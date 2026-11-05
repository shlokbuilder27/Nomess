export type TemplateId = 
  | 'cornell-study'
  | 'feynman-technique'
  | 'executive-memo'
  | 'zettelkasten'
  | 'architecture-spec'
  | 'meeting-decisional'
  | 'stoic-journal'
  | 'book-podcast-digest'
  | 'sop-checklist'
  | 'founder-pitch'
  | 'custom';

export interface NoteMetadata {
  readingTimeMinutes?: number;
  wordCount?: number;
  author?: string;
  sourceContext?: string;
  confidenceScore?: number;
  tokensUsed?: number;
  [key: string]: unknown;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Markdown formatted
  rawInput: string;
  templateId: TemplateId;
  tags: string[];
  createdAt: string; // ISO timestamp
  updatedAt: string;
  gdriveSynced: boolean;
  sourceScanDataUrl?: string; // Base64 or asset path if ingested via photo
  metadata: NoteMetadata;
}

export interface NoteTemplate {
  id: TemplateId;
  name: string;
  category: 'Thinking' | 'Learning' | 'Execution' | 'Strategy' | 'Reflection';
  tagline: string;
  description: string;
  iconName: string;
  promptInstructions: string;
  sampleInput: string;
  skeletonMarkdown: string;
}

export interface VaultConfig {
  vaultPath: string;
  gdriveFolderPath: string;
  aiProvider: 'pure-engineering' | 'gemini' | 'ollama';
  geminiApiKey: string;
  ollamaEndpoint: string;
  ollamaModel: string;
  autoSaveToDisk: boolean;
}
