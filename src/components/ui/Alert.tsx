import type { ReactNode } from 'react'

type AlertProps = {
  id?: string
  variant: 'error' | 'success' | 'info'
  title: string
  children?: ReactNode
}

const variantStyles = {
  error: 'border-danger bg-danger-bg text-danger',
  success: 'border-success bg-success-bg text-success',
  info: 'border-brand-600 bg-brand-50 text-brand-800',
}

export function Alert({ id, variant, title, children }: AlertProps) {
  return (
    <div
      id={id}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className={`rounded-lg border px-4 py-3 text-sm ${variantStyles[variant]}`}
    >
      <p className="font-semibold">{title}</p>
      {children ? <div className="mt-1">{children}</div> : null}
    </div>
  )
}
