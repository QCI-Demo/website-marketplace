import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { RegisterForm } from './RegisterForm'

const navigateMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('RegisterForm', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('requires terms acceptance before submission', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/first name/i), 'Alex')
    await user.type(screen.getByLabelText(/last name/i), 'Rivera')
    await user.type(screen.getByLabelText(/email address/i), 'alex@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'StrongPass1')
    await user.type(screen.getByLabelText(/confirm password/i), 'StrongPass1')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(
      await screen.findByText('You must accept the terms and privacy policy'),
    ).toBeInTheDocument()
  })

  it('shows a password mismatch error', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/first name/i), 'Alex')
    await user.type(screen.getByLabelText(/last name/i), 'Rivera')
    await user.type(screen.getByLabelText(/email address/i), 'alex@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'StrongPass1')
    await user.type(screen.getByLabelText(/confirm password/i), 'Mismatch1')
    await user.click(screen.getByLabelText(/terms of service/i))
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
  })

  it('supports keyboard selection of account type options', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )

    const sellerOption = screen.getByLabelText(/sell electronics/i)
    sellerOption.focus()
    await user.keyboard(' ')

    expect(sellerOption).toBeChecked()
  })
})
