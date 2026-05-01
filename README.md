# Parking Management System - Frontend

Frontend repo: `https://github.com/sonsocoding/ParkingManagement-FE`  
Backend repo: `https://github.com/sonsocoding/ParkingManagement-BE`

This repository contains the frontend for my parking management project. Its job is to make the backend workflows usable through a cleaner interface for both users and admins.

## Overview

- Provides login and registration pages
- Shows different flows for normal users and admins
- Connects to the backend with `axios`
- Supports bookings, vehicles, payments, monthly passes, and parking history
- Handles the VNPay return flow
- Includes admin pages for users, lots, bookings, payments, and slot monitoring

## 🛠️ Tech Stack

- `React`
- `Vite`
- `React Router`
- `Axios`
- `CSS`
- `Lucide React`

## 📚 What I Learned

- Structuring a React app into pages, layout components, hooks, context, and API services
- Managing authentication state and protected routes
- Handling loading, error, refresh, and redirect states
- Connecting UI screens to real backend endpoints
- Building separate user and admin experiences
- Translating backend business rules into UI behavior

## 💡 Skills This Repo Shows

- Frontend architecture
- API integration
- State handling with React hooks and context
- Route protection
- Dashboard and management UI
- Workflow-focused UX thinking

## 🚀 Key Features

- User dashboard
- Browse parking lots and lot details
- Vehicle management
- My bookings, payments, and parking history
- Monthly pass purchase and renewal
- VNPay return page
- Admin dashboards for users, lots, bookings, payments, and live slot monitoring

## ▶️ How To Run

```bash
npm install
npm run dev
```

Create a `.env.local` or `.env` file:

```bash
VITE_API_URL=http://localhost:3000/api
```

The frontend expects the backend repo to be running separately on `http://localhost:3000`.

## 🔧 What I Would Improve Next

- Add more reusable UI primitives
- Add stronger client-side validation
- Improve responsive behavior and accessibility
- Add automated frontend tests
- Add richer analytics and visualization for the admin area

## 📝 Project Note

This frontend is one half of a two-repository project. The backend lives in a separate repo and contains the deeper technical logic of the system.
