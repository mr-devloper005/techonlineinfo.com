'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FileText, ImageIcon, Layout, Mail, Newspaper } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { SITE_CONFIG } from '@/lib/site-config'
import { articleSiteUi } from '@/lib/article-site-ui'
import { cn } from '@/lib/utils'

type PressAsset = {
  id: string
  title: string
  description: string
  fileType: string
  preview: 'logo' | 'screens' | 'doc'
}

const pressAssets: PressAsset[] = [
  {
    id: 'brand-mark',
    title: 'Logo & wordmark',
    description: 'Primary mark on light backgrounds, monochrome option, and clear-space rules for editorial use.',
    fileType: 'PNG pack',
    preview: 'logo',
  },
  {
    id: 'product-captures',
    title: 'Product & reading UI',
    description: 'Representative screenshots of article layouts, navigation, and glass components for reviews and features.',
    fileType: 'ZIP',
    preview: 'screens',
  },
  {
    id: 'editorial-brief',
    title: 'Editorial positioning brief',
    description: `One-page overview: audience, tone, pillars, and how we describe ${SITE_CONFIG.name} in third person.`,
    fileType: 'PDF',
    preview: 'doc',
  },
]

const pressCoverage = [
  {
    id: 'c1',
    outlet: 'Northline Review',
    headline: `${SITE_CONFIG.name} pairs calm design with reporting that refuses to rush verdicts.`,
    date: 'March 2026',
  },
  {
    id: 'c2',
    outlet: 'Format Weekly',
    headline: 'How lavender glass UI and violet CTAs became the signature of a new wave of tech publications.',
    date: 'February 2026',
  },
  {
    id: 'c3',
    outlet: 'Signal & Noise',
    headline: 'Readers return for explainers that still make sense a week later—a rarity in platform coverage.',
    date: 'January 2026',
  },
]

function PreviewVisual({ kind }: { kind: PressAsset['preview'] }) {
  if (kind === 'logo') {
    return (
      <div className="relative flex aspect-[16/9] items-center justify-center rounded-xl border border-white/60 bg-gradient-to-br from-slate-50 via-white to-violet-50/80">
        <div className="relative h-24 w-24 sm:h-28 sm:w-28">
          <Image src="/favicon.png" alt={`${SITE_CONFIG.name} mark`} fill className="object-contain drop-shadow-md" sizes="112px" priority />
        </div>
      </div>
    )
  }
  if (kind === 'screens') {
    return (
      <div className="relative flex aspect-[16/9] items-center justify-center gap-3 rounded-xl border border-white/60 bg-gradient-to-br from-indigo-50/90 via-white to-violet-100/60">
        <div className="hidden h-[55%] w-[28%] rounded-lg border border-white/80 bg-white/90 shadow-lg sm:block" />
        <div className="h-[70%] w-[42%] rounded-lg border border-violet-200/80 bg-white/95 shadow-xl">
          <div className="flex h-full flex-col gap-2 p-3">
            <div className="h-2 w-1/3 rounded bg-violet-200/80" />
            <div className="mt-1 space-y-1.5">
              <div className="h-1.5 w-full rounded bg-slate-200/90" />
              <div className="h-1.5 w-[92%] rounded bg-slate-200/80" />
              <div className="h-1.5 w-[78%] rounded bg-slate-200/70" />
            </div>
            <div className="mt-auto flex gap-2">
              <div className="h-6 flex-1 rounded-md bg-gradient-to-r from-violet-500/25 to-indigo-500/20" />
              <div className="h-6 w-14 rounded-md bg-slate-200/80" />
            </div>
          </div>
        </div>
        <div className="hidden h-[48%] w-[22%] rounded-lg border border-white/80 bg-white/80 shadow-md sm:block" />
      </div>
    )
  }
  return (
    <div className="relative flex aspect-[16/9] flex-col justify-between rounded-xl border border-white/60 bg-gradient-to-br from-white via-slate-50 to-violet-50/70 p-6">
      <Layout className="h-8 w-8 text-violet-500/80" />
      <div className="space-y-2">
        <div className="h-2 w-2/5 rounded bg-slate-300/80" />
        <div className="h-1.5 w-full rounded bg-slate-200/90" />
        <div className="h-1.5 w-4/5 rounded bg-slate-200/80" />
        <div className="h-1.5 w-3/5 rounded bg-slate-200/70" />
      </div>
      <FileText className="ml-auto h-6 w-6 text-indigo-400/90" />
    </div>
  )
}

export default function PressPage() {
  const { toast } = useToast()
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = pressAssets.find((a) => a.id === activeId)
  const { panel, soft, muted, action } = articleSiteUi

  return (
    <PageShell
      title="Press"
      description={`Media kit, brand assets, and recent coverage for ${SITE_CONFIG.name}. For interview requests, email through our contact page—we respond within two business days when possible.`}
      actions={
        <Button variant="outline" asChild className="rounded-full border-white/60 bg-white/70 backdrop-blur-sm hover:bg-white">
          <Link href="/contact">
            <Mail className="mr-2 h-4 w-4" />
            Media inquiries
          </Link>
        </Button>
      }
    >
      <div className="space-y-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className={cn('p-8 sm:p-10', panel)}>
            <div className="flex items-center gap-2 text-violet-600">
              <ImageIcon className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Press kit</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Download-ready assets</h2>
            <p className={cn('mt-2 max-w-xl text-sm leading-6', muted)}>
              Use these materials for broadcast, print, and digital features. Please do not alter logo proportions or colors; monochrome assets are
              provided where contrast requires it.
            </p>
            <div className="mt-8 space-y-4">
              {pressAssets.map((asset) => (
                <div key={asset.id} className={cn('rounded-2xl p-5 sm:p-6', soft)}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{asset.title}</p>
                      <p className={cn('mt-1 text-sm', muted)}>{asset.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="rounded-full border-violet-100 bg-violet-50 text-violet-800">
                        {asset.fileType}
                      </Badge>
                      <Button size="sm" variant="outline" className="rounded-full border-white/70 bg-white/60" onClick={() => setActiveId(asset.id)}>
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className={cn('rounded-full', action)}
                        onClick={() =>
                          toast({
                            title: 'Download started',
                            description: `${asset.title} — in a live deployment, this would begin your download.`,
                          })
                        }
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-indigo-600">
              <Newspaper className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Coverage</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Recent mentions</h2>
            <p className={cn('mt-2 text-sm', muted)}>Selected stories referencing our reporting, design, or editorial approach.</p>
            <div className="mt-8 space-y-4">
              {pressCoverage.map((item) => (
                <Card key={item.id} className="border-white/55 bg-white/45 shadow-[0_16px_48px_rgba(99,102,241,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5">
                  <CardContent className="p-6">
                    <div className={cn('text-xs font-semibold uppercase tracking-wider', muted)}>{item.outlet}</div>
                    <p className="mt-2 text-sm font-medium leading-snug text-slate-900">{item.headline}</p>
                    <p className={cn('mt-3 text-xs', muted)}>{item.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className={cn('rounded-[2rem] p-8 sm:p-10', soft)}>
          <h3 className="text-lg font-semibold text-slate-900">Fact sheet (short)</h3>
          <ul className={cn('mt-4 grid gap-3 text-sm sm:grid-cols-2', muted)}>
            <li>
              <strong className="text-slate-800">Publication:</strong> {SITE_CONFIG.name}
            </li>
            <li>
              <strong className="text-slate-800">Focus:</strong> Technology explainers, analysis, and product-aware reporting
            </li>
            <li>
              <strong className="text-slate-800">Visual identity:</strong> Lavender glass surfaces, violet-to-indigo accents, generous whitespace
            </li>
            <li>
              <strong className="text-slate-800">Contact:</strong>{' '}
              <Link href="/contact" className="font-medium text-violet-700 underline-offset-4 hover:underline">
                Editorial &amp; press desk
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <Dialog open={Boolean(active)} onOpenChange={() => setActiveId(null)}>
        <DialogContent className="max-w-3xl border-white/60 bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>{active?.title}</DialogTitle>
          </DialogHeader>
          {active && <PreviewVisual kind={active.preview} />}
          <p className={cn('text-sm', muted)}>{active?.description}</p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-full" onClick={() => setActiveId(null)}>
              Close
            </Button>
            <Button
              className={cn('rounded-full', action)}
              onClick={() =>
                toast({
                  title: 'Download started',
                  description: `${active?.title} — in production, your file would download here.`,
                })
              }
            >
              Download {active?.fileType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
