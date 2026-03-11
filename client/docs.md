# Client Documentation

This document provides a comprehensive overview of the client-side application structure, key directories, and component hierarchy. It is intended to be a living document, updated as the application evolves.

## Project Structure

The frontend application is built using React (Vite) and Tailwind CSS. The source code is located in `client/src/`.

### Root Directory (`client/src/`)

| File/Directory | Description |
| :--- | :--- |
| `App.jsx` | Main application entry point. Defines the routing configuration and wraps the app with necessary contexts. |
| `main.jsx` | Bootstraps the React application and mounts it to the DOM. |
| `index.css` | Global styles, including Tailwind CSS directives and base resets. |
| `assets/` | Static media assets (images, icons, etc.). |
| `lib/` | Utility functions and helper libraries (e.g., `utils.js` for class merging). |

## Directory Details

### 1. Components (`src/components/`)
Reusable UI building blocks are organized here.

*   **`common/`**: Low-level, generic components used throughout the application.
    *   `Button.jsx`: Standard button component with variants.
    *   `Card.jsx`: Container component with Header, Title, and Content sub-components.
    *   `Input.jsx`: Standard text input field.
    *   `Badge.jsx`: Status indicators and tags.
*   **`layout/`**: Components specifically designed for application layout.
    *   `Header.jsx`: Top navigation bar containing user profile and global actions.
    *   `Sidebar.jsx`: Main navigation menu with role-based links.
    *   `PageTransition.jsx`: Wrapper for animating page route changes.
*   **`forms/`**: Complex form components or form-related utilities (currently initializing).

### 2. Context (`src/context/`)
React Context Providers for global state management.

*   **`AuthContext.jsx`**: Manages authentication state (login, logout, user roles). Currently uses mock authentication for development.
*   **`PatientContext.jsx`**: Centralized store for patient data, allowing sharing of patient records between Reception, Doctor, and Billing modules.

### 3. Layouts (`src/layouts/`)
High-level layout wrappers.

*   **`DashboardLayout.jsx`**: The primary layout structure for logged-in users. It composes the `Sidebar`, `Header`, and the main content area (`<Outlet />`). It ensures a consistent look across all dashboard pages.

### 4. Pages (`src/pages/`)
Application views mapped to specific routes, organized by functional domain or user role.

*   **`public/`**: Publicly accessible pages.
    *   `Login.jsx`: User authentication screen.
*   **`admin/`**: Views for the Super Admin.
    *   `Dashboard.jsx`: High-level statistics and hospital oversight.
*   **`doctor/`**: Views for Doctors.
    *   `Dashboard.jsx`: Appointment queue and quick actions.
*   **`hospital/`**: General hospital operations.
    *   `Reception.jsx`: Patient registration and file management.
    *   `Prescription.jsx`: Digital prescription entry.
    *   `HospitalMaster.jsx`: Hospital configuration and settings.
*   **`lab/`**: Laboratory management.
    *   `Dashboard.jsx`: Lab overview and pending tests.
    *   `TestEntry.jsx`: Interface for recording test results.
    *   `TestMaster.jsx`: Configuration of available lab tests and pricing.
*   **`pharmacy/`**: Pharmacy inventory management.
    *   `Dashboard.jsx`: Stock overview and sales trends.
    *   `StockEntry.jsx`: Interface for adding and managing medicine stock.
*   **`pharmacy-billing/`**:
    *   `Billing.jsx`: POS system for generating medicine bills.
*   **`Dashboard.jsx`**: Route switcher that redirects users to their specific role-based dashboard upon login.
*   **`PlaceholderPage.jsx`**: Generic "Coming Soon" page for features under development.

## Key Features & Workflows

1.  **Role-Based Access**:
    *   The `AuthContext` determines the current user's role (Admin, Doctor, Lab, Pharmacy).
    *   `Sidebar` dynamically renders links based on these permissions.
    *   `Dashboard.jsx` routes the root `/` path to the appropriate role-specific dashboard.

2.  **Patient Flow**:
    *   **Reception**: Registers a patient in `Reception.jsx`. Data is saved to `PatientContext`.
    *   **Doctor**: Can look up patients (simulated) and write prescriptions in `Prescription.jsx`.
    *   **Pharmacy/Lab**: Can search for patients by ID to generate bills or enter test results.

3.  **UI/UX Standards**:
    *   **Design System**: All pages use Tailwind CSS for styling.
    *   **Transitions**: `PageTransition` component provides smooth entry animations for every route.
    *   **Consistency**: All major inputs and buttons use the `common` components to maintain distinct visual identity.

## Development Note
*   **Mock Data**: Currently, most modules use local state or mock arrays (like `inventory` in Pharmacy or `patients` in Context) to simulate a database.
*   **Backend**: The backend is currently decoupled/mocked. All API calls are simulated within the services or components.

---
*Last Updated: 2026-01-08*
