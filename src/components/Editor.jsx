import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap, selectAll } from '@codemirror/commands'

// Remove Ctrl+A (Mod-a) from defaultKeymap — our app uses it for Open
// Add Ctrl+E for Select All
const editorKeymap = keymap.of([
  ...defaultKeymap.filter(b => b.key !== 'Mod-a'),
  ...historyKeymap,
  { key: 'Ctrl-e', run: selectAll, preventDefault: true },
])

const editorTheme = EditorView.theme({
  '&': { height: '100%' },
  '.cm-scroller': { overflow: 'auto', fontFamily: 'inherit' },
  '.cm-content': { minHeight: '100%', padding: '8px 12px', caretColor: 'auto' },
  '.cm-line': { padding: 0 },
})

const wrapCompartment = new Compartment()

const Editor = forwardRef(function Editor({ tabId, content, onChange, onCursorChange, fontSize = 14, font = 'Consolas', wordWrap = true }, ref) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const onCursorRef = useRef(onCursorChange)

  useEffect(() => { onChangeRef.current = onChange }, [onChange])
  useEffect(() => { onCursorRef.current = onCursorChange }, [onCursorChange])

  useImperativeHandle(ref, () => ({
    getView: () => viewRef.current,
    setContent: (text) => {
      const view = viewRef.current
      if (!view) return
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } })
    },
  }))

  // Create / destroy editor when tab changes
  useEffect(() => {
    const view = new EditorView({
      state: EditorState.create({
        doc: content,
        extensions: [
          history(),
          editorKeymap,
          editorTheme,
          wrapCompartment.of(wordWrap ? EditorView.lineWrapping : []),
          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString())
            }
            if (update.docChanged || update.selectionSet) {
              const { from } = update.state.selection.main
              const line = update.state.doc.lineAt(from)
              onCursorRef.current({
                line: line.number,
                col: from - line.from + 1,
                chars: update.state.doc.length,
              })
            }
          }),
        ],
      }),
      parent: containerRef.current,
    })

    viewRef.current = view
    view.focus()
    return () => { view.destroy(); viewRef.current = null }
  }, [tabId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reconfigure word wrap without destroying the view
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({ effects: wrapCompartment.reconfigure(wordWrap ? EditorView.lineWrapping : []) })
  }, [wordWrap])

  return (
    <div
      ref={containerRef}
      className="editor-container"
      style={{ fontFamily: `${font}, monospace`, fontSize: `${fontSize}px` }}
    />
  )
})

export default Editor
