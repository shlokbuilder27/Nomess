import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EditorialCanvas } from './components/EditorialCanvas';
import { MessyInputModal } from './components/MessyInputModal';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { ExportPrintModal } from './components/ExportPrintModal';
import { SettingsModal } from './components/SettingsModal';

import type { Note, NoteTemplate, VaultConfig } from './types/note';
import { VaultService } from './services/vaultService';
import { SECOND_BRAIN_TEMPLATES } from './data/templates';
import type { AIResponse } from './services/aiService';

export const App: React.FC = () => {
  const [config, setConfig] = useState<VaultConfig>(VaultService.loadConfig());
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Modals
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initial Boot & Seeding
  useEffect(() => {
    let loaded = VaultService.loadAllNotes();
    if (loaded.length === 0) {
      // Seed with initial master specimens from Steve & Woz
      const specimen1: Note = {
        id: 'specimen_cornell',
        title: 'Distributed Consensus: Paxos vs Raft',
        templateId: 'cornell-study',
        content: SECOND_BRAIN_TEMPLATES[0].skeletonMarkdown,
        rawInput: SECOND_BRAIN_TEMPLATES[0].sampleInput,
        tags: ['consensus', 'distributed-systems', 'raft'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gdriveSynced: true,
        metadata: {
          wordCount: 165,
          tokensUsed: 142
        }
      };

      const specimen2: Note = {
        id: 'specimen_arch',
        title: 'Nomess Local Vault Storage Engine',
        templateId: 'architecture-spec',
        content: SECOND_BRAIN_TEMPLATES[4].skeletonMarkdown,
        rawInput: SECOND_BRAIN_TEMPLATES[4].sampleInput,
        tags: ['architecture', 'rust', 'carmack-style'],
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        gdriveSynced: true,
        metadata: {
          wordCount: 195,
          tokensUsed: 0
        }
      };

      loaded = [specimen1, specimen2];
      VaultService.saveNote(specimen1, config);
      VaultService.saveNote(specimen2, config);
    }

    setNotes(loaded);
    if (loaded.length > 0) {
      setActiveNoteId(loaded[0].id);
    }
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setIsNewNoteOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setIsExportOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0] || null;

  // Handle Note Creation from Messy Input
  const handleNoteCreated = async (
    aiRes: AIResponse,
    template: NoteTemplate,
    rawInput: string,
    imageBase64?: string
  ) => {
    const newNote: Note = {
      id: `nm_${Date.now()}`,
      title: aiRes.title,
      content: aiRes.markdown,
      rawInput,
      templateId: template.id,
      tags: aiRes.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gdriveSynced: Boolean(config.gdriveFolderPath),
      sourceScanDataUrl: imageBase64,
      metadata: {
        tokensUsed: aiRes.tokensUsed,
        wordCount: aiRes.markdown.split(/\s+/).length
      }
    };

    await VaultService.saveNote(newNote, config);
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  // Handle Instantiating Template directly from Gallery
  const handleInstantiateTemplate = async (template: NoteTemplate) => {
    const newNote: Note = {
      id: `nm_${Date.now()}`,
      title: `New ${template.name}`,
      content: template.skeletonMarkdown,
      rawInput: '',
      templateId: template.id,
      tags: [template.category.toLowerCase()],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gdriveSynced: Boolean(config.gdriveFolderPath),
      metadata: {
        wordCount: template.skeletonMarkdown.split(/\s+/).length,
        tokensUsed: 0
      }
    };

    await VaultService.saveNote(newNote, config);
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  // Handle Note Update
  const handleUpdateNote = async (updated: Note) => {
    await VaultService.saveNote(updated, config);
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
  };

  // Handle Note Deletion
  const handleDeleteNote = (noteId: string) => {
    VaultService.deleteNote(noteId);
    const remaining = notes.filter(n => n.id !== noteId);
    setNotes(remaining);
    if (activeNoteId === noteId) {
      setActiveNoteId(remaining[0]?.id || null);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#FBFBF9] text-[#1A1A18] overflow-hidden select-text">
      {/* Top Header */}
      <Header
        activeNote={activeNote}
        config={config}
        notesCount={notes.length}
        onOpenNewNote={() => setIsNewNoteOpen(true)}
        onOpenTemplateGallery={() => setIsGalleryOpen(true)}
        onOpenExportPrint={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          notes={notes}
          activeNoteId={activeNoteId}
          onSelectNote={(n) => setActiveNoteId(n.id)}
          onDeleteNote={handleDeleteNote}
        />

        {/* Editorial Canvas */}
        {activeNote ? (
          <EditorialCanvas
            note={activeNote}
            onUpdateNote={handleUpdateNote}
            onPrint={() => setIsExportOpen(true)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#ECECE6]">
            <p className="font-serif italic text-[#7E7C75]">Select a note or create one to begin.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <MessyInputModal
        isOpen={isNewNoteOpen}
        config={config}
        onClose={() => setIsNewNoteOpen(false)}
        onNoteCreated={handleNoteCreated}
      />

      <TemplateGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectTemplateToInstantiate={handleInstantiateTemplate}
      />

      <ExportPrintModal
        isOpen={isExportOpen}
        note={activeNote}
        config={config}
        onClose={() => setIsExportOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        config={config}
        onClose={() => setIsSettingsOpen(false)}
        onSaveConfig={setConfig}
      />
    </div>
  );
};

export default App;
