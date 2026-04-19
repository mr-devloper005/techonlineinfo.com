import { defineSiteTheme } from '@/config/site.theme.defaults'

export const SITE_THEME = defineSiteTheme({
  shell: 'editorial',
  hero: {
    variant: 'story-first',
    eyebrow: 'Article publishing desk',
  },
  home: {
    layout: 'editorial-grid',
    primaryTask: 'article',
    featuredTaskKeys: ['article'],
  },
  navigation: {
    variant: 'editorial',
  },
  footer: {
    variant: 'columns',
  },
  cards: {
    listing: 'listing-elevated',
    article: 'article-glass',
    image: 'studio-panel',
    profile: 'studio-panel',
    classified: 'catalog-grid',
    pdf: 'catalog-grid',
    sbm: 'editorial-feature',
    social: 'studio-panel',
    org: 'catalog-grid',
    comment: 'editorial-feature',
  },
})
