import type { Note, VaultConfig } from '../types/note';

const DEFAULT_CONFIG_KEY = 'nomess_vault_config';
const LOCAL_STORAGE_NOTES_KEY = 'nomess_local_notes';

export class VaultService {
  /**
   * Load Vault Configuration
   */
  static loadConfig(): VaultConfig {
    const raw = localStorage.getItem(DEFAULT_CONFIG_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return {
      vaultPath: 'Nomess_Vault',
      gdriveFolderPath: '',
      aiProvider: 'pure-engineering',
      geminiApiKey: '',
      ollamaEndpoint: 'http://localhost:11434',
      ollamaModel: 'llama3.2',
      autoSaveToDisk: true
    };
  }

  /**
   * Save Vault Configuration
   */
  static saveConfig(config: VaultConfig): void {
    localStorage.setItem(DEFAULT_CONFIG_KEY, JSON.stringify(config));
  }

  /**
   * Serialize a Note into Markdown with RFC/YAML Frontmatter
   */
  static serializeToMarkdown(note: Note): string {
    const frontmatter = [
      '---',
      `id: "${note.id}"`,
      `title: "${note.title.replace(/"/g, '\\"')}"`,
      `template: "${note.templateId}"`,
      `created_at: "${note.createdAt}"`,
      `updated_at: "${note.updatedAt}"`,
      `tags: [${note.tags.map(t => `"${t}"`).join(', ')}]`,
      `tokens_used: ${note.metadata.tokensUsed ?? 0}`,
      `gdrive_synced: ${note.gdriveSynced}`,
      '---',
      '',
      note.content
    ].join('\n');

    return frontmatter;
  }

  /**
   * Parse Markdown with YAML frontmatter back into Note
   */
  static parseFromMarkdown(raw: string, fallbackId: string): Partial<Note> {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      return {
        id: fallbackId,
        title: 'Untitled Note',
        content: raw,
        tags: []
      };
    }

    const yamlBlock = match[1];
    const content = match[2];
    const getVal = (key: string) => {
      const line = yamlBlock.split('\n').find(l => l.startsWith(`${key}:`));
      return line ? line.replace(`${key}:`, '').trim().replace(/^["']|["']$/g, '') : undefined;
    };

    return {
      id: getVal('id') || fallbackId,
      title: getVal('title') || 'Untitled Note',
      templateId: (getVal('template') as any) || 'cornell-study',
      createdAt: getVal('created_at') || new Date().toISOString(),
      updatedAt: getVal('updated_at') || new Date().toISOString(),
      content,
      tags: []
    };
  }

  /**
   * Save Note to Vault (Tauri FS if native, localStorage fallback)
   */
  static async saveNote(note: Note, config: VaultConfig): Promise<boolean> {
    const markdownContent = this.serializeToMarkdown(note);

    // Save to local storage for instant state hydration
    const allNotes = this.loadAllNotes();
    const existingIndex = allNotes.findIndex(n => n.id === note.id);
    if (existingIndex >= 0) {
      allNotes[existingIndex] = note;
    } else {
      allNotes.unshift(note);
    }
    localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(allNotes));

    // If running in Tauri Native environment, write direct to physical filesystem
    try {
      if ((window as any).__TAURI_INTERNALS__) {
        const { writeTextFile } = await import('@tauri-apps/plugin-fs');
        const fileName = `${this.sanitizeFileName(note.title)}_${note.id.slice(0, 8)}.md`;
        
        // Save to vault directory
        if (config.vaultPath) {
          const fullPath = `${config.vaultPath}/${fileName}`;
          await writeTextFile(fullPath, markdownContent);
        }

        // Mirror to Google Drive folder if configured
        if (config.gdriveFolderPath) {
          const gdrivePath = `${config.gdriveFolderPath}/${fileName}`;
          await writeTextFile(gdrivePath, markdownContent);
        }
      }
      return true;
    } catch (err) {
      console.warn('Physical filesystem write skipped or running in preview mode:', err);
      return true;
    }
  }

  /**
   * Load all notes
   */
  static loadAllNotes(): Note[] {
    const raw = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return [];
  }

  /**
   * Delete a Note
   */
  static deleteNote(noteId: string): void {
    const allNotes = this.loadAllNotes();
    const filtered = allNotes.filter(n => n.id !== noteId);
    localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(filtered));
  }

  /**
   * Helper to sanitize file names for OS disk safety
   */
  private static sanitizeFileName(name: string): string {
    return name.replace(/[/\\?%*:|"<>]/g, '-').slice(0, 50).trim() || 'note';
  }
}
