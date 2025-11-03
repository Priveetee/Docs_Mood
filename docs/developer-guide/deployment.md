# Deployment & Containerization

The Mood application is designed to be deployed as a set of Docker containers. This approach ensures a consistent and reproducible environment from development to production. This page details the containerization strategy.

## `docker-compose.yml`

The `docker-compose.yml` file orchestrates the two main services:

- **`postgres`**: A standard `postgres:16-alpine` image that runs the database. It uses a named volume (`postgres_data`) for data persistence.
- **`web`**: The main application service, built from the local `Dockerfile`.

A key feature is the `healthcheck` on the `postgres` service and the `depends_on` condition in the `web` service. This ensures the `web` container will only start after the database is fully initialized and ready to accept connections, preventing startup errors.

## `Dockerfile`

The `Dockerfile` uses a multi-stage build to create a lean and optimized final image for production.

1.  **`deps` Stage**: Installs all dependencies (`dependencies` and `devDependencies`) using `bun install`. This layer is cached by Docker, speeding up subsequent builds if dependencies haven't changed.
2.  **`builder` Stage**: Copies the source code and `node_modules` from the previous stage, then runs `bun run build`. This compiles the Next.js application into an optimized production output in the `.next` directory.
3.  **`runner` Stage**: This is the final, lightweight image. It installs **only** production dependencies (`bun install --production`), copies the build artifacts from the `builder` stage, and sets up the `entrypoint.sh` script.

## `entrypoint.sh`

This script is the `ENTRYPOINT` for the final `runner` container. It performs critical runtime tasks before starting the application server:

1.  **Wait for Database**: It enters a loop that uses `pg_isready` to pause execution until the `postgres` container is fully ready.
2.  **Apply Migrations**: It runs `npx prisma migrate deploy`. This command applies any pending database migrations. It's safe to run on every startup and ensures the database schema is always in sync with the Prisma schema.
3.  **Start Application**: Finally, it executes `exec bun run start` to start the Next.js production server.

This automated migration step makes deployments and updates seamless.
