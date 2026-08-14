# API reference

This frontend talks to a Laravel API through the shared client in src/lib/apiClient.js. In local development the app defaults to mock mode, so most screens work without a backend.

## Environment variables

- VITE_API_URL: Base URL for the API, for example http://localhost:8000/api
- VITE_USE_MOCKS: Set to true to use local mock data and localStorage. Set to false to call the real API.

## Authentication

The auth service uses the following endpoints:

- POST /login
- POST /logout
- GET /me

When a token is available, requests automatically include:

- Authorization: Bearer <token>

The token is stored in localStorage under token.

## Resource endpoints

The app currently expects these resource routes:

- Units: /units
- Projects: /projects
- Leads: /leads
- Documents: /documents
- Posts: /posts
- Content: /content
- Settings: /settings
- Audit logs: /audit-logs
- Media upload: /media/upload

## Mock mode behavior

When VITE_USE_MOCKS=true:

- Services read and write from localStorage instead of the API.
- Login accepts any email/password combination and creates a mock admin session.
- Mock data keys include pt_mock_units, pt_mock_projects, pt_mock_leads, pt_mock_documents, pt_mock_posts, pt_mock_settings, and pt_mock_pages.

## Client conventions

- All feature services should be created through createResource from src/lib/apiClient.js.
- The shared client normalizes API errors into an Error object with message, status, and data.
- Audit logging is recorded for create/update/delete actions when the real API is used.
