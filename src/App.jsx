import { useState } from 'react'
import { useTabs } from './hooks/useTabs'
import TabBar from './components/TabBar'
import Editor from './components/Editor'
import Footer from './components/Footer'
import './App.css'

function App() {
  const { tabs, activeTabId, activeTab, setActiveTabId, addTab, updateContent, closeTab } = useTabs()
  const [cursor, setCursor] = useState({ line: 1, col: 1, chars: 0 })

  function handleClose(id) {
    const tab = tabs.find(t => t.id === id)
    if (tab && tab.content !== tab.savedContent) {
      const ok = window.confirm(`Close "${tab.title}"?\n\nUnsaved changes will be lost.`)
      if (!ok) return
    }
    closeTab(id, tabs, activeTabId)
  }

  return (
    <div className="app">
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelect={setActiveTabId}
        onClose={handleClose}
        onNewTab={addTab}
      />
      <Editor
        tabId={activeTabId}
        content={activeTab?.content ?? ''}
        onChange={content => updateContent(activeTabId, content)}
        onCursorChange={setCursor}
      />
      <Footer cursor={cursor} />
    </div>
  )
}

export default App
