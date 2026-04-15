'use client'

import type { ReactNode } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { isArticleHomeLayout } from '@/lib/article-site-ui'
import { cn } from '@/lib/utils'

export function PageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
}) {
  const { recipe } = getFactoryState()
  const article = isArticleHomeLayout(recipe.homeLayout)

  return (
    <div className={cn('min-h-screen', article ? 'text-slate-900' : 'bg-background text-foreground')}>
      <NavbarShell />
      <main>
        <section
          className={cn(
            'border-b',
            article
              ? 'border-violet-100/60 bg-white/45 backdrop-blur-md'
              : 'border-border bg-secondary/30'
          )}
        >
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className={cn('text-3xl font-bold tracking-tight', article ? 'text-slate-900' : 'text-foreground')}>
                  {title}
                </h1>
                {description && (
                  <p className={cn('mt-2 max-w-2xl', article ? 'text-slate-600' : 'text-muted-foreground')}>{description}</p>
                )}
              </div>
              {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
            </div>
          </div>
        </section>
        <section className={cn('mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8', article && 'pb-16')}>{children}</section>
      </main>
      <Footer />
    </div>
  )
}
