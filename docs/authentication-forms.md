# Authentication Forms

This document describes the registration, login, and password reset UI for the Electronics Marketplace frontend.

## Stack

- **React 19** with **TypeScript**
- **Vite** for development and builds
- **React Router** for client-side routing
- **React Hook Form** + **Zod** for validation
- **Tailwind CSS v4** for responsive styling
- **Vitest** + **Testing Library** for unit tests

## Routes

| Route | Component | Purpose |
| --- | --- | --- |
| `/register` | `RegisterForm` | Buyer/seller account creation |
| `/login` | `LoginForm` | Email/password sign in |
| `/forgot-password` | `ForgotPasswordForm` | Request password reset email |
| `/reset-password?token=...` | `ResetPasswordForm` | Set a new password from email link |

## Validation Rules

### Login

- Email required and must be valid
- Password required

### Registration

- First and last name required (max 50 characters)
- Email required and must be valid
- Account type required (`buyer` or `seller`)
- Password minimum 8 characters with uppercase, lowercase, and number
- Confirm password must match
- Terms acceptance required

### Password Reset

- Forgot password: valid email required
- Reset password: same password complexity rules as registration

## Accessibility

The forms follow WCAG-oriented patterns:

- Semantic landmarks (`main`, `section`, `header`, `footer`, `fieldset`, `legend`)
- Explicit `<label>` associations for every input
- `aria-invalid`, `aria-describedby`, and `role="alert"` for validation errors
- `aria-live` regions for async success and password strength feedback
- Visible focus outlines with sufficient color contrast
- Minimum 44px touch targets on primary actions
- Keyboard-operable radio groups and checkboxes
- Screen-reader-only loading text on submit buttons

## API Integration

Auth requests are sent to `VITE_API_BASE_URL` (default `/api`):

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

Set `VITE_API_BASE_URL` in `.env` to point at the backend service.

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

## Testing

Unit tests cover:

- Zod schema validation (`authSchemas.test.ts`)
- Form validation and submission behavior
- Accessible error rendering
- Password reset token handling

Run the suite with:

```bash
npm test
```
