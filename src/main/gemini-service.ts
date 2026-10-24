import { GoogleGenAI } from '@google/genai';
import { Task, GeneratedScheduleResponse, ScheduledBlock, TaskInput } from './types';

export class GeminiService {
  private client: GoogleGenAI | null = null;
  private currentApiKey: string = '';

  constructor(apiKey?: string) {
    if (apiKey) {
      this.setApiKey(apiKey);
    }
  }

  public setApiKey(apiKey: string): void {
    this.currentApiKey = apiKey.trim();
    if (this.currentApiKey) {
      try {
        this.client = new GoogleGenAI({ apiKey: this.currentApiKey });
      } catch (err) {
        console.error('Failed to initialize GoogleGenAI client:', err);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  public hasValidKey(): boolean {
    return Boolean(this.client && this.currentApiKey.length > 5);
  }

  /**
   * Generates an optimal Pomodoro study schedule with flexible block durations.
   */
  public async generateSchedule(tasks: Task[]): Promise<GeneratedScheduleResponse> {
    const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
    if (pendingTasks.length === 0) {
      return {
        schedule: [],
        summary: 'No pending homework tasks found. Add your tasks first!',
        totalWorkMinutes: 0,
        totalBreakMinutes: 0,
        aiBriefing: 'Mission queue is empty. You are currently clear for deep work or rest.',
      };
    }

    if (this.hasValidKey() && this.client) {
      try {
        // Run with an 8-second timeout to ensure the app never hangs
        const aiPromise = this.generateScheduleWithGemini(pendingTasks);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI request timed out after 8s')), 8000)
        );
        return await Promise.race([aiPromise, timeoutPromise]);
      } catch (err) {
        console.warn('Gemini API call skipped or failed, falling back to heuristic scheduling:', err);
      }
    }

    // Heuristic intelligent fallback (zero internet required)
    return this.generateHeuristicSchedule(pendingTasks);
  }

  private async generateScheduleWithGemini(tasks: Task[]): Promise<GeneratedScheduleResponse> {
    if (!this.client) throw new Error('Gemini client not initialized');

    const prompt = `You are a high-performance cognitive scheduling engine for an ambitious 15-year-old deep-tech builder preparing for board exams.
Your objective: Take these raw homework assignments and construct an optimal Pomodoro schedule.

Rules for schedule design:
1. Flexible block lengths based on task type:
   - "problem-solving" (maths, physics): 40-50 mins deep work.
   - "written" (exercises, essays): 30-40 mins focus.
   - "memorization" or "reading": 20-30 mins high-intensity sprint.
2. Interleave heavy analytical tasks with reading/memorization.
3. Respect high priority tasks (priority: 1) and urgent deadlines first.
4. Insert short 5-7 minute rest breaks between work blocks.
5. If total work exceeds 90 minutes, insert a 15-minute long recharge break.
6. Provide an inspiring, disciplined "aiBriefing" in an energetic, no-nonsense systems-engineer ethos.

Task list JSON:
${JSON.stringify(tasks.map(t => ({
  id: t.id,
  subject: t.subject,
  description: t.description,
  taskType: t.taskType,
  estMinutes: t.estMinutes,
  priority: t.priority,
  deadline: t.deadline
})), null, 2)}

Respond with STRICT VALID JSON ONLY in the following schema:
{
  "summary": "Brief 1-sentence strategic summary",
  "aiBriefing": "2-3 sentences of tactical advice and motivation",
  "blocks": [
    {
      "taskId": "task id from input, or null for breaks",
      "subject": "Subject name or 'Rest'",
      "title": "Clear action-oriented block title",
      "blockType": "work" | "short-break" | "long-break",
      "durationMinutes": 35,
      "rationale": "Why this task is placed here"
    }
  ]
}`;

    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite'];
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const response = await this.client.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const responseText = response.text || '{}';
        const parsed = JSON.parse(responseText);

        const schedule: ScheduledBlock[] = (parsed.blocks || []).map((b: any, index: number) => ({
          id: `block_${Date.now()}_${index}`,
          taskId: b.taskId || '',
          subject: b.subject || (b.blockType === 'work' ? 'Homework' : 'Rest'),
          title: b.title || (b.blockType === 'work' ? 'Focus Session' : 'Recharge Break'),
          blockType: b.blockType || 'work',
          durationMinutes: Number(b.durationMinutes) || 25,
          rationale: b.rationale,
          completed: false,
        }));

        let workMins = 0;
        let breakMins = 0;
        for (const b of schedule) {
          if (b.blockType === 'work') workMins += b.durationMinutes;
          else breakMins += b.durationMinutes;
        }

        return {
          schedule,
          summary: parsed.summary || 'AI-optimized study blueprint created.',
          totalWorkMinutes: workMins,
          totalBreakMinutes: breakMins,
          aiBriefing: parsed.aiBriefing || 'Execute with full cognitive lock-in. One block at a time.',
        };
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    throw lastError || new Error('All model attempts failed');
  }

  private generateHeuristicSchedule(tasks: Task[]): GeneratedScheduleResponse {
    // Sort tasks: Priority 1 first, then shortest to longest, or deadline if present
    const sorted = [...tasks].sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return a.estMinutes - b.estMinutes;
    });

    const schedule: ScheduledBlock[] = [];
    let consecutiveWorkMins = 0;
    let totalWork = 0;
    let totalBreak = 0;

    sorted.forEach((task, idx) => {
      // Determine optimal duration based on task type
      let duration = task.estMinutes;
      if (!duration || duration <= 0) {
        if (task.taskType === 'problem-solving') duration = 45;
        else if (task.taskType === 'written') duration = 35;
        else if (task.taskType === 'memorization') duration = 25;
        else duration = 30;
      }

      schedule.push({
        id: `block_${Date.now()}_w${idx}`,
        taskId: task.id,
        subject: task.subject,
        title: `${task.subject}: ${task.description}`,
        blockType: 'work',
        durationMinutes: duration,
        rationale: task.priority === 1 ? 'High priority target' : 'Sequenced for cognitive momentum',
        completed: false,
      });

      totalWork += duration;
      consecutiveWorkMins += duration;

      // Add appropriate break if not the last task
      if (idx < sorted.length - 1) {
        const isLongBreak = consecutiveWorkMins >= 75;
        const breakDuration = isLongBreak ? 15 : 5;
        schedule.push({
          id: `block_${Date.now()}_b${idx}`,
          taskId: '',
          subject: 'Rest & Recover',
          title: isLongBreak ? 'Deep Recharge & Hydration' : 'Short Tactical Break',
          blockType: isLongBreak ? 'long-break' : 'short-break',
          durationMinutes: breakDuration,
          rationale: isLongBreak ? 'Cognitive fatigue reset' : 'Maintain neuroplastic focus',
          completed: false,
        });
        totalBreak += breakDuration;
        if (isLongBreak) consecutiveWorkMins = 0;
      }
    });

    return {
      schedule,
      summary: `Algorithmic schedule constructed for ${sorted.length} assignments.`,
      totalWorkMinutes: totalWork,
      totalBreakMinutes: totalBreak,
      aiBriefing: 'Execution discipline is sovereignty. Eliminate tasks methodically.',
    };
  }

  /**
   * OCR Homework from base64 image using Gemini Multimodal Vision
   */
  public async ocrHomeworkImage(base64Data: string, mimeType = 'image/jpeg'): Promise<TaskInput[]> {
    if (!this.hasValidKey() || !this.client) {
      throw new Error('Gemini API key is required to perform camera OCR. Please configure your key in Settings.');
    }

    const prompt = `Inspect this image containing handwritten or printed homework assignments, syllabus portions, or study tasks.
Extract every distinct assignment into structured tasks.

For each task provide:
- subject: School subject (e.g., Mathematics, Science, English, Gujarati, Social Science, Computer Studies)
- description: Specific exercise, question numbers, page, or assignment description
- taskType: One of "written", "reading", "memorization", or "problem-solving"
- estMinutes: Realistic estimated time in minutes (15 to 60)
- priority: 1 if marked urgent/due tomorrow, otherwise 0

Respond with STRICT JSON in this format:
{
  "tasks": [
    {
      "subject": "Mathematics",
      "description": "Exercise 4.2 Q1 to Q10",
      "taskType": "problem-solving",
      "estMinutes": 40,
      "priority": 1
    }
  ]
}`;

    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

    const response = await this.client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{"tasks":[]}';
    const parsed = JSON.parse(responseText);
    return Array.isArray(parsed.tasks) ? parsed.tasks : [];
  }
}
