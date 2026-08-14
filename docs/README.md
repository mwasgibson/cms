# Admin

This repository contains the React + Vite admin frontend for Panda Towers. It is a separate app from the public marketing site and is used to manage content and records for the investment platform.

## Stack

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- lucide-react

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment

The frontend expects these Vite variables:

- VITE_API_URL: API base URL, for example http://localhost:8000/api
- VITE_USE_MOCKS: Set to true to use mock data and localStorage by default

## Mock mode

The app currently defaults to mock mode so the UI can run without a backend. In this mode:

- Auth works with any email/password combination.
- CRUD flows are simulated in localStorage.
- The mock data is stored under keys such as pt_mock_units and pt_mock_projects.

## Main features

- Authentication and protected admin routes
- Dashboard and summary cards
- Units and projects management
- Leads and document tracking
- Blog and content management
- Settings and audit log views

## Project structure

- src/app: router and app shell
- src/features: feature-based modules
- src/components: shared UI primitives
- src/layouts: auth/admin layouts
- src/lib: shared API client and helpers

## Notes

Historical Lighthouse reports under docs/lighthouse are kept as reference artifacts only and are not required for local development or builds.
