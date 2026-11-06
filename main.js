// Bleeding Canvas - Electron main process.
// Transparent, click-through, always-on-top overlay over the primary display.
// Streams OS-level cursor + mouse button state to the renderer at ~60Hz.
//
// Flags:  --demo   scripted showcase (trail, pool, one of each weapon) every 16 s
//         --debug  open detached DevTools for the overlay renderer
const { app, BrowserWindow, screen, globalShortcut } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

const DEBUG = process.argv.includes('--debug');
const DEMO = process.argv.includes('--demo');
const SNAPSHOT = process.argv.includes('--snapshot'); // dev: save renderer frames to the temp dir
const POLL_MS = 16;

// Transparent windows + GPU compositing crash on some Windows drivers; software rendering is the stable default.
app.disableHardwareAcceleration();

let win = null;
let pollTimer = null;
let mouseProc = null;

// Button bitmask from native poller: 1 = left, 2 = right
let buttonMask = 0;
let prevMask = 0;
let prevPoint = null;

function createOverlay() {
  const { x, y, width, height } = screen.getPrimaryDisplay().bounds;

  win = new BrowserWindow({
    x, y, width, height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    resizable: false,
    movable: false,
    focusable: false, // never steal keyboard focus from the app underneath
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      autoplayPolicy: 'no-user-gesture-required',
      backgroundThrottling: false,
    },
  });

  // `fullscreen: true` breaks window transparency on Windows, so the window
  // is pinned to the display bounds instead (visually identical).
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setIgnoreMouseEvents(true, { forward: true });
  win.setBounds({ x, y, width, height });

  win.loadFile(path.join(__dirname, 'index.html'), DEMO ? { query: { demo: '1' } } : undefined);

  win.webContents.on('console-message', (e) => console.log('[Renderer]', e.message));
  if (DEBUG) {
    win.webContents.once('did-finish-load', () => win.webContents.openDevTools({ mode: 'detach', activate: false }));
  }

  win.once('ready-to-show', () => {
    win.showInactive();
    console.log('Overlay window shown');
  });
  if (SNAPSHOT) {
    // Captures the overlay's own pixels (not the desktop) for headless verification.
    const fs = require('fs');
    const os = require('os');
    win.webContents.once('did-finish-load', () => {
      [2500, 4500, 9000, 13000].forEach((ms) => setTimeout(async () => {
        if (!win) return;
        const img = await win.webContents.capturePage();
        const file = path.join(os.tmpdir(), `bleed-snap-${ms}.png`);
        fs.writeFileSync(file, img.toPNG());
        console.log('snapshot saved', file);
      }, ms));
    });
  }
  win.on('closed', () => { win = null; });
}

// Persistent PowerShell process polling user32 GetAsyncKeyState for L/R buttons.
function startMouseButtonPoller() {
  const script = path.join(__dirname, 'native', 'mouse-state.ps1');
  try {
    mouseProc = spawn('powershell.exe', [
      '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', script,
    ], { windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) {
    console.error('mouse poller failed to start', e);
    return;
  }
  let buf = '';
  mouseProc.stdout.on('data', (chunk) => {
    buf += chunk.toString();
    let idx;
    while ((idx = buf.indexOf('\n')) >= 0) {
      const n = parseInt(buf.slice(0, idx).trim(), 10);
      buf = buf.slice(idx + 1);
      if (!Number.isNaN(n)) buttonMask = n;
    }
  });
  mouseProc.on('error', (e) => console.error('mouse poller error', e));
  mouseProc.on('exit', () => { mouseProc = null; });
}

function startCursorPolling() {
  pollTimer = setInterval(() => {
    if (!win || win.isDestroyed()) return;
    const p = screen.getCursorScreenPoint();
    const b = win.getBounds();
    const vx = prevPoint ? p.x - prevPoint.x : 0;
    const vy = prevPoint ? p.y - prevPoint.y : 0;
    prevPoint = p;
    const rising = (buttonMask & ~prevMask) !== 0; // rising edge of any button
    prevMask = buttonMask;
    win.webContents.send('global-mouse', {
      x: p.x - b.x, y: p.y - b.y, vx, vy,
      isClicked: rising && win.isVisible(),
    });
  }, POLL_MS);
}

function toggleVisible() {
  if (!win) return;
  if (win.isVisible()) {
    win.hide();
  } else {
    win.showInactive();
    win.setAlwaysOnTop(true, 'screen-saver');
    win.setIgnoreMouseEvents(true, { forward: true });
  }
}

function registerShortcuts() {
  const bind = (accel, fn) => {
    if (!globalShortcut.register(accel, fn)) console.warn('Shortcut unavailable (in use by another app):', accel);
  };
  bind('CommandOrControl+Shift+B', toggleVisible);                                  // show / hide overlay
  bind('Alt+Q', () => app.quit());                                                  // emergency quit
  bind('CommandOrControl+Alt+Q', () => app.quit());
  bind('CommandOrControl+Alt+B', () => win && win.webContents.send('clear-blood')); // wipe the screen
}

app.whenReady().then(() => {
  createOverlay();
  startMouseButtonPoller();
  startCursorPolling();
  registerShortcuts();
});

app.on('will-quit', () => {
  clearInterval(pollTimer);
  globalShortcut.unregisterAll();
  if (mouseProc) mouseProc.kill();
});

app.on('window-all-closed', () => app.quit());