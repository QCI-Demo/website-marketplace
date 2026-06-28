import { describe, expect, it } from 'vitest'
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from './authSchemas'

describe('authSchemas', () => {
  it('validates a complete login payload', () => {
    const result = loginSchema.safeParse({
      email: 'buyer@example.com',
      password: 'secret',
      rememberMe: true,
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid login email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'secret',
    })

    expect(result.success).toBe(false)
  })

  it('requires matching passwords on registration', () => {
    const result = registerSchema.safeParse({
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex@example.com',
      accountType: 'buyer',
      password: 'StrongPass1',
      confirmPassword: 'Different1',
      acceptTerms: true,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const hasConfirmPasswordError = result.error.issues.some(
        (issue) => issue.path[0] === 'confirmPassword',
      )
      expect(hasConfirmPasswordError).toBe(true)
    }
  })

  it('enforces password complexity on registration', () => {
    const result = registerSchema.safeParse({
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex@example.com',
      accountType: 'seller',
      password: 'weakpass',
      confirmPassword: 'weakpass',
      acceptTerms: true,
    })

    expect(result.success).toBe(false)
  })

  it('validates forgot password email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'user@example.com' })
    expect(result.success).toBe(true)
  })

  it('validates reset password payload', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'NewPass123',
      confirmPassword: 'NewPass123',
    })

    expect(result.success).toBe(true)
  })
})
