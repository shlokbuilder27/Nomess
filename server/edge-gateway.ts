/**
 * Nomess Free Edge Gateway (Cloudflare Worker / Vercel Edge)
 * Idea 4: Proxies requests to Gemini Flash without exposing API keys to client devices.
 * 
 * To deploy on Cloudflare Workers (100,000 free requests/day):
 * 1. npx wrangler deploy
 * 2. Set secret: npx wrangler secret put GEMINI_API_KEY
 */

export interface Env {
  GEMINI_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers for phone/desktop web app
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json() as any;
      const { prompt, systemPrompt, imageBase64 } = body;

      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Edge Gateway not configured with GEMINI_API_KEY' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const parts: any[] = [{ text: prompt }];
      if (imageBase64) {
        parts.unshift({
          inline_data: {
            mime_type: 'image/jpeg',
            data: imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '')
          }
        });
      }

      const payload = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.2,
          response_mime_type: 'application/json',
          maxOutputTokens: 2048
        }
      };

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await geminiRes.text();
      return new Response(data, {
        status: geminiRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message || 'Gateway error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
