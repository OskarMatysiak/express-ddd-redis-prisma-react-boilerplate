# express-ddd-redis-prisma-react-boilerplate

A task service built twice with the same Clean Architecture / DDD design — once on Express, once on NestJS — sharing a PostgreSQL + Prisma + Redis stack, plus a React frontend.

## Packages (npm workspaces)

| Package | Framework | Default port | Docs |
|---|---|---|---|
| [`backend-express`](backend-express) | Express | 3000 | [backend-express/README.md](backend-express/README.md) |
| [`backend`](backend) | NestJS | 3001 | [backend/README.md](backend/README.md) |
| [`frontend`](frontend) | React (Vite) | 5173 | [frontend/README.md](frontend/README.md) |

Both backends implement the same four-layer architecture (domain / application / infrastructure / api) against the same Task domain model, so they can be compared side by side. The root scripts default to the Express backend.

## Getting started

```bash
npm install
cp backend-express/.env.example backend-express/.env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Start Postgres and Redis for the backend you want to run (see each package's README for its `docker compose` command), then:

```bash
npm run dev:backend   # backend-express, with hot reload
npm run dev:frontend   # frontend, with hot reload
```

## Root scripts

```bash
npm run build          # build backend-express and frontend
npm run dev:backend    # run backend-express in watch mode
npm run dev:frontend   # run frontend in dev mode
npm run test           # run backend-express tests
```

See each package's README for framework-specific commands (Docker, Prisma migrations, lint/format, environment variables, and architecture layout).
