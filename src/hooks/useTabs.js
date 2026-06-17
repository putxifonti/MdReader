import { useState, useCallback } from 'react'

function createTab(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    title: 'Untitled',
    content: '',
    savedContent: '',
    filePath: null,
    fileType: 'txt',
    ...overrides,
  }
}

export function useTabs() {
  const initial = createTab()
  const [tabs, setTabs] = useState([initial])
  const [activeTabId, setActiveTabId] = useState(initial.id)

  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0]

  const addTab = useCallback(() => {
    const tab = createTab()
    setTabs(prev => [...prev, tab])
    setActiveTabId(tab.id)
    return tab.id  // ID is generated before setState, safe to return synchronously
  }, [])

  const updateContent = useCallback((id, content) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, content } : t))
  }, [])

  const updateTab = useCallback((id, updates) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
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
      setActiveTabId(remaining[Math.min(idx, remaining.length - 1)].id)
    }
  }, [])

  return { tabs, activeTabId, activeTab, setActiveTabId, addTab, updateContent, updateTab, closeTab }
}
