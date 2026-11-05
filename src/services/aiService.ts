import type { NoteTemplate, VaultConfig } from '../types/note';
import { CognitiveEngine } from './cognitiveEngine';
import { ImageOcrService, type OCRProgressCallback } from './imageOcrService';

export interface AIResponse {
  title: string;
  markdown: string;
  tags: string[];
  tokensUsed: number;
  providerUsed: string;
}

export class AIService {
  /**
   * Structure messy thoughts or photo scans into a chosen second brain template
   */
  static async structureNote(
    rawText: string,
    template: NoteTemplate,
    config: VaultConfig,
    imageBase64?: string,
    onProgress?: OCRProgressCallback
  ): Promise<AIResponse> {
    let effectiveText = rawText;

    // 1. If image is provided and no Gemini key is active:
    // Execute on-device Canvas Wasm OCR (Idea 3)
    if (imageBase64 && (!config.geminiApiKey?.trim() || config.aiProvider === 'pure-engineering')) {
      try {
        const ocrText = await ImageOcrService.extractTextFromImage(imageBase64, onProgress);
        effectiveText = ocrText ? `${rawText}\n${ocrText}`.trim() : rawText;
      } catch (ocrErr) {
        console.warn('On-device OCR fallback note:', ocrErr);
      }
    }

    // 2. Try Gemini Cloud if configured
    if (config.aiProvider === 'gemini' && config.geminiApiKey?.trim()) {
      try {
        onProgress?.('Synthesizing with Gemini Flash...', 0.7);
        return await this.callGemini(effectiveText, template, config.geminiApiKey.trim(), imageBase64);
      } catch (err) {
        console.warn('Gemini API call failed, falling back to Pure-Engineering Engine:', err);
      }
    }

    // 3. Try Ollama if configured
    if (config.aiProvider === 'ollama' && config.ollamaEndpoint) {
      try {
        onProgress?.('Synthesizing with local Ollama...', 0.7);
        return await this.callOllama(effectiveText, template, config.ollamaEndpoint, config.ollamaModel);
      } catch (err) {
        console.warn('Ollama call failed, falling back to Pure-Engineering Engine:', err);
      }
    }

    // 4. Default: First-principles Cognitive AST Synthesizer (Idea 1 - Pure Engineering)
    onProgress?.('Synthesizing with Pure-Engineering Cognitive Engine...', 0.9);
    return CognitiveEngine.synthesize(effectiveText, template);
  }

  /**
   * Call Google Gemini with strict single-shot prompt and low token consumption
   */
  private static async callGemini(
    rawText: string,
    template: NoteTemplate,
    apiKey: string,
    imageBase64?: string
  ): Promise<AIResponse> {
    const systemPrompt = `You are an elite cognitive editor and second-brain architect.
Your task: Take the user's messy, fragmented input (and/or image of handwritten notes/whiteboard) and synthesize it strictly into the requested template format.
Maintain extreme intellectual rigor, high clarity, and eliminate fluff.
Return STRICT JSON format:
{
  "title": "Clear concise title",
  "markdown": "Full markdown content matching the exact requested skeleton structure",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const userPrompt = `TEMPLATE TYPE: ${template.name}
INSTRUCTIONS:
${template.promptInstructions}

RAW MESSY INPUT:
${rawText || '(Notes captured in attached image)'}`;

    const parts: unknown[] = [{ text: userPrompt }];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      parts.unshift({
        inline_data: {
          mime_type: 'image/jpeg',
          data: cleanBase64
        }
      });
    }

    const payload = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.2,
        response_mime_type: 'application/json',
        maxOutputTokens: 2048,
      }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const textOutput = candidate?.content?.parts?.[0]?.text;
    const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

    if (!textOutput) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(textOutput);
    return {
      title: parsed.title || 'Synthesized Second Brain Note',
      markdown: parsed.markdown,
      tags: Array.isArray(parsed.tags) ? parsed.tags : ['synthesis'],
      tokensUsed,
      providerUsed: 'Gemini 1.5 Flash'
    };
  }

  /**
   * Call Local Ollama endpoint for air-gapped, 100% private notes
   */
  private static async callOllama(
    rawText: string,
    template: NoteTemplate,
    endpoint: string,
    modelName: string
  ): Promise<AIResponse> {
    const prompt = `System: You are an elite cognitive editor. Transform the following messy notes into the ${template.name} format.
Instructions:
${template.promptInstructions}

Respond ONLY with valid JSON:
{
  "title": "Document Title",
  "markdown": "Full formatted markdown note",
  "tags": ["tag1", "tag2"]
}

Messy Input:
${rawText}`;

    const targetUrl = endpoint.endsWith('/') ? `${endpoint}api/generate` : `${endpoint}/api/generate`;

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName || 'llama3.2',
        prompt,
        stream: false,
        format: 'json'
      })
    });

    if (!res.ok) {
      throw new Error(`Ollama error HTTP ${res.status}`);
    }

    const json = await res.json();
    const parsed = JSON.parse(json.response);
    return {
      title: parsed.title || 'Ollama Synthesized Note',
      markdown: parsed.markdown,
      tags: parsed.tags || ['local-ai'],
      tokensUsed: json.eval_count || 0,
      providerUsed: `Ollama (${modelName})`
    };
  }
}
