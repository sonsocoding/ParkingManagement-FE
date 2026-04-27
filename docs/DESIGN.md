# Smart Parking OS - Frontend Design Guide

**Version:** 2.0 | **Last Updated:** April 27, 2026

---

## Tech Stack

- **React 19.2.5** + **React Router 7.14.2** + **Vite 8.0.10**
- **Axios 1.15.2** (API) + **Lucide React 1.9.0** (Icons)
- **Dev Server:** Port 5173
- **API Base:** `VITE_API_URL` env var (default: `http://localhost:3000/api`)

---

## Architecture Principles

**Clean Architecture with Layer Separation:**

Components (UI only) → Hooks (Logic) → Services (API) → CSS (Styles)


1. **Components are dumb** - Only render UI, no business logic
2. **Hooks contain logic** - Data fetching, transformations, state
3. **Services handle API** - All HTTP requests via `src/api/index.js`
4. **CSS is separated** - No inline styles, use CSS files in `src/styles/`

---

## Project Structure

src/ ├── api/ # API services (authService, userService, etc.) │ ├── axiosClient.js # Axios config with interceptors │ └── index.js # All service exports ├── components/ │ ├── layout/ # AppLayout, Sidebar, TopBar │ └── shared/ # StatCard, etc. ├── context/ # AuthContext (global auth state) ├── pages/ │ ├── auth/ # LoginPage, RegisterPage │ ├── user/ # User pages + components/ + hooks/ │ └── admin/ # Admin pages ├── styles/ # Mirrors component structure │ ├── components/ │ └── pages/ ├── utils/ # formatters.js, etc. ├── App.jsx # Routes ├── main.jsx # Entry point └── index.css # Design system (CSS variables)


---

## Design System (src/index.css)

**NEVER hardcode values - always use CSS variables!**

### Colors
```css
--color-primary: #1A237E              /* Brand indigo */
--color-primary-bg: #E8EAF6
--surface-page: #FAFAFA
--surface-card: #FFFFFF
--text-primary: #1a1c1c
--text-secondary: #5f6368
--border-light: #E0E0E0
Status Colors (CRITICAL - Use Exact Values)
--color-available: #43A047            /* Green - available/confirmed */
--color-occupied: #E53935             /* Red - occupied/cancelled */
--color-reserved: #FB8C00             /* Orange - reserved/pending */
--color-maintenance: #78909C          /* Grey - maintenance */
--color-completed: #1565C0            /* Blue - completed */
Typography
--font-display: 'Manrope'             /* Headings */
--font-body: 'Inter'                  /* Body text */
Classes: .display-lg, .headline-md, .title-md, .body-md, .label-sm

Spacing
--space-sm: 8px
--space-md: 12px
--space-lg: 16px
--space-xl: 24px
--space-2xl: 32px
Radius & Shadows
--radius-md: 8px                      /* Inputs/buttons */
--radius-lg: 12px                     /* Cards */
--shadow-sm: ...                      /* Buttons */
--shadow-md: ...                      /* Cards */
Component Patterns
Buttons
<button className="btn btn-primary">Save</button>
<button className="btn btn-secondary">Cancel</button>
<button className="btn btn-ghost">Skip</button>
<button className="btn-icon"><Settings size={20} /></button>
Forms
<div className="form-group">
  <label className="form-label">Email</label>
  <input className="form-input" type="email" />
</div>
Status Badges
<span className="badge badge-available">Available</span>
<span className="badge badge-occupied">Occupied</span>
<span className="badge badge-pending">Pending</span>
Cards & Tables
<div className="card">Content</div>
<table className="data-table">...</table>
Empty States
<div className="empty-state">
  <PackageX size={48} />
  <h3>No data found</h3>
  <p>Description text</p>
</div>
State Management
Global Auth (AuthContext)
import { useAuth } from '../context/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();
Feature State (Custom Hooks)
// src/pages/user/hooks/useUserDashboard.js
export function useUserDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch & transform data
  }, []);
  
  return { data, loading };
}
API Integration
Services (src/api/index.js)
import { bookingService, lotService, vehicleService } from '../api/index';

const bookings = await bookingService.getMyBookings();
const lots = await lotService.getAllLots();
Available Services:

authService, userService, vehicleService, lotService
slotService, bookingService, recordService, paymentService, passService
Axios Config
Base URL from VITE_API_URL
withCredentials: true (cookie auth)
Auto-unwraps response.data
Routing
Public: /login, /register

User: /dashboard, /parking-lots, /my-bookings, /my-vehicles, /parking-history, /my-payments, /monthly-passes

Admin: /admin/dashboard, /admin/users, /admin/lots, /admin/bookings, /admin/payments, /admin/monitoring

Protection: Routes wrapped in <AppLayout /> check isAuthenticated

Styling Rules
Every component has a CSS file in src/styles/ mirroring its location
Import CSS last in component file
Use BEM-style naming: .component-name, .component-name-element
Use utility classes: .flex, .items-center, .gap-md, .w-full
Avoid inline styles except for dynamic values (e.g., width: ${progress}%)
Code Conventions
Component Structure
// 1. Imports (React → libraries → components → hooks → services → CSS)
import { useState } from 'react';
import { Car } from 'lucide-react';
import { vehicleService } from '../../api/index';
import '../../styles/pages/user/MyVehicles.css';

// 2. Component
export default function MyVehicles() {
  const [data, setData] = useState([]);
  
  if (loading) return <div>Loading...</div>;
  
  return <div className="my-vehicles">{/* JSX */}</div>;
}
Naming
Components: PascalCase (UserDashboard.jsx)
Hooks: camelCase with use prefix (useUserDashboard.js)
CSS: Match component name (UserDashboard.css)
Critical Rules for AI Agents
❌ NEVER
Mix CSS into JSX (no inline styles for layout/colors)
Write business logic in JSX return blocks
Hardcode colors/fonts/spacing (use CSS variables)
Use different status colors than defined
Bypass service layer for API calls
✅ ALWAYS
Create CSS file in src/styles/ for every component
Extract logic into custom hooks in src/pages/[feature]/hooks/
Use existing CSS variables from 
index.css
Handle loading/error states
Use isMounted flag in useEffect cleanup
Keep components under ~100 lines (extract sub-components)
Check for existing utilities before creating new CSS
Before Changing Code
Read existing code in the feature
Check 
index.css
 for variables/utilities
Verify file structure matches conventions
Ensure change doesn't break patterns