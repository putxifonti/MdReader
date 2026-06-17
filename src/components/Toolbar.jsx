import { useState, useEffect, useRef } from 'react'

const FILE_MENU = [
  { label: 'New Tab',      shortcut: 'Ctrl+U',       action: 'new-tab' },
  { label: 'New Window',   shortcut: 'Ctrl+Shift+N', action: 'new-window' },
  null,
  { label: 'Open...',      shortcut: 'Ctrl+A',       action: 'open' },
  { label: 'Save',         shortcut: 'Ctrl+G',       action: 'save' },
  { label: 'Save As...',   shortcut: 'Ctrl+Shift+S', action: 'save-as' },
  null,
  { label: 'Close Tab',    shortcut: 'Ctrl+W',       action: 'close-tab' },
  { label: 'Close Window', shortcut: 'Ctrl+Shift+W', action: 'close-window' },
  { label: 'Exit',         shortcut: '',             action: 'exit' },
]

const EDIT_MENU = [
  { label: 'Undo',       shortcut: 'Ctrl+Z', action: 'undo' },
  null,
  { label: 'Cut',        shortcut: 'Ctrl+X', action: 'cut' },
  { label: 'Copy',       shortcut: 'Ctrl+C', action: 'copy' },
  { label: 'Paste',      shortcut: 'Ctrl+V', action: 'paste' },
  { label: 'Delete',     shortcut: 'Del',    action: 'delete' },
  null,
  { label: 'Find',       shortcut: 'Ctrl+B', action: 'find' },
  { label: 'Replace',    shortcut: 'Ctrl+R', action: 'replace' },
  null,
  { label: 'Select All', shortcut: 'Ctrl+E', action: 'select-all' },
]

function Menu({ items, onAction, onClose }) {
  return (
    <div className="menu-dropdown">
      {items.map((item, i) =>
        item === null
          ? <div key={i} className="menu-separator" />
          : (
            <div
              key={item.action}
              className="menu-item"
              onClick={() => { onAction(item.action); onClose() }}
            >
              <span>{item.label}</span>
              {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
            </div>
          )
      )}
    </div>
  )
}

function Toolbar({ onAction }) {
  const [openMenu, setOpenMenu] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (!ref.current?.contains(e.target)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggle(name) {
    setOpenMenu(prev => prev === name ? null : name)
  }

  return (
    <div className="toolbar" ref={ref}>
      <div className="toolbar__menus">
        <div className="menu-root">
          <button
            className={`menu-btn${openMenu === 'file' ? ' menu-btn--open' : ''}`}
            onClick={() => toggle('file')}
          >
            File
          </button>
          {openMenu === 'file' && (
            <Menu items={FILE_MENU} onAction={onAction} onClose={() => setOpenMenu(null)} />
          )}
        </div>

        <div className="menu-root">
          <button
            className={`menu-btn${openMenu === 'edit' ? ' menu-btn--open' : ''}`}
            onClick={() => toggle('edit')}
          >
            Edit
          </button>
          {openMenu === 'edit' && (
            <Menu items={EDIT_MENU} onAction={onAction} onClose={() => setOpenMenu(null)} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Toolbar
