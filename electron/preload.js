const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // IPC methods added in later phases
})
