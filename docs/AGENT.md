# Smart Parking OS - Agent Context & Development Flow

This document provides high-level context for AI agents working on the Smart Parking OS frontend. It explains the core purpose of the application, user workflows, and the current development phase strategy.

## 1. Project Goal
The Smart Parking OS is a responsive, web-based platform designed to manage parking operations. It serves both consumers (drivers booking spots) and enterprise staff (managers and admins overseeing operations).

## 2. Current Development Strategy: API-Backed UI

The frontend is no longer mock-only.
- **Real API Calls:** Use the service layer in `src/api/index.js` and hooks in `src/hooks/useApi.js`
- **Preserve UX Quality:** Keep the polished UI approach, but make changes match the live backend contract
- **Respect Backend States:** Booking, payment, and monthly pass statuses come from the backend and should not be faked in the UI
- **VNPay Redirect Flow:** Booking creation and monthly pass purchase/renewal may return a `paymentUrl`; the frontend should redirect the browser to VNPay and handle the return at `/payments/vnpay-return`

## 3. Core Workflows & User Roles

The application relies on role-based access control. Currently, roles can be simulated via the Dev Tool in the TopBar.

### 3.1. Consumer Flow (`USER`)
- **Dashboard (`/dashboard`):** High-level overview of active bookings, currently checked-in vehicles, and quick action shortcuts.
- **Browse & Book (`/parking-lots` -> `/parking-lots/:id`):** Users view available parking lots, check hourly rates/capacity, and initiate a booking.
- **Manage Entities (`/my-vehicles`, `/my-bookings`):** Users add/edit license plates and track their current, upcoming, or past bookings.
- **Payments (`/my-payments`):** Users view payment history and VNPay outcomes.
- **VNPay Return (`/payments/vnpay-return`):** Public result page that verifies VNPay return data through the backend.

### 3.2. Enterprise Flow (`ADMIN`)
- **Admin Dashboard (`/admin/dashboard`):** Global analytics on revenue, occupancy rates, and active parking sessions.
- **Operational Management (`/admin/lots`, `/admin/bookings`):** Add/edit parking lots, manually adjust booking statuses, and manage slots.
- **User Management (`/admin/users`):** Administer user accounts, permissions, and staff monitoring.

## 4. Development Workflow for Agents
When tasked with creating a new feature, page, or flow:
1. **Check `DESIGN.md`:** Ensure your UI and architectural decisions align with the established design tokens and folder structures.
2. **Check Existing Services/Hooks:** Extend `src/api/index.js` and `src/hooks/useApi.js` only when needed.
3. **Build the UI:** Create or update the view in `src/pages/` and abstract any complex elements into the local `components/` folder.
4. **Style it:** Update the matching `.css` file in `src/styles/` following the existing class naming conventions and global CSS variables.

## 5. Backend Contract Notes

- The backend returns `paymentUrl` for VNPay booking creation and monthly pass VNPay flows
- The backend verifies gateway return data at `GET /api/payments/vnpay-return`
- The final source of truth for payment success is still the VNPay IPN handled by the backend
