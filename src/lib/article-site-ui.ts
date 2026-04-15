/**
 * Shared layout tokens for the article / editorial product (lavender glass, violet CTA).
 * Use when `recipe.homeLayout === 'article-home'` or `getProductKind(recipe) === 'editorial'`.
 */
export const articleSiteUi = {
  shell: 'min-h-screen text-slate-900',
  panel:
    'rounded-[2rem] border border-white/55 bg-white/55 shadow-[0_24px_70px_rgba(99,102,241,0.1)] backdrop-blur-xl',
  soft: 'rounded-2xl border border-white/45 bg-white/45 shadow-[0_8px_32px_rgba(99,102,241,0.06)] backdrop-blur-md',
  muted: 'text-slate-500',
  /** Primary pill — matches #8B5CF6 → #6366F1 reference */
  action:
    'rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white font-semibold shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:opacity-95',
  input:
    'rounded-2xl border border-slate-200/90 bg-white/90 text-slate-900 shadow-sm placeholder:text-slate-400',
} as const

export function isArticleHomeLayout(homeLayout: string) {
  return homeLayout === 'article-home'
}
