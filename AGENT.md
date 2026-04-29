# Frontend Agent Quickstart

> Start here when working inside the `frontend/` folder.

## What This Folder Is

This frontend is the React client for the Smart Parking Management System.

- Build tool: Vite
- UI: React
- Routing: React Router
- HTTP: Axios
- Auth model: session restored from backend

## Read Order

1. This file
2. `docs/agents/shared-agent-context.md`
3. `docs/agents/frontend-folder-structure.md`
4. Task-specific files only

If your task needs UI conventions or architecture detail, then read `docs/agents/frontend-agent.md`.

## Fast Map

- `src/App.jsx`: route tree
- `src/main.jsx`: app bootstrap
- `src/context/AuthContext.jsx`: auth/session state
- `src/api/axiosClient.js`: Axios config
- `src/api/index.js`: service layer
- `src/pages/`: route-level screens
- `src/components/`: reusable UI
- `src/styles/`: mirrored CSS files
- `src/index.css`: design tokens and global styles

## If Your Task Is...

### Login, logout, session, guards

Read:

- `src/context/AuthContext.jsx`
- `src/api/authService.js`
- `src/App.jsx`

### User dashboard, bookings, vehicles, payments, monthly passes

Read:

- `src/pages/user/`
- `src/pages/user/components/`
- `src/pages/user/hooks/`
- `src/api/index.js`

### Admin pages

Read:

- `src/pages/admin/`
- `src/components/layout/`
- `src/api/index.js`

### VNPay return flow

Read:

- `src/pages/user/VnpayReturnPage.jsx`
- `src/api/index.js`
- `docs/agents/shared-agent-context.md`

## Frontend Rules

- Use the service layer before creating new API calls.
- Respect backend statuses instead of inventing UI-only states.
- Keep styles in matching CSS files.
- Use shared variables from `src/index.css`.
- Handle loading, empty, and error states.

## Documentation Update Rule

When making a feature change, update the relevant agent docs in the same task if the change affects:

- API routes, payloads, or response shape
- auth, permissions, or role behavior
- status enums or business flows
- folder structure or important file locations
- frontend/backend integration expectations

Update only what changed:

- frontend-only change: update frontend docs
- backend-only dependency change: update backend docs if the frontend doc points to it
- shared contract change: update the shared agent context in both folders

## What Backend Expects

The backend contract assumes frontend will:

- call protected endpoints with cookie credentials where appropriate
- use `GET /api/auth/me` to restore session
- redirect to `paymentUrl` for VNPay flows
- verify return data through the payment return endpoint

If your change needs a backend contract update, also update the shared agent context.
