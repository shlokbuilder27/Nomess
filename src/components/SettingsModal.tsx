import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  HardDrive, 
  Cloud, 
  Check 
} from 'lucide-react';
import type { VaultConfig } from '../types/note';
import { VaultService } from '../services/vaultService';

interface SettingsModalProps {
  isOpen: boolean;
  config: VaultConfig;
  onClose: () => void;
  onSaveConfig: (newConfig: VaultConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  config,
  onClose,
  onSaveConfig
}) => {
  const [formData, setFormData] = useState<VaultConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    VaultService.saveConfig(formData);
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A18]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#FBFBF9] border border-[#E6E4DC] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E4DC] flex items-center justify-between bg-[#F4F4EE]">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#1A1A18] text-[#FBFBF9]">
              <Settings className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-medium text-[#1A1A18]">
                Vault & AI Settings
              </h2>
              <p className="text-[11px] text-[#7E7C75]">
                Configure local vault paths, Google Drive synchronization, and intelligence engines
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* AI Intelligence Provider */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#7E7C75] font-semibold">
              AI Intelligence Engine
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setFormData({ ...formData, aiProvider: 'gemini' })}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.aiProvider === 'gemini'
                    ? 'border-[#C84B31] bg-[#C84B31]/5'
                    : 'border-[#E6E4DC] bg-[#FFFFFF] hover:border-[#D8D6CD]'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-serif text-sm font-medium text-[#1A1A18]">Google Gemini Flash</span>
                </div>
                <p className="text-[11px] text-[#7E7C75]">
                  Ultra-fast, lowest token cost, vision OCR for photos of notebook pages.
                </p>
              </div>

              <div
                onClick={() => setFormData({ ...formData, aiProvider: 'ollama' })}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.aiProvider === 'ollama'
                    ? 'border-[#C84B31] bg-[#C84B31]/5'
                    : 'border-[#E6E4DC] bg-[#FFFFFF] hover:border-[#D8D6CD]'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-serif text-sm font-medium text-[#1A1A18]">Local Ollama</span>
                </div>
                <p className="text-[11px] text-[#7E7C75]">
                  100% offline air-gapped notes on your machine with zero data leaving your PC.
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Provider Settings */}
          {formData.aiProvider === 'gemini' ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#45443F]">
                Google Gemini API Key
              </label>
              <div className="relative">
                <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E7C75]" />
                <input
                  type="password"
                  value={formData.geminiApiKey}
                  onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#FFFFFF] border border-[#E6E4DC] rounded-lg pl-8 pr-3 py-2 text-xs font-mono outline-none focus:border-[#C84B31]"
                />
              </div>
              <p className="text-[11px] text-[#7E7C75]">
                Stored securely on your local device. Free tier keys available at aistudio.google.com
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#45443F]">Ollama Endpoint</label>
                <input
                  type="text"
                  value={formData.ollamaEndpoint}
                  onChange={(e) => setFormData({ ...formData, ollamaEndpoint: e.target.value })}
                  placeholder="http://localhost:11434"
                  className="w-full bg-[#FFFFFF] border border-[#E6E4DC] rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-[#C84B31]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#45443F]">Model Name</label>
                <input
                  type="text"
                  value={formData.ollamaModel}
                  onChange={(e) => setFormData({ ...formData, ollamaModel: e.target.value })}
                  placeholder="llama3.2"
                  className="w-full bg-[#FFFFFF] border border-[#E6E4DC] rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-[#C84B31]"
                />
              </div>
            </div>
          )}

          <div className="h-[1px] bg-[#E6E4DC] my-2" />

          {/* Vault Storage Path */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#45443F]">
              Primary Local Vault Folder
            </label>
            <div className="relative">
              <HardDrive className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E7C75]" />
              <input
                type="text"
                value={formData.vaultPath}
                onChange={(e) => setFormData({ ...formData, vaultPath: e.target.value })}
                placeholder="F:\APPS\Nomess\Nomess_Vault"
                className="w-full bg-[#FFFFFF] border border-[#E6E4DC] rounded-lg pl-8 pr-3 py-2 text-xs font-mono outline-none focus:border-[#C84B31]"
              />
            </div>
            <p className="text-[11px] text-[#7E7C75]">
              Directory on your hard drive where Markdown files and assets are stored.
            </p>
          </div>

          {/* Google Drive Mirror Path */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#45443F]">
              Google Drive Mirror Folder (Optional)
            </label>
            <div className="relative">
              <Cloud className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E7C75]" />
              <input
                type="text"
                value={formData.gdriveFolderPath}
                onChange={(e) => setFormData({ ...formData, gdriveFolderPath: e.target.value })}
                placeholder="G:\My Drive\Nomess"
                className="w-full bg-[#FFFFFF] border border-[#E6E4DC] rounded-lg pl-8 pr-3 py-2 text-xs font-mono outline-none focus:border-[#C84B31]"
              />
            </div>
            <p className="text-[11px] text-[#7E7C75]">
              Point this to your local Google Drive directory to automatically sync notes to your phone!
            </p>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#E6E4DC] flex items-center justify-between">
            <span className="text-xs text-[#3C6351] font-mono">
              {savedSuccess ? 'Settings Saved Successfully!' : ''}
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-[#7E7C75] hover:text-[#1A1A18]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 bg-[#1A1A18] hover:bg-[#333] text-[#FBFBF9] px-4 py-2 rounded-lg text-xs font-medium"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Vault Config</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
