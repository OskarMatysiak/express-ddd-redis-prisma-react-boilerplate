# backend-nest

NestJS 10 implementation of the task service. Mirrors the Express `backend` package — same domain model, same four-layer Clean Architecture — with NestJS classes, decorators, and its IoC container replacing factory functions and manual wiring.

Runs on port **3001** by default.

## Local development

Start PostgreSQL and Redis:

```bash
docker compose up db redis
```

Run the app with hot reload:

```bash
npm run dev
```

## Docker

Full stack (app + db + redis):

```bash
npm run docker:fresh   # build and start
npm run docker:up      # start (already built)
npm run docker:down    # stop
```

## Database

```bash
npm run migrate:dev      # create and apply a new migration
npm run migrate:deploy   # apply pending migrations (CI/production)
npm run db:generate      # regenerate Prisma Client after schema changes
npm run db:studio        # open Prisma Studio GUI
```

## Lint & format

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Environment variables

Copy `.env.example` to `.env` before running locally:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/app` | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `FRONTEND_URL` | `http://localhost:4173` | CORS allowed origin (required at startup) |
| `PORT` | `3001` | HTTP port |

## Architecture

```
src/
  modules/task/
    domain/          Task entity (Zod), TaskRepository interface
    application/     use cases (@Injectable), TaskCachePort, DI tokens
    infrastructure/  PrismaTaskRepository, RedisTaskCache (@Injectable)
    api/             TaskController (@Controller)
    task.module.ts   @Module — wires providers and controller
  config/            PrismaService, redisProvider
  common/            AppError, GlobalExceptionFilter
  app.module.ts
  main.ts
```

Interfaces (`TaskRepository`, `TaskCachePort`) are bound to their implementations via Symbol tokens (`TASK_REPOSITORY`, `TASK_CACHE`) in `task.module.ts`. NestJS resolves them at startup through its IoC container.
