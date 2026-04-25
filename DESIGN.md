# Smart Parking OS - Frontend Design System & Architecture

This document serves as the foundational guide for the Smart Parking OS frontend. Any AI model or developer working on this project must strictly adhere to these guidelines to ensure consistency, maintainability, and visual coherence.

## 1. Architectural Philosophy

The frontend follows **Clean Architecture** principles to separate UI components from business logic and styling.

- **Component Layer (`src/components/`, `src/pages/*/components/`)**: Pure UI components. They should be "dumb" and only handle rendering and local UI state.
- **Logic Layer (`src/pages/*/hooks/`)**: Custom React hooks are used to isolate business logic, data fetching, and data transformation.
- **Style Layer (`src/styles/`)**: All CSS files are strictly separated from JSX files. The directory structure inside `src/styles/` mirrors the structure of `src/components/` and `src/pages/`. Do not use inline styles for structural or primary design properties.

## 2. Directory Structure

```text
src/
├── components/       # Shared and global UI components (Layout, StatCard)
├── context/          # React Context providers (AuthContext)
├── data/             # Mock data / sample data
├── pages/            # Feature-specific modules (auth, user, admin)
│   └── [feature]/
│       ├── components/  # Feature-specific UI components
│       ├── hooks/       # Feature-specific business logic
│       └── [Page].jsx   # Page container assembling hooks and components
└── styles/           # Centralized CSS, mirroring component/page paths
```

## 3. Design System (Airbnb-Inspired)

We use a modern, clean, consumer-focused design system defined globally in `src/index.css`. All new CSS must use these CSS variables instead of hardcoded values.

### 3.1. Typography
- **Headings (`--font-display`)**: `Manrope` (Weights: 500, 600, 700, 800)
- **Body (`--font-body`)**: `Inter` (Weights: 400, 500, 600, 700)
- Always use utility classes where applicable: `.display-lg`, `.headline-md`, `.title-md`, `.body-md`, `.label-sm`.

### 3.2. Color Palette
- **Primary Brand**: 
  - Base: `#1A237E` (`--color-primary`)
  - Background: `#E8EAF6` (`--color-primary-bg`)
- **Surfaces**:
  - Page Background: `#FAFAFA` (`--surface-page`)
  - Card/Modal: `#FFFFFF` (`--surface-card`)
- **Text**:
  - Primary: `#1a1c1c` (`--text-primary`)
  - Secondary: `#5f6368` (`--text-secondary`)
  - Tertiary: `#9AA0A6` (`--text-tertiary`)

### 3.3. Semantic Colors (Parking & Booking Status)
Strictly adhere to these colors for states:
- **Available / Confirmed / Success**: Green (`#43A047`)
- **Occupied / Cancelled / Failed**: Red (`#E53935`)
- **Reserved / Pending**: Orange (`#FB8C00`)
- **Completed**: Blue (`#1565C0`)
- **Maintenance / Expired**: Blue-Grey (`#78909C`)

*Note: Use the pre-defined `.badge` classes for status indicators (e.g., `.badge-available`, `.badge-occupied`).*

### 3.4. Shadows & Radii
- **Border Radius**: Use rounded, soft corners. Default to `--radius-md` (8px) for inputs/buttons and `--radius-lg` (12px) for cards.
- **Shadows**: Use `--shadow-sm` for buttons and `--shadow-md` for cards/hover states. Avoid harsh borders; rely on shadows for elevation.

## 4. UI Components & Best Practices

- **Buttons**: Use `.btn` with modifiers like `.btn-primary`, `.btn-secondary`, `.btn-ghost`. Never style `button` tags directly without classes.
- **Forms**: Wrap inputs in `.form-group`. Use `.form-label`, `.form-input`, and `.form-select`.
- **Empty States**: For empty lists or missing data, use the `.empty-state` class structure with a Lucide icon and helper text.
- **Icons**: Use `lucide-react`. Ensure icons have consistent sizing (usually `size={20}` for actions, `size={24}` for highlights).
- **Responsive Layout**: Use flexbox/grid utilities defined in `src/index.css` (e.g., `.flex`, `.items-center`, `.gap-md`).

## 5. Instructions for Future AI Models
1. **Never** mix CSS into JSX files. Create or update the corresponding `.css` file in `src/styles/`.
2. **Never** write data manipulation logic inside the page's JSX return block. Abstract it into a `use[Feature]` hook.
3. **Always** check `src/index.css` for existing CSS variables before introducing new hex codes or font sizes.
4. Keep UI components small. If a `render` function grows past ~60 lines, extract a sub-component into the `components/` subfolder.
