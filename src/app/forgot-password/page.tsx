"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NavbarShell } from "@/components/shared/navbar-shell"
import { Footer } from "@/components/shared/footer"
import { getFactoryState } from "@/design/factory/get-factory-state"
import { getProductKind } from "@/design/factory/get-product-kind"
import { articleSiteUi } from "@/lib/article-site-ui"
import { cn } from "@/lib/utils"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const editorial = productKind === "editorial"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className={cn("min-h-screen", editorial ? articleSiteUi.shell : "bg-background text-foreground")}>
      <NavbarShell />
      <main className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-lg flex-col justify-center px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "w-full p-8 sm:p-10",
            editorial
              ? cn(articleSiteUi.panel, "shadow-[0_24px_70px_rgba(99,102,241,0.12)]")
              : "rounded-2xl border border-border bg-card shadow-sm"
          )}
        >
          <Link
            href="/login"
            className={cn(
              "mb-8 inline-flex items-center gap-2 text-sm",
              editorial ? "text-slate-500 hover:text-violet-700" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {!isSubmitted ? (
            <>
              <h1 className={cn("mb-2 text-3xl font-bold tracking-tight", editorial ? "text-slate-900" : "text-foreground")}>
                Reset your password
              </h1>
              <p className={cn("mb-8 text-sm leading-relaxed", editorial ? "text-slate-600" : "text-muted-foreground")}>
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className={editorial ? "text-slate-700" : undefined}>
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className={cn("absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2", editorial ? "text-slate-400" : "text-muted-foreground")} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn("pl-10", editorial && articleSiteUi.input)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant={editorial ? "gradient" : "default"} className="h-11 w-full rounded-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className={cn("mb-2 text-3xl font-bold tracking-tight", editorial ? "text-slate-900" : "text-foreground")}>
                Check your email
              </h1>
              <p className={cn("mb-8 text-sm", editorial ? "text-slate-600" : "text-muted-foreground")}>
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
              <Button asChild variant="outline" className={cn("h-11 w-full rounded-full", editorial && "border-violet-200/80 bg-white/70 text-slate-800 hover:bg-white")}>
                <Link href="/login">Back to login</Link>
              </Button>
              <p className={cn("mt-6 text-sm", editorial ? "text-slate-500" : "text-muted-foreground")}>
                Didn&apos;t receive the email?{" "}
                <button type="button" onClick={() => setIsSubmitted(false)} className="font-medium text-violet-600 hover:underline">
                  Try again
                </button>
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
