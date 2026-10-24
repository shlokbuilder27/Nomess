# 🚀 HomeworkNuke — Sovereign Study Control System

> *"Action Kills Anxiety. Thinking about homework causes dread; sitting down with a focused timer destroys it. School homework is not a test of my soul; it is a clerical toll to be paid quickly and mechanically."*  
> — **Shlok // Operating Creed**

![HomeworkNuke Logo](assets/icons/app-icon.svg)

**HomeworkNuke** is a native-feeling Windows desktop application designed for high-performance students and deep-tech builders preparing for board exams. It takes an overwhelming mountain of clerical homework, runs Gemini AI cognitive triage to estimate time and difficulty, sequences flexible-duration Pomodoro blocks, and eliminates friction with an addictive, tactile study experience.

---

## 🎨 Anti-AI-Slop Design Language

Strictly avoids generic corporate blue-purple gradients in favor of an organic, warm, cosmic aesthetic:

| Color | Hex | Role | Application |
|---|---|---|---|
| **Dark Moss** | `#2D312E` | Primary Structure / Dark Surface | Canvas background in dark mode, high-contrast typography in light mode |
| **Golden Amber** | `#D4A373` | Action & Urgency Accent | Active countdown timer ring, start buttons, high-priority flags |
| **Pale Sage** | `#E9EDC9` | Container Backgrounds | Mission cards, passive navigation bars |
| **Swiss Cream** | `#FEFAE0` | Main Surface (Light Mode) | Clean background surface, astronaut suit highlights |
| **Muted Slate** | `#CCD5AE` | Secondary Accents | Break mode ring, completed state strikethroughs |

### 🖋 Typography
- **Headings, Timers & Telemetry:** `Space Grotesk` (Variable Font)
- **Body & Mission Descriptions:** `Cagliostro` (Clean, human, readable)

---

## ⚡ Core Systems & Capabilities

### 1. 📋 Mission Queue Triage
- Quick entry with subject chips: **Mathematics, Science, English, Gujarati, Computer Studies, Social Science**.
- Cognitive task categories: *Problem-Solving*, *Written*, *Memorization*, *Reading*.
- Priority overrides (`★ HIGH PRIORITY`) and due-date tracking.
- Visual left-strip Golden Amber indicator for urgent assignments.

### 2. 📅 AI Strategic Study Blueprint
- Powered by **Google Gemini API** (`@google/genai`) with zero-latency heuristic offline fallback.
- Dynamically allocates flexible block lengths (e.g. 45m deep focus for Maths/Physics, 20m high-intensity sprint for revision).
- Interleaves heavy analytical blocks with lighter reading to prevent burnout.
- Drag-and-drop interactive timeline reordering.
- Direct **"LOAD IN TIMER"** button to jump straight into action.

### 3. ⏱ Sovereign Pomodoro Focus Engine
- High-precision SVG circular countdown progress ring.
- Harmonic Web Audio API synthesizer chimes upon completion (no audio file dependencies).
- Mode transitions: **Golden Amber** for Deep Work $\to$ **Muted Slate** for Tactical Rest Breaks.
- Global and local keyboard bindings:
  - `Spacebar` $\to$ Start / Pause Timer.
  - `Enter` $\to$ Mark current mission complete.
  - `Ctrl + Shift + H` $\to$ Toggle window visibility from anywhere.
  - `Ctrl + Shift + N` $\to$ Global Quick-Add Mission.

### 4. 💣 The Tactical NUKE Action
- Instantly identifies and eliminates all low-hanging, easy clerical homework (≤ 20 mins, normal priority).
- Triggers a tactical screen shockwave (`.shake-nuke`), deep sub-bass blast, and massive confetti burst.

### 5. 📸 Vision OCR Homework Ingestion
- Drag-and-drop or snap a photo of a textbook exercise, handwritten diary, or syllabus portion.
- Gemini Multimodal Vision automatically parses individual exercises and question ranges into structured tasks.

### 6. 📊 Daily Productivity Radar
- Telemetry tracking: consecutive sovereign streak days, missions eliminated, tasks nuked, and total deep focus minutes logged.

---

## 🛠 Tech Stack

- **Platform:** Windows Desktop (Electron v34.5.8)
- **Architecture:** TypeScript (strict CommonJS build), HTML5, CSS3, Web Audio API, Canvas
- **AI Engine:** Google Gemini API (`gemini-3.8-flash` / `gemini-flash-latest`)
- **Storage:** Local atomic JSON database (`data/homeworknuke-db.json`)
- **Branding:** Custom 2D Space Astronaut vector icon

---

## 🚀 Quick Launch

### Option 1: 1-Click Batch Launcher
Double-click `launch-app.bat` in this directory.

### Option 2: Command Line
```bash
# In F:\DEV\homeworknuke
npm start
# or
npm run dev
```

---

*Built with precision during Vibe Session #1. Anti-AI-Slop. 100% Sovereign.*
