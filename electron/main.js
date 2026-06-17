const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

const closingWindows = new WeakSet()

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 640,
    minHeight: 480,
    title: 'MdReader',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Intercept close to let the renderer check for unsaved changes
  win.on('close', (e) => {
    if (!closingWindows.has(win)) {
      e.preventDefault()
      win.webContents.send('menu-action', 'before-close')
    }
  })

  return win
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Renderer confirmed it's OK to close this window
ipcMain.on('confirmed-close-window', (e) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (win) {
    closingWindows.add(win)
    win.close()
  }
})

ipcMain.on('open-new-window', () => createWindow())

ipcMain.on('quit-app', () => app.quit())

ipcMain.handle('show-confirm', async (e, message) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  const { response } = await dialog.showMessageBox(win, {
    type: 'question',
    buttons: ['OK', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
    message,
  })
  return response === 0
})

ipcMain.handle('open-file', async (e) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  const result = await dialog.showOpenDialog(win, {
    filters: [
      { name: 'Text files', extensions: ['txt', 'md'] },
      { name: 'All files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  })
  if (result.canceled || !result.filePaths.length) return null
  const filePath = result.filePaths[0]
  const content = fs.readFileSync(filePath, 'utf-8')
  const ext = path.extname(filePath).slice(1).toLowerCase()
  return { path: filePath, content, type: ext === 'md' ? 'md' : 'txt' }
})

ipcMain.handle('save-file', async (_, filePath, content) => {
  try { fs.writeFileSync(filePath, content, 'utf-8'); return true }
  catch { return false }
})

ipcMain.handle('save-file-as', async (e, content, defaultName) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  const result = await dialog.showSaveDialog(win, {
    defaultPath: defaultName || 'Untitled.txt',
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'Text', extensions: ['txt'] },
      { name: 'All files', extensions: ['*'] },
    ],
  })
  if (result.canceled || !result.filePath) return null
  try { fs.writeFileSync(result.filePath, content, 'utf-8'); return { path: result.filePath } }
  catch { return null }
})
