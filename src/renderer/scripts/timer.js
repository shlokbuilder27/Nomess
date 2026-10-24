// Sovereign Pomodoro Timer Engine
class PomodoroTimer {
  constructor() {
    this.totalSeconds = 25 * 60;
    this.remainingSeconds = 25 * 60;
    this.isRunning = false;
    this.mode = 'work'; // 'work' | 'short-break' | 'long-break'
    this.interval = null;
    this.startTime = null;
    this.targetEndTime = null;
    this.activeTask = null; // Currently linked task or schedule block

    this.perimeter = 2 * Math.PI * 150; // Radius = 150 -> 942.48
    this.onTickCallbacks = [];
    this.onCompleteCallbacks = [];

    this.initElements();
  }

  initElements() {
    this.ringWrapper = document.getElementById('timer-ring-wrapper');
    this.circleProgress = document.getElementById('timer-progress-circle');
    this.digitsDisplay = document.getElementById('timer-digits');
    this.statusBadge = document.getElementById('timer-status-badge');
    this.taskLabel = document.getElementById('timer-task-label');
    this.btnPlayPause = document.getElementById('btn-timer-play-pause');
    this.btnReset = document.getElementById('btn-timer-reset');
    this.btnSkip = document.getElementById('btn-timer-skip');

    if (this.btnPlayPause) {
      this.btnPlayPause.addEventListener('click', () => this.toggle());
    }
    if (this.btnReset) {
      this.btnReset.addEventListener('click', () => this.reset());
    }
    if (this.btnSkip) {
      this.btnSkip.addEventListener('click', () => this.skip());
    }

    this.updateDisplay();
  }

  setDuration(minutes, mode = 'work', task = null) {
    this.pause();
    this.mode = mode;
    this.activeTask = task;
    this.totalSeconds = Math.max(1, Math.round(minutes * 60));
    this.remainingSeconds = this.totalSeconds;

    if (this.ringWrapper) {
      if (mode === 'work') {
        this.ringWrapper.classList.remove('break-mode');
        this.statusBadge.textContent = 'DEEP WORK FOCUS';
      } else {
        this.ringWrapper.classList.add('break-mode');
        this.statusBadge.textContent = mode === 'long-break' ? 'TACTICAL RECHARGE' : 'SHORT REST BREAK';
      }
    }

    if (this.taskLabel) {
      if (task) {
        this.taskLabel.textContent = `${task.subject || 'Mission'}: ${task.description || task.title}`;
      } else {
        this.taskLabel.textContent = mode === 'work' ? 'Target: Unspecified Focus' : 'Hydrate & Reset Mind';
      }
    }

    this.updateDisplay();
  }

  toggle() {
    window.soundEngine.playClick();
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = Date.now();
    this.targetEndTime = this.startTime + this.remainingSeconds * 1000;

    if (this.btnPlayPause) {
      this.btnPlayPause.innerHTML = '⏸';
      this.btnPlayPause.setAttribute('title', 'Pause Timer (Spacebar)');
    }

    this.interval = setInterval(() => {
      const now = Date.now();
      const left = Math.max(0, Math.round((this.targetEndTime - now) / 1000));
      this.remainingSeconds = left;

      this.updateDisplay();

      if (this.remainingSeconds <= 0) {
        this.handleComplete();
      }
    }, 250);
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.interval);
    this.interval = null;

    if (this.btnPlayPause) {
      this.btnPlayPause.innerHTML = '▶';
      this.btnPlayPause.setAttribute('title', 'Start Timer (Spacebar)');
    }
  }

  reset() {
    window.soundEngine.playClick();
    this.pause();
    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
  }

  skip() {
    window.soundEngine.playClick();
    this.pause();
    if (this.mode === 'work') {
      this.setDuration(5, 'short-break');
    } else {
      this.setDuration(25, 'work');
    }
  }

  updateDisplay() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (this.digitsDisplay) {
      this.digitsDisplay.textContent = formatted;
    }

    // Update circular SVG progress
    if (this.circleProgress) {
      const fraction = this.remainingSeconds / this.totalSeconds;
      const offset = this.perimeter * (1 - fraction);
      this.circleProgress.style.strokeDashoffset = offset;
    }

    // Update document title for background tracking
    document.title = `${formatted} — ${this.mode === 'work' ? 'Focus' : 'Break'} | HomeworkNuke`;
  }

  handleComplete() {
    this.pause();
    window.soundEngine.playChime();

    // Trigger confetti burst
    if (window.confetti) {
      window.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
    }

    // Record pomodoro session to DB
    const sessionPayload = {
      taskId: this.activeTask ? this.activeTask.id : undefined,
      taskSubject: this.activeTask ? (this.activeTask.subject || 'Focus') : 'General',
      taskTitle: this.activeTask ? (this.activeTask.description || this.activeTask.title) : 'Focus Session',
      blockType: this.mode,
      durationMinutes: Math.round(this.totalSeconds / 60),
      completedMinutes: Math.round(this.totalSeconds / 60),
      startedAt: new Date(Date.now() - this.totalSeconds * 1000).toISOString(),
      finishedAt: new Date().toISOString(),
      completed: true,
    };

    if (window.electronAPI) {
      window.electronAPI.recordSession(sessionPayload).then(() => {
        if (window.app && window.app.refreshStats) {
          window.app.refreshStats();
        }
      });
    }

    // Auto switch modes or prompt
    if (this.mode === 'work') {
      // Suggest short break
      setTimeout(() => {
        this.setDuration(5, 'short-break');
      }, 1000);
    } else {
      // Break over, ready for next work block
      setTimeout(() => {
        this.setDuration(25, 'work');
      }, 1000);
    }
  }
}

window.PomodoroTimer = PomodoroTimer;
