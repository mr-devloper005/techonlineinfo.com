'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, User, FileText, Building2, LayoutGrid, Tag, Image as ImageIcon, ChevronRight, Sparkles, MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { NAVBAR_OVERRIDE_ENABLED, NavbarOverride } from '@/overrides/navbar'

const NavbarAuthControls = dynamic(() => import('@/components/shared/navbar-auth-controls').then((mod) => mod.NavbarAuthControls), {
  ssr: false,
  loading: () => null,
})

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: LayoutGrid,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

const variantClasses = {
  'compact-bar': {
    shell: 'border-b border-slate-200/80 bg-white/88 text-slate-950 backdrop-blur-xl',
    logo: 'rounded-2xl border border-slate-200 bg-white shadow-sm',
    active: 'bg-slate-950 text-white',
    idle: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
    cta: 'rounded-full bg-slate-950 text-white hover:bg-slate-800',
    mobile: 'border-t border-slate-200/70 bg-white/95',
  },
  'editorial-bar': {
    shell: 'border-b border-violet-200/35 bg-white/72 text-slate-900 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] backdrop-blur-xl',
    logo: 'rounded-full border border-violet-100/90 bg-white shadow-[0_4px_20px_rgba(99,102,241,0.08)]',
    active: 'bg-violet-600 text-white shadow-sm',
    idle: 'text-slate-600 hover:bg-violet-50 hover:text-violet-800',
    cta: 'rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-md hover:opacity-95',
    mobile: 'border-t border-violet-100/50 bg-white/92 backdrop-blur-xl',
  },
  'floating-bar': {
    shell: 'border-b border-transparent bg-transparent text-white',
    logo: 'rounded-[1.35rem] border border-white/12 bg-white/8 shadow-[0_16px_48px_rgba(15,23,42,0.22)] backdrop-blur',
    active: 'bg-[#8df0c8] text-[#07111f]',
    idle: 'text-slate-200 hover:bg-white/10 hover:text-white',
    cta: 'rounded-full bg-[#8df0c8] text-[#07111f] hover:bg-[#77dfb8]',
    mobile: 'border-t border-white/10 bg-[#09101d]/96',
  },
  'utility-bar': {
    shell: 'border-b border-[#d7deca] bg-[#f4f6ef]/94 text-[#1f2617] backdrop-blur-xl',
    logo: 'rounded-xl border border-[#d7deca] bg-white shadow-sm',
    active: 'bg-[#1f2617] text-[#edf5dc]',
    idle: 'text-[#56604b] hover:bg-[#e7edd9] hover:text-[#1f2617]',
    cta: 'rounded-lg bg-[#1f2617] text-[#edf5dc] hover:bg-[#2f3a24]',
    mobile: 'border-t border-[#d7deca] bg-[#f4f6ef]',
  },
} as const

const directoryPalette = {
  'directory-clean': {
    shell: 'border-b border-slate-200 bg-white/94 text-slate-950 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-xl',
    logo: 'rounded-2xl border border-slate-200 bg-slate-50',
    nav: 'text-slate-600 hover:text-slate-950',
    search: 'border border-slate-200 bg-slate-50 text-slate-600',
    cta: 'bg-slate-950 text-white hover:bg-slate-800',
    post: 'border border-slate-200 bg-white text-slate-950 hover:bg-slate-50',
    mobile: 'border-t border-slate-200 bg-white',
  },
  'market-utility': {
    shell: 'border-b border-[#d7deca] bg-[#f4f6ef]/96 text-[#1f2617] shadow-[0_1px_0_rgba(64,76,34,0.06)] backdrop-blur-xl',
    logo: 'rounded-xl border border-[#d7deca] bg-white',
    nav: 'text-[#56604b] hover:text-[#1f2617]',
    search: 'border border-[#d7deca] bg-white text-[#56604b]',
    cta: 'bg-[#1f2617] text-[#edf5dc] hover:bg-[#2f3a24]',
    post: 'border border-[#d7deca] bg-white text-[#1f2617] hover:bg-[#eef2e4]',
    mobile: 'border-t border-[#d7deca] bg-[#f4f6ef]',
  },
} as const

export function Navbar() {
  if (NAVBAR_OVERRIDE_ENABLED) {
    return <NavbarOverride />
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const { recipe } = getFactoryState()

  const navigation = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile'), [])
  const primaryNavigation = navigation.slice(0, 5)
  const mobileNavigation = navigation.map((task) => ({
    name: task.label,
    href: task.route,
    icon: taskIcons[task.key] || LayoutGrid,
  }))
  const primaryTask = SITE_CONFIG.tasks.find((task) => task.key === recipe.primaryTask && task.enabled) || primaryNavigation[0]
  const isDirectoryProduct = recipe.homeLayout === 'listing-home' || recipe.homeLayout === 'classified-home'

  if (isDirectoryProduct) {
    const palette = directoryPalette[(recipe.brandPack === 'market-utility' ? 'market-utility' : 'directory-clean') as keyof typeof directoryPalette]

    return (
      <header className={cn('sticky top-0 z-50 w-full', palette.shell)}>
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <div className={cn('flex h-12 w-12 items-center justify-center overflow-hidden p-1.5', palette.logo)}>
                <img src="/favicon.png?v=20260401" alt={`${SITE_CONFIG.name} logo`} width="48" height="48" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 hidden sm:block">
                <span className="block truncate text-xl font-semibold">{SITE_CONFIG.name}</span>
                <span className="block text-[10px] uppercase tracking-[0.24em] opacity-60">{siteContent.navbar.tagline}</span>
              </div>
            </Link>

            <div className="hidden items-center gap-5 xl:flex">
              {primaryNavigation.slice(0, 4).map((task) => {
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('text-sm font-semibold transition-colors', isActive ? 'text-foreground' : palette.nav)}>
                    {task.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <div className={cn('flex w-full max-w-xl items-center gap-3 rounded-full px-4 py-3', palette.search)}>
              <Search className="h-4 w-4" />
              <span className="text-sm">Find businesses, spaces, and local services</span>
              <div className="ml-auto hidden items-center gap-1 text-xs opacity-75 md:flex">
                <MapPin className="h-3.5 w-3.5" />
                Local discovery
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {primaryTask ? (
              <Link href={primaryTask.route} className="hidden items-center gap-2 rounded-full border border-current/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] opacity-75 md:inline-flex">
                <Sparkles className="h-3.5 w-3.5" />
                {primaryTask.label}
              </Link>
            ) : null}

            {isAuthenticated ? (
              <NavbarAuthControls />
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" size="sm" asChild className="rounded-full px-4">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className={cn('rounded-full', palette.cta)}>
                  <Link href="/register">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Listing
                  </Link>
                </Button>
              </div>
            )}

            <Button variant="ghost" size="icon" className="rounded-full lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className={palette.mobile}>
            <div className="space-y-2 px-4 py-4">
              <div className={cn('mb-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium', palette.search)}>
                <Search className="h-4 w-4" />
                Find businesses, spaces, and services
              </div>
              {mobileNavigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors', isActive ? 'bg-foreground text-background' : palette.post)}>
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </header>
    )
  }

  const style = variantClasses[recipe.navbar]
  const isFloating = recipe.navbar === 'floating-bar'
  const isEditorial = recipe.navbar === 'editorial-bar'
  const isUtility = recipe.navbar === 'utility-bar'

  return (
    <header className={cn('sticky top-0 z-50 w-full', style.shell)}>
      <nav
        className={cn(
          'mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8',
          isFloating ? 'h-24 pt-4' : 'h-20',
          isEditorial ? 'relative justify-between' : 'justify-between'
        )}
      >
        <div
          className={cn(
            'flex min-w-0 items-center gap-4 lg:gap-7',
            isEditorial ? 'z-10 flex-1' : 'flex-1'
          )}
        >
          <Link href="/" className="flex shrink-0 items-center gap-3 whitespace-nowrap pr-2">
            <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden p-1.5', style.logo)}>
              <img src="/favicon.png?v=20260401" alt={`${SITE_CONFIG.name} logo`} width="48" height="48" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 hidden sm:block">
              <span className="block truncate text-xl font-semibold tracking-tight text-slate-900">{SITE_CONFIG.name}</span>
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.26em] text-slate-500 sm:block">{siteContent.navbar.tagline}</span>
            </div>
          </Link>

          {!isEditorial && isFloating ? (
            <div className="hidden min-w-0 flex-1 items-center gap-2 xl:flex">
              {primaryNavigation.map((task) => {
                const Icon = taskIcons[task.key] || LayoutGrid
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors', isActive ? style.active : style.idle)}>
                    <Icon className="h-4 w-4" />
                    <span>{task.label}</span>
                  </Link>
                )
              })}
            </div>
          ) : null}
          {!isEditorial && isUtility ? (
            <div className="hidden min-w-0 flex-1 items-center gap-2 xl:flex">
              {primaryNavigation.map((task) => {
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('rounded-lg px-3 py-2 text-sm font-semibold transition-colors', isActive ? style.active : style.idle)}>
                    {task.label}
                  </Link>
                )
              })}
            </div>
          ) : null}
          {!isEditorial && !isFloating && !isUtility ? (
            <div className="hidden min-w-0 flex-1 items-center gap-1 overflow-hidden xl:flex">
              {primaryNavigation.map((task) => {
                const Icon = taskIcons[task.key] || LayoutGrid
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors', isActive ? style.active : style.idle)}>
                    <Icon className="h-4 w-4" />
                    <span>{task.label}</span>
                  </Link>
                )
              })}
            </div>
          ) : null}
        </div>

        {isEditorial ? (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-center xl:flex">
            <div className="pointer-events-auto flex items-center gap-5">
              <div className="h-px w-10 bg-gradient-to-r from-transparent via-slate-300 to-slate-300 sm:w-16" />
              {primaryNavigation.length <= 1 ? (
                <Link
                  href={primaryNavigation[0]?.route || '/articles'}
                  className={cn(
                    'text-sm font-semibold uppercase tracking-[0.28em] transition-colors',
                    pathname.startsWith(primaryNavigation[0]?.route || '/articles') ? 'text-violet-700' : 'text-slate-900 hover:text-violet-700'
                  )}
                >
                  {primaryNavigation[0]?.label || 'Articles'}
                </Link>
              ) : (
                <div className="flex items-center gap-5">
                  {primaryNavigation.map((task) => {
                    const isActive = pathname.startsWith(task.route)
                    return (
                      <Link
                        key={task.key}
                        href={task.route}
                        className={cn(
                          'text-sm font-semibold uppercase tracking-[0.2em] transition-colors',
                          isActive ? 'text-violet-700' : 'text-slate-700 hover:text-violet-700'
                        )}
                      >
                        {task.label}
                      </Link>
                    )
                  })}
                </div>
              )}
              <div className="h-px w-10 bg-gradient-to-l from-transparent via-slate-300 to-slate-300 sm:w-16" />
            </div>
          </div>
        ) : null}

        <div className={cn('flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-3', isEditorial ? 'z-10 flex-1' : '')}>
          {primaryTask && (recipe.navbar === 'utility-bar' || recipe.navbar === 'floating-bar') ? (
            <Link href={primaryTask.route} className="hidden items-center gap-2 rounded-full border border-current/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] opacity-80 md:inline-flex">
              <Sparkles className="h-3.5 w-3.5" />
              {primaryTask.label}
            </Link>
          ) : null}

          <Button variant="ghost" size="icon" asChild className="hidden rounded-full text-[#4A5568] hover:bg-violet-50/80 hover:text-slate-900 md:flex">
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          {isAuthenticated ? (
            <NavbarAuthControls />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild className="rounded-full px-4 text-[#4A5568] hover:bg-violet-50/80 hover:text-slate-900">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className={cn('rounded-full font-semibold shadow-sm', style.cta)}>
                <Link href="/register">{isEditorial ? 'Join free' : isUtility ? 'Post Now' : 'Get Started'}</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="rounded-full text-slate-700 hover:bg-violet-50 lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {isFloating && primaryTask ? (
        <div className="mx-auto hidden max-w-7xl px-4 pb-3 sm:px-6 lg:block lg:px-8">
          <Link href={primaryTask.route} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur hover:bg-white/12">
            Featured surface
            <span>{primaryTask.label}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}

      {isMobileMenuOpen && (
        <div className={style.mobile}>
          <div className="space-y-2 px-4 py-4">
            <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="mb-3 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-muted-foreground">
              <Search className="h-4 w-4" />
              Search the site
            </Link>
            {mobileNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors', isActive ? style.active : style.idle)}>
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
