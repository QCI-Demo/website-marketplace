import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ForgotPasswordForm } from './ForgotPasswordForm'

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('shows a success message after submitting a valid email', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          message: 'If an account exists, reset instructions have been sent.',
        }),
        { status: 200 },
      ),
    )

    render(
      <MemoryRouter>
        <ForgotPasswordForm />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/email address/i), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Check your email')
    })
  })
})
