# Project Setup

This guide will walk you through the steps to get the Mood project running on your local machine for **development purposes**. For deployment instructions, please refer to the main [README.md](https://github.com/Priveetee/Mood/blob/main/README.md).

## Prerequisites

Before you begin, ensure you have the following tools installed on your system:

- [Git](https://git-scm.com/)
- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## 1. Clone the Repository

First, clone the project repository to your local machine.

```bash
git clone https://github.com/Priveetee/Mood.git
cd Mood
```

## 2. Install Dependencies

Install all the required project dependencies using Bun.

```bash
bun install
```

## 3. Configure Environment Variables

The project uses a `.env` file for configuration. Create your local development environment file by copying the example:

```bash
cp .env.example .env
```

Now, open the `.env` file. The default values for `POSTGRES_USER`, `POSTGRES_PASSWORD`, etc., are generally suitable for local development. However, you **must** set the following:

- **`JWT_SECRET`**: Generate a long, random secret string for session security.
  ```bash
  openssl rand -base64 32
  ```
- **`NEXT_PUBLIC_APP_URL`**: Set this to `http://localhost:3000` for local development.

## 4. Start the Database

The project requires a PostgreSQL database. The provided `docker-compose.yml` is configured to start only the database service for local development.

```bash
docker-compose up -d postgres
```

This command starts **only the `postgres` service** in the background, leaving the application to be run locally.

## 5. Apply Database Migrations

With the database running, apply the Prisma schema to create the necessary tables.

```bash
bunx prisma migrate dev
```

This will synchronize your database schema with the models defined in `prisma/schema.prisma`.

## 6. Run the Development Server

You are now ready to start the Next.js development server on your host machine.

```bash
bun run dev
```

The application should now be running and accessible at [http://localhost:3000](http://localhost:3000).
