export type TaskType = 'written' | 'reading' | 'memorization' | 'problem-solving';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'nuked';

export interface Task {
  id: string;
  subject: string;
  description: string;
  deadline?: string;         // ISO date string (YYYY-MM-DD or YYYY-MM-DDTHH:mm)
  taskType: TaskType;
  estMinutes: number;        // Estimated time in minutes
  priority: number;          // 0 = Normal, 1 = High / Must Do First
  difficulty?: number;       // 1 (trivial) to 5 (extreme)
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface TaskInput {
  subject: string;
  description: string;
  deadline?: string;
  taskType?: TaskType;
  estMinutes?: number;
  priority?: number;
  notes?: string;
}

export interface ScheduledBlock {
  id: string;
  taskId: string;
  subject: string;
  title: string;
  blockType: 'work' | 'short-break' | 'long-break';
  durationMinutes: number;
  startTime?: string;
  endTime?: string;
  rationale?: string;
  completed: boolean;
}

export interface GeneratedScheduleResponse {
  schedule: ScheduledBlock[];
  summary: string;
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  aiBriefing: string;
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  taskSubject?: string;
  taskTitle?: string;
  blockType: 'work' | 'short-break' | 'long-break';
  durationMinutes: number;
  completedMinutes: number;
  startedAt: string;
  finishedAt: string;
  completed: boolean;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  tasksCompleted: number;
  tasksNuked: number;
  totalWorkMinutes: number;
  streakDays: number;
  subjectDistribution: Record<string, number>; // subject -> count
}

export interface AppSettings {
  theme: 'dark' | 'light';
  geminiApiKey?: string;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
  spaceAnimationsEnabled: boolean;
  minimizeToTray: boolean;
}
