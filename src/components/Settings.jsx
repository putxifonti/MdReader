const FONTS = ['Consolas', 'Segoe UI', 'Georgia', 'JetBrains Mono']

function Settings({ settings, onUpdate, onClose }) {
  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <span>Settings</span>
          <button className="settings-close" onClick={onClose}>×</button>
        </div>

        <div className="settings-section">
          <div className="settings-label">Theme</div>
          <div className="settings-options">
            {[
              { value: 'system', label: 'Use system setting' },
              { value: 'light',  label: 'Light' },
              { value: 'dark',   label: 'Dark' },
            ].map(opt => (
              <label key={opt.value} className="settings-radio">
                <input
                  type="radio"
                  name="theme"
                  value={opt.value}
                  checked={settings.theme === opt.value}
                  onChange={() => onUpdate('theme', opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label">Editor font</div>
          <select
            className="settings-select"
            value={settings.font}
            onChange={e => onUpdate('font', e.target.value)}
          >
            {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="settings-section">
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={settings.wordWrap}
              onChange={e => onUpdate('wordWrap', e.target.checked)}
            />
            Word wrap
          </label>
        </div>
      </div>
    </div>
  )
}

export default Settings
