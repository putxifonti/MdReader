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

const FORMAT_BUTTONS = [
  { label: 'B',   action: 'bold',          title: 'Bold (Ctrl+Shift+B)',    style: { fontWeight: 'bold' } },
  { label: 'I',   action: 'italic',        title: 'Italic (Ctrl+Shift+I)',  style: { fontStyle: 'italic' } },
  { label: <span style={{ textDecoration: 'line-through', fontWeight: '600' }}>S</span>, action: 'strikethrough', title: 'Strikethrough' },
  { label: 'H1',  action: 'h1',            title: 'Heading 1' },
  { label: 'H2',  action: 'h2',            title: 'Heading 2' },
  { label: 'H3',  action: 'h3',            title: 'Heading 3' },
  { label: '`',   action: 'code-inline',   title: 'Inline code' },
  { label: '</>',  action: 'code-block',    title: 'Code block' },
  { label: '🔗',  action: 'link',          title: 'Link (Ctrl+Shift+K)' },
  { label: '–',   action: 'list',          title: 'Unordered list' },
  { label: '1.',  action: 'numbered-list', title: 'Numbered list' },
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

function Toolbar({ onAction, fontSize, mode = 'edit', settingsOpen = false }) {
  const [openMenu, setOpenMenu] = useState(null)
  const ref = useRef(null)
  const isRead = mode === 'read'

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

  function act(action) {
    setOpenMenu(null)
    onAction(action)
  }

  return (
    <div className="toolbar" ref={ref}>

      {/* ── File / Edit menus ── */}
      <div className="toolbar__menus">
        <div className="menu-root">
          <button className={`menu-btn${openMenu === 'file' ? ' menu-btn--open' : ''}`} onClick={() => toggle('file')}>File</button>
          {openMenu === 'file' && <Menu items={FILE_MENU} onAction={act} onClose={() => setOpenMenu(null)} />}
        </div>
        <div className="menu-root">
          <button className={`menu-btn${openMenu === 'edit' ? ' menu-btn--open' : ''}`} onClick={() => toggle('edit')}>Edit</button>
          {openMenu === 'edit' && <Menu items={EDIT_MENU} onAction={act} onClose={() => setOpenMenu(null)} />}
        </div>
      </div>

      <div className="toolbar__sep" />

      {/* ── Read / Edit toggle ── */}
      <div className="toolbar__group">
        <button
          className={`tb-btn tb-btn--mode${isRead ? ' tb-btn--mode-active' : ''}`}
          title={isRead ? 'Switch to Edit mode (Ctrl+Shift+P)' : 'Switch to Read mode (Ctrl+Shift+P)'}
          onClick={() => onAction('toggle-mode')}
        >
          {isRead ? '✏️' : '👁'}
        </button>
      </div>

      <div className="toolbar__sep" />

      {/* ── Zoom ── */}
      <div className="toolbar__group">
        <button className="tb-btn" onClick={() => onAction('zoom-out')} title="Decrease font size">A–</button>
        <span className="toolbar__zoom-label">{fontSize}px</span>
        <button className="tb-btn" onClick={() => onAction('zoom-in')}  title="Increase font size">A+</button>
      </div>

      <div className="toolbar__sep" />

      {/* ── Format buttons ── */}
      <div className={`toolbar__group toolbar__format${isRead ? ' toolbar__group--disabled' : ''}`}>
        {FORMAT_BUTTONS.map(btn => (
          <button
            key={btn.action}
            className="tb-btn"
            style={btn.style}
            title={btn.title}
            disabled={isRead}
            onClick={() => !isRead && onAction(btn.action)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* ── Settings button (right) ── */}
      <div className="toolbar__right">
        <button
          className={`tb-btn${settingsOpen ? ' tb-btn--active' : ''}`}
          title="Settings"
          onClick={() => onAction('settings')}
        >
          ⚙
        </button>
      </div>

    </div>
  )
}

export default Toolbar
