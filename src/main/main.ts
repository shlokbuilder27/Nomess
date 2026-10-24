import { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut, nativeImage } from 'electron';
import * as path from 'path';
import { Database } from './database';
import { GeminiService } from './gemini-service';
import { Task, TaskInput, PomodoroSession, AppSettings } from './types';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let db: Database;
let gemini: GeminiService;

function createWindow(): void {
  const settings = db.getSettings();

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 900,
    minHeight: 650,
    frame: false, // Frameless custom title bar as requested!
    titleBarStyle: 'hidden',
    backgroundColor: settings.theme === 'dark' ? '#2D312E' : '#FEFAE0',
    icon: path.join(__dirname, '../../assets/icons/app-icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../../src/renderer/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle minimize to tray if enabled
  mainWindow.on('minimize', () => {
    if (db.getSettings().minimizeToTray) {
      mainWindow?.hide();
    }
  });
}

function setupTray(): void {
  const trayIconPath = path.join(__dirname, '../../assets/icons/tray-icon.png');
  const icon = nativeImage.createFromPath(trayIconPath);
  tray = new Tray(icon);
  tray.setToolTip('HomeworkNuke — Sovereign Study Control');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🚀 Open HomeworkNuke',
      click: () => {
        if (!mainWindow) createWindow();
        else {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: '➕ Quick Add Task',
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
        mainWindow?.webContents.send('action:quick-add');
      },
    },
    {
      label: '⏱ Start / Pause Timer',
      click: () => {
        mainWindow?.show();
        mainWindow?.webContents.send('action:toggle-timer');
      },
    },
    { type: 'separator' },
    {
      label: '💣 Nuke Easy Tasks',
      click: () => {
        const result = db.nukeTasks('easy');
        mainWindow?.webContents.send('tasks:updated');
      },
    },
    { type: 'separator' },
    {
      label: '❌ Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    if (!mainWindow) createWindow();
    else if (mainWindow.isVisible()) mainWindow.hide();
    else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function registerShortcuts(): void {
  // Global Shortcut: Ctrl+Shift+H to toggle window visibility
  globalShortcut.register('CommandOrControl+Shift+H', () => {
    if (!mainWindow) createWindow();
    else if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Global Shortcut: Ctrl+Shift+N to focus & quick add
  globalShortcut.register('CommandOrControl+Shift+N', () => {
    if (!mainWindow) createWindow();
    else {
      mainWindow.show();
      mainWindow.focus();
    }
    mainWindow?.webContents.send('action:quick-add');
  });
}

function registerIpcHandlers(): void {
  // Tasks CRUD
  ipcMain.handle('tasks:get', () => db.getTasks());
  ipcMain.handle('tasks:add', (_event, input: TaskInput) => db.addTask(input));
  ipcMain.handle('tasks:addMultiple', (_event, inputs: TaskInput[]) => db.addMultipleTasks(inputs));
  ipcMain.handle('tasks:update', (_event, id: string, updates: Partial<Task>) => db.updateTask(id, updates));
  ipcMain.handle('tasks:delete', (_event, id: string) => db.deleteTask(id));
  ipcMain.handle('tasks:nuke', (_event, filter?: 'easy' | 'all-pending') => db.nukeTasks(filter));

  // Schedule & AI
  ipcMain.handle('schedule:generate', async (_event, tasks: Task[]) => {
    return await gemini.generateSchedule(tasks);
  });
  ipcMain.handle('ai:ocr', async (_event, base64Image: string, mimeType?: string) => {
    return await gemini.ocrHomeworkImage(base64Image, mimeType);
  });

  // Pomodoro Sessions & Stats
  ipcMain.handle('sessions:record', (_event, session: Omit<PomodoroSession, 'id'>) => db.recordSession(session));
  ipcMain.handle('sessions:get', () => db.getSessions());
  ipcMain.handle('stats:getDaily', (_event, dateStr?: string) => db.getDailyStats(dateStr));
  ipcMain.handle('stats:getAll', () => db.getAllStats());

  // Settings
  ipcMain.handle('settings:get', () => db.getSettings());
  ipcMain.handle('settings:save', (_event, updates: Partial<AppSettings>) => {
    const saved = db.saveSettings(updates);
    if (updates.geminiApiKey !== undefined) {
      gemini.setApiKey(updates.geminiApiKey);
    }
    return saved;
  });

  // Window Controls for custom titlebar
  ipcMain.on('window:minimize', () => {
    mainWindow?.minimize();
  });
  ipcMain.on('window:maximize', () => {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  });
  ipcMain.on('window:close', () => {
    if (db.getSettings().minimizeToTray) {
      mainWindow?.hide();
    } else {
      mainWindow?.close();
    }
  });
}

// App lifecycle
app.whenReady().then(() => {
  db = new Database();
  const settings = db.getSettings();
  gemini = new GeminiService(settings.geminiApiKey);

  registerIpcHandlers();
  createWindow();
  setupTray();
  registerShortcuts();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && !db.getSettings().minimizeToTray) {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
