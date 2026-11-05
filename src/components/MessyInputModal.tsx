import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  AlertCircle
} from 'lucide-react';
import type { NoteTemplate, TemplateId, VaultConfig } from '../types/note';
import { SECOND_BRAIN_TEMPLATES } from '../data/templates';
import { AIService } from '../services/aiService';
import type { AIResponse } from '../services/aiService';

interface MessyInputModalProps {
  isOpen: boolean;
  config: VaultConfig;
  onClose: () => void;
  onNoteCreated: (response: AIResponse, template: NoteTemplate, rawInput: string, imageBase64?: string) => void;
}

export const MessyInputModal: React.FC<MessyInputModalProps> = ({
  isOpen,
  config,
  onClose,
  onNoteCreated
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [rawText, setRawText] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>('cornell-study');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedTemplate = SECOND_BRAIN_TEMPLATES.find(t => t.id === selectedTemplateId) || SECOND_BRAIN_TEMPLATES[0];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadSample = () => {
    setRawText(selectedTemplate.sampleInput);
  };

  const handleTransform = async () => {
    if (!rawText.trim() && !imagePreview) {
      setErrorMsg('Please enter messy notes or upload a handwritten page photo.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await AIService.structureNote(
        rawText,
        selectedTemplate,
        config,
        imagePreview || undefined
      );

      onNoteCreated(res, selectedTemplate, rawText, imagePreview || undefined);
      onClose();
      // Reset
      setRawText('');
      setImagePreview(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Transformation failed. Falling back to offline engine.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A18]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#FBFBF9] border border-[#E6E4DC] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E4DC] flex items-center justify-between bg-[#F4F4EE]">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#C84B31]/10 text-[#C84B31]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-medium text-[#1A1A18]">
                Restructure Messy Notes
              </h2>
              <p className="text-[11px] text-[#7E7C75]">
                Turn chaotic scrawls and scanned pages into pristine second-brain knowledge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#7E7C75] hover:text-[#1A1A18] rounded-md hover:bg-[#EAE8E0]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Input Modality Tabs */}
          <div className="flex items-center space-x-2 border-b border-[#E6E4DC] pb-3">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'text'
                  ? 'bg-[#1A1A18] text-[#FBFBF9]'
                  : 'text-[#7E7C75] hover:bg-[#EAE8E0]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Raw Text / Brain Dump</span>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'image'
                  ? 'bg-[#1A1A18] text-[#FBFBF9]'
                  : 'text-[#7E7C75] hover:bg-[#EAE8E0]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo / Scan of Page</span>
            </button>

            {activeTab === 'text' && (
              <button
                onClick={handleLoadSample}
                className="ml-auto text-[11px] font-mono text-[#C84B31] hover:underline"
              >
                + Insert Sample Input
              </button>
            )}
          </div>

          {/* Active Input Area */}
          {activeTab === 'text' ? (
            <div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste or type messy meeting notes, book quotes, fleeting thoughts, or raw bullet points..."
                className="w-full h-44 p-3.5 bg-[#FFFFFF] border border-[#E6E4DC] rounded-xl text-sm font-mono leading-relaxed text-[#1A1A18] placeholder-[#B5B3AA] outline-none focus:border-[#C84B31] transition-all resize-none"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#D8D6CD] rounded-xl p-6 text-center bg-[#FFFFFF]">
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Uploaded Note Page"
                    className="max-h-52 object-contain mx-auto rounded-lg border border-[#E6E4DC]"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="text-xs text-[#C84B31] hover:underline"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-[#B5B3AA] mx-auto mb-2" />
                  <span className="text-sm font-medium text-[#1A1A18]">
                    Click or drag photo of handwritten notes or whiteboard
                  </span>
                  <p className="text-xs text-[#7E7C75] mt-1">
                    Supports JPEG, PNG, WEBP (Multimodal OCR via Gemini Flash)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {/* Template Selection Tray */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#7E7C75] mb-2 font-semibold">
              Select Second-Brain Target Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SECOND_BRAIN_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-[#C84B31] bg-[#C84B31]/5 shadow-sm'
                        : 'border-[#E6E4DC] bg-[#FFFFFF] hover:border-[#D8D6CD]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium font-serif text-[#1A1A18] line-clamp-1">
                        {tmpl.name}
                      </span>
                      <span className="text-[9px] font-mono uppercase text-[#7E7C75] px-1 py-0.5 rounded bg-[#F4F4EE]">
                        {tmpl.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7E7C75] line-clamp-2">
                      {tmpl.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#C84B31]/10 border border-[#C84B31]/20 text-xs text-[#C84B31] flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E6E4DC] bg-[#F4F4EE] flex items-center justify-between">
          <div className="text-xs font-mono text-[#7E7C75]">
            Provider: <span className="font-semibold text-[#1A1A18]">{config.geminiApiKey ? 'Gemini 1.5 Flash' : config.aiProvider === 'ollama' ? 'Ollama Local' : 'Offline Engine'}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium text-[#7E7C75] hover:text-[#1A1A18]"
            >
              Cancel
            </button>

            <button
              onClick={handleTransform}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-[#C84B31] hover:bg-[#B33E26] disabled:opacity-50 text-[#FBFBF9] px-5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Synthesizing...' : 'Elevate to Second Brain'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
