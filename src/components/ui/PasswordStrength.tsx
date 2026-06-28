type PasswordStrengthProps = {
  password: string
}

type StrengthLevel = {
  label: string
  score: number
  color: string
}

function getPasswordStrength(password: string): StrengthLevel {
  let score = 0

  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score <= 2) return { label: 'Weak', score: 1, color: 'bg-danger' }
  if (score <= 4) return { label: 'Fair', score: 2, color: 'bg-amber-500' }
  return { label: 'Strong', score: 3, color: 'bg-success' }
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null

  const strength = getPasswordStrength(password)

  return (
    <div aria-live="polite" className="space-y-2">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span id="password-strength-label">Password strength</span>
        <span>{strength.label}</span>
      </div>
      <div
        role="meter"
        aria-labelledby="password-strength-label"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={strength.score}
        className="grid grid-cols-3 gap-1"
      >
        {[1, 2, 3].map((segment) => (
          <span
            key={segment}
            className={`h-1.5 rounded-full ${
              segment <= strength.score ? strength.color : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
