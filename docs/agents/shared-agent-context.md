# Shared Agent Context

> This file is shared knowledge for agents working in the frontend and backend folders.

## System Overview

The project contains two cooperating applications:

- `backend/`: REST API and business logic
- `frontend/`: React application for users and admins

Backend is the source of truth for domain state.
Frontend is the source of truth for presentation and client navigation.

## Local Dev Assumptions

- Backend base URL: `http://localhost:3000`
- API prefix: `/api`
- Frontend dev URL: `http://localhost:5173`
- Frontend env usually points `VITE_API_URL` to `http://localhost:3000/api`

## Auth Contract

Supported auth methods:

- httpOnly cookie
- `Authorization: Bearer <token>`

Frontend should include credentials for browser-auth flows.
Backend should keep `GET /api/auth/me` stable because frontend uses it to restore session state.

## Response Contract

Success:

```json
{ "status": "success", "data": { } }
```

Error:

```json
{ "status": "error", "message": "Human-readable error message" }
```

## Roles

- `USER`
- `ADMIN`

## Shared Enums

### Booking

- `PENDING_PAYMENT`
- `CONFIRMED`
- `COMPLETED`
- `CANCELLED`

### Payment

- `PENDING`
- `SUCCESS`
- `FAILED`
- `REFUNDED`

### Slot

- `AVAILABLE`
- `RESERVED`
- `OCCUPIED`
- `MAINTENANCE`

### Monthly Pass

- `PENDING_PAYMENT`
- `ACTIVE`
- `EXPIRED`
- `CANCELLED`

## Shared Flows

### Booking with CASH

- booking created
- slot reserved
- booking confirmed
- payment usually created at checkout

### Booking with VNPay

- booking created
- pending payment created
- `paymentUrl` returned
- user is redirected to gateway
- backend IPN confirms or fails final payment outcome

### Check-in and checkout

- walk-in check-in requires `AVAILABLE`
- booking-backed check-in requires `RESERVED` and confirmed booking
- checkout releases the slot

### Monthly pass

- one active pass per user and vehicle type at a time
- a pass may be used by any owned vehicle of that type
- a pass may cover only one active parking session at a time across all lots
- VNPay may be used for purchase or renewal

## Coordination Rules

- If one side changes route shape, required fields, statuses, or auth behavior, update this file.
- If one side adds a dependency on a new field, update this file.
- If VNPay redirect or verification behavior changes, both sides should review the change.
- Feature work should update the relevant docs in the same task, not as a later cleanup.
- Shared-contract changes must be mirrored in both frontend and backend shared agent context files.
