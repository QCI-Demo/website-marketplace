import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { AuthApiError, register as registerUser } from '../../lib/api/authApi'
import {
  registerSchema,
  type RegisterFormValues,
} from '../../lib/validation/authSchemas'
import { Alert } from '../ui/Alert'
import { AuthCard } from '../ui/AuthCard'
import { Button } from '../ui/Button'
import { CheckboxField, RadioGroup, TextInput } from '../ui/FormFields'
import { PasswordStrength } from '../ui/PasswordStrength'

export function RegisterForm() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      accountType: 'buyer',
      password: '',
      confirmPassword: '',
      acceptTerms: undefined,
    },
  })

  const passwordValue = watch('password')
  const accountType = watch('accountType')

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null)

    try {
      const response = await registerUser(values)
      localStorage.setItem('auth_token', response.token)
      navigate('/', { replace: true })
    } catch (error) {
      if (error instanceof AuthApiError) {
        if (error.fieldErrors) {
          Object.entries(error.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof RegisterFormValues, { message })
          })
        }
        setFormError(error.message)
        return
      }

      setFormError('Unable to create your account right now. Please try again.')
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join the Electronics Marketplace as a buyer or seller."
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        aria-describedby={formError ? 'register-form-error' : undefined}
      >
        {formError ? (
          <Alert id="register-form-error" variant="error" title="Registration failed">
            {formError}
          </Alert>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="First name"
            autoComplete="given-name"
            required
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <TextInput
            label="Last name"
            autoComplete="family-name"
            required
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <TextInput
          label="Email address"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <RadioGroup
          legend="I want to"
          name="accountType"
          value={accountType}
          onChange={(value) =>
            setValue('accountType', value as RegisterFormValues['accountType'], {
              shouldValidate: true,
            })
          }
          error={errors.accountType?.message}
          options={[
            {
              value: 'buyer',
              label: 'Buy electronics',
              description: 'Browse listings and purchase devices securely.',
            },
            {
              value: 'seller',
              label: 'Sell electronics',
              description: 'List products and manage your storefront.',
            },
          ]}
        />

        <div className="space-y-3">
          <TextInput
            label="Password"
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
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <CheckboxField
          label={
            <>
              I agree to the{' '}
              <a href="/terms" className="font-medium text-brand-700 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="font-medium text-brand-700 hover:underline">
                Privacy Policy
              </a>
            </>
          }
          error={errors.acceptTerms?.message}
          {...register('acceptTerms')}
        />

        <Button type="submit" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthCard>
  )
}
