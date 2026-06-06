import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/en/auth/', '/zh/auth/', '/api/'],
    },
    sitemap: 'https://mingchen.dev/sitemap.xml',
  }
}
