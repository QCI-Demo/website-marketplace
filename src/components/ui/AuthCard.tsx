import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type AuthCardProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-lg font-bold text-brand-800"
          >
            <span aria-hidden="true">⚡</span>
            Electronics Marketplace
          </Link>
        </div>

        <section
          aria-labelledby="auth-card-title"
          className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
        >
          <header className="mb-6 space-y-2">
            <h1 id="auth-card-title" className="text-2xl font-bold text-text">
              {title}
            </h1>
            <p className="text-sm text-text-muted">{subtitle}</p>
          </header>

          {children}
        </section>

        {footer ? (
          <footer className="mt-6 text-center text-sm text-text-muted">{footer}</footer>
        ) : null}
      </div>
    </main>
  )
}
