import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { LoginForm } from '../../components/auth/LoginForm'

const navigateMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('LoginForm', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('shows validation errors for empty submission', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('submits valid credentials and stores the auth token', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          token: 'test-token',
          user: {
            id: '1',
            email: 'buyer@example.com',
            firstName: 'Buyer',
            lastName: 'Example',
            accountType: 'buyer',
          },
        }),
        { status: 200 },
      ),
    )

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/email address/i), 'buyer@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'Secret123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBe('test-token')
      expect(navigateMock).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  it('exposes accessible error messaging for invalid email format', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/email address/i), 'invalid-email')
    await user.type(screen.getByLabelText(/^password/i), 'Secret123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    const error = await screen.findByRole('alert', { name: '' })
    expect(error).toHaveTextContent('Enter a valid email address')
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('aria-invalid', 'true')
  })
})
