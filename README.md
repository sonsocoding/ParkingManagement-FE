# Parking Management System - Frontend

This repository contains the frontend for my parking management project. I built it to practice creating a complete user interface on top of a real backend, with both user and admin workflows.

## What This Frontend Does

- Provides login and registration pages
- Shows different flows for normal users and admins
- Connects to the backend with `axios`
- Supports booking, vehicle management, payment tracking, monthly passes, and parking history
- Includes VNPay return handling and payment result feedback
- Includes an admin dashboard for users, lots, bookings, payments, and slot monitoring

## Tech Stack

- React
- Vite
- React Router
- Axios
- CSS
- Lucide React

## What I Learned

- Structuring a React app by pages, shared layout components, hooks, and API services
- Managing authentication state and protected routes
- Connecting frontend screens to real backend APIs
- Handling async UI states like loading, error, refresh, and redirect flows
- Building role-based navigation for different types of users
- Designing interfaces that reflect business rules from the backend

## Skills This Repo Shows

- Frontend architecture
- API integration
- State handling with React hooks and context
- Route protection
- Admin dashboard UI
- UX thinking for real workflows

## Key Features

- User dashboard
- Browse parking lots and lot details
- Vehicle management
- My bookings, payments, and parking history
- Monthly pass purchase and renewal
- VNPay return page
- Admin dashboards for users, lots, bookings, payments, and live slot monitoring

## How To Run

```bash
npm install
npm run dev
```

Create a `.env.local` or `.env` file:

```bash
VITE_API_URL=http://localhost:3000/api
```

The frontend expects the backend repo to be running separately on `http://localhost:3000`.

## What I Would Improve Next

- Add reusable UI primitives to reduce repeated page logic
- Add form libraries and stronger client-side validation
- Improve responsive behavior and accessibility
- Add automated frontend tests
- Add charts or richer analytics for the admin area

## Project Note

This frontend is one half of a two-repository project. The backend lives in a separate repo and provides authentication, parking, booking, and payment APIs.
