# 🅿️ Parking Management System — Backend

A production-grade REST API for a smart parking management system. Built with Node.js, Express 5, and PostgreSQL via Prisma ORM — featuring role-based access control, transactional business logic, and third-party payment integration.

## Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Runtime    | Node.js (ESM)                        |
| Framework  | Express 5                            |
| Database   | PostgreSQL + Prisma ORM              |
| Auth       | JWT (HttpOnly cookie + Bearer token) |
| Validation | Zod                                  |
| Payment    | VNPay IPN webhook                    |

## Architecture Highlights

- **Role-Based Access Control** — two roles (`ADMIN`, `USER`) enforced per route via composable middleware chain: `authenticate → authorize → validate → controller`
- **Atomic Transactions** — all multi-step state changes (booking creation, slot reservation, checkout settlement, VNPay confirmation/expiration) are wrapped in `prisma.$transaction()` to prevent race conditions and data corruption
- **State Machine Guards** — explicit allowed-transition maps for `Booking` (`PENDING_PAYMENT → CONFIRMED → COMPLETED`) and `Payment` (`PENDING → SUCCESS/FAILED`, `SUCCESS → REFUNDED`) prevent illegal state jumps
- **Global Error Handler** — maps Prisma error codes (P2002, P2025, P2003) to correct HTTP status codes with clean `{ status, message }` response shape
- **Data Integrity Guards** — runtime safety checks prevent cascade deletion of active bookings, occupied slots, and financial records

## API Modules (9 modules, 40+ endpoints)

| Module          | Base Route            | Key Features                                         |
| --------------- | --------------------- | ---------------------------------------------------- |
| Auth            | `/api/auth`           | Register, login, logout, session via JWT cookie      |
| Users           | `/api/users`          | Profile management, admin CRUD                       |
| Vehicles        | `/api/vehicles`       | User vehicle registry (CAR / MOTORBIKE)              |
| Parking Lots    | `/api/parking-lots`   | Lot management with zone config & hourly rates       |
| Parking Slots   | `/api/parking-slots`  | Bulk slot creation, status management                |
| Bookings        | `/api/bookings`       | Full booking lifecycle with cost estimation          |
| Parking Records | `/api/records`        | Walk-in check-in/out with real-time cost calculation |
| Payments        | `/api/payments`       | Multi-method payments (CASH / VNPay) + IPN webhook   |
| Monthly Passes  | `/api/monthly-passes` | Subscription pass management with renewal            |

## Business Logic Flows

**Booking Flow (CASH)**

```
User creates booking → slot reserved → booking CONFIRMED
User checks in → slot OCCUPIED → ParkingRecord CHECKED_IN
User checks out → actual cost calculated → cash payment created (SUCCESS) → booking COMPLETED → slot AVAILABLE
```

**VNPay Payment Flow**

```
Booking created with PENDING_PAYMENT → VNPay payment row created (PENDING)
→ IPN success confirms payment + booking CONFIRMED
→ IPN failure or 15-minute expiry marks payment FAILED, cancels booking, releases slot
```

**Monthly Pass VNPay Flow**

```
Pass purchase created with PENDING_PAYMENT → VNPay payment URL returned
→ IPN success activates pass (or applies renewal)
→ IPN failure / expiry fails payment and cancels pending pass purchase
```

## Getting Started

```bash
npm install
# configure .env: DATABASE_URL, JWT_SECRET, FRONTEND_URL, BACKEND_URL,
# VNPAY_TMN_CODE, VNPAY_SECURE_SECRET, VNPAY_RETURN_URL
npx prisma migrate dev
npm run seed     # seed admin/user + sample data
npm run dev
```

## VNPay Sandbox Notes

- Set your VNPay sandbox `Return URL` to `VNPAY_RETURN_URL`
- If you are using the Vite frontend in this repo, that should normally be `http://localhost:5173/payments/vnpay-return`
- Point VNPay sandbox `IPN URL` to `GET /api/payments/vnpay-ipn` on your backend
- Booking creation with `"paymentMethod": "VNPAY"` now returns `paymentUrl`
- Monthly pass purchase and renewal also accept `"paymentMethod": "VNPAY"` and return `paymentUrl`
- A public verifier endpoint is available at `GET /api/payments/vnpay-return`

## Project Structure

```
src/
├── controllers/   # business logic (9 modules)
├── jobs/          # background cleanup jobs (e.g. stale VNPay expiration)
├── routes/        # express routers with middleware chain
├── middleware/    # authenticate, authorize, validate, errorHandler
├── schemas/       # Zod validation schemas
├── utils/         # asyncHandler, formatResponse
└── config/        # Prisma client singleton
prisma/
├── schema.prisma  # Prisma models + enums
└── seed.js        # full-flow seed data
```
