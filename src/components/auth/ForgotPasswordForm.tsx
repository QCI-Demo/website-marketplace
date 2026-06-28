import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { AuthApiError, requestPasswordReset } from '../../lib/api/authApi'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../../lib/validation/authSchemas'
import { Alert } from '../ui/Alert'
import { AuthCard } from '../ui/AuthCard'
import { Button } from '../ui/Button'
import { TextInput } from '../ui/FormFields'

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setFormError(null)
    setSuccessMessage(null)

    try {
      const response = await requestPasswordReset(values)
      setSuccessMessage(response.message)
    } catch (error) {
      if (error instanceof AuthApiError) {
        if (error.fieldErrors?.email) {
          setError('email', { message: error.fieldErrors.email })
        }
        setFormError(error.message)
        return
      }

      setFormError('Unable to send reset instructions right now. Please try again.')
    }
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter the email associated with your account and we will send reset instructions."
      footer={
        <p>
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      {successMessage ? (
        <Alert variant="success" title="Check your email">
          {successMessage}
        </Alert>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          aria-describedby={formError ? 'forgot-password-form-error' : undefined}
        >
          {formError ? (
            <Alert id="forgot-password-form-error" variant="error" title="Request failed">
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

          <Button type="submit" isLoading={isSubmitting}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
