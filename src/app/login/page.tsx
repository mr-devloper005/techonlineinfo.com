'use client'

import { useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Bookmark, Building2, FileText, Image as ImageIcon, Sparkles } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { useAuth } from '@/lib/auth-context'
import { articleSiteUi } from '@/lib/article-site-ui'
import { LOGIN_PAGE_OVERRIDE_ENABLED, LoginPageOverride } from '@/overrides/login-page'
import { cn } from '@/lib/utils'

function getLoginConfig(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return {
      shell: 'bg-[#f8fbff] text-slate-950',
      panel: 'border border-slate-200 bg-white',
      side: 'border border-slate-200 bg-slate-50',
      muted: 'text-slate-600',
      action: 'bg-slate-950 text-white hover:bg-slate-800',
      icon: Building2,
      title: 'Access your business dashboard',
      body: 'Manage listings, verification details, contact info, and local discovery surfaces from one place.',
    }
  }
  if (kind === 'editorial') {
    return {
      shell: articleSiteUi.shell,
      panel: articleSiteUi.panel,
      side: articleSiteUi.soft,
      muted: articleSiteUi.muted,
      action: articleSiteUi.action,
      icon: FileText,
      title: 'Sign in to your publication workspace',
      body: 'Draft, review, and publish long-form work with the calmer reading system intact.',
    }
  }
  if (kind === 'visual') {
    return {
      shell: 'bg-[#07101f] text-white',
      panel: 'border border-white/10 bg-white/6',
      side: 'border border-white/10 bg-white/5',
      muted: 'text-slate-300',
      action: 'bg-[#8df0c8] text-[#07111f] hover:bg-[#77dfb8]',
      icon: ImageIcon,
      title: 'Enter the creator workspace',
      body: 'Open your visual feed, creator profile, and publishing tools without dropping into a generic admin shell.',
    }
  }
  return {
    shell: 'bg-[#f7f1ea] text-[#261811]',
    panel: 'border border-[#ddcdbd] bg-[#fffaf4]',
    side: 'border border-[#e8dbce] bg-[#f3e8db]',
    muted: 'text-[#71574a]',
    action: 'bg-[#5b2b3b] text-[#fff0f5] hover:bg-[#74364b]',
    icon: Bookmark,
    title: 'Open your curated collections',
    body: 'Manage saved resources, collection notes, and curator identity from a calmer workspace.',
  }
}

export default function LoginPage() {
  if (LOGIN_PAGE_OVERRIDE_ENABLED) {
    return <LoginPageOverride />
  }

  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const config = getLoginConfig(productKind)
  const Icon = config.icon
  const router = useRouter()
  const { login, isLoading, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const recommendedReads = useMemo(
    () => [
      'AI Tooling in 2026: Practical Stack for Teams',
      'Building Faster Sites with Edge Rendering',
      'TypeScript Patterns that Scale Editorial Apps',
      'How to Write Better Technical Explainers',
    ],
    []
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }
    try {
      await login(email.trim(), password)
      router.push('/articles')
      router.refresh()
    } catch {
      setError('Unable to sign in right now. Please try again.')
    }
  }

  return (
    <div
      className={cn(
        'min-h-screen',
        config.shell,
        productKind !== 'editorial' && 'bg-[linear-gradient(180deg,#eef2fb_0%,#f6f8ff_40%,#ffffff_100%)]'
      )}
    >
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className={`relative overflow-hidden rounded-[2rem] p-8 ${config.panel} backdrop-blur-sm`}>
            <div className="pointer-events-none absolute -bottom-14 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(133,108,255,0.45),rgba(106,179,255,0.12)_45%,transparent_70%)] blur-xl" />
            <div className="mb-8 flex items-center gap-4">
              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                Article Access
              </span>
              <span className="text-xs text-black/55">Curated for readers</span>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Welcome back to your reading desk.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-black/60">
              Sign in to continue reading, save articles, and personalize your editorial feed.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {recommendedReads.map((title) => (
                <div key={title} className="rounded-2xl border border-black/10 bg-white/70 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Recommended</p>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold text-black/80">{title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2rem] p-8 ${config.side}`}>
            <Icon className="h-8 w-8" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Welcome back</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Sign in to continue reading</h2>
            <p className={`mt-4 text-sm leading-7 ${config.muted}`}>{config.body}</p>
            {user ? (
              <p className="mt-4 rounded-xl border border-emerald-300/70 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Logged in as {user.email}. Your session is stored locally on this browser.
              </p>
            ) : null}
            {error ? (
              <p className="mt-4 flex items-center gap-2 rounded-xl border border-red-300/70 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            ) : null}
            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <input
                className={cn(
                  'h-12 px-4 text-sm',
                  productKind === 'editorial' ? articleSiteUi.input : 'rounded-xl border border-current/10 bg-transparent'
                )}
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
              <input
                className={cn(
                  'h-12 px-4 text-sm',
                  productKind === 'editorial' ? articleSiteUi.input : 'rounded-xl border border-current/10 bg-transparent'
                )}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              <button type="submit" disabled={isLoading} className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 ${config.action}`}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <div className={`mt-6 flex items-center justify-between text-sm ${config.muted}`}>
              <Link href="/forgot-password" className="hover:underline">Forgot password?</Link>
              <Link href="/register" className="inline-flex items-center gap-2 font-semibold hover:underline">
                <Sparkles className="h-4 w-4" />
                Create account
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
