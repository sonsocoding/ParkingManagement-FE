# AGENT.md — Frontend Integration Guide

> This file is written for an AI agent building the frontend for the Parking Management System.
> Read this entirely before writing a single line of frontend code.

---

## Backend Base URL

```
http://localhost:3000
```

All API routes are prefixed with `/api`.

---

## Authentication

The backend supports **two token delivery methods** (both work):

| Method                          | How                           | When to use               |
| ------------------------------- | ----------------------------- | ------------------------- |
| HttpOnly Cookie (`jwt`)         | Sent automatically by browser | Production / secure flows |
| `Authorization: Bearer <token>` | Manual header                 | Dev/testing               |

**Login response** sets a cookie AND returns user data. On `GET /api/auth/me`, the backend reads whichever token is present.

> ⚠️ All requests to protected routes must be made with `credentials: 'include'` if using cookies, or with the `Authorization` header.

---

## Roles

There are three roles with different access levels:

| Role    | Who              | Access               |
| ------- | ---------------- | -------------------- |
| `USER`  | Regular customer | Own data only        |
| `ADMIN` | System admin     | Full CRUD everywhere |

Use `GET /api/auth/me` on app load to get the current user's role and conditionally render UI.

---

## Standard Response Shape

Every API response follows this consistent format:

**Success:**

```json
{ "status": "success", "data": { ... } }
```

**Error:**

```json
{ "status": "error", "message": "Human-readable error message" }
```

Always check `response.status` field (not HTTP status code alone) to determine success/failure in the UI.

---

## API Reference

### 🔐 Auth — `/api/auth`

| Method | Route       | Auth? | Body                                    | Returns                         |
| ------ | ----------- | ----- | --------------------------------------- | ------------------------------- |
| POST   | `/register` | ❌    | `{ email, password, fullName, phone? }` | user object                     |
| POST   | `/login`    | ❌    | `{ email, password }`                   | user + sets cookie              |
| POST   | `/logout`   | ❌    | —                                       | clears cookie                   |
| GET    | `/me`       | ✅    | —                                       | `{ id, email, fullName, role }` |

---

### 👤 Users — `/api/users`

| Method | Route  | Role  | Notes                       |
| ------ | ------ | ----- | --------------------------- |
| GET    | `/me`  | Any   | Own profile                 |
| PUT    | `/me`  | Any   | Update own profile          |
| DELETE | `/me`  | Any   | Delete own account          |
| GET    | `/`    | ADMIN | All users                   |
| POST   | `/`    | ADMIN | Create user (admin-created) |
| PUT    | `/:id` | ADMIN | Update any user             |
| DELETE | `/:id` | ADMIN | Delete any user             |

---

### 🚗 Vehicles — `/api/vehicles`

| Method | Route        | Role        | Body / Notes                                              |
| ------ | ------------ | ----------- | --------------------------------------------------------- |
| POST   | `/`          | Any         | `{ vehicleType: "CAR"/"MOTORBIKE", plateNumber, color? }` |
| GET    | `/me`        | Any         | Own vehicles                                              |
| GET    | `/`          | ADMIN       | All vehicles                                              |
| GET    | `/:id`       | ADMIN       | Single vehicle                                            |
| PUT    | `/:id`       | Any (owner) | Update own vehicle                                        |
| DELETE | `/:id`       | Any (owner) | Delete own vehicle                                        |
| PUT    | `/:id/admin` | ADMIN       | Admin override update                                     |
| DELETE | `/:id/admin` | ADMIN       | Admin force delete                                        |

---

### 🏢 Parking Lots — `/api/parking-lots`

| Method | Route  | Role  | Body / Notes                                                                         |
| ------ | ------ | ----- | ------------------------------------------------------------------------------------ |
| GET    | `/`    | Any   | All lots with slot counts                                                            |
| GET    | `/:id` | Any   | Single lot                                                                           |
| POST   | `/`    | ADMIN | `{ name, address, totalSlots, lotType, carHourlyRate, motorbikeHourlyRate, zones? }` |
| PUT    | `/:id` | ADMIN | Partial update                                                                       |
| DELETE | `/:id` | ADMIN | Only if no active bookings                                                           |

**`lotType` enum:** `CAR_ONLY` | `MOTORBIKE_ONLY` | `BOTH`

---

### 🅿️ Parking Slots — `/api/parking-slots`

| Method | Route         | Role  | Body / Notes                                                                  |
| ------ | ------------- | ----- | ----------------------------------------------------------------------------- |
| GET    | `/:id`        | Any   | Get slots by **lot ID**                                                       |
| POST   | `/`           | ADMIN | Bulk create: `{ parkingLotId, slots: [{ zoneId, slotNumber, vehicleType }] }` |
| PUT    | `/:id/status` | ADMIN | `{ status: "AVAILABLE"/"RESERVED"/"OCCUPIED"/"MAINTENANCE" }`                 |
| PUT    | `/:id`        | ADMIN | Update slot metadata                                                          |
| DELETE | `/:id`        | ADMIN | Delete slot                                                                   |

**Slot status flow:** `AVAILABLE ↔ RESERVED ↔ OCCUPIED`, `AVAILABLE ↔ MAINTENANCE`

---

### 📋 Bookings — `/api/bookings`

| Method | Route         | Role  | Body / Notes                      |
| ------ | ------------- | ----- | --------------------------------- |
| POST   | `/`           | USER  | Create booking (see flow below)   |
| GET    | `/me`         | USER  | Own bookings                      |
| DELETE | `/:id`        | USER  | Cancel own booking                |
| PUT    | `/:id`        | USER  | Update own booking (time/slot)    |
| GET    | `/`           | ADMIN | All bookings                      |
| GET    | `/:id`        | ADMIN | Single booking                    |
| PUT    | `/:id/admin`  | ADMIN | Admin update                      |
| PUT    | `/:id/status` | ADMIN | Force status change               |
| DELETE | `/:id/admin`  | ADMIN | Delete (only COMPLETED/CANCELLED) |

**Create booking body:**

```json
{
  "vehicleId": "cuid",
  "parkingSlotId": "cuid",
  "parkingLotId": "cuid",
  "startTime": "2025-05-01T08:00:00Z",
  "endTime": "2025-05-01T10:00:00Z",
  "paymentMethod": "CASH"
}
```

> `VNPAY` is currently disabled. Use `CASH` only.

**Booking status enum:** `PENDING_PAYMENT` → `CONFIRMED` → `COMPLETED` | `CANCELLED`

**What happens on `POST /bookings` (CASH):**

1. Slot status → `RESERVED`
2. Booking created with status `CONFIRMED`
3. Payment record created with status `PENDING`, linked to booking

**What happens on `DELETE /bookings/:id` (cancel):**

1. Booking → `CANCELLED`
2. Slot → `AVAILABLE`
3. Payment → `FAILED`

---

### 🅿️ Parking Records — `/api/records`

| Method | Route           | Role  | Body / Notes                 |
| ------ | --------------- | ----- | ---------------------------- |
| POST   | `/checkin`      | USER  | Check in (walk-in or booked) |
| PUT    | `/:id/checkout` | USER  | Check out + cost calculated  |
| GET    | `/me`           | USER  | Own parking history          |
| GET    | `/`             | ADMIN | All records                  |

**Check-in body:**

```json
{
  "vehicleId": "cuid",
  "parkingSlotId": "cuid",
  "parkingLotId": "cuid",
  "bookingId": "cuid (optional — omit for walk-in)"
}
```

**Check-out body:**

```json
{
  "paymentMethod": "CASH"
}
```

**Check-in rules:**

- Walk-in (no `bookingId`): slot must be `AVAILABLE`
- Pre-booked (`bookingId` provided): slot must be `RESERVED`, booking must be `CONFIRMED`
- After check-in: slot → `OCCUPIED`

**After check-out:**

- Actual cost calculated from real time delta × hourly rate
- Slot → `AVAILABLE`
- Payment → `SUCCESS`

---

### 💳 Payments — `/api/payments`

| Method | Route           | Role      | Notes                                       |
| ------ | --------------- | --------- | ------------------------------------------- |
| GET    | `/me`           | USER      | Own payments                                |
| GET    | `/`             | ADMIN     | All payments                                |
| GET    | `/user/:userId` | ADMIN     | Payments by user                            |
| GET    | `/:id`          | ADMIN     | Single payment                              |
| POST   | `/`             | ADMIN     | Manual payment entry                        |
| PUT    | `/:id/status`   | ADMIN     | `{ status: "SUCCESS"/"FAILED"/"REFUNDED" }` |
| GET    | `/vnpay-ipn`    | 🌐 PUBLIC | VNPay webhook (no auth)                     |

**Payment status flow:** `PENDING → SUCCESS → REFUNDED` | `PENDING → FAILED`

**Payment method enum:** `CASH` | `VNPAY`

> Payments are **auto-created** when a booking is made or a monthly pass is purchased. Admin can create manual entries for cash reconciliation.

---

### 🎫 Monthly Passes — `/api/monthly-passes`

| Method | Route         | Role  | Body                                  |
| ------ | ------------- | ----- | ------------------------------------- |
| POST   | `/`           | USER  | `{ vehicleType, startDate, endDate }` |
| GET    | `/me`         | USER  | Own passes                            |
| PUT    | `/:id/renew`  | USER  | `{ endDate }`                         |
| DELETE | `/:id`        | USER  | Cancel own pass                       |
| GET    | `/`           | ADMIN | All passes                            |
| PUT    | `/price`      | ADMIN | `{ vehicleType, price }`              |
| PUT    | `/:id/status` | ADMIN | `{ status }`                          |

**Pass status enum:** `ACTIVE` | `EXPIRED` | `CANCELLED`

---

## Data Models (Key Fields)

### User

```ts
{ id, email, fullName, phone, role: "ADMIN"|"USER", createdAt }
```

### Vehicle

```ts
{ id, userId, plateNumber, vehicleType: "CAR"|"MOTORBIKE", color }
```

### ParkingLot

```ts
{
  (id, name, address, totalSlots, lotType, carHourlyRate, motorbikeHourlyRate, zones);
}
```

### ParkingSlot

```ts
{ id, parkingLotId, zoneId, slotNumber, vehicleType, status: "AVAILABLE"|"RESERVED"|"OCCUPIED"|"MAINTENANCE" }
```

### Booking

```ts
{
  id, userId, vehicleId, parkingSlotId, parkingLotId,
  startTime, endTime, estimatedCost,
  status: "PENDING_PAYMENT"|"CONFIRMED"|"COMPLETED"|"CANCELLED"
}
```

### Payment

```ts
{
  id, userId, bookingId?, monthlyPassId?, parkingRecordId?,
  amount, method: "CASH"|"VNPAY",
  status: "PENDING"|"SUCCESS"|"FAILED"|"REFUNDED",
  referenceId?
}
```

### ParkingRecord

```ts
{
  id, userId, vehicleId, parkingLotId, parkingSlotId, bookingId?,
  checkInTime, checkOutTime?, actualCost,
  paymentStatus: "PENDING"|"SUCCESS"|"FAILED"|"REFUNDED",
  status: "CHECKED_IN"|"CHECKED_OUT"
}
```

### MonthlyPass

```ts
{ id, userId, vehicleType, startDate, endDate, price, status: "ACTIVE"|"EXPIRED"|"CANCELLED" }
```

---

## CORS Configuration

Backend allows these origins by default:

```
http://localhost:3001
http://127.0.0.1:3001
process.env.FRONTEND_URL
```

> Run your frontend on port **3001**, or add your dev URL to `FRONTEND_URL` in the backend `.env`.

All requests that use cookies must include `credentials: 'include'`.

---

## Common Frontend Patterns

**Axios setup:**

```js
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // for cookie auth
});
```

**Fetch setup:**

```js
fetch("/api/...", {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
});
```

**Error handling pattern:**

```js
const res = await api.post("/bookings", payload);
if (res.data.status === "error") {
  showToast(res.data.message); // always a human-readable string
}
```

---

## Suggested Page Structure

| Page               | Role   | Key API calls                                    |
| ------------------ | ------ | ------------------------------------------------ |
| Login / Register   | Public | `POST /auth/login`, `POST /auth/register`        |
| Dashboard          | All    | `GET /auth/me`                                   |
| Browse Lots        | All    | `GET /parking-lots`, `GET /parking-slots/:lotId` |
| Make Booking       | USER   | `POST /bookings`                                 |
| My Bookings        | USER   | `GET /bookings/me`                               |
| Check In           | USER   | `POST /records/checkin`                          |
| Check Out          | USER   | `PUT /records/:id/checkout`                      |
| My Payments        | USER   | `GET /payments/me`                               |
| My Passes          | USER   | `GET /monthly-passes/me`                         |
| Admin Dashboard    | ADMIN  | `GET /users`, `GET /bookings`, `GET /payments`   |
| Admin Parking Mgmt | ADMIN  | `GET /parking-lots`, `POST /parking-slots`       |

---

## Notes for the AI Agent

1. **IDs are CUIDs** — always treat them as opaque strings, never numbers.
2. **Monetary values** are `Decimal(10,2)` from Prisma — they come as strings in JSON (e.g. `"25.50"`). Parse with `parseFloat()` for display.
3. **Dates** are ISO 8601 strings. Always send times in UTC (`toISOString()`).
4. **The slot `:id` in `GET /parking-slots/:id` is the parking LOT id**, not a slot id. It returns all slots for that lot.
5. **Do not create new payments manually** — they are auto-created by the backend on booking/pass purchase. The `POST /payments` is for admin cash reconciliation only.
6. **VNPay is disabled** — do not build VNPay UI flows. Only `CASH` is active.
7. **Monthly pass check-in** — when a user with an active monthly pass checks in, they pass `monthlyPassId` to associate the parking record with the pass.
