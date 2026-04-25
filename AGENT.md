# Smart Parking OS - Agent Context & Development Flow

This document provides high-level context for AI agents working on the Smart Parking OS frontend. It explains the core purpose of the application, user workflows, and the current development phase strategy.

## 1. Project Goal
The Smart Parking OS is a responsive, web-based platform designed to manage parking operations. It serves both consumers (drivers booking spots) and enterprise staff (managers and admins overseeing operations).

## 2. Current Development Strategy: Design-First
**CRITICAL RULE: DESIGN BEFORE API INTEGRATION.**

We are currently in a UI/UX-first development phase.
- **No Real API Calls:** Do not wire up `fetch`, `axios`, or backend services yet.
- **Use Sample Data:** Rely entirely on the mock data located in `src/data/sampleData.js`.
- **Focus on Aesthetics:** The primary goal is to build out a stunning, Airbnb-inspired, fully functional UI using React, maintaining the strict separation of concerns (hooks for logic, separate CSS for styling). 
- **Mock State Transitions:** Simulate API latency or state changes (like confirming a booking) using `setTimeout` and local React state or Context.

## 3. Core Workflows & User Roles

The application relies on role-based access control. Currently, roles can be simulated via the Dev Tool in the TopBar.

### 3.1. Consumer Flow (`USER`)
- **Dashboard (`/dashboard`):** High-level overview of active bookings, currently checked-in vehicles, and quick action shortcuts.
- **Browse & Book (`/parking-lots` -> `/parking-lots/:id`):** Users view available parking lots, check hourly rates/capacity, and initiate a booking.
- **Manage Entities (`/my-vehicles`, `/my-bookings`):** Users add/edit license plates and track their current, upcoming, or past bookings.
- **Payments (`/my-payments`):** Users simulate paying for confirmed bookings (e.g., using CASH or simulated VNPay).

### 3.2. Enterprise Flow (`ADMIN`)
- **Admin Dashboard (`/admin/dashboard`):** Global analytics on revenue, occupancy rates, and active parking sessions.
- **Operational Management (`/admin/lots`, `/admin/bookings`):** Add/edit parking lots, manually adjust booking statuses, and manage slots.
- **User Management (`/admin/users`):** Administer user accounts, permissions, and staff monitoring.

## 4. Development Workflow for Agents
When tasked with creating a new feature, page, or flow:
1. **Check `DESIGN.md`:** Ensure your UI and architectural decisions align with the established design tokens and folder structures.
2. **Update Mock Data:** If the feature requires new state, update `src/data/sampleData.js` first.
3. **Build the Hook:** Create a custom hook (e.g., `use[Feature].js`) in the `hooks/` directory to expose and manipulate this mock data.
4. **Build the UI:** Create the view in `src/pages/` and abstract any complex elements into the local `components/` folder.
5. **Style it:** Create a matching `.css` file in `src/styles/` following the existing class naming conventions and use global CSS variables.

## 5. Future API Integration (Phase 2)
Do not proceed to this phase until the user explicitly requests it.
Once the UI is perfectly polished and user flows are verified with mock data, the project will transition to Phase 2. At that point, the custom hooks will simply be updated to swap out the mock data with actual HTTP requests, targeting the backend endpoints documented in `docs/BE-AGENT.md`.
