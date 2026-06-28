import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
        Electronics Marketplace
      </p>
      <h1 className="mt-3 text-4xl font-bold text-text sm:text-5xl">
        Buy and sell electronics with confidence
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-text-muted">
        Secure onboarding for buyers and sellers. Create an account, sign in, or recover
        your password to get started.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/register"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Create account
        </Link>
        <Link
          to="/login"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-text hover:border-brand-600"
        >
          Sign in
        </Link>
      </div>
    </main>
  )
}
