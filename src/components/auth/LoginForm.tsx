import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { AuthApiError, login } from '../../lib/api/authApi'
import { loginSchema, type LoginFormValues } from '../../lib/validation/authSchemas'
import { Alert } from '../ui/Alert'
import { AuthCard } from '../ui/AuthCard'
import { Button } from '../ui/Button'
import { CheckboxField, TextInput } from '../ui/FormFields'

export function LoginForm() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null)

    try {
      const response = await login(values)
      localStorage.setItem('auth_token', response.token)
      navigate('/', { replace: true })
    } catch (error) {
      if (error instanceof AuthApiError) {
        if (error.fieldErrors) {
          Object.entries(error.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof LoginFormValues, { message })
          })
        }
        setFormError(error.message)
        return
      }

      setFormError('Unable to sign in right now. Please try again.')
    }
  }

  return (
    <AuthCard
      title="Sign in"
      subtitle="Access your buyer or seller account on the Electronics Marketplace."
      footer={
        <p>
          New here?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        aria-describedby={formError ? 'login-form-error' : undefined}
      >
        {formError ? (
          <Alert id="login-form-error" variant="error" title="Sign in failed">
            {formError}
          </Alert>
        ) : null}

        <TextInput
          label="Email address"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-2">
          <TextInput
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-brand-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <CheckboxField
          label="Remember me on this device"
          {...register('rememberMe')}
        />

        <Button type="submit" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthCard>
  )
}
