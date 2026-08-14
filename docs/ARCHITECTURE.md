# Architecture

This repository is a Vite + React admin frontend for Panda Towers. The app is intentionally split into feature folders so each domain stays self-contained.

## Application flow

1. src/main.jsx mounts the app.
2. src/app/App.jsx loads the global providers and routes.
3. src/app/routes.jsx defines the public and protected routes.
4. Feature pages in src/features/*/pages render the UI and call services.
5. Services use src/lib/apiClient.js to switch between mock mode and the real Laravel API.

## Folder structure

- src/app: app shell, route definitions, and shared app-level providers.
- src/features: domain modules such as auth, dashboard, units, projects, leads, documents, blog, content, settings, audit.
- src/components: shared UI primitives such as Button, Input, Modal, Table, and Toast.
- src/hooks: reusable hooks such as useToast and useFetch.
- src/layouts: AdminLayout and AuthLayout.
- src/lib: shared API client, audit logging, upload helpers, and permissions helpers.
- src/utils: route constants, formatters, validators, mock helpers, and shared app constants.

## Routing

The main router lives in src/app/routes.jsx.

- Public: /login
- Protected admin routes: /admin/dashboard, /admin/units, /admin/projects, /admin/leads, /admin/documents, /admin/blog, /admin/content, /admin/settings, and /admin/audit-logs
- The root path redirects to /admin

## State and data flow

- Auth state is handled through the auth context and localStorage token storage.
- Feature data is usually fetched by each page or hook and passed through the service layer.
- The API client centralizes headers, error handling, and the mock/real switch.

## Mock mode

The app defaults to mock mode via VITE_USE_MOCKS=true. That keeps the admin usable even before the Laravel API is ready. Mock data is persisted in localStorage, and services currently simulate auth and CRUD operations.

## Notes

Historical Lighthouse reports under docs/lighthouse are reference artifacts only. They do not drive the frontend build or runtime behavior.
