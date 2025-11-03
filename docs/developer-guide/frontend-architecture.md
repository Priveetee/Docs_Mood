# Frontend Architecture

The frontend is built using Next.js 15 with the App Router, providing a clear and scalable structure for routing, layouts, and component rendering.

## App Router Structure

The `src/app` directory follows the App Router conventions, where folders define routes.

- **/admin**: This is a route group containing all protected pages for the administrator dashboard. Its structure is protected by the `middleware.ts` file.
- **/(auth)**: This is a route group for authentication-related pages like `/login`. The parentheses indicate that `(auth)` is not part of the URL path, allowing for a shared layout for auth pages without affecting the URL.
- **/poll**: This group contains the public-facing pages for users to vote.

## Layouts (`layout.tsx`)

Layouts are used to create a consistent UI shell across multiple pages.

- **`src/app/layout.tsx` (Root Layout)**: The main layout for the entire application. It sets up the HTML structure, fonts, and the `ThemeProvider` for light/dark mode.
- **`src/app/admin/layout.tsx` (Admin Layout)**: This is a crucial layout that wraps all pages within the `/admin` route. It provides the `TRPCProvider`, making tRPC hooks available to all admin components. It also manages the dynamic animated background (`Silk`) and the theme switcher.

## Client & Server Components

The application heavily utilizes Client Components (`"use client";`) for pages that require interactivity, state, and hooks. This is the case for all pages in the admin dashboard, which are rich with user interactions.

Often, a `page.tsx` file (which can be a Server Component) will be a thin wrapper that imports and renders a main Client Component (e.g., `client-page.tsx`), which contains all the interactive logic. This is a best practice for separating concerns.
