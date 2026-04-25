import Link from 'next/link'
import { ArrowRight, Building2, FileText, Image as ImageIcon, LayoutGrid, Search, Tag, User } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskListClient } from '@/components/tasks/task-list-client'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { taskIntroCopy } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { TASK_LIST_PAGE_OVERRIDE_ENABLED, TaskListPageOverride } from '@/overrides/task-list-page'

const taskIcons: Record<TaskKey, any> = {
  listing: Building2,
  article: FileText,
  image: ImageIcon,
  profile: User,
  classified: Tag,
  sbm: LayoutGrid,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

const variantShells = {
  'listing-directory': 'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_24%),linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]',
  'listing-showcase': 'bg-[linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)]',
  'article-editorial':
    'bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.12),transparent_42%),radial-gradient(circle_at_10%_0%,rgba(99,102,241,0.1),transparent_38%),linear-gradient(180deg,#eef2fb_0%,#f6f8ff_48%,#ffffff_100%)]',
  'article-journal':
    'bg-[radial-gradient(circle_at_80%_15%,rgba(129,140,248,0.14),transparent_40%),linear-gradient(180deg,#eef2fb_0%,#f8f9ff_50%,#ffffff_100%)]',
  'image-masonry': 'bg-[linear-gradient(180deg,#09101d_0%,#111c2f_100%)] text-white',
  'image-portfolio': 'bg-[linear-gradient(180deg,#07111f_0%,#13203a_100%)] text-white',
  'profile-creator': 'bg-[linear-gradient(180deg,#0a1120_0%,#101c34_100%)] text-white',
  'profile-business': 'bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_100%)]',
  'classified-bulletin': 'bg-[linear-gradient(180deg,#edf3e4_0%,#ffffff_100%)]',
  'classified-market': 'bg-[linear-gradient(180deg,#f4f6ef_0%,#ffffff_100%)]',
  'sbm-curation': 'bg-[linear-gradient(180deg,#fff7ee_0%,#ffffff_100%)]',
  'sbm-library': 'bg-[linear-gradient(180deg,#f7f8fc_0%,#ffffff_100%)]',
} as const

const editorialSignatures = [
  {
    badge: 'border-fuchsia-200/80 bg-white/75 text-fuchsia-700',
    chip: 'border-fuchsia-100 bg-fuchsia-50/80 text-fuchsia-700',
    title: 'from-fuchsia-700 via-violet-700 to-indigo-700',
    highlight: 'from-fuchsia-600/90 to-indigo-600/90',
    accent: 'text-fuchsia-700',
    panel: 'border-fuchsia-100/70 bg-white/72',
    tagline: 'Lab Notes',
  },
  {
    badge: 'border-emerald-200/80 bg-white/75 text-emerald-700',
    chip: 'border-emerald-100 bg-emerald-50/80 text-emerald-700',
    title: 'from-emerald-700 via-teal-700 to-cyan-700',
    highlight: 'from-emerald-600/90 to-cyan-600/90',
    accent: 'text-emerald-700',
    panel: 'border-emerald-100/70 bg-white/72',
    tagline: 'Signal Desk',
  },
  {
    badge: 'border-amber-200/90 bg-white/80 text-amber-700',
    chip: 'border-amber-100 bg-amber-50/85 text-amber-700',
    title: 'from-amber-700 via-orange-700 to-rose-700',
    highlight: 'from-amber-600/90 to-rose-600/90',
    accent: 'text-orange-700',
    panel: 'border-amber-100/80 bg-white/78',
    tagline: 'Field Briefing',
  },
] as const

const pickEditorialSignature = () => {
  const seed = `${SITE_CONFIG.domain}-${SITE_CONFIG.name}`
  let total = 0
  for (const char of seed) total += char.charCodeAt(0)
  return editorialSignatures[total % editorialSignatures.length]
}

export async function TaskListPage({ task, category }: { task: TaskKey; category?: string }) {
  if (TASK_LIST_PAGE_OVERRIDE_ENABLED) {
    return await TaskListPageOverride({ task, category })
  }

  const taskConfig = getTaskConfig(task)
  const posts = await fetchTaskPosts(task, 30)
  const normalizedCategory = category ? normalizeCategory(category) : 'all'
  const intro = taskIntroCopy[task]
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || '/posts'}/${post.slug}`,
    name: post.title,
  }))
  const { recipe } = getFactoryState()
  const layoutKey = recipe.taskLayouts[task as keyof typeof recipe.taskLayouts] || `${task}-${task === 'listing' ? 'directory' : 'editorial'}`
  const shellClass = variantShells[layoutKey as keyof typeof variantShells] || 'bg-background'
  const Icon = taskIcons[task] || LayoutGrid
  const editorialSignature = pickEditorialSignature()

  const isDark = ['image-masonry', 'image-portfolio', 'profile-creator'].includes(layoutKey)
  const ui = isDark
    ? {
        muted: 'text-slate-300',
        panel: 'border border-white/10 bg-white/6',
        soft: 'border border-white/10 bg-white/5',
        input: 'border-white/10 bg-white/6 text-white',
        button: 'bg-white text-slate-950 hover:bg-slate-200',
      }
    : layoutKey.startsWith('article')
      ? {
          muted: 'text-slate-500',
          panel: 'border border-white/55 bg-white/50 shadow-[0_24px_70px_rgba(99,102,241,0.1)] backdrop-blur-xl',
          soft: 'border border-white/45 bg-white/40 backdrop-blur-md',
          input: 'rounded-2xl border border-slate-200/80 bg-white/85 text-slate-900 shadow-sm',
          button:
            'rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-md hover:opacity-95',
        }
      : layoutKey.startsWith('sbm')
        ? {
            muted: 'text-[#72594a]',
            panel: 'border border-[#dbc6b6] bg-white/90',
            soft: 'border border-[#dbc6b6] bg-[#fff8ef]',
            input: 'border border-[#dbc6b6] bg-white text-[#2f1d16]',
            button: 'bg-[#2f1d16] text-[#fff4e4] hover:bg-[#452920]',
          }
      : {
          muted: 'text-slate-600',
          panel: 'border border-slate-200 bg-white',
          soft: 'border border-slate-200 bg-slate-50',
          input: 'border border-slate-200 bg-white text-slate-950',
          button: 'bg-slate-950 text-white hover:bg-slate-800',
        }

  return (
    <div className={`min-h-screen ${shellClass}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {task === 'listing' ? (
          <SchemaJsonLd
            data={[
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Business Directory Listings',
                itemListElement: schemaItems,
              },
              {
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                name: SITE_CONFIG.name,
                url: `${baseUrl}/listings`,
                areaServed: 'Worldwide',
              },
            ]}
          />
        ) : null}
        {task === 'article' || task === 'classified' ? (
          <SchemaJsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
              url: `${baseUrl}${taskConfig?.route || ''}`,
              hasPart: schemaItems,
            }}
          />
        ) : null}

        {layoutKey === 'listing-directory' || layoutKey === 'listing-showcase' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className={`rounded-[2rem] p-7 shadow-[0_24px_70px_rgba(15,23,42,0.07)] ${ui.panel}`}>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] opacity-70"><Icon className="h-4 w-4" /> {taskConfig?.label || task}</div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-4 max-w-2xl text-sm leading-7 ${ui.muted}`}>Built with a cleaner scan rhythm, stronger metadata grouping, and a structure designed for business discovery rather than editorial reading.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={taskConfig?.route || '#'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.button}`}>Explore results <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/search" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.soft}`}>Open search</Link>
              </div>
            </div>
            <form className={`grid gap-3 rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${ui.soft}`} action={taskConfig?.route || '#'}>
              <div>
                <label className={`text-xs uppercase tracking-[0.2em] ${ui.muted}`}>Category</label>
                <select name="category" defaultValue={normalizedCategory} className={`mt-2 h-11 w-full rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className={`h-11 rounded-xl text-sm font-medium ${ui.button}`}>Apply filters</button>
            </form>
          </section>
        ) : null}

        {layoutKey === 'article-editorial' || layoutKey === 'article-journal' ? (
          <section className="mb-14 grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
            <div className="relative">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] backdrop-blur-sm ${editorialSignature.badge}`}>
                  All | News | Guides
                </span>
                <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${editorialSignature.accent}`}>{editorialSignature.tagline}</span>
              </div>
              <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className={`mt-3 max-w-4xl bg-gradient-to-r bg-clip-text text-4xl font-semibold tracking-[-0.05em] text-transparent sm:text-5xl lg:text-[3.15rem] ${editorialSignature.title}`}>
                {taskConfig?.description || 'Latest posts'}
              </h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>
                A reading deck tuned for long-form stories, sharper scanning, and topic-first navigation.
              </p>
              <Link
                href="/search"
                className={`mt-8 flex w-full max-w-xl items-center gap-3 rounded-full border px-4 py-3.5 text-sm text-slate-600 shadow-[0_12px_40px_rgba(99,102,241,0.08)] backdrop-blur-md transition hover:bg-white/90 ${editorialSignature.panel}`}
              >
                <Search className={`h-4 w-4 shrink-0 ${editorialSignature.accent}`} />
                <span className="text-slate-500">Article name, tag, category...</span>
              </Link>
            </div>
            <div className={`rounded-[2rem] border p-6 sm:p-7 ${ui.panel} ${editorialSignature.panel}`}>
              <div className="flex items-center justify-between gap-3">
                <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${ui.muted}`}>Recommended</p>
                <Link href="/articles" className={`text-xs font-semibold ${editorialSignature.accent}`}>
                  View all
                </Link>
              </div>
              <p className={`mt-4 text-sm leading-7 ${ui.muted}`}>
                Filter by topic to narrow the feed, or scroll for editor picks and the full archive below.
              </p>
              <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center" action={taskConfig?.route || '#'}>
                <select
                  name="category"
                  defaultValue={normalizedCategory}
                  className={`h-12 w-full flex-1 px-4 text-sm ${ui.input}`}
                >
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className={`h-12 shrink-0 px-6 text-sm font-semibold ${ui.button}`}>
                  Apply
                </button>
              </form>
              <div className={`mt-6 rounded-2xl border p-5 text-white shadow-lg bg-gradient-to-br ${editorialSignature.highlight} ${editorialSignature.chip}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-90">Spotlight</p>
                <p className="mt-3 text-lg font-semibold leading-snug tracking-[-0.02em]">
                  Start with the featured story, then explore the three-up row and archive.
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {layoutKey === 'image-masonry' || layoutKey === 'image-portfolio' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${ui.soft}`}>
                <Icon className="h-3.5 w-3.5" /> Visual feed
              </div>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em]">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>This surface leans into stronger imagery, larger modules, and more expressive spacing so visual content feels materially different from reading and directory pages.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`min-h-[220px] rounded-[2rem] ${ui.panel}`} />
              <div className={`min-h-[220px] rounded-[2rem] ${ui.soft}`} />
              <div className={`col-span-2 min-h-[120px] rounded-[2rem] ${ui.panel}`} />
            </div>
          </section>
        ) : null}

        {layoutKey === 'profile-creator' || layoutKey === 'profile-business' ? (
          <section className={`mb-12 rounded-[2.2rem] p-8 shadow-[0_24px_70px_rgba(15,23,42,0.1)] ${ui.panel}`}>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className={`min-h-[240px] rounded-[2rem] ${ui.soft}`} />
              <div>
                <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Profiles with stronger identity, trust, and reputation cues.</h1>
                <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>This layout prioritizes the person or business surface first, then lets the feed continue below without borrowing the same visual logic used by articles or listings.</p>
              </div>
            </div>
          </section>
        ) : null}

        {layoutKey === 'classified-bulletin' || layoutKey === 'classified-market' ? (
          <section className="mb-12 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className={`rounded-[1.8rem] p-6 ${ui.panel}`}>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Fast-moving notices, offers, and responses in a compact board format.</h1>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {['Quick to scan', 'Shorter response path', 'Clearer urgency cues'].map((item) => (
                <div key={item} className={`rounded-[1.5rem] p-5 ${ui.soft}`}>
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {layoutKey === 'sbm-curation' || layoutKey === 'sbm-library' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Curated resources arranged more like collections than a generic post feed.</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>Bookmarks, saved resources, and reference-style items need calmer grouping and lighter metadata. This variant gives them that separation.</p>
            </div>
            <div className={`rounded-[2rem] p-6 ${ui.panel}`}>
              <p className={`text-xs uppercase tracking-[0.24em] ${ui.muted}`}>Collection filter</p>
              <form className="mt-4 flex items-center gap-3" action={taskConfig?.route || '#'}>
                <select name="category" defaultValue={normalizedCategory} className={`h-11 flex-1 rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
                <button type="submit" className={`h-11 rounded-xl px-4 text-sm font-medium ${ui.button}`}>Apply</button>
              </form>
            </div>
          </section>
        ) : null}

        {intro ? (
          <section className={`mb-12 rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 ${ui.panel}`}>
            <h2 className="text-2xl font-semibold text-foreground">{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className={`mt-4 text-sm leading-7 ${ui.muted}`}>{paragraph}</p>
            ))}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {intro.links.map((link) => (
                <a key={link.href} href={link.href} className="font-semibold text-foreground hover:underline">{link.label}</a>
              ))}
            </div>
          </section>
        ) : null}

        <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
      </main>
      <Footer />
    </div>
  )
}
