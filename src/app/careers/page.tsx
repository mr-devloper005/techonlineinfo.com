import Link from "next/link"
import { ArrowRight, Clock, Globe2, HeartHandshake, Laptop, Palette, Users } from "lucide-react"
import { PageShell } from "@/components/shared/page-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SITE_CONFIG } from "@/lib/site-config"
import { articleSiteUi } from "@/lib/article-site-ui"
import { cn } from "@/lib/utils"

const openings = [
  {
    title: "Staff Writer, Consumer Technology",
    location: "Remote (US & EU time zones)",
    type: "Full-time",
    level: "Mid–Senior",
    summary: "Report and write features on hardware, software, and the platforms readers use every day. Comfort with primary sources and tight deadlines required.",
  },
  {
    title: "Tech Analyst, Platforms & AI",
    location: "Hybrid — New York",
    type: "Full-time",
    level: "Senior",
    summary: "Translate complex product and policy changes into clear analysis. Collaborate with editors on explainers, reviews, and data-informed commentary.",
  },
  {
    title: "Audience & Newsletter Editor",
    location: "Remote",
    type: "Full-time",
    level: "Mid",
    summary: "Own voice and rhythm for our editorial newsletters, partner with growth on experiments, and keep subscription journeys respectful of reader attention.",
  },
]

const benefits = [
  { icon: Globe2, text: "Remote-first with intentional in-person weeks" },
  { icon: HeartHandshake, text: "Health, dental, and vision for employees & dependents" },
  { icon: Laptop, text: "Hardware stipend and home-office budget" },
  { icon: Palette, text: "Learning budget for courses, books, and conferences" },
  { icon: Users, text: "Editorial mentorship and structured review cycles" },
  { icon: Clock, text: "Flexible hours where the news allows" },
]

const values = [
  {
    title: "Editorial integrity",
    body: "We correct fast, cite carefully, and protect reporters’ independence. Commercial teams do not influence scores or conclusions.",
  },
  {
    title: "Craft & accessibility",
    body: "We invest in design systems, readable type, and inclusive language so our work reaches the widest audience without dumbing it down.",
  },
  {
    title: "Sustainable pace",
    body: "Breaking news happens, but we staff for sustainability—clear ownership, realistic timelines, and real time off.",
  },
]

export default function CareersPage() {
  const { panel, soft, muted, action } = articleSiteUi

  return (
    <PageShell
      title="Careers"
      description={`Join ${SITE_CONFIG.name} and help build a publication readers trust—sharp reporting, thoughtful design, and technology explained with care.`}
      actions={
        <Button variant="gradient" asChild className="rounded-full">
          <Link href="/contact">
            Apply or introduce yourself
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-14">
        <div className={cn("p-8 sm:p-10", panel)}>
          <Badge className="rounded-full border-0 bg-gradient-to-r from-violet-600/90 to-indigo-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Why join
          </Badge>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            We are a small editorial team with product-level ambition.
          </h2>
          <p className={cn("mt-4 max-w-3xl text-sm leading-7 sm:text-base", muted)}>
            You will work alongside reporters, editors, and designers who care about the same glass-and-violet experience as our readers. We ship stories
            on modern infrastructure, experiment with formats, and measure success by depth of trust—not vanity metrics alone.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className={cn("rounded-2xl p-5", soft)}>
                <h3 className="text-sm font-semibold text-slate-900">{v.title}</h3>
                <p className={cn("mt-2 text-sm leading-6", muted)}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Open roles</h3>
              <p className={cn("mt-1 max-w-xl text-sm", muted)}>
                Don’t see a perfect fit? Send a note anyway—we often hire from general applications when projects expand.
              </p>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Updated regularly</p>
          </div>
          <div className="mt-8 space-y-5">
            {openings.map((role) => (
              <div key={role.title} className={cn("p-6 sm:p-8", panel)}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full border-violet-100 bg-violet-50 text-violet-800">
                    {role.level}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-white/70 bg-white/50">
                    {role.type}
                  </Badge>
                </div>
                <h4 className="mt-4 text-xl font-semibold text-slate-900">{role.title}</h4>
                <p className={cn("mt-1 text-sm", muted)}>{role.location}</p>
                <p className={cn("mt-4 max-w-3xl text-sm leading-7", muted)}>{role.summary}</p>
                <Button variant="outline" asChild className="mt-6 rounded-full border-white/60 bg-white/70 backdrop-blur-sm hover:bg-white">
                  <Link href="/contact">Apply for this role</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div className={cn("p-8", soft)}>
            <h3 className="text-lg font-semibold text-slate-900">Benefits &amp; support</h3>
            <p className={cn("mt-2 text-sm leading-6", muted)}>
              Compensation is reviewed against industry benchmarks. We aim for transparency in leveling and growth paths.
            </p>
            <ul className="mt-6 space-y-4">
              {benefits.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3 text-sm text-slate-800">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-violet-600 shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="leading-6">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={cn("p-8 sm:p-10", panel)}>
            <h3 className="text-lg font-semibold text-slate-900">Interview process</h3>
            <ol className={cn("mt-6 space-y-6 text-sm", muted)}>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 text-xs font-bold text-white">
                  1
                </span>
                <span>
                  <strong className="text-slate-900">Intro call</strong> — culture, scope, and what success looks like in the first six months.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 text-xs font-bold text-white">
                  2
                </span>
                <span>
                  <strong className="text-slate-900">Skills conversation</strong> — portfolio, clips, or a short editorial exercise depending on the role.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 text-xs font-bold text-white">
                  3
                </span>
                <span>
                  <strong className="text-slate-900">Meet the team</strong> — cross-functional chats so you know who you will collaborate with day to day.
                </span>
              </li>
            </ol>
            <Link
              href="/contact"
              className={cn(
                "mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95 sm:w-auto",
                action
              )}
            >
              Start a conversation
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
