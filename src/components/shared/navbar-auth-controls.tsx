'use client'

import Link from 'next/link'
import { ChevronDown, LayoutGrid, LogOut, Plus, User, FileText, Building2, Tag, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'

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

export function NavbarAuthControls() {
  const { logout } = useAuth()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="hidden h-10 gap-1 rounded-full border border-[#9b1b3a]/20 bg-[#AE2448] px-4 text-white shadow-[0_12px_28px_rgba(174,36,72,0.28)] hover:bg-[#8e1b3b] sm:flex">
            <Plus className="h-4 w-4" />
            Create
            <ChevronDown className="h-3 w-3 opacity-80" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border border-violet-200/60 bg-white/95 shadow-xl backdrop-blur-xl">
          {SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => {
            const Icon = taskIcons[task.key] || LayoutGrid
            return (
              <DropdownMenuItem key={task.key} asChild>
                <Link href={`/create/${task.key}`}>
                  <Icon className="mr-2 h-4 w-4" />
                  Create {task.label}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 gap-1.5 rounded-full border-violet-200/70 bg-white/80 px-3 text-sm font-medium text-slate-800 shadow-sm backdrop-blur-sm hover:bg-white hover:text-slate-900"
        onClick={logout}
      >
        <LogOut className="h-4 w-4 text-slate-600" />
        Sign Out
      </Button>
    </>
  )
}
