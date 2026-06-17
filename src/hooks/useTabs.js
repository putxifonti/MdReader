import { useState, useCallback } from 'react'

function createTab() {
  return {
    id: crypto.randomUUID(),
    title: 'Untitled',
    content: '',
    savedContent: '',
    filePath: null,
    fileType: 'txt',
  }
}

export function useTabs() {
  const initialTab = createTab()
  const [tabs, setTabs] = useState([initialTab])
  const [activeTabId, setActiveTabId] = useState(initialTab.id)

  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0]

  const addTab = useCallback(() => {
    const tab = createTab()
    setTabs(prev => [...prev, tab])
    setActiveTabId(tab.id)
  }, [])

  const updateContent = useCallback((id, content) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, content } : t))
  }, [])

  const closeTab = useCallback((id, currentTabs, currentActiveId) => {
    const idx = currentTabs.findIndex(t => t.id === id)
    const remaining = currentTabs.filter(t => t.id !== id)

    if (remaining.length === 0) {
      const newTab = createTab()
      setTabs([newTab])
      setActiveTabId(newTab.id)
      return
    }

    setTabs(remaining)

    if (currentActiveId === id) {
      const newIdx = Math.min(idx, remaining.length - 1)
      setActiveTabId(remaining[newIdx].id)
    }
  }, [])

  return { tabs, activeTabId, activeTab, setActiveTabId, addTab, updateContent, closeTab }
}
