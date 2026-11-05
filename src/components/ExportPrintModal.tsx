import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  CloudCheck, 
  Smartphone
} from 'lucide-react';
import type { Note, VaultConfig } from '../types/note';
import { VaultService } from '../services/vaultService';

interface ExportPrintModalProps {
  isOpen: boolean;
  note: Note | null;
  config: VaultConfig;
  onClose: () => void;
}

export const ExportPrintModal: React.FC<ExportPrintModalProps> = ({
  isOpen,
  note,
  config,
  onClose
}) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [gdriveStatus, setGdriveStatus] = useState<string | null>(null);

  if (!isOpen || !note) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const fullMd = VaultService.serializeToMarkdown(note);
    navigator.clipboard.writeText(fullMd);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadStandaloneHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${note.title} — Nomess Second Brain</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap" rel="stylesheet">
  <style>
    body {
      background: #FBFBF9;
      color: #1A1A18;
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }
    h1 { font-family: 'Newsreader', serif; font-size: 32px; font-weight: normal; margin-bottom: 8px; }
    blockquote { border-left: 2px solid #C84B31; padding-left: 16px; font-style: italic; color: #45443F; margin: 20px 0; }
    pre { background: #1A1A18; color: #FBFBF9; padding: 16px; border-radius: 8px; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #E6E4DC; padding: 8px 12px; text-align: left; }
    th { background: #F4F4EE; }
  </style>
</head>
<body>
  <div style="font-size: 11px; font-family: monospace; color: #7E7C75; text-transform: uppercase;">
    NOMESS SECOND BRAIN • ${note.templateId} • ${new Date(note.createdAt).toLocaleDateString()}
  </div>
  <h1>${note.title}</h1>
  <hr style="border: none; border-top: 1px solid #E6E4DC; margin: 20px 0;">
  <div>
    <pre style="background: transparent; color: inherit; font-family: inherit; white-space: pre-wrap;">${note.content}</pre>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSyncToGDrive = async () => {
    setGdriveStatus('Saving to Google Drive folder...');
    try {
      await VaultService.saveNote(note, config);
      setGdriveStatus('Successfully mirrored into your Google Drive!');
      setTimeout(() => setGdriveStatus(null), 3000);
    } catch {
      setGdriveStatus('Sync error. Please check folder path in Settings.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A18]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#FBFBF9] border border-[#E6E4DC] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E4DC] flex items-center justify-between bg-[#F4F4EE]">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#1A1A18] text-[#FBFBF9]">
              <Share2 className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-medium text-[#1A1A18]">
                Editorial Print & Share Suite
              </h2>
              <p className="text-[11px] text-[#7E7C75]">
                Pristine physical prints, mobile share cards, and Google Drive vault sync
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

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Precision Print */}
            <div 
              onClick={handlePrint}
              className="p-4 rounded-xl border border-[#E6E4DC] bg-[#FFFFFF] hover:border-[#C84B31] cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="p-2 rounded-lg bg-[#C84B31]/10 text-[#C84B31] w-fit mb-3 group-hover:scale-105 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-medium text-[#1A1A18]">
                Physical Print / Vector PDF
              </h3>
              <p className="text-xs text-[#7E7C75] mt-1 leading-relaxed">
                Calibrated @media print styles for A4 & Letter with zero orphan headings and crisp Swiss layout.
              </p>
            </div>

            {/* 2. Google Drive Vault Sync */}
            <div 
              onClick={handleSyncToGDrive}
              className="p-4 rounded-xl border border-[#E6E4DC] bg-[#FFFFFF] hover:border-[#3C6351] cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="p-2 rounded-lg bg-[#3C6351]/10 text-[#3C6351] w-fit mb-3 group-hover:scale-105 transition-transform">
                <CloudCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-medium text-[#1A1A18]">
                Save to Google Drive
              </h3>
              <p className="text-xs text-[#7E7C75] mt-1 leading-relaxed">
                {config.gdriveFolderPath 
                  ? `Mirror directly to: ${config.gdriveFolderPath}` 
                  : 'Configured via Google Drive desktop mirror folder in Settings.'}
              </p>
            </div>

            {/* 3. Standalone HTML */}
            <div 
              onClick={handleDownloadStandaloneHtml}
              className="p-4 rounded-xl border border-[#E6E4DC] bg-[#FFFFFF] hover:border-[#2D4059] cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="p-2 rounded-lg bg-[#2D4059]/10 text-[#2D4059] w-fit mb-3 group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-medium text-[#1A1A18]">
                Standalone HTML File
              </h3>
              <p className="text-xs text-[#7E7C75] mt-1 leading-relaxed">
                Self-contained readable web page with embedded typography that opens on any phone or browser.
              </p>
            </div>

            {/* 4. Copy Raw Markdown + Frontmatter */}
            <div 
              onClick={handleCopyMarkdown}
              className="p-4 rounded-xl border border-[#E6E4DC] bg-[#FFFFFF] hover:border-[#C08A3E] cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="p-2 rounded-lg bg-[#C08A3E]/10 text-[#C08A3E] w-fit mb-3 group-hover:scale-105 transition-transform">
                {copiedMd ? <Check className="w-5 h-5 text-[#3C6351]" /> : <Copy className="w-5 h-5" />}
              </div>
              <h3 className="font-serif text-base font-medium text-[#1A1A18]">
                {copiedMd ? 'Copied to Clipboard!' : 'Copy Obsidian Markdown'}
              </h3>
              <p className="text-xs text-[#7E7C75] mt-1 leading-relaxed">
                Standard YAML frontmatter format ready to paste directly into Obsidian, Logseq, or Git.
              </p>
            </div>
          </div>

          {/* Sync Status Banner */}
          {gdriveStatus && (
            <div className="p-3 rounded-lg bg-[#3C6351]/10 border border-[#3C6351]/20 text-xs font-mono text-[#3C6351] text-center">
              {gdriveStatus}
            </div>
          )}

          {/* Mobile Sharing Preview Card */}
          <div className="p-4 rounded-xl bg-[#F4F4EE] border border-[#E6E4DC]">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#7E7C75] mb-2">
              <Smartphone className="w-4 h-4" />
              <span>Mobile / Phone Readability Check</span>
            </div>
            <p className="text-xs text-[#45443F] leading-relaxed">
              Because Nomess saves standard markdown files into your synced Google Drive or local folder, you can open and read every formatted note instantly on your phone using any cloud reader or markdown viewer.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E6E4DC] bg-[#F4F4EE] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#7E7C75] hover:text-[#1A1A18]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
