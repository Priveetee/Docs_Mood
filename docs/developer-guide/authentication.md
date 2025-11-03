# Authentication

Authentication in the Mood project is a critical piece of its security model, built around a **single-administrator design**. It's handled by the `better-auth` library, configured with custom logic to enforce this specific requirement.

## Single-Administrator Logic (`src/auth.ts`)

The core of the authentication system lies in `src/auth.ts`. A `databaseHooks` function is used to intercept the user creation process:

- **`user.create.before`**: Before a new user is created, this hook runs a query to check the total number of users in the database.
- **If `userCount` is greater than 0**, the creation is rejected with an error.
- This ensures that once the first administrator account is created, **no other accounts can ever be registered**.

## The Registration Flow

The frontend intelligently adapts to this single-admin rule.

1.  **The `(auth)` Layout**: The `/login` page is wrapped by `src/app/(auth)/layout.tsx`. This layout provides a `PublicTRPCProvider`, which is essential for the login form to make public API calls.

2.  **`auth.canRegister` Endpoint**: The `authRouter` exposes a public `canRegister` query. This endpoint simply returns `true` if the user count is 0, and `false` otherwise.

3.  **Conditional UI in `LoginForm.tsx`**: The login form calls `publicTrpc.auth.canRegister.useQuery()`. The result of this hook is used to conditionally render the "Sign Up" tab. If `canRegister` is `false`, the tab is hidden, and only the login form is available.

## Session Management & tRPC Integration

The user's session is made available to tRPC procedures through the tRPC **context**.

The context is created for each request in `src/server/context.ts`. It uses `auth.api.getSession()` from `better-auth` to retrieve the current session. If a valid session exists, it's attached to the context.

## Protecting API Procedures (`protectedProcedure`)

To restrict access, we use a `protectedProcedure` defined in `src/server/trpc.ts`. This custom middleware does the following:

1.  It checks if `ctx.session` and `ctx.session.user` exist.
2.  If the session is missing, it throws an `UNAUTHORIZED` error, preventing the procedure from running.
3.  If the session is present, it makes the user's details (like `ctx.session.user.id`) available to the procedure's logic.

This multi-layered approach—combining a database rule, a conditional UI, and server-side API protection—creates a robust and secure single-administrator system.
