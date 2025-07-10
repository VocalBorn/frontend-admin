# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - TypeScript compilation + Vite build
- `npm run lint` - Run ESLint code checking

### Testing
No test framework is currently configured. Ask user for testing preferences if tests are needed.

## Architecture Overview

This is a React 19 + TypeScript + Vite admin dashboard for VocalBorn, using JWT authentication and Radix UI components.

### Key Architectural Patterns

**Authentication Flow:**
- JWT tokens stored in localStorage via `AuthContext` (useReducer pattern)
- `AdminRoute` component wraps protected routes
- API interceptors automatically inject tokens
- Role-based access control (admin-only system)

**API Integration:**
- Centralized Axios configuration in `src/lib/api.ts` with request/response interceptors
- Domain-specific API modules (auth-api.ts, users-api.ts, etc.)
- TypeScript interfaces for all API contracts
- Consistent error handling with automatic toast notifications

**State Management:**
- React Context for global state (AuthContext, ToastContext)
- Custom hooks for domain logic (useAuth, useUsers, useTherapists, etc.)
- Each hook encapsulates API calls, loading states, and error handling
- No external state management library (Redux, Zustand)

**Component Architecture:**
- `AppLayout` provides consistent layout with `SharedSidebar` and `Navbar`
- Dialog components for CRUD operations (UserDetailsDialog, DeleteUserDialog, etc.)
- shadcn/ui + Radix UI component library with Tailwind CSS
- Compound component patterns for complex UI elements

**Data Flow:**
1. Pages import and use domain-specific hooks
2. Hooks call API functions and manage local state
3. API errors are caught and displayed via ToastContext
4. Successful operations trigger optimistic UI updates

### File Organization

**Core Infrastructure:**
- `src/contexts/` - React contexts for global state
- `src/hooks/` - Custom hooks for data fetching and business logic
- `src/lib/` - API clients and utility functions

**Feature Modules:**
- `src/pages/` - Page components organized by feature
- `src/components/` - Reusable UI components organized by feature
- Each feature has its own API module, hooks, and components

### Important Conventions

**API Patterns:**
- All API functions return promises with typed responses
- Error handling happens at the hook level, not component level
- Use optimistic updates for better UX, with rollback on failure

**Component Patterns:**
- Dialog components handle their own state and API calls
- Management components (UserManagement, TherapistManagement) are container components
- Use TypeScript interfaces for all props and state

**Authentication:**
- Always check user role and loading state before rendering admin content
- Use `AdminRoute` wrapper for any protected routes
- Handle token expiration gracefully with automatic logout

### Key Dependencies

- **UI:** @radix-ui/react-* components with Tailwind CSS styling
- **Routing:** react-router-dom v7 with nested routing
- **HTTP:** axios with interceptors for authentication
- **Icons:** lucide-react for consistent iconography
- **Build:** Vite with TypeScript compilation

### Claude Interaction Guidelines

- 使用繁體中文回答