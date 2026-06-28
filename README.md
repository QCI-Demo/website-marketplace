# Electronics Marketplace Website

Frontend for the Electronics Marketplace, including responsive and accessible authentication flows for buyers and sellers.

## Features

- User registration with buyer/seller account type selection
- Login with remember-me support
- Forgot password and reset password flows
- Client-side validation with clear error messaging
- Accessibility support (ARIA, keyboard navigation, color contrast)

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173` to view the app.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm test` | Run unit tests |
| `npm run lint` | Run Oxlint |

## Documentation

See [docs/authentication-forms.md](docs/authentication-forms.md) for validation rules, API contracts, and accessibility details.

## Environment

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL for auth API requests | `/api` |
