const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlay', {
  onGlobalMouse: (cb) => ipcRenderer.on('global-mouse', (_e, data) => cb(data)),
  onClear: (cb) => ipcRenderer.on('clear-blood', () => cb()),
});
