import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { Task, TaskInput, PomodoroSession, DailyStats, AppSettings } from './types';

interface DatabaseSchema {
  version: number;
  tasks: Task[];
  sessions: PomodoroSession[];
  stats: Record<string, DailyStats>; // date string -> DailyStats
  settings: AppSettings;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  soundEnabled: true,
  autoStartBreaks: false,
  spaceAnimationsEnabled: true,
  minimizeToTray: true,
};

export class Database {
  private filePath: string;
  private data: DatabaseSchema;

  constructor() {
    // Prefer project local data folder if running in development, or userData in production
    const isDev = !app.isPackaged;
    const baseDir = isDev ? path.join(__dirname, '../../data') : path.join(app.getPath('userData'), 'data');
    
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    this.filePath = path.join(baseDir, 'homeworknuke-db.json');
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          version: parsed.version || 1,
          tasks: parsed.tasks || [],
          sessions: parsed.sessions || [],
          stats: parsed.stats || {},
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        };
      } catch (err) {
        console.error('Failed to parse database file, resetting to defaults:', err);
      }
    }
    const initial: DatabaseSchema = {
      version: 1,
      tasks: [],
      sessions: [],
      stats: {},
      settings: DEFAULT_SETTINGS,
    };
    this.save(initial);
    return initial;
  }

  private save(dataToSave?: DatabaseSchema): void {
    const payload = dataToSave || this.data;
    const tempPath = `${this.filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(payload, null, 2), 'utf-8');
    fs.renameSync(tempPath, this.filePath);
  }

  public getTasks(): Task[] {
    return [...this.data.tasks];
  }

  public addTask(input: TaskInput): Task {
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      subject: input.subject.trim(),
      description: input.description.trim(),
      deadline: input.deadline,
      taskType: input.taskType || 'written',
      estMinutes: input.estMinutes && input.estMinutes > 0 ? input.estMinutes : 25,
      priority: input.priority ?? 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: input.notes,
    };
    this.data.tasks.unshift(newTask);
    this.save();
    return newTask;
  }

  public addMultipleTasks(inputs: TaskInput[]): Task[] {
    const created: Task[] = [];
    for (const input of inputs) {
      if (!input.subject || !input.description) continue;
      const t = this.addTask(input);
      created.push(t);
    }
    return created;
  }

  public updateTask(id: string, updates: Partial<Task>): Task | null {
    const index = this.data.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const existing = this.data.tasks[index];
    const updated: Task = {
      ...existing,
      ...updates,
      id: existing.id, // Immutable ID
    };

    if (updates.status === 'completed' && existing.status !== 'completed') {
      updated.completedAt = new Date().toISOString();
      this.recordTaskCompleted(updated);
    }

    this.data.tasks[index] = updated;
    this.save();
    return updated;
  }

  public deleteTask(id: string): boolean {
    const initLen = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    if (this.data.tasks.length !== initLen) {
      this.save();
      return true;
    }
    return false;
  }

  public nukeTasks(filter: 'easy' | 'all-pending' = 'easy'): { nukedCount: number; tasks: Task[] } {
    const now = new Date().toISOString();
    let count = 0;
    const modified: Task[] = [];

    this.data.tasks = this.data.tasks.map(t => {
      if (t.status === 'completed' || t.status === 'nuked') return t;

      const isTarget = filter === 'all-pending' || (t.estMinutes <= 20 && t.priority === 0);
      if (isTarget) {
        count++;
        const nuked = {
          ...t,
          status: 'nuked' as const,
          completedAt: now,
        };
        modified.push(nuked);
        return nuked;
      }
      return t;
    });

    if (count > 0) {
      this.recordNukedBatch(count);
      this.save();
    }

    return { nukedCount: count, tasks: modified };
  }

  public recordSession(sessionInput: Omit<PomodoroSession, 'id'>): PomodoroSession {
    const session: PomodoroSession = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...sessionInput,
    };
    this.data.sessions.unshift(session);

    // Update daily stats work minutes
    const today = new Date().toISOString().split('T')[0];
    const stats = this.getOrCreateDailyStats(today);
    if (session.completed) {
      stats.totalWorkMinutes += session.durationMinutes;
    }
    this.save();
    return session;
  }

  public getSessions(limit = 50): PomodoroSession[] {
    return this.data.sessions.slice(0, limit);
  }

  private getOrCreateDailyStats(dateStr: string): DailyStats {
    if (!this.data.stats[dateStr]) {
      this.data.stats[dateStr] = {
        date: dateStr,
        tasksCompleted: 0,
        tasksNuked: 0,
        totalWorkMinutes: 0,
        streakDays: this.calculateStreak(dateStr),
        subjectDistribution: {},
      };
    }
    return this.data.stats[dateStr];
  }

  private calculateStreak(currentDateStr: string): number {
    const dates = Object.keys(this.data.stats).sort().reverse();
    if (dates.length === 0) return 1;

    let streak = 0;
    const checkDate = new Date(currentDateStr);

    for (let i = 0; i < 365; i++) {
      const dStr = checkDate.toISOString().split('T')[0];
      const entry = this.data.stats[dStr];
      if (entry && (entry.tasksCompleted > 0 || entry.totalWorkMinutes > 0)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        // Today might not have activity yet
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return Math.max(1, streak);
  }

  private recordTaskCompleted(task: Task): void {
    const today = new Date().toISOString().split('T')[0];
    const stats = this.getOrCreateDailyStats(today);
    stats.tasksCompleted += 1;
    stats.subjectDistribution[task.subject] = (stats.subjectDistribution[task.subject] || 0) + 1;
  }

  private recordNukedBatch(count: number): void {
    const today = new Date().toISOString().split('T')[0];
    const stats = this.getOrCreateDailyStats(today);
    stats.tasksNuked += count;
  }

  public getDailyStats(dateStr?: string): DailyStats {
    const target = dateStr || new Date().toISOString().split('T')[0];
    return this.getOrCreateDailyStats(target);
  }

  public getAllStats(): Record<string, DailyStats> {
    return { ...this.data.stats };
  }

  public getSettings(): AppSettings {
    return { ...this.data.settings };
  }

  public saveSettings(updates: Partial<AppSettings>): AppSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
    };
    this.save();
    return this.data.settings;
  }
}
