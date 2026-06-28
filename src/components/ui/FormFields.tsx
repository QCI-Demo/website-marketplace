import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
  describedBy?: string
}

export function TextInput({
  label,
  error,
  hint,
  describedBy,
  id,
  className = '',
  required,
  ...props
}: TextInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const ariaDescribedBy =
    [describedBy, hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-text">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </label>
      <input
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={ariaDescribedBy}
        className={`block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-text shadow-sm transition placeholder:text-text-muted focus:border-brand-600 focus:ring-2 focus:ring-brand-100 ${
          error ? 'border-danger' : 'border-border'
        } ${className}`}
        {...props}
      />
      {hint ? (
        <p id={hintId} className="text-xs text-text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type CheckboxFieldProps = {
  label: ReactNode
  error?: string
  id?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export function CheckboxField({
  label,
  error,
  id,
  className = '',
  ...props
}: CheckboxFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-3">
        <input
          id={inputId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={`mt-1 h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-600 ${className}`}
          {...props}
        />
        <label htmlFor={inputId} className="text-sm text-text">
          {label}
        </label>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type RadioGroupProps = {
  legend: string
  name: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string; description: string }>
  error?: string
}

export function RadioGroup({
  legend,
  name,
  value,
  onChange,
  options,
  error,
}: RadioGroupProps) {
  const groupId = useId()
  const errorId = error ? `${groupId}-error` : undefined

  return (
    <fieldset className="space-y-3" aria-describedby={errorId}>
      <legend className="text-sm font-medium text-text">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`
          const isSelected = value === option.value

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={`flex cursor-pointer flex-col rounded-lg border p-4 transition ${
                isSelected
                  ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-100'
                  : 'border-border bg-white hover:border-brand-600'
              }`}
            >
              <span className="flex items-center gap-2">
                <input
                  id={optionId}
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={(event) => onChange(event.target.value)}
                  className="h-4 w-4 border-border text-brand-600 focus:ring-brand-600"
                />
                <span className="text-sm font-semibold text-text">{option.label}</span>
              </span>
              <span className="mt-1 pl-6 text-xs text-text-muted">{option.description}</span>
            </label>
          )
        })}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
