import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  FileText, 
  Columns, 
  Flame, 
  Briefcase, 
  Network, 
  Cpu, 
  Users, 
  Compass, 
  BookOpen, 
  CheckSquare, 
  Sparkles 
} from 'lucide-react';
import type { Note } from '../types/note';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

const TEMPLATE_CATEGORIES: Record<string, string> = {
  'cornell-study': 'Learning',
  'feynman-technique': 'Learning',
  'book-podcast-digest': 'Learning',
  'zettelkasten': 'Thinking',
  'architecture-spec': 'Execution',
  'sop-checklist': 'Execution',
  'meeting-decisional': 'Execution',
  'executive-memo': 'Strategy',
  'founder-pitch': 'Strategy',
  'stoic-journal': 'Reflection'
};

const noteCategoryMatches = (templateId: string, category: string) => {
  return TEMPLATE_CATEGORIES[templateId] === category;
};

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  'cornell-study': <Columns className="w-3.5 h-3.5 text-[#3C6351]" />,
  'feynman-technique': <Flame className="w-3.5 h-3.5 text-[#C84B31]" />,
  'executive-memo': <Briefcase className="w-3.5 h-3.5 text-[#2D4059]" />,
  'zettelkasten': <Network className="w-3.5 h-3.5 text-[#C08A3E]" />,
  'architecture-spec': <Cpu className="w-3.5 h-3.5 text-[#45443F]" />,
  'meeting-decisional': <Users className="w-3.5 h-3.5 text-[#3C6351]" />,
  'stoic-journal': <Compass className="w-3.5 h-3.5 text-[#C84B31]" />,
  'book-podcast-digest': <BookOpen className="w-3.5 h-3.5 text-[#C08A3E]" />,
  'sop-checklist': <CheckSquare className="w-3.5 h-3.5 text-[#2D4059]" />,
  'founder-pitch': <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" />
};

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  activeNoteId,
  onSelectNote,
  onDeleteNote
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Learning', 'Thinking', 'Execution', 'Strategy', 'Reflection'];

  const filteredNotes = notes.filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedCategory === 'All') return true;
    return noteCategoryMatches(n.templateId, selectedCategory);
  });

  return (
    <aside className="w-80 h-full border-r border-[#E6E4DC] bg-[#F4F4EE] flex flex-col no-print select-none">
      {/* Search & Category Filter Header */}
      <div className="p-3 border-b border-[#E6E4DC] space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E7C75]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or #tags..."
            className="w-full bg-[#EAE8E0] border border-transparent focus:border-[#C84B31] focus:bg-[#FFFFFF] text-xs rounded-md pl-8 pr-3 py-1.5 text-[#1A1A18] placeholder-[#7E7C75] outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-0.5 no-scrollbar text-[10px]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#1A1A18] text-[#FBFBF9] font-medium'
                  : 'bg-[#EAE8E0] text-[#7E7C75] hover:text-[#1A1A18]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredNotes.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <FileText className="w-8 h-8 text-[#B5B3AA] mx-auto mb-2 stroke-[1.5]" />
            <p className="text-xs font-serif text-[#7E7C75] italic">
              {notes.length === 0 ? 'No notes in vault yet.' : 'No notes match your search.'}
            </p>
            <p className="text-[11px] text-[#B5B3AA] mt-1">
              Click &quot;Restructure Note&quot; to transform your thoughts.
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isActive = note.id === activeNoteId;
            const dateStr = new Date(note.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric'
            });

            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-[#FFFFFF] border-[#D8D6CD] shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-[#EAE8E0]/70'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-1.5 mb-1">
                    {TEMPLATE_ICONS[note.templateId] || <FileText className="w-3.5 h-3.5 text-[#7E7C75]" />}
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#7E7C75] font-semibold">
                      {note.templateId.replace(/-/g, ' ')}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this note from vault?')) {
                        onDeleteNote(note.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#B5B3AA] hover:text-[#C84B31] transition-opacity"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <h3 className={`text-sm font-serif font-medium line-clamp-1 ${
                  isActive ? 'text-[#1A1A18]' : 'text-[#45443F]'
                }`}>
                  {note.title || 'Untitled Note'}
                </h3>

                <p className="text-xs text-[#7E7C75] line-clamp-2 mt-1 font-sans">
                  {note.content.replace(/^[#\-* ]+/gm, '').slice(0, 100)}
                </p>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#F0EFE9] text-[10px] text-[#B5B3AA] font-mono">
                  <span>{dateStr}</span>
                  {note.tags.length > 0 && (
                    <span className="truncate max-w-[120px]">
                      #{note.tags.slice(0, 2).join(' #')}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
