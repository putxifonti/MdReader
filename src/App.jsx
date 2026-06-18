import { useState, useEffect, useRef, useCallback } from 'react'
import { undo, deleteCharForward } from '@codemirror/commands'
import { applyFormat } from './utils/format'
import { useTabs } from './hooks/useTabs'
import Toolbar from './components/Toolbar'
import TabBar from './components/TabBar'
import FindReplace from './components/FindReplace'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Footer from './components/Footer'
import './App.css'

function basename(filePath) {
  return filePath.split(/[\\/]/).pop()
}

function App() {
  const { tabs, activeTabId, activeTab, setActiveTabId, addTab, updateContent, updateTab, closeTab } = useTabs()
  const [cursor, setCursor] = useState({ line: 1, col: 1, chars: 0 })
  const [findState, setFindState] = useState({ open: false, mode: 'find' })
  const [fontSize, setFontSize] = useState(14)
  const [mode, setMode] = useState('edit')
  const editorRef = useRef(null)

  function getView() { return editorRef.current?.getView() }

  // Native file dialogs (open/save) steal window focus — restore after each one.
  function focusEditor() {
    setTimeout(() => editorRef.current?.getView()?.focus(), 100)
  }

  // ── File operations ─────────────────────────────────────────────

  const doOpen = useCallback(async () => {
    const api = window.electronAPI
    if (!api) return
    const result = await api.openFile()
    focusEditor() // restore focus regardless of cancel or success
    if (!result) return
    const updates = {
      title: basename(result.path),
      content: result.content,
      savedContent: result.content,
      filePath: result.path,
      fileType: result.type,
    }
    const isEmpty = !activeTab?.content && activeTab?.title === 'Untitled' && !activeTab?.filePath
    if (isEmpty) {
      updateTab(activeTabId, updates)
      // tabId doesn't change so Editor's useEffect won't re-run — push content directly
      editorRef.current?.setContent(updates.content)
    } else {
      const newId = addTab() // returns new id synchronously (generated before setState)
      updateTab(newId, updates)
    }
  }, [activeTab, activeTabId, updateTab, addTab]) // eslint-disable-line react-hooks/exhaustive-deps

  const doSave = useCallback(async () => {
    const api = window.electronAPI
    if (!api || !activeTab) return
    if (activeTab.filePath) {
      await api.saveFile(activeTab.filePath, activeTab.content)
      updateTab(activeTabId, { savedContent: activeTab.content })
      focusEditor()
    } else {
      doSaveAs()
    }
  }, [activeTab, activeTabId, updateTab]) // eslint-disable-line react-hooks/exhaustive-deps

  const doSaveAs = useCallback(async () => {
    const api = window.electronAPI
    if (!api || !activeTab) return
    const defaultName = activeTab.title !== 'Untitled' ? activeTab.title : 'Untitled.txt'
    const result = await api.saveFileAs(activeTab.content, defaultName)
    focusEditor() // restore focus whether saved or cancelled
    if (!result) return
    const ext = result.path.split('.').pop().toLowerCase()
    updateTab(activeTabId, {
      title: basename(result.path),
      filePath: result.path,
      savedContent: activeTab.content,
      fileType: ext === 'md' ? 'md' : 'txt',
    })
  }, [activeTab, activeTabId, updateTab])

  // ── Tab / window close ──────────────────────────────────────────

  const handleCloseTab = useCallback(async (id, currentTabs, currentActiveId) => {
    const tab = currentTabs.find(t => t.id === id)
    if (tab && tab.content !== tab.savedContent) {
      const ok = await window.electronAPI.showConfirm(
        `Close "${tab.title}"?\n\nUnsaved changes will be lost.`
      )
      if (!ok) return
    }
    closeTab(id, currentTabs, currentActiveId)
  }, [closeTab])

  const handleCloseWindow = useCallback(async (thenQuit = false) => {
    const unsaved = tabs.filter(t => t.content !== t.savedContent)
    if (unsaved.length > 0) {
      const ok = await window.electronAPI.showConfirm(
        `There are ${unsaved.length} unsaved file(s). Close window anyway?`
      )
      if (!ok) return
    }
    if (thenQuit) window.electronAPI?.quitApp()
    else window.electronAPI?.confirmedCloseWindow()
  }, [tabs])

  // ── Toolbar / menu actions ──────────────────────────────────────

  const handleAction = useCallback((action) => {
    const view = getView()
    switch (action) {
      case 'new-tab':      addTab(); break
      case 'new-window':   window.electronAPI?.openNewWindow(); break
      case 'open':         doOpen(); break
      case 'save':         doSave(); break
      case 'save-as':      doSaveAs(); break
      case 'close-tab':    handleCloseTab(activeTabId, tabs, activeTabId); break
      case 'close-window': handleCloseWindow(); break
      case 'exit':         handleCloseWindow(true); break
      case 'undo':         if (view) { undo(view); view.focus() } break
      case 'cut':          document.execCommand('cut'); break
      case 'copy':         document.execCommand('copy'); break
      case 'paste':        document.execCommand('paste'); break
      case 'delete':       if (view) deleteCharForward(view); break
      case 'find':         setFindState({ open: true, mode: 'find' }); break
      case 'replace':      setFindState({ open: true, mode: 'replace' }); break
      case 'toggle-mode':  setMode(m => m === 'edit' ? 'read' : 'edit'); break
      case 'zoom-in':      setFontSize(s => Math.min(32, s + 2)); break
      case 'zoom-out':     setFontSize(s => Math.max(10, s - 2)); break
      case 'bold': case 'italic': case 'strikethrough':
      case 'code-inline': case 'code-block': case 'link':
      case 'h1': case 'h2': case 'h3':
      case 'list': case 'numbered-list':
        applyFormat(view, action); break
      case 'select-all':
        if (view) {
          view.dispatch({ selection: { anchor: 0, head: view.state.doc.length } })
          view.focus()
        }
        break
      default: break
    }
  }, [activeTabId, tabs, addTab, doOpen, doSave, doSaveAs, handleCloseTab, handleCloseWindow])

  // ── Keyboard shortcuts (capture phase — fires before CodeMirror) ─

  useEffect(() => {
    function onKey(e) {
      const ctrl = e.ctrlKey && !e.altKey
      const cs = e.ctrlKey && e.shiftKey && !e.altKey
      if (cs) {
        if (e.key === 'N') { e.preventDefault(); handleAction('new-window') }
        if (e.key === 'S') { e.preventDefault(); handleAction('save-as') }
        if (e.key === 'W') { e.preventDefault(); handleAction('close-window') }
        if (e.key === 'B') { e.preventDefault(); handleAction('bold') }
        if (e.key === 'I') { e.preventDefault(); handleAction('italic') }
        if (e.key === 'K') { e.preventDefault(); handleAction('link') }
        if (e.key === 'P') { e.preventDefault(); handleAction('toggle-mode') }
      } else if (ctrl) {
        if (e.key === 'u' || e.key === 'U') { e.preventDefault(); handleAction('new-tab') }
        if (e.key === 'a' || e.key === 'A') { e.preventDefault(); handleAction('open') }
        if (e.key === 'g' || e.key === 'G') { e.preventDefault(); handleAction('save') }
        if (e.key === 'w' || e.key === 'W') { e.preventDefault(); handleAction('close-tab') }
        if (e.key === 'b' || e.key === 'B') { e.preventDefault(); handleAction('find') }
        if (e.key === 'r' || e.key === 'R') { e.preventDefault(); handleAction('replace') }
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [handleAction])

  // ── IPC: window close button (title bar ×) ─────────────────────

  useEffect(() => {
    const cleanup = window.electronAPI?.onMenuAction((action) => {
      if (action === 'before-close') handleCloseWindow()
    })
    return cleanup
  }, [handleCloseWindow])

  return (
    <div className="app">
      <Toolbar onAction={handleAction} fontSize={fontSize} mode={mode} />
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelect={setActiveTabId}
        onClose={id => handleCloseTab(id, tabs, activeTabId)}
        onNewTab={addTab}
      />
      {findState.open && (
        <FindReplace
          mode={findState.mode}
          editorRef={editorRef}
          onClose={() => { setFindState(s => ({ ...s, open: false })); focusEditor() }}
        />
      )}
      {mode === 'edit' ? (
        <Editor
          ref={editorRef}
          tabId={activeTabId}
          content={activeTab?.content ?? ''}
          fontSize={fontSize}
          onChange={content => updateContent(activeTabId, content)}
          onCursorChange={setCursor}
        />
      ) : (
        <Preview content={activeTab?.content ?? ''} fontSize={fontSize} />
      )}
      <Footer cursor={cursor} />
    </div>
  )
}

export default App
