const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
  saveFileAs: (content, defaultName) => ipcRenderer.invoke('save-file-as', content, defaultName),
  openNewWindow: () => ipcRenderer.send('open-new-window'),
  confirmedCloseWindow: () => ipcRenderer.send('confirmed-close-window'),
  quitApp: () => ipcRenderer.send('quit-app'),
  showConfirm: (message) => ipcRenderer.invoke('show-confirm', message),
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (_, action) => callback(action))
    return () => ipcRenderer.removeAllListeners('menu-action')
  },
})
