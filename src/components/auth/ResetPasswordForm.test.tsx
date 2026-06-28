import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ResetPasswordForm } from './ResetPasswordForm'

describe('ResetPasswordForm', () => {
  it('shows an error state when the reset token is missing', () => {
    render(
      <MemoryRouter initialEntries={['/reset-password']}>
        <ResetPasswordForm />
      </MemoryRouter>,
    )

    expect(screen.getByText('Invalid reset link')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please request a new password reset email to continue.',
    )
  })

  it('renders the reset form when a token is present', () => {
    render(
      <MemoryRouter initialEntries={['/reset-password?token=abc123']}>
        <ResetPasswordForm />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/^new password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument()
  })
})
