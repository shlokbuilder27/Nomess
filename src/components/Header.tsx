import React from 'react';
import { 
  Plus, 
  Printer, 
  Settings, 
  CloudCheck, 
  Zap, 
  LayoutGrid,
  FolderOpen
} from 'lucide-react';
import type { Note, VaultConfig } from '../types/note';

interface HeaderProps {
  activeNote: Note | null;
  config: VaultConfig;
  notesCount: number;
  onOpenNewNote: () => void;
  onOpenTemplateGallery: () => void;
  onOpenExportPrint: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNote,
  config,
  notesCount,
  onOpenNewNote,
  onOpenTemplateGallery,
  onOpenExportPrint,
  onOpenSettings
}) => {
  return (
    <header className="h-14 border-b border-[#E6E4DC] bg-[#F4F4EE]/90 backdrop-blur-md px-6 flex items-center justify-between select-none z-20 no-print">
      {/* Brand & Identity */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="font-serif italic font-semibold text-xl tracking-tight text-[#1A1A18]">
            Nomess
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#1A1A18] text-[#FBFBF9] font-medium tracking-widest">
            Brain
          </span>
        </div>

        <div className="h-4 w-[1px] bg-[#D8D6CD]" />

        {/* Vault Status Indicator */}
        <div className="flex items-center space-x-2 text-xs font-mono text-[#7E7C75]">
          <FolderOpen className="w-3.5 h-3.5 text-[#45443F]" />
          <span>{config.vaultPath || 'Nomess_Vault'}</span>
          <span className="text-[#B5B3AA]">({notesCount} notes)</span>
        </div>

        {/* GDrive Mirror Badge */}
        {config.gdriveFolderPath && (
          <div className="flex items-center space-x-1 text-[11px] font-mono text-[#3C6351] bg-[#3C6351]/10 px-2 py-0.5 rounded-full">
            <CloudCheck className="w-3 h-3" />
            <span>GDrive Synced</span>
          </div>
        )}
      </div>

      {/* Action Suite */}
      <div className="flex items-center space-x-3">
        {/* Token Frugality Badge */}
        {activeNote?.metadata?.tokensUsed !== undefined && (
          <div className="flex items-center space-x-1.5 text-xs font-mono text-[#7E7C75] bg-[#EAE8E0] px-2.5 py-1 rounded-md">
            <Zap className="w-3.5 h-3.5 text-[#C08A3E]" />
            <span>
              {activeNote.metadata.tokensUsed === 0 
                ? 'Offline Heuristic' 
                : `${activeNote.metadata.tokensUsed} tokens spent`}
            </span>
          </div>
        )}

        {/* Template Gallery Button */}
        <button
          onClick={onOpenTemplateGallery}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#45443F] hover:bg-[#EAE8E0] hover:text-[#1A1A18] transition-colors"
          title="Browse 10 Second-Brain Templates"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Templates</span>
        </button>

        {/* Export / Print Button */}
        {activeNote && (
          <button
            onClick={onOpenExportPrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#45443F] hover:bg-[#EAE8E0] hover:text-[#1A1A18] transition-colors"
            title="Editorial Print & High-Res Card"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print & Share</span>
          </button>
        )}

        {/* New Note CTA (Steve Jobs Vermillion Accent) */}
        <button
          onClick={onOpenNewNote}
          className="flex items-center space-x-1.5 bg-[#C84B31] hover:bg-[#B33E26] text-[#FBFBF9] px-3.5 py-1.5 rounded-md text-xs font-medium shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Restructure Note</span>
        </button>

        <div className="h-4 w-[1px] bg-[#D8D6CD]" />

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md text-[#7E7C75] hover:text-[#1A1A18] hover:bg-[#EAE8E0] transition-colors"
          title="Vault & AI Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
