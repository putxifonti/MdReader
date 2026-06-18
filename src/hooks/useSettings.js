import { useState, useEffect } from 'react'

const STORAGE_KEY = 'mdreader-settings'

const DEFAULTS = {
  theme: 'system',
  font: 'Consolas',
  wordWrap: true,
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  function updateSetting(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return { settings, updateSetting }
}
