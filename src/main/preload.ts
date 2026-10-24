import { contextBridge, ipcRenderer } from 'electron';
import { Task, TaskInput, PomodoroSession, DailyStats, AppSettings, GeneratedScheduleResponse } from './types';

export const API = {
  // Tasks
  getTasks: (): Promise<Task[]> => ipcRenderer.invoke('tasks:get'),
  addTask: (input: TaskInput): Promise<Task> => ipcRenderer.invoke('tasks:add', input),
  addMultipleTasks: (inputs: TaskInput[]): Promise<Task[]> => ipcRenderer.invoke('tasks:addMultiple', inputs),
  updateTask: (id: string, updates: Partial<Task>): Promise<Task | null> => ipcRenderer.invoke('tasks:update', id, updates),
  deleteTask: (id: string): Promise<boolean> => ipcRenderer.invoke('tasks:delete', id),
  nukeTasks: (filter?: 'easy' | 'all-pending'): Promise<{ nukedCount: number; tasks: Task[] }> =>
    ipcRenderer.invoke('tasks:nuke', filter),

  // Schedule & AI
  generateSchedule: (tasks: Task[]): Promise<GeneratedScheduleResponse> =>
    ipcRenderer.invoke('schedule:generate', tasks),
  ocrHomework: (base64Image: string, mimeType?: string): Promise<TaskInput[]> =>
    ipcRenderer.invoke('ai:ocr', base64Image, mimeType),

  // Pomodoro Sessions & Stats
  recordSession: (session: Omit<PomodoroSession, 'id'>): Promise<PomodoroSession> =>
    ipcRenderer.invoke('sessions:record', session),
  getSessions: (): Promise<PomodoroSession[]> => ipcRenderer.invoke('sessions:get'),
  getDailyStats: (dateStr?: string): Promise<DailyStats> =>
    ipcRenderer.invoke('stats:getDaily', dateStr),
  getAllStats: (): Promise<Record<string, DailyStats>> => ipcRenderer.invoke('stats:getAll'),

  // Settings
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings: Partial<AppSettings>): Promise<AppSettings> =>
    ipcRenderer.invoke('settings:save', settings),

  // Window Controls
  windowMinimize: () => ipcRenderer.send('window:minimize'),
  windowMaximize: () => ipcRenderer.send('window:maximize'),
  windowClose: () => ipcRenderer.send('window:close'),

  // Listeners from Tray / Shortcuts
  onShortcutQuickAdd: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('action:quick-add', handler);
    return () => ipcRenderer.removeListener('action:quick-add', handler);
  },
  onShortcutToggleTimer: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('action:toggle-timer', handler);
    return () => ipcRenderer.removeListener('action:toggle-timer', handler);
  },
};

contextBridge.exposeInMainWorld('electronAPI', API);
