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
    return marked.parseInline(source)
  } catch {
    return source
  }
}
