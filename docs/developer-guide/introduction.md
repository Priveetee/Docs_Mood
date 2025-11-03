# Introduction

Welcome to the developer documentation for the **Mood** project. This guide provides a deep dive into the architecture, tools, and conventions used in this application.

## Project Goal

Mood is a self-hostable polling platform designed for teams to gather feedback anonymously. It allows a single administrator to create campaigns and distribute unique polling links to managers or teams, ensuring that all responses remain untraceable to the individual.

## Technical Stack

The project is built on a modern, fully typesafe stack from the database to the frontend:

- **Framework**: [Next.js](https://nextjs.org/) 15 (App Router) with Turbopack
- **API**: [tRPC](https://trpc.io/) for end-to-end typesafe APIs
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/) for database access and migrations
- **Authentication**: [Better Auth](https://github.com/Thorn-Services/better-auth) for session management, configured for a single-admin system
- **UI**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **Validation**: [Zod](https://zod.dev/) for schema validation on API inputs

## Architecture Overview

The application follows a monolithic, full-stack structure within the Next.js framework. The communication between the client and server is primarily handled by tRPC.

### Request Flow

A typical data request follows this path:

1.  A Client Component (e.g., in `src/app/admin/`) uses a tRPC hook from `@/lib/trpc/client` to call an API procedure (e.g., `trpc.campaign.list.useQuery()`).
2.  The `TRPCProvider` (in `src/lib/trpc/provider.tsx`) sends a batched HTTP request to the `/api/trpc` endpoint. Data is serialized with `superjson`.
3.  The Next.js API route (`src/app/api/trpc/[trpc]/route.ts`) forwards the request to the main tRPC router.
4.  The tRPC context (`src/server/context.ts`) is created for the request, injecting the `prisma` client and the user `session` (retrieved via `better-auth`).
5.  If the procedure is a `protectedProcedure` (`src/server/trpc.ts`), it verifies the user's session. If invalid, it throws an `UNAUTHORIZED` error.
6.  The corresponding router procedure (e.g., in `src/server/routers/campaign.ts`) executes its logic, using the Prisma client to interact with the database.
7.  The response is returned to the client, fully typed and ready to be used.
