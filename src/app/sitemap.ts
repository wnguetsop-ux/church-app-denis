import type { MetadataRoute } from 'next'

const BASE_URL = 'https://communautedesfilsdemalachie4.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['fr', 'en']
  const pages = [
    '',
    '/messages',
    '/enseignements',
    '/videos',
    '/galerie',
    '/priere',
    '/dons',
    '/a-propos',
    '/contact',
  ]

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      })
    }
  }

  return entries
}
