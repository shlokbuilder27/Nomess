import React, { useState } from 'react';
import { 
  X, 
  ArrowRight
} from 'lucide-react';
import type { NoteTemplate } from '../types/note';
import { SECOND_BRAIN_TEMPLATES } from '../data/templates';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplateToInstantiate: (template: NoteTemplate) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplateToInstantiate
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<NoteTemplate>(SECOND_BRAIN_TEMPLATES[0]);
  const [previewTab, setPreviewTab] = useState<'skeleton' | 'instructions' | 'sample'>('skeleton');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A18]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#FBFBF9] border border-[#E6E4DC] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E4DC] flex items-center justify-between bg-[#F4F4EE]">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#1A1A18]">
              The 10 Curated Second-Brain Templates
            </h2>
            <p className="text-xs text-[#7E7C75]">
              Engineered cognitive models for active recall, executive decisions, and first-principles synthesis
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#7E7C75] hover:text-[#1A1A18] rounded-md hover:bg-[#EAE8E0]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gallery Content Split Screen */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Template List */}
          <div className="w-80 border-r border-[#E6E4DC] overflow-y-auto p-3 space-y-1.5 bg-[#F9F9F6]">
            {SECOND_BRAIN_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === selectedTemplate.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#D8D6CD] shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-[#EAE8E0]/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-sm font-medium text-[#1A1A18]">
                      {tmpl.name}
                    </span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#EAE8E0] text-[#45443F]">
                      {tmpl.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#7E7C75] line-clamp-2">
                    {tmpl.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Template Deep-Dive Preview */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#FFFFFF]">
            
            {/* Template Header Card */}
            <div className="p-6 border-b border-[#E6E4DC] bg-[#FBFBF9]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C84B31] font-semibold">
                    {selectedTemplate.category} Template
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-[#1A1A18] mt-0.5">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-xs text-[#7E7C75] mt-1">
                    {selectedTemplate.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectTemplateToInstantiate(selectedTemplate);
                    onClose();
                  }}
                  className="flex items-center space-x-1.5 bg-[#1A1A18] hover:bg-[#333] text-[#FBFBF9] px-4 py-2 rounded-lg text-xs font-medium transition-all"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sub-tabs */}
              <div className="flex items-center space-x-4 mt-6 border-b border-[#E6E4DC]">
                <button
                  onClick={() => setPreviewTab('skeleton')}
                  className={`pb-2 text-xs font-medium border-b-2 transition-all ${
                    previewTab === 'skeleton'
                      ? 'border-[#C84B31] text-[#C84B31]'
                      : 'border-transparent text-[#7E7C75] hover:text-[#1A1A18]'
                  }`}
                >
                  Skeleton Structure
                </button>

                <button
                  onClick={() => setPreviewTab('sample')}
                  className={`pb-2 text-xs font-medium border-b-2 transition-all ${
                    previewTab === 'sample'
                      ? 'border-[#C84B31] text-[#C84B31]'
                      : 'border-transparent text-[#7E7C75] hover:text-[#1A1A18]'
                  }`}
                >
                  Sample Input & Raw Notes
                </button>

                <button
                  onClick={() => setPreviewTab('instructions')}
                  className={`pb-2 text-xs font-medium border-b-2 transition-all ${
                    previewTab === 'instructions'
                      ? 'border-[#C84B31] text-[#C84B31]'
                      : 'border-transparent text-[#7E7C75] hover:text-[#1A1A18]'
                  }`}
                >
                  AI Prompt & Synthesis Rules
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed text-[#1A1A18] bg-[#FBFBF9]">
              {previewTab === 'skeleton' && (
                <pre className="whitespace-pre-wrap font-mono p-4 rounded-lg bg-[#FFFFFF] border border-[#E6E4DC]">
                  {selectedTemplate.skeletonMarkdown}
                </pre>
              )}

              {previewTab === 'sample' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#FFFFFF] border border-[#E6E4DC]">
                    <span className="text-[11px] font-sans font-semibold text-[#7E7C75] block mb-2 uppercase">
                      Example Raw Messy Braindump:
                    </span>
                    <p className="font-mono text-xs text-[#45443F] leading-relaxed whitespace-pre-wrap">
                      {selectedTemplate.sampleInput}
                    </p>
                  </div>
                </div>
              )}

              {previewTab === 'instructions' && (
                <pre className="whitespace-pre-wrap font-mono p-4 rounded-lg bg-[#FFFFFF] border border-[#E6E4DC] text-[#45443F]">
                  {selectedTemplate.promptInstructions}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
