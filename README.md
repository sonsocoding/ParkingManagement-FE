# Parking Management System - Frontend

Frontend repo: `https://github.com/sonsocoding/ParkingManagement-FE`  
Backend repo: `https://github.com/sonsocoding/ParkingManagement-BE`

This repository contains the frontend for my parking management project. Its job is to make the backend workflows usable through a cleaner interface for both users and admins, while reflecting important backend rules like **booking state control** and **race condition protection**.

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

## Key Features

- User dashboard
- Browse parking lots and lot details
- Vehicle management
- My bookings, payments, and parking history
- Monthly pass purchase and renewal
- VNPay return page
- Admin dashboards for users, lots, bookings, payments, and live slot monitoring
- **UI flows aligned with backend rules**, including booking status changes and **race condition protection** around slot availability

## Folder Structure

```text
frontend/
├── docs/
│   ├── DESIGN.md
│   └── agents/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── README.md
```

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

## What This Project Shows

- **Frontend structure** with pages, components, hooks, context, and API services
- **Protected routing and auth state** for user and admin experiences
- **API integration** across booking, vehicle, payment, and monthly pass flows
- **Workflow-driven UI thinking** that reflects backend constraints instead of only showing forms
- **Practical coordination with backend logic**, especially payment flow handling and **race condition-aware booking behavior**

## Next Improvements

- Add more reusable UI primitives
- Add stronger client-side validation
- Improve responsive behavior and accessibility
- Add automated frontend tests
- Add richer analytics and visualization for the admin area
