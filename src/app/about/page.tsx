import Link from "next/link"
import { BookOpen, Compass, FileText, LineChart, Mail, ShieldCheck, Sparkles } from "lucide-react"
import { PageShell } from "@/components/shared/page-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SITE_CONFIG } from "@/lib/site-config"
import { articleSiteUi } from "@/lib/article-site-ui"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Original features per month", value: "40+" },
  { label: "Topics we cover", value: "12" },
  { label: "Reader countries", value: "80+" },
]

const pillars = [
  {
    icon: ShieldCheck,
    title: "Editorial independence",
    body: "Sponsorships never dictate our conclusions. We label partnerships clearly and keep reviews and explainers separate from commercial relationships.",
  },
  {
    icon: LineChart,
    title: "Evidence over hype",
    body: "We prioritize primary sources, reproducible checks, and context—especially when a story moves fast or touches security, privacy, or consumer safety.",
  },
  {
    icon: Compass,
    title: "Readers first",
    body: "Headlines stay accurate, layouts stay calm, and navigation stays obvious so you can skim, deep-read, or share without fighting the interface.",
  },
]

const workflow = [
  {
    step: "01",
    title: "Report & verify",
    detail: "Reporters and editors stress-test claims, talk to people on the record when it matters, and update stories when facts change.",
  },
  {
    step: "02",
    title: "Design for clarity",
    detail: "Art direction, typography, and spacing follow the same glass editorial system you see on the homepage—readable on any screen.",
  },
  {
    step: "03",
    title: "Publish & iterate",
    detail: "We ship, listen to reader feedback, and refine explainers and guides so they stay useful after the news cycle moves on.",
  },
]

export default function AboutPage() {
  const { panel, soft, muted, action } = articleSiteUi

  return (
    <PageShell
      title={`About ${SITE_CONFIG.name}`}
      description={`${SITE_CONFIG.name} is an independent technology publication: explainers, analysis, and reporting with a calm, modern reading experience.`}
      actions={
        <>
          <Button variant="outline" asChild className="rounded-full border-white/60 bg-white/70 text-slate-800 shadow-sm backdrop-blur-sm hover:bg-white">
            <Link href="/articles">
              <FileText className="mr-2 h-4 w-4" />
              Browse articles
            </Link>
          </Button>
          <Button variant="gradient" asChild className="rounded-full">
            <Link href="/contact">
              <Mail className="mr-2 h-4 w-4" />
              Contact editorial
            </Link>
          </Button>
        </>
      }
    >
      <div className="space-y-12">
        <div className={cn("grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start")}>
          <div className={cn("p-8 sm:p-10", panel)}>
            <Badge className="rounded-full border-0 bg-gradient-to-r from-violet-600/90 to-indigo-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Our story
            </Badge>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Technology moves quickly; trustworthy context should not feel like an afterthought.
            </h2>
            <p className={cn("mt-4 text-sm leading-7 sm:text-base", muted)}>
              We built {SITE_CONFIG.name} for readers who want depth without noise—whether you are evaluating a product, following platform shifts, or
              teaching a team. Every page uses the same lavender-glass, violet-accent language as the homepage so the brand feels cohesive from the first
              visit to the last paragraph.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className={cn("flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-slate-700", soft)}>
                <BookOpen className="h-4 w-4 text-violet-600" />
                Long-form explainers &amp; guides
              </div>
              <div className={cn("flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-slate-700", soft)}>
                <Sparkles className="h-4 w-4 text-indigo-500" />
                Product analysis you can act on
              </div>
            </div>
          </div>
          <div className={cn("space-y-4", panel, "p-8")}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">At a glance</p>
            <ul className="space-y-5">
              {stats.map((s) => (
                <li key={s.label} className="flex items-baseline justify-between gap-4 border-b border-white/50 pb-4 last:border-0 last:pb-0">
                  <span className={cn("text-sm", muted)}>{s.label}</span>
                  <span className="text-2xl font-semibold tabular-nums text-slate-900">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">What we stand for</h3>
          <p className={cn("mt-2 max-w-2xl text-sm", muted)}>
            Three principles shape every pitch, edit, and layout decision. They are non-negotiable, even when timelines are tight.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div key={title} className={cn("p-6 sm:p-7", soft)}>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-indigo-500/20 text-violet-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-4 text-base font-semibold text-slate-900">{title}</h4>
                <p className={cn("mt-2 text-sm leading-6", muted)}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={cn("overflow-hidden rounded-[2rem] p-8 sm:p-10", panel)}>
          <h3 className="text-lg font-semibold text-slate-900">How a story goes live</h3>
          <p className={cn("mt-2 max-w-2xl text-sm", muted)}>
            Transparency matters. Here is the simplified path from idea to published piece—no black boxes.
          </p>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {workflow.map((w) => (
              <li key={w.step} className="relative">
                <span className="text-4xl font-bold tabular-nums text-violet-200">{w.step}</span>
                <h4 className="mt-2 text-base font-semibold text-slate-900">{w.title}</h4>
                <p className={cn("mt-2 text-sm leading-6", muted)}>{w.detail}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className={cn("flex flex-col items-start justify-between gap-6 rounded-[2rem] p-8 sm:flex-row sm:items-center sm:p-10", soft)}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Work with us</p>
            <p className="mt-2 max-w-xl text-base font-medium text-slate-900">Have a tip, correction, or collaboration idea? Our editorial desk reads everything.</p>
            <p className={cn("mt-2 max-w-xl text-sm", muted)}>For syndication and press assets, visit the Press page. For job openings, see Careers.</p>
          </div>
          <Link
            href="/contact"
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-white transition hover:opacity-95",
              action
            )}
          >
            Reach the team
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
