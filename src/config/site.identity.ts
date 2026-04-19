export const siteIdentity = {
  code: process.env.NEXT_PUBLIC_SITE_CODE || '8af29rerfb',
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Tech Online Info',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Independent editorial publication',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'A reading-first article platform for essays, guides, opinions, and long-form publishing.',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'techonlineinfo.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://techonlineinfo.com',
  ogImage: process.env.NEXT_PUBLIC_SITE_OG_IMAGE || '/og-default.png',
  googleMapsEmbedApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY || 'AIzaSyBco7dIECu3rJWjP3J0MImnR_uxlbeqAe0',

} as const

export const defaultAuthorProfile = {
  name: siteIdentity.name,
  avatar: '/placeholder.svg?height=80&width=80',
} as const

