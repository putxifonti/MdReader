export function applyFormat(view, type) {
  if (!view) return
  const { from, to } = view.state.selection.main
  const hasSelection = from !== to
  const selected = hasSelection ? view.state.doc.sliceString(from, to) : ''

  switch (type) {
    case 'bold':          wrapInline(view, '**', '**', 'bold text',      selected, from, to, hasSelection); break
    case 'italic':        wrapInline(view, '*',  '*',  'italic text',    selected, from, to, hasSelection); break
    case 'strikethrough': wrapInline(view, '~~', '~~', 'strikethrough',  selected, from, to, hasSelection); break
    case 'code-inline':   wrapInline(view, '`',  '`',  'code',           selected, from, to, hasSelection); break
    case 'code-block':    applyCodeBlock(view, selected, from, to, hasSelection); break
    case 'link':          applyLink(view, selected, from, to, hasSelection); break
    case 'h1':            applyLinePrefix(view, '# ',  'Heading 1', from, to, hasSelection); break
    case 'h2':            applyLinePrefix(view, '## ', 'Heading 2', from, to, hasSelection); break
    case 'h3':            applyLinePrefix(view, '### ','Heading 3', from, to, hasSelection); break
    case 'list':          applyLinePrefix(view, '- ',  'item',      from, to, hasSelection); break
    case 'numbered-list': applyLinePrefix(view, '1. ', 'item',      from, to, hasSelection); break
    default: break
  }
  view.focus()
}

function wrapInline(view, before, after, placeholder, selected, from, to, hasSelection) {
  if (hasSelection) {
    view.dispatch({
      changes: { from, to, insert: before + selected + after },
      selection: { anchor: from + before.length, head: from + before.length + selected.length },
    })
  } else {
    view.dispatch({
      changes: { from, insert: before + placeholder + after },
      selection: { anchor: from + before.length, head: from + before.length + placeholder.length },
    })
  }
}

function applyCodeBlock(view, selected, from, to, hasSelection) {
  if (hasSelection) {
    view.dispatch({
      changes: { from, to, insert: '```\n' + selected + '\n```' },
      selection: { anchor: from + 4, head: from + 4 + selected.length },
    })
  } else {
    view.dispatch({
      changes: { from, insert: '```\ncode\n```' },
      selection: { anchor: from + 4, head: from + 8 },
    })
  }
}

function applyLink(view, selected, from, to, hasSelection) {
  if (hasSelection) {
    // [selection](url) — pre-select "url" for quick replacement
    view.dispatch({
      changes: { from, to, insert: `[${selected}](url)` },
      selection: { anchor: from + selected.length + 3, head: from + selected.length + 6 },
    })
  } else {
    // [text](url) — pre-select "text"
    view.dispatch({
      changes: { from, insert: '[text](url)' },
      selection: { anchor: from + 1, head: from + 5 },
    })
  }
}

function applyLinePrefix(view, prefix, placeholder, from, to, hasSelection) {
  const doc = view.state.doc
  if (hasSelection) {
    const startLine = doc.lineAt(from)
    const endLine = doc.lineAt(to)
    const changes = []
    for (let n = startLine.number; n <= endLine.number; n++) {
      changes.push({ from: doc.line(n).from, insert: prefix })
    }
    view.dispatch({ changes })
  } else {
    const line = doc.lineAt(from)
    if (line.length === 0) {
      // Empty line: insert full template and select placeholder
      view.dispatch({
        changes: { from: line.from, insert: prefix + placeholder },
        selection: { anchor: line.from + prefix.length, head: line.from + prefix.length + placeholder.length },
      })
    } else {
      // Non-empty line: add prefix at line start
      view.dispatch({ changes: { from: line.from, insert: prefix } })
    }
  }
}
