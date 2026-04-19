'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Bookmark, Building2, FileText, Image as ImageIcon, Sparkles } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { useAuth } from '@/lib/auth-context'
import { articleSiteUi } from '@/lib/article-site-ui'
import { REGISTER_PAGE_OVERRIDE_ENABLED, RegisterPageOverride } from '@/overrides/register-page'
import { cn } from '@/lib/utils'

function getRegisterConfig(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return {
      shell: 'bg-[#f8fbff] text-slate-950',
      panel: 'border border-slate-200 bg-white',
      side: 'border border-slate-200 bg-slate-50',
      muted: 'text-slate-600',
      action: 'bg-slate-950 text-white hover:bg-slate-800',
      icon: Building2,
      title: 'Create a business-ready account',
      body: 'List services, manage locations, and activate trust signals with a proper directory workflow.',
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
      title: 'Start your contributor workspace',
      body: 'Create a profile for essays, issue drafts, editorial review, and publication scheduling.',
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
      title: 'Set up your creator profile',
      body: 'Launch a visual-first account with gallery publishing, identity surfaces, and profile-led discovery.',
    }
  }
  return {
    shell: 'bg-[#f7f1ea] text-[#261811]',
    panel: 'border border-[#ddcdbd] bg-[#fffaf4]',
    side: 'border border-[#e8dbce] bg-[#f3e8db]',
    muted: 'text-[#71574a]',
    action: 'bg-[#5b2b3b] text-[#fff0f5] hover:bg-[#74364b]',
    icon: Bookmark,
    title: 'Create a curator account',
    body: 'Build shelves, save references, and connect collections to your profile without a generic feed setup.',
  }
}

export default function RegisterPage() {
  if (REGISTER_PAGE_OVERRIDE_ENABLED) {
    return <RegisterPageOverride />
  }

  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const config = getRegisterConfig(productKind)
  const Icon = config.icon
  const router = useRouter()
  const { signup, isLoading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focus, setFocus] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill name, email, and password to continue.')
      return
    }
    try {
      await signup(name.trim(), email.trim(), password)
      router.push('/articles')
      router.refresh()
    } catch {
      setError('Unable to create account right now. Please try again.')
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
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className={`relative overflow-hidden rounded-[2rem] p-8 ${config.panel} backdrop-blur-sm`}>
            <div className="pointer-events-none absolute -bottom-16 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(133,108,255,0.45),rgba(106,179,255,0.12)_45%,transparent_70%)] blur-xl" />
            <p className="inline-flex items-center rounded-full border border-black/10 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
              Reader Membership
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Create your account and build your personalized article stream.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-black/60">
              Join the platform to save posts, track your reading list, and get a cleaner recommendation experience.
            </p>
            <div className="mt-8 grid gap-4">
              {['Save article history locally', 'Build a private reading queue', 'Get smoother article-first navigation'].map((item) => (
                <div key={item} className="rounded-[1.2rem] border border-black/10 bg-white/75 px-4 py-4 text-sm font-medium text-black/75">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2rem] p-8 ${config.side}`}>
            <Icon className="h-8 w-8" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Create account</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Join the article platform</h2>
            <p className={`mt-4 text-sm leading-7 ${config.muted}`}>{config.body}</p>
            {error ? (
              <p className="mt-4 flex items-center gap-2 rounded-xl border border-red-300/70 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            ) : null}
            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <input
                className={cn('h-12 px-4 text-sm', productKind === 'editorial' ? articleSiteUi.input : 'rounded-xl border border-current/10 bg-transparent')}
                placeholder="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
              <input
                className={cn('h-12 px-4 text-sm', productKind === 'editorial' ? articleSiteUi.input : 'rounded-xl border border-current/10 bg-transparent')}
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
              <input
                className={cn('h-12 px-4 text-sm', productKind === 'editorial' ? articleSiteUi.input : 'rounded-xl border border-current/10 bg-transparent')}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
              <input
                className={cn('h-12 px-4 text-sm', productKind === 'editorial' ? articleSiteUi.input : 'rounded-xl border border-current/10 bg-transparent')}
                placeholder="What topics do you like to read?"
                value={focus}
                onChange={(event) => setFocus(event.target.value)}
              />
              <button type="submit" disabled={isLoading} className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 ${config.action}`}>
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
            <div className={`mt-6 flex items-center justify-between text-sm ${config.muted}`}>
              <span>Already have an account?</span>
              <Link href="/login" className="inline-flex items-center gap-2 font-semibold hover:underline">
                <Sparkles className="h-4 w-4" />
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
