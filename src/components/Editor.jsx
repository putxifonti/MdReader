import { useEffect, useRef } from 'react'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'

function Editor({ tabId, content, onChange, onCursorChange }) {
  const containerRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const onCursorRef = useRef(onCursorChange)

  useEffect(() => { onChangeRef.current = onChange }, [onChange])
  useEffect(() => { onCursorRef.current = onCursorChange }, [onCursorChange])

  useEffect(() => {
    const view = new EditorView({
      state: EditorState.create({
        doc: content,
        extensions: [
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap]),
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
          EditorView.theme({
            '&': { height: '100%', fontFamily: 'Consolas, monospace', fontSize: '14px' },
            '.cm-scroller': { overflow: 'auto', fontFamily: 'inherit' },
            '.cm-content': { minHeight: '100%', padding: '8px 12px', caretColor: 'auto' },
            '.cm-line': { padding: 0 },
          }),
        ],
      }),
      parent: containerRef.current,
    })

    view.focus()
    return () => view.destroy()
  }, [tabId]) // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} className="editor-container" />
}

export default Editor
