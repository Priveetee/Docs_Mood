# Introduction

Welcome to the developer documentation for the **Mood** project. This guide provides a deep dive into the architecture, technical choices, and core principles that define this application.

## Project Goal

Mood is a self-hostable polling platform designed for teams to gather feedback with a core focus on **100% anonymity and a single-administrator security model**. It allows one admin to create campaigns and distribute unique polling links to managers, ensuring that all responses remain untraceable to the individual.

## Core Architectural Principles

The application is built on several key principles that guide its structure and development:

1.  **End-to-End Type Safety**: By combining Next.js, tRPC, Zod, and Prisma, the entire data flow is strongly typed. This eliminates a massive class of potential bugs between the frontend and backend and provides an exceptional developer experience with autocompletion.

2.  **Defense in Depth Security**: The application employs a multi-layered security model:
    - **Edge Protection**: A `middleware.ts` file protects the entire `/admin` route group at the network edge, redirecting unauthenticated users before any application code is rendered.
    - **API Protection**: Every sensitive API endpoint is a `protectedProcedure`, verifying the user's session on the server for every single request.
    - **Single-Admin Model**: The authentication logic (`src/auth.ts`) is hard-coded to allow registration only for the very first user, secured by a mandatory `INVITATION_KEY`.

3.  **Optimized User Experience**: The architecture is designed to be fast and responsive.
    - **"Server Component Shell" Pattern**: Complex pages use a Server Component shell to enable instant loading and UI streaming via React Suspense, while a core Client Component handles all interactivity.
    - **Consistent Feedback**: Every user action (especially mutations) provides immediate visual feedback through toasts and loading states, ensuring the user is never left guessing.

## Technical Stack

- **Framework**: Next.js 15 (App Router) with Turbopack
- **API**: tRPC (for end-to-end typesafe APIs)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth (configured for a single-admin system)
- **UI**: Tailwind CSS with shadcn/ui components
- **Visuals**: Custom WebGL shaders via `react-three-fiber` & `ogl`
- **Validation**: Zod (for API input validation)

## Application Data Flow

A typical request to a protected page follows this comprehensive path:

1.  A user attempts to access an admin URL (e.g., `/admin/campaigns/active`).
2.  The **Next.js Middleware** (`src/middleware.ts`) intercepts the request at the edge and verifies the session cookie. If invalid, it redirects to `/login`.
3.  The request proceeds. React renders the page, starting with the **Root Layout** and the **Admin Layout**.
4.  The `AdminLayout` wraps the page in a `TRPCProvider`, making the authenticated tRPC client available.
5.  The page's Client Component (e.g., `ActiveCampaignsPage.tsx`) mounts and calls a tRPC hook, like `trpc.campaign.list.useQuery()`.
6.  The tRPC client sends an HTTP request to the API route at `/api/trpc`. Data is serialized using `superjson`.
7.  The **tRPC Context** (`src/server/context.ts`) is created on the server, attaching the `prisma` client and the user `session` to the request.
8.  The `protectedProcedure` in `src/server/trpc.ts` runs its middleware, validating that `ctx.session.user` exists.
9.  The router logic in `src/server/routers/campaign.ts` finally executes, using Prisma to query the database.
10. The fully typed response is returned to the client, where React Query manages caching and renders the data.
