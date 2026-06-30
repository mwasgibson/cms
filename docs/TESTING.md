# Testing and verification

## Current verification status

The project has been verified locally with:

- npm install
- npm run build

The latest build completed successfully with Vite and generated the production bundle in dist/.

## What is currently covered

- Build validation for the frontend bundle
- Manual smoke checking of the main routes and layout is recommended before release

## Known limitations

- No automated test suite is currently configured in package.json.
- Authentication and CRUD flows are mostly exercised through the mock mode implementation.
- File uploads and persistence are still dependent on the backend contract once real API mode is enabled.

## Suggested release checklist

- Confirm VITE_API_URL points to the intended backend.
- Set VITE_USE_MOCKS=false only after the Laravel API matches the frontend contract.
- Verify the main flows manually: login, dashboard, units, projects, leads, documents, blog, content, and settings.
- Review browser console output for runtime errors before shipping.

