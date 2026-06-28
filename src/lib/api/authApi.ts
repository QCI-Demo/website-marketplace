import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
} from '../validation/authSchemas'

export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  accountType: 'buyer' | 'seller'
}

export type AuthResponse = {
  user: AuthUser
  token: string
}

export class AuthApiError extends Error {
  fieldErrors?: Record<string, string>

  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message)
    this.name = 'AuthApiError'
    this.fieldErrors = fieldErrors
  }
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new AuthApiError(
      payload.message ?? 'Something went wrong. Please try again.',
      payload.fieldErrors,
    )
  }

  return payload as T
}

export async function login(values: LoginFormValues): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export async function register(
  values: RegisterFormValues,
): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export async function requestPasswordReset(
  values: ForgotPasswordFormValues,
): Promise<{ message: string }> {
  return request<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export async function resetPassword(
  token: string,
  values: ResetPasswordFormValues,
): Promise<{ message: string }> {
  return request<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, ...values }),
  })
}
