# Frontend Agent Guide

> Use this after `frontend/AGENT.md` when you need implementation detail.

## Purpose

The frontend turns backend parking workflows into user and admin experiences. Backend state is authoritative; frontend should present it clearly and safely.

## Stack

- React
- Vite
- React Router
- Axios
- CSS files mirrored to feature structure

## Architecture

Preferred flow:

```text
Route/page -> local components -> hooks/context -> API service -> backend
```

Rules:

- Components should stay presentation-focused.
- Put reusable request logic in the service layer.
- Put data orchestration in hooks or context when needed.
- Keep CSS in `src/styles/` rather than inline layout styling.

## Key Files

- `src/App.jsx`: route declarations
- `src/main.jsx`: app mount
- `src/context/AuthContext.jsx`: auth bootstrap and session state
- `src/api/axiosClient.js`: base axios behavior
- `src/api/index.js`: domain service exports
- `src/index.css`: variables and global primitives

## Feature Map

- Auth pages: `src/pages/auth/`
- User pages: `src/pages/user/`
- Admin pages: `src/pages/admin/`
- Shared layout: `src/components/layout/`
- Reusable display pieces: `src/components/shared/`
- Feature styles: `src/styles/pages/` and `src/styles/components/`

## UX Rules

- Always show loading, empty, and error states.
- Use backend status values as the display source of truth.
- Do not fake payment success before backend verification.
- Keep VNPay redirect flow browser-driven when `paymentUrl` is returned.
- Preserve role-aware navigation and page access.

## What Frontend Needs From Backend

Frontend depends on:

- stable auth bootstrap through `GET /api/auth/me`
- consistent response shape
- stable enum values for booking, slot, payment, and pass status
- `paymentUrl` for VNPay redirect flows
- payment return verification endpoint behavior

If backend changes any of these, update the shared agent context.

## What Backend Needs From Frontend

Backend-facing expectations:

- send credentials for cookie-based protected requests
- submit valid payload shapes
- handle pending states honestly
- avoid inventing impossible state transitions in UI

## Change Workflow

When editing a feature:

1. Read the route page.
2. Check whether a hook already exists.
3. Reuse or extend the existing service.
4. Update CSS in the mirrored styles folder.
5. Recheck the shared agent context if the feature touches API contract or status flow.
