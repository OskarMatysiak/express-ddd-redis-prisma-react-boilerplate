## Local Development

**Start only DB and Redis (recommended for local dev):**

```bash
docker compose up db redis
```

**Run the app locally:**

```bash
npm run dev:watch
```

## Docker

**Build and start all services (fresh):**

```bash
npm run docker:fresh
```

**Build images:**

```bash
npm run docker:build
```

**Start all services:**

```bash
npm run docker:up
```

**Run a one-off command in the app container:**

```bash
npm run docker:run
```

**Stop all services:**

```bash
npm run docker:down
```

## Migrations

**Create and apply a new migration (dev):**

```bash
npm run migrate:dev
```

**Apply pending migrations (CI/production):**

```bash

with production url
//DATABASE_URL="..." npx prisma migrate deploy
npm run migrate:deploy
```

**Reset DB and re-apply all migrations:**

```bash
npm run migrate:reset
```

**Check migration status:**

```bash
npm run migrate:status
```

**Regenerate Prisma Client after schema changes:**

```bash
npm run db:generate
```

**Open Prisma Studio GUI:**

```bash
npm run db:studio
```
