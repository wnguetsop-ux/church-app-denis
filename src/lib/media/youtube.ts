export function extractYouTubeId(input: string): string {
  const value = input.trim()
  if (!value) return ''

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value

  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] ?? value
    }

    if (host.endsWith('youtube.com')) {
      const watchId = url.searchParams.get('v')
      if (watchId) return watchId

      const parts = url.pathname.split('/').filter(Boolean)
      const videoIndex = parts.findIndex(part => ['embed', 'shorts', 'live'].includes(part))
      if (videoIndex >= 0 && parts[videoIndex + 1]) return parts[videoIndex + 1]
    }
  } catch {
    // Keep the original value if it is not a URL.
  }

  return value
}

export function getYouTubeEmbedUrl(input: string): string {
  const id = extractYouTubeId(input)
  return id ? `https://www.youtube.com/embed/${id}` : ''
}

export function getYouTubeThumbnailUrl(input: string): string {
  const id = extractYouTubeId(input)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : ''
}
