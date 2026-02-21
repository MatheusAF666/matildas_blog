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
    const html = marked.parse(source)
    return html.replace(/<\/?p[^>]*>/gi, '').trim()
  } catch {
    return source
  }
}
