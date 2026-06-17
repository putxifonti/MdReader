import { useState, useEffect, useRef } from 'react'

function FindReplace({ mode, editorRef, onClose }) {
  const [query, setQuery] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [matchInfo, setMatchInfo] = useState('')
  const queryRef = useRef(null)

  useEffect(() => { queryRef.current?.focus() }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [onClose])

  function getMatches(text, q) {
    if (!q) return []
    const positions = []
    let idx = 0
    while ((idx = text.indexOf(q, idx)) !== -1) {
      positions.push(idx)
      idx += q.length
    }
    return positions
  }

  function findNext(fromEnd = false) {
    const view = editorRef.current?.getView()
    if (!view || !query) return
    const text = view.state.doc.toString()
    const matches = getMatches(text, query)
    if (!matches.length) { setMatchInfo('No results'); return }

    const cursor = fromEnd ? 0 : view.state.selection.main.to
    let idx = matches.find(m => m >= cursor)
    if (idx === undefined) idx = matches[0] // wrap
    view.dispatch({
      selection: { anchor: idx, head: idx + query.length },
      scrollIntoView: true,
    })
    view.focus()
    const pos = matches.indexOf(idx) + 1
    setMatchInfo(`${pos} of ${matches.length}`)
  }

  function findPrev() {
    const view = editorRef.current?.getView()
    if (!view || !query) return
    const text = view.state.doc.toString()
    const matches = getMatches(text, query)
    if (!matches.length) { setMatchInfo('No results'); return }

    const cursor = view.state.selection.main.from
    const candidates = matches.filter(m => m < cursor)
    const idx = candidates.length ? candidates[candidates.length - 1] : matches[matches.length - 1]
    view.dispatch({
      selection: { anchor: idx, head: idx + query.length },
      scrollIntoView: true,
    })
    view.focus()
    const pos = matches.indexOf(idx) + 1
    setMatchInfo(`${pos} of ${matches.length}`)
  }

  function replaceCurrent() {
    const view = editorRef.current?.getView()
    if (!view || !query) return
    const { from, to } = view.state.selection.main
    const selected = view.state.doc.sliceString(from, to)
    if (selected === query) {
      view.dispatch({ changes: { from, to, insert: replaceText } })
    }
    findNext()
  }

  function replaceAll() {
    const view = editorRef.current?.getView()
    if (!view || !query) return
    const text = view.state.doc.toString()
    const matches = getMatches(text, query)
    if (!matches.length) { setMatchInfo('No results'); return }
    const changes = matches.map(from => ({ from, to: from + query.length, insert: replaceText }))
    view.dispatch({ changes })
    setMatchInfo(`Replaced ${matches.length}`)
    view.focus()
  }

  return (
    <div className="find-replace">
      <div className="find-replace__row">
        <input
          ref={queryRef}
          className="find-replace__input"
          placeholder="Find"
          value={query}
          onChange={e => { setQuery(e.target.value); setMatchInfo('') }}
          onKeyDown={e => e.key === 'Enter' && findNext()}
        />
        <button className="fr-btn" onClick={() => findPrev()} title="Previous">&#8593;</button>
        <button className="fr-btn" onClick={() => findNext()} title="Next">&#8595;</button>
        {matchInfo && <span className="find-replace__info">{matchInfo}</span>}
      </div>

      {mode === 'replace' && (
        <div className="find-replace__row">
          <input
            className="find-replace__input"
            placeholder="Replace with"
            value={replaceText}
            onChange={e => setReplaceText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && replaceCurrent()}
          />
          <button className="fr-btn" onClick={replaceCurrent}>Replace</button>
          <button className="fr-btn" onClick={replaceAll}>All</button>
        </div>
      )}

      <button className="find-replace__close" onClick={onClose} title="Close (Esc)">×</button>
    </div>
  )
}

export default FindReplace
