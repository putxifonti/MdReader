import { useMemo } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({ breaks: true, gfm: true })

function Preview({ content, fontSize = 14 }) {
  const html = useMemo(() => {
    const raw = marked.parse(content || '')
    return DOMPurify.sanitize(raw)
  }, [content])

  return (
    <div
      className="preview-container"
      style={{ fontSize: `${fontSize}px` }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default Preview
