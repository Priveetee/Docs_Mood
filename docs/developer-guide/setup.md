# Project Setup

This guide covers two main scenarios: quick local development and the contribution workflow required for submitting changes.

## Quick Local Development

This method is ideal for quick features development or debugging. It runs the Next.js dev server on your host machine and connects to a PostgreSQL database running in Docker.

### Prerequisites

- [Git](https://git-scm.com/), [Bun](https://bun.sh/), [Docker](https://www.docker.com/)

### Steps

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/Priveetee/Mood.git
    cd Mood
    bun install
    ```
2.  **Configure Environment**:
    ```bash
    cp .env.example .env
    ```
    Ensure `NEXT_PUBLIC_APP_URL` is set to `http://localhost:3000` and generate a `JWT_SECRET`.
3.  **Start Database**:
    ```bash
    docker-compose up -d postgres
    ```
4.  **Apply Migrations**:
    ```bash
    bunx prisma migrate dev
    ```
5.  **Run Dev Server**:
    `bash
    bun run dev
    `
    The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## Contribution & Pre-PR Workflow (Recommended)

This is the **required** workflow for submitting a Pull Request. It ensures your changes work correctly in a clean, containerized production-like environment. This process builds the application, runs linting, and catches errors that your local dev server might miss.

### Prerequisites

- [Git](https://git-scm.com/), [Docker](https://www.docker.com/)

### Steps

1.  **Clone & Configure**: Follow steps 1 and 2 from the quick setup.
2.  **Build and Run the Full Stack**:
    ```bash
    docker compose up --build -d
    ```
    This single command builds the application image, starts both the web server and the database, and automatically applies migrations via the `entrypoint.sh` script.

If the containers start successfully, your changes are ready to be pushed for a Pull Request. For a detailed explanation of this process, see the [Deployment](./deployment.md) page.
