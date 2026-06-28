import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthApiError, resetPassword } from '../../lib/api/authApi'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '../../lib/validation/authSchemas'
import { Alert } from '../ui/Alert'
import { AuthCard } from '../ui/AuthCard'
import { Button } from '../ui/Button'
import { TextInput } from '../ui/FormFields'
import { PasswordStrength } from '../ui/PasswordStrength'

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = watch('password')

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setFormError(null)

    if (!token) {
      setFormError('This reset link is invalid or has expired. Request a new one.')
      return
    }

    try {
      const response = await resetPassword(token, values)
      setSuccessMessage(response.message)
    } catch (error) {
      if (error instanceof AuthApiError) {
        setFormError(error.message)
        return
      }

      setFormError('Unable to reset your password right now. Please try again.')
    }
  }

  if (!token && !successMessage) {
    return (
      <AuthCard
        title="Invalid reset link"
        subtitle="The password reset link is missing or expired."
        footer={
          <p>
            <Link to="/forgot-password" className="font-semibold text-brand-700 hover:underline">
              Request a new reset link
            </Link>
          </p>
        }
      >
        <Alert variant="error" title="Reset link unavailable">
          Please request a new password reset email to continue.
        </Alert>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Choose a new password"
      subtitle="Create a strong password to secure your Electronics Marketplace account."
      footer={
        successMessage ? (
          <p>
            <Link to="/login" className="font-semibold text-brand-700 hover:underline">
              Continue to sign in
            </Link>
          </p>
        ) : (
          <p>
            <Link to="/login" className="font-semibold text-brand-700 hover:underline">
              Back to sign in
            </Link>
          </p>
        )
      }
    >
      {successMessage ? (
        <Alert variant="success" title="Password updated">
          {successMessage}
        </Alert>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          aria-describedby={formError ? 'reset-password-form-error' : undefined}
        >
          {formError ? (
            <Alert id="reset-password-form-error" variant="error" title="Reset failed">
              {formError}
            </Alert>
          ) : null}

          <div className="space-y-3">
            <TextInput
              label="New password"
              type="password"
              autoComplete="new-password"
              required
              hint="Use at least 8 characters with uppercase, lowercase, and a number."
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordStrength password={passwordValue} />
          </div>

          <TextInput
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            required
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" isLoading={isSubmitting}>
            Update password
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
