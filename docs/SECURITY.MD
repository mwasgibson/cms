# Security notes

This document captures the current frontend-side security expectations for the Panda Towers admin app.

## Environment variables

- Keep secrets out of the repository. Only non-sensitive Vite variables should be stored in .env or .env.example.
- Local overrides should stay in .env.local or .env.*.local and are ignored by git.
- The current app uses VITE_API_URL and VITE_USE_MOCKS; no secret-bearing values should be added to the frontend bundle.

## Authentication and sessions

- The app stores the auth token in localStorage under pt_token.
- Treat that token as sensitive and clear it on logout.
- When the backend is moved to a production-grade session model, prefer HttpOnly cookies if the stack supports them.

## File uploads

- Restrict upload types and sizes on both the client and server.
- Do not trust user-submitted filenames.
- Store uploads through the backend with server-side validation and scanning where possible.

## Cross-origin requests

- Keep the API CORS policy explicit and restrict it to the admin domain in production.
- Avoid wildcard origins for authenticated requests.
- If cookies are used, make sure the server sets the appropriate credentials policy.

## Content safety

- React escapes content by default, but any user-generated HTML or rich text should still be sanitized on the backend.
- Avoid rendering untrusted content without sanitization.

## Dependency hygiene

- Keep dependencies updated and run npm audit regularly.
- Review any new package before adding it to the admin app.
