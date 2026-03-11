# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

No test framework is configured.

## Architecture

**Lucidify** is a Next.js 14 App Router web agency portfolio and client project management platform deployed at https://lucidify.vercel.app.

### Tech Stack
- **Next.js 14** with App Router and TypeScript
- **Firebase** (Firestore for data, Firebase Auth + Google OAuth)
- **Tailwind CSS** + SCSS (`globals.scss`)
- Custom Tailwind breakpoint: `xl: 1300px`
- Path alias: `@/*` maps to root (use `@/components/`, `@/context/`, etc.)
- Image domains allowed: `lh3.googleusercontent.com`, `res.cloudinary.com`

### Key Directories
- `app/` — Next.js pages and layouts (App Router)
- `components/` — All React components (44 files, no subdirectories)
- `context/authContext.tsx` — Firebase auth context with Google OAuth
- `firebaseConfig.ts` — Firebase init (Firestore, Auth, Analytics)

### Route Structure
```
/                        → Landing page
/login                   → Login
/signup                  → Signup
/signup/get-started      → Onboarding
/creations               → Case studies
/contact                 → Contact
/dashboard               → Main dashboard
/dashboard/projects      → Projects list
/dashboard/projects/[projectId]           → Project details
/dashboard/projects/[projectId]/progress  → Progress tracking
/dashboard/projects/[projectId]/uploads   → File uploads
/dashboard/messages      → Messaging
/dashboard/profile       → Profile
/dashboard/settings      → Settings
/dashboard/get-started   → Dashboard onboarding
```

### Dual Dashboard Pattern
All dashboard pages conditionally render either an Admin or Client component based on the authenticated user's role. Component naming follows this convention:
- `DASHBOARD{Admin|Client}{PageName}.tsx` — page-level components
- `DashboardAdminSideNav.tsx` / `DashboardClientSideNav.tsx` — navigation

### Component Naming Conventions
Components are named with a prefix indicating their page context:
- `DASHBOARD*` — dashboard components
- `LOGIN*`, `SIGNUP*` — auth page components
- `CONTACT*`, `CREATIONS*` — public page sections
- Unprefixed (`HeroSection`, `Navbar`, `Footer`) — home page / shared
