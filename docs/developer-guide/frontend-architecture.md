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
- **`src/app/(auth)/layout.tsx` (Auth Layout)**: This layout wraps the authentication pages and provides the `PublicTRPCProvider`, enabling tRPC queries on public routes like the login page.
- **`src/app/admin/layout.tsx` (Admin Layout)**: This layout wraps all pages within the `/admin` route. It provides the authenticated `TRPCProvider`, making protected tRPC hooks available to all admin components.

## "Server Component Shell" Pattern

For complex interactive pages, the project uses a pattern where a Server Component acts as a "shell" for a main Client Component. This is a best practice that leverages the strengths of both component types.

- **`page.tsx` (Server Component Shell)**: This file is a Server Component. Its primary role is to handle server-centric concerns, such as wrapping the main component in a React `<Suspense>` boundary to enable UI streaming and provide an instant loading state.
- **`client-page.tsx` (Client Component Core)**: This file contains the `"use client";` directive and houses all the interactive logic for the page. It manages state, handles user events, and fetches data using tRPC hooks.

This pattern is notably used in the global results page (`src/app/admin/results/global/`). Other pages, such as the public poll page, are implemented as single, self-contained Client Components.
