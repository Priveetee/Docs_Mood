# Middleware & Routing Protection

The Mood application uses Next.js Middleware to protect routes and manage access control at the edge, before a request reaches the application code.

## `src/middleware.ts`

This file is responsible for a single, critical task: **protecting the entire admin dashboard**.

### `matcher`

The middleware's scope is defined by the `config.matcher` property:

```ts
export const config = {
  matcher: ["/admin/:path*"],
};
```

This configuration ensures that the middleware will run for every request to a URL starting with `/admin/`.

### Logic

The middleware's logic is straightforward:

1.  It uses the `getSessionCookie` helper from `better-auth` to check for the existence of a valid session cookie in the incoming request.
2.  **If the cookie is not found**, it means the user is not authenticated. The middleware immediately redirects the user to the homepage (`/`), preventing any access to the admin dashboard.
3.  **If the cookie is found**, the middleware allows the request to proceed to the requested admin page.

This approach is highly efficient as it secures the entire dashboard at the network edge without needing to implement checks in every individual page or component.
