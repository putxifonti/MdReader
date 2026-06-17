function TabBar({ tabs, activeTabId, onSelect, onClose, onNewTab }) {
  return (
    <div className="tab-bar">
      {tabs.map(tab => {
        const unsaved = tab.content !== tab.savedContent
        return (
          <div
            key={tab.id}
            className={`tab${tab.id === activeTabId ? ' tab--active' : ''}`}
            onClick={() => onSelect(tab.id)}
          >
            <span className="tab__title">
              {unsaved && <span className="tab__dot">•</span>}
              {tab.title}
            </span>
            <button
              className="tab__close"
              onClick={e => { e.stopPropagation(); onClose(tab.id) }}
              title="Close tab"
            >
              ×
            </button>
          </div>
        )
      })}
      <button className="tab-bar__new" onClick={onNewTab} title="New tab">+</button>
    </div>
  )
}

export default TabBar
