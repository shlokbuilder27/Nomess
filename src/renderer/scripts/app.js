// HomeworkNuke Main Controller
class HomeworkNukeApp {
  constructor() {
    this.tasks = [];
    this.currentSchedule = null;
    this.currentView = 'tasks';
    this.selectedSubject = 'Mathematics';
    this.selectedTaskType = 'problem-solving';
    this.selectedPriority = 0;

    this.init();
  }

  async init() {
    this.initTheme();
    this.initWindowControls();
    this.initNavigation();
    this.initTaskForm();
    this.initNukeButton();
    this.initKeyboardShortcuts();
    this.initOCR();
    this.initSettings();

    // Start background space animation and confetti
    window.spaceBg = new window.SpaceAnimation('space-canvas');
    window.confetti = new window.ConfettiEngine('confetti-canvas');
    window.timer = new window.PomodoroTimer();

    // Load initial tasks & stats
    await this.refreshTasks();
    await this.refreshStats();

    // Check for API IPC events (shortcuts from tray)
    if (window.electronAPI) {
      window.electronAPI.onShortcutQuickAdd(() => {
        this.switchView('tasks');
        const input = document.getElementById('task-desc-input');
        if (input) input.focus();
      });
      window.electronAPI.onShortcutToggleTimer(() => {
        this.switchView('timer');
        window.timer.toggle();
      });
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('homeworknuke_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButton(savedTheme);

    const toggleBtn = document.getElementById('btn-toggle-theme');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        window.soundEngine.playClick();
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('homeworknuke_theme', next);
        this.updateThemeButton(next);
        if (window.electronAPI) {
          window.electronAPI.saveSettings({ theme: next });
        }
      });
    }
  }

  updateThemeButton(theme) {
    const toggleBtn = document.getElementById('btn-toggle-theme');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'dark' ? '☀ SWISS CREAM' : '🌙 DARK MOSS';
    }
  }

  initWindowControls() {
    const btnMin = document.getElementById('win-min');
    const btnMax = document.getElementById('win-max');
    const btnClose = document.getElementById('win-close');

    if (btnMin) btnMin.addEventListener('click', () => window.electronAPI.windowMinimize());
    if (btnMax) btnMax.addEventListener('click', () => window.electronAPI.windowMaximize());
    if (btnClose) btnClose.addEventListener('click', () => window.electronAPI.windowClose());
  }

  initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        window.soundEngine.playClick();
        const viewName = item.getAttribute('data-view');
        this.switchView(viewName);
      });
    });
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach((item) => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Hide all view panels, show target
    document.querySelectorAll('.view-panel').forEach((panel) => {
      panel.style.display = 'none';
    });

    const activePanel = document.getElementById(`view-${viewName}`);
    if (activePanel) {
      activePanel.style.display = 'block';
    }

    if (viewName === 'stats') {
      this.refreshStats();
    }
  }

  initTaskForm() {
    // Subject chips
    const subjectChips = document.querySelectorAll('#subject-chips .chip');
    subjectChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        window.soundEngine.playClick();
        subjectChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedSubject = chip.getAttribute('data-subject');
      });
    });

    // Task type chips
    const typeChips = document.querySelectorAll('#type-chips .chip');
    typeChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        window.soundEngine.playClick();
        typeChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedTaskType = chip.getAttribute('data-type');
      });
    });

    // Priority toggle button
    const btnPriority = document.getElementById('btn-toggle-priority');
    if (btnPriority) {
      btnPriority.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.selectedPriority = this.selectedPriority === 0 ? 1 : 0;
        if (this.selectedPriority === 1) {
          btnPriority.classList.add('active');
          btnPriority.textContent = '★ HIGH PRIORITY';
        } else {
          btnPriority.classList.remove('active');
          btnPriority.textContent = '☆ NORMAL PRIORITY';
        }
      });
    }

    // Add Task Button
    const btnAdd = document.getElementById('btn-add-task');
    const inputDesc = document.getElementById('task-desc-input');
    const inputMins = document.getElementById('task-mins-input');
    const inputDeadline = document.getElementById('task-deadline-input');

    const handleAddTask = async () => {
      const desc = inputDesc.value.trim();
      if (!desc) {
        inputDesc.focus();
        return;
      }

      window.soundEngine.playSuccess();
      const est = parseInt(inputMins.value) || 25;

      const payload = {
        subject: this.selectedSubject,
        description: desc,
        taskType: this.selectedTaskType,
        estMinutes: est,
        priority: this.selectedPriority,
        deadline: inputDeadline.value || undefined,
      };

      await window.electronAPI.addTask(payload);
      inputDesc.value = '';
      await this.refreshTasks();
    };

    if (btnAdd) btnAdd.addEventListener('click', handleAddTask);
    if (inputDesc) {
      inputDesc.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleAddTask();
      });
    }
  }

  async refreshTasks() {
    this.tasks = await window.electronAPI.getTasks();
    this.renderTaskList();
    this.updateTaskBadges();
  }

  updateTaskBadges() {
    const pendingCount = this.tasks.filter((t) => t.status === 'pending' || t.status === 'in-progress').length;
    const badge = document.getElementById('nav-task-badge');
    if (badge) {
      badge.textContent = pendingCount;
    }
  }

  renderTaskList() {
    const container = document.getElementById('task-list-container');
    if (!container) return;

    if (this.tasks.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
          <div style="font-size: 40px; margin-bottom: 12px;">🛸</div>
          <h3 style="font-size: 18px; margin-bottom: 6px; color: var(--text-primary);">Mission Queue Clear</h3>
          <p style="font-size: 14px;">No homework assignments found. Add your tasks above or snap a syllabus photo!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    this.tasks.forEach((task) => {
      const card = document.createElement('div');
      card.className = `task-card ${task.priority === 1 ? 'priority-high' : ''} ${task.status === 'completed' || task.status === 'nuked' ? 'completed' : ''}`;

      const isDone = task.status === 'completed' || task.status === 'nuked';

      card.innerHTML = `
        <div class="task-left">
          <div class="task-check-circle" title="Mark Complete">
            ${isDone ? '✓' : ''}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="task-subject-tag">${task.subject}</span>
              <span class="task-title">${task.description}</span>
              ${task.priority === 1 ? '<span style="color: var(--color-golden-amber); font-weight: bold; font-size: 12px;">★</span>' : ''}
            </div>
            <div class="task-meta">
              <span>⏱ ${task.estMinutes} mins</span>
              <span>🏷 ${task.taskType}</span>
              ${task.deadline ? `<span>📅 Due: ${task.deadline}</span>` : ''}
              ${task.status === 'nuked' ? '<span style="color: var(--color-danger-nuke); font-weight: 700;">[NUKED 💣]</span>' : ''}
            </div>
          </div>
        </div>
        <div class="task-actions">
          <button class="btn-icon btn-start-timer" title="Load into Pomodoro Timer">⏱</button>
          <button class="btn-icon danger btn-delete-task" title="Delete Task">🗑</button>
        </div>
      `;

      // Checkbox complete toggle
      const checkCircle = card.querySelector('.task-check-circle');
      checkCircle.addEventListener('click', async () => {
        window.soundEngine.playSuccess();
        const nextStatus = isDone ? 'pending' : 'completed';
        await window.electronAPI.updateTask(task.id, { status: nextStatus });
        if (nextStatus === 'completed') {
          window.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 50);
        }
        await this.refreshTasks();
      });

      // Load into Timer
      const btnTimer = card.querySelector('.btn-start-timer');
      btnTimer.addEventListener('click', () => {
        window.soundEngine.playClick();
        window.timer.setDuration(task.estMinutes, 'work', task);
        this.switchView('timer');
      });

      // Delete Task
      const btnDelete = card.querySelector('.btn-delete-task');
      btnDelete.addEventListener('click', async () => {
        window.soundEngine.playClick();
        await window.electronAPI.deleteTask(task.id);
        await this.refreshTasks();
      });

      container.appendChild(card);
    });
  }

  initNukeButton() {
    const btnNuke = document.getElementById('btn-nuke-action');
    if (!btnNuke) return;

    btnNuke.addEventListener('click', async () => {
      // Audio Blast
      window.soundEngine.playNukeExplosion();

      // Screen Shockwave
      const appContainer = document.getElementById('app-container');
      appContainer.classList.add('shake-nuke');
      setTimeout(() => appContainer.classList.remove('shake-nuke'), 700);

      // Massive Multi-Stage Confetti Explosion
      window.confetti.burst(window.innerWidth * 0.3, window.innerHeight * 0.5, 90);
      window.confetti.burst(window.innerWidth * 0.7, window.innerHeight * 0.5, 90);
      setTimeout(() => {
        window.confetti.burst(window.innerWidth * 0.5, window.innerHeight * 0.3, 120);
      }, 150);

      // Execute Nuke on Backend
      const result = await window.electronAPI.nukeTasks('easy');
      await this.refreshTasks();
      await this.refreshStats();

      // Notification feedback
      this.showToast(`💣 NUKE DETONATED: ${result.nukedCount} easy missions eliminated!`);
    });
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '28px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'var(--bg-secondary)';
    toast.style.border = '1px solid var(--color-golden-amber)';
    toast.style.color = 'var(--text-primary)';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '24px';
    toast.style.fontFamily = 'Space Grotesk, sans-serif';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    toast.style.zIndex = '9999';
    toast.textContent = message;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  async generateAISchedule() {
    const btnGen = document.getElementById('btn-generate-schedule');
    if (btnGen) {
      btnGen.innerHTML = '⚡ CALCULATING TRAJECTORY...';
      btnGen.style.opacity = '0.7';
    }

    try {
      window.soundEngine.playClick();
      const response = await window.electronAPI.generateSchedule(this.tasks);
      this.currentSchedule = response;
      this.renderScheduleView();
    } catch (err) {
      console.error(err);
      this.showToast('Schedule calculation error: ' + err.message);
    } finally {
      if (btnGen) {
        btnGen.innerHTML = '⚡ REGENERATE BLUEPRINT';
        btnGen.style.opacity = '1';
      }
    }
  }

  renderScheduleView() {
    const container = document.getElementById('schedule-blocks-container');
    const briefingText = document.getElementById('ai-briefing-content');
    const summaryHeader = document.getElementById('schedule-summary-header');

    if (!this.currentSchedule || !container) return;

    if (briefingText) {
      briefingText.textContent = this.currentSchedule.aiBriefing;
    }
    if (summaryHeader) {
      summaryHeader.textContent = `${this.currentSchedule.summary} (Total Work: ${this.currentSchedule.totalWorkMinutes}m | Rest: ${this.currentSchedule.totalBreakMinutes}m)`;
    }

    container.innerHTML = '';
    this.currentSchedule.schedule.forEach((block, index) => {
      const isBreak = block.blockType !== 'work';
      const el = document.createElement('div');
      el.className = `timeline-block ${isBreak ? 'break-block' : ''}`;
      el.setAttribute('draggable', 'true');
      el.setAttribute('data-index', index);

      el.innerHTML = `
        <div class="block-left">
          <span style="font-size: 16px;">${isBreak ? '☕' : '🎯'}</span>
          <div>
            <div style="font-weight: 600; font-size: 14px; color: var(--text-primary);">${block.title}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${block.rationale || (isBreak ? 'Rest state' : 'Target assignment')}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="block-duration-badge">${block.durationMinutes} MIN</span>
          <button class="btn-primary" style="padding: 6px 14px; font-size: 11px;">LOAD IN TIMER</button>
        </div>
      `;

      // Load block in timer
      const btnLoad = el.querySelector('button');
      btnLoad.addEventListener('click', () => {
        window.soundEngine.playClick();
        window.timer.setDuration(block.durationMinutes, block.blockType, {
          subject: block.subject,
          description: block.title,
        });
        this.switchView('timer');
      });

      // Drag and drop reordering
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', index);
        el.style.opacity = '0.5';
      });
      el.addEventListener('dragend', () => {
        el.style.opacity = '1';
      });
      el.addEventListener('dragover', (e) => {
        e.preventDefault();
        el.style.borderColor = 'var(--color-golden-amber)';
      });
      el.addEventListener('dragleave', () => {
        el.style.borderColor = 'var(--border-subtle)';
      });
      el.addEventListener('drop', (e) => {
        e.preventDefault();
        el.style.borderColor = 'var(--border-subtle)';
        const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
        const toIdx = index;
        if (fromIdx !== toIdx) {
          const item = this.currentSchedule.schedule.splice(fromIdx, 1)[0];
          this.currentSchedule.schedule.splice(toIdx, 0, item);
          this.renderScheduleView();
        }
      });

      container.appendChild(el);
    });
  }

  async refreshStats() {
    const stats = await window.electronAPI.getDailyStats();
    const streakEl = document.getElementById('stat-streak');
    const tasksDoneEl = document.getElementById('stat-tasks-done');
    const nukedEl = document.getElementById('stat-tasks-nuked');
    const minutesEl = document.getElementById('stat-minutes');

    if (streakEl) streakEl.textContent = `${stats.streakDays} DAYS`;
    if (tasksDoneEl) tasksDoneEl.textContent = stats.tasksCompleted;
    if (nukedEl) nukedEl.textContent = stats.tasksNuked;
    if (minutesEl) minutesEl.textContent = `${stats.totalWorkMinutes}m`;
  }

  initOCR() {
    const dropzone = document.getElementById('ocr-dropzone');
    const fileInput = document.getElementById('ocr-file-input');
    const previewContainer = document.getElementById('ocr-preview-container');
    const previewImg = document.getElementById('ocr-preview-img');
    const btnScan = document.getElementById('btn-run-ocr');
    let currentBase64 = null;

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--color-golden-amber)';
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'var(--border-subtle)';
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--border-subtle)';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.handleOCRFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleOCRFile(e.target.files[0]);
      }
    });

    if (btnScan) {
      btnScan.addEventListener('click', async () => {
        if (!currentBase64) return;
        window.soundEngine.playClick();
        btnScan.innerHTML = '🔍 GEMINI VISION ANALYZING...';
        btnScan.disabled = true;

        try {
          const tasks = await window.electronAPI.ocrHomework(currentBase64);
          if (tasks && tasks.length > 0) {
            await window.electronAPI.addMultipleTasks(tasks);
            window.soundEngine.playSuccess();
            window.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 70);
            this.showToast(`✨ Extracted ${tasks.length} homework assignments from photo!`);
            await this.refreshTasks();
            this.switchView('tasks');
          } else {
            this.showToast('No clear homework tasks identified in image.');
          }
        } catch (err) {
          console.error(err);
          this.showToast('OCR Error: ' + err.message);
        } finally {
          btnScan.innerHTML = '🔍 EXTRACT MISSIONS';
          btnScan.disabled = false;
        }
      });
    }
  }

  handleOCRFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      const previewImg = document.getElementById('ocr-preview-img');
      const previewContainer = document.getElementById('ocr-preview-container');
      const dropzonePrompt = document.getElementById('ocr-dropzone-prompt');

      if (previewImg && previewContainer && dropzonePrompt) {
        previewImg.src = base64;
        previewContainer.style.display = 'block';
        dropzonePrompt.style.display = 'none';
        document.getElementById('btn-run-ocr').disabled = false;
      }
    };
    reader.readAsDataURL(file);
  }

  initSettings() {
    const inputApiKey = document.getElementById('setting-api-key');
    const btnSaveSettings = document.getElementById('btn-save-settings');

    window.electronAPI.getSettings().then((settings) => {
      if (inputApiKey && settings.geminiApiKey) {
        inputApiKey.value = settings.geminiApiKey;
      }
    });

    if (btnSaveSettings) {
      btnSaveSettings.addEventListener('click', async () => {
        window.soundEngine.playSuccess();
        const key = inputApiKey.value.trim();
        await window.electronAPI.saveSettings({ geminiApiKey: key });
        this.showToast('⚙ Settings saved successfully!');
      });
    }
  }

  initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // If typing in input or textarea, don't trigger global timer shortcuts
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        window.timer.toggle();
      } else if (e.code === 'KeyN' && e.ctrlKey) {
        e.preventDefault();
        this.switchView('tasks');
        const desc = document.getElementById('task-desc-input');
        if (desc) desc.focus();
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new HomeworkNukeApp();
});
