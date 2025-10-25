# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 frontend application for Fregister, using Google OAuth authentication. The application connects to a NestJS backend API (running on `http://localhost:3001`) and uses SWR for data fetching, Material UI for components, and Tailwind CSS for styling.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Authentication Flow
- Google OAuth integration via `@react-oauth/google`
- `AuthContext` (src/contexts/AuthContext.tsx) provides global auth state
- Google ID token is stored in localStorage and sent to backend at `/auth/login`
- Backend returns user data which is cached locally
- Token and user data persist across page refreshes via localStorage

### Route Protection
- The app uses Next.js App Router with route groups
- Routes under `(withNavbar)` are protected and require authentication
- The `(withNavbar)/layout.tsx` checks for authenticated user and redirects to `/login` if not authenticated
- Protected routes automatically show the Navbar component

### State Management
- **Global Auth State**: React Context (`AuthContext`) manages user and token
- **Server State**: SWR for data fetching and caching (see `useUser` hook)
- **Local State**: React useState for component-level state

### Data Fetching Pattern
- `apiFetcher` utility (src/utils/apiFetcher.ts) is the SWR fetcher function
- It automatically adds the API base URL and Bearer token to requests
- Returns JSON or text based on response content-type
- Hooks like `useUser` use SWR with `apiFetcher` for automatic caching and revalidation

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (withNavbar)/      # Protected routes with navbar
│   │   ├── layout.tsx     # Auth guard + navbar wrapper
│   │   ├── page.tsx       # Home page
│   │   └── profile/       # Profile page
│   ├── layout.tsx         # Root layout with providers
│   └── login/             # Login page (public)
├── components/            # React components
├── contexts/              # React context providers (AuthContext)
├── hooks/                 # Custom hooks (useUser, etc.)
├── types/                 # TypeScript interfaces
└── utils/                 # Utility functions (apiFetcher)
```

### Environment Variables
Required in `.env.local`:
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (default: http://localhost:3001)

### Key Technical Details
- **TypeScript**: Strict mode enabled, paths aliased with `@/` prefix
- **Styling**: Tailwind CSS v4 + Material UI (Emotion-based)
- **Client Components**: Most components use 'use client' directive due to interactive features
- **Toast Notifications**: react-hot-toast for user feedback
- **Next.js Version**: 15.5.4 (latest features including App Router)

### Working with Auth
- Use `useAuth()` hook to access `user`, `token`, `isLoading`, `handleLoginSuccess`, and `logout`
- User state is synced between context and localStorage
- For authenticated API calls, use the `useUser` hook or create similar SWR hooks with `apiFetcher`
- The auth token from Google is the ID token, not an access token

### Common Patterns
- Protected pages should be placed under `src/app/(withNavbar)/`
- New data fetching hooks should follow the `useUser` pattern with SWR + apiFetcher
- Toast notifications should use `react-hot-toast` for consistency
- TypeScript interfaces should be defined in `src/types/` and exported through `index.ts`
