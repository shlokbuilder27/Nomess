import React, { useState, useEffect } from 'react';
import { 
  Edit3, 
  Copy, 
  Check, 
  Printer, 
  Image as ImageIcon 
} from 'lucide-react';
import { marked } from 'marked';
import type { Note } from '../types/note';

interface EditorialCanvasProps {
  note: Note;
  onUpdateNote: (updated: Note) => void;
  onPrint: () => void;
}

export const EditorialCanvas: React.FC<EditorialCanvasProps> = ({
  note,
  onUpdateNote,
  onPrint
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title);
  const [copied, setCopied] = useState(false);
  const [showOriginalScan, setShowOriginalScan] = useState(false);

  useEffect(() => {
    setContent(note.content);
    setTitle(note.title);
  }, [note.id]);

  const handleSave = () => {
    onUpdateNote({
      ...note,
      title,
      content,
      updatedAt: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Configure marked for clean HTML output
  const renderMarkdown = (md: string) => {
    try {
      return marked.parse(md, { gfm: true, breaks: true });
    } catch {
      return md;
    }
  };

  const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="flex-1 h-full overflow-y-auto bg-[#ECECE6] p-6 lg:p-10 flex flex-col items-center">
      {/* Top Floating Control Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4 no-print select-none">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#7E7C75]">
          <span className="capitalize px-2 py-0.5 rounded bg-[#E4E3DC] text-[#45443F]">
            {note.templateId.replace(/-/g, ' ')}
          </span>
          <span>•</span>
          <span>{formattedDate}</span>
          {note.sourceScanDataUrl && (
            <button
              onClick={() => setShowOriginalScan(!showOriginalScan)}
              className="flex items-center space-x-1 text-[#C84B31] hover:underline ml-2"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{showOriginalScan ? 'Hide Scan' : 'View Source Scan'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-1.5 px-3 py-1 rounded bg-[#E4E3DC] hover:bg-[#D8D6CD] text-xs text-[#45443F] transition-colors"
            title="Copy Raw Markdown"
          >
            {copied ? <Check className="w-3 h-3 text-[#3C6351]" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy MD'}</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center space-x-1.5 px-3 py-1 rounded bg-[#E4E3DC] hover:bg-[#D8D6CD] text-xs text-[#45443F] transition-colors"
            title="Print or Export PDF"
          >
            <Printer className="w-3 h-3" />
            <span>Print Sheet</span>
          </button>

          <button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-1 rounded text-xs font-medium transition-all ${
              isEditing 
                ? 'bg-[#3C6351] text-[#FBFBF9]' 
                : 'bg-[#1A1A18] text-[#FBFBF9] hover:bg-[#333]'
            }`}
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Save Changes' : 'Edit Note'}</span>
          </button>
        </div>
      </div>

      {/* Source Scan Drawer if available */}
      {showOriginalScan && note.sourceScanDataUrl && (
        <div className="w-full max-w-4xl mb-6 p-4 bg-[#FFFFFF] border border-[#E6E4DC] rounded-xl shadow-sm no-print">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-medium text-[#7E7C75]">Original Captured Page / Scan</span>
            <button 
              onClick={() => setShowOriginalScan(false)}
              className="text-xs text-[#7E7C75] hover:text-[#1A1A18]"
            >
              Close
            </button>
          </div>
          <img 
            src={note.sourceScanDataUrl} 
            alt="Original Handwritten Page" 
            className="max-h-72 object-contain rounded-lg border border-[#E6E4DC] mx-auto"
          />
        </div>
      )}

      {/* The Master Archival Paper Sheet */}
      <article className="print-sheet w-full max-w-4xl bg-[#FBFBF9] border border-[#E6E4DC] rounded-xl shadow-lg p-8 sm:p-14 lg:p-16 transition-all min-h-[750px] relative">
        
        {/* Subtle Watermark or Running Header for Print */}
        <div className="hidden print-only mb-6 border-b border-[#1A1A18] pb-2 flex justify-between items-center text-[10pt] font-mono">
          <span className="uppercase tracking-widest font-bold">NOMESS SECOND BRAIN</span>
          <span>{note.templateId.toUpperCase()} • {formattedDate}</span>
        </div>

        {/* Note Title & Header Metadata */}
        {isEditing ? (
          <div className="mb-6 space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full font-serif text-3xl font-semibold text-[#1A1A18] bg-transparent border-b border-[#D8D6CD] pb-2 outline-none focus:border-[#C84B31]"
              placeholder="Note Title"
            />
          </div>
        ) : (
          <div className="mb-8 border-b border-[#E6E4DC] pb-6">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#7E7C75] mb-2 uppercase tracking-wider">
              <span>{note.templateId.replace(/-/g, ' ')}</span>
              <span>/</span>
              <span>{formattedDate}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1A1A18] leading-tight">
              {title}
            </h1>

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {note.tags.map(t => (
                  <span 
                    key={t}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#EAE8E0] text-[#45443F]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Note Body */}
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[500px] font-mono text-sm leading-relaxed text-[#1A1A18] bg-transparent outline-none resize-none p-2 border border-[#E6E4DC] rounded-md focus:border-[#C84B31]"
            placeholder="Write your markdown note here..."
          />
        ) : (
          <div 
            className="prose prose-neutral max-w-none text-[#1A1A18] font-sans leading-relaxed
              prose-headings:font-serif prose-headings:font-normal prose-headings:text-[#1A1A18]
              prose-h1:text-2xl prose-h1:border-b prose-h1:border-[#E6E4DC] prose-h1:pb-2 prose-h1:mt-8
              prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
              prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2 prose-h3:text-[#45443F]
              prose-blockquote:border-l-2 prose-blockquote:border-[#C84B31] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#45443F] prose-blockquote:bg-[#F4F4EE]/50 prose-blockquote:py-1 prose-blockquote:my-4
              prose-ul:list-disc prose-ul:pl-5 prose-ul:my-3
              prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-3
              prose-li:my-1
              prose-table:w-full prose-table:border-collapse prose-table:my-4
              prose-th:border prose-th:border-[#E6E4DC] prose-th:bg-[#F4F4EE] prose-th:p-2 prose-th:text-xs prose-th:font-mono prose-th:text-left
              prose-td:border prose-td:border-[#E6E4DC] prose-td:p-2 prose-td:text-sm
              prose-code:font-mono prose-code:bg-[#EAE8E0] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
              prose-pre:bg-[#1A1A18] prose-pre:text-[#FBFBF9] prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
            "
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}

        {/* Paper Sheet Bottom Debossed Rule & Metadata */}
        <div className="mt-16 pt-6 border-t border-[#E6E4DC] flex items-center justify-between text-[11px] font-mono text-[#B5B3AA]">
          <span>NOMESS VAULT • RFC-822 COMPATIBLE</span>
          <span>{note.metadata.wordCount ? `${note.metadata.wordCount} words` : 'Archival Laid Cotton'}</span>
        </div>
      </article>
    </main>
  );
};
