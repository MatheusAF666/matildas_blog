import { marked } from 'marked'

marked.setOptions({
  breaks: true,
  gfm: true,
})

export const renderMarkdown = (value: string) => {
  const source = typeof value === 'string' ? value : ''

  try {
    return marked.parse(source)
  } catch {
    return source
  }
}

export const renderMarkdownInline = (value: string) => {
  const source = typeof value === 'string' ? value : ''

  try {
    if (typeof marked.parseInline === 'function') {
      return marked.parseInline(source)
    }

    const html = marked.parse(source)
    return html.replace(/^<p>/i, '').replace(/<\/p>\s*$/i, '')
  } catch {
    return source
  }
}
