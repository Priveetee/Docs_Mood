# Authentication

Authentication in the Mood project is handled by the `better-auth` library, a modern authentication solution for Next.js. It manages user sessions, credentials, and provides the foundation for securing API endpoints.

## Core Configuration Files

The authentication logic is primarily configured in two key files:

1.  **`src/auth.ts`**: This is the main configuration file for `better-auth`. It defines the authentication strategies (e.g., credentials provider for email/password login), session management settings (e.g., JWT strategy), and callbacks.

2.  **`src/app/api/auth/[...all]/route.ts`**: This file creates the API endpoints required by `better-auth` (e.g., `/api/auth/signin`, `/api/auth/signout`, `/api/auth/session`). It simply exports the handlers from the main `src/auth.ts` configuration.

## Integration with tRPC

The user's session is made available to tRPC procedures through the tRPC **context**.

The context is a special object that every tRPC procedure has access to. It's created for each incoming request in the `src/server/context.ts` file. In this file, we use the `auth()` function from `better-auth` to retrieve the current session from the request's headers.

If a valid session exists, the `session` object is attached to the context. If not, `session` is `null`.

## Protecting API Procedures

To restrict access to certain API endpoints, we use a `protectedProcedure`. This is a custom tRPC middleware defined in `src/server/trpc.ts`.

The `protectedProcedure` does the following:

1.  It checks if `ctx.session` and `ctx.session.user` exist in the context.
2.  If the session is missing, it automatically throws a `TRPCError` with the code `UNAUTHORIZED`, preventing the procedure's logic from running.
3.  If the session is present, it proceeds and makes the `session` object available to the procedure, including the user's ID (`ctx.session.user.id`).

### Usage Example

Here is how a protected procedure is defined in a tRPC router:

```ts
import { protectedProcedure, router } from "../trpc";

export const campaignRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    // We can safely access ctx.session.user here
    const campaigns = await ctx.prisma.campaign.findMany({
      where: { createdBy: ctx.session.user.id },
    });
    return campaigns;
  }),
});
```

Any procedure built with `protectedProcedure` instead of `procedure` will require a valid user session to be accessed.
