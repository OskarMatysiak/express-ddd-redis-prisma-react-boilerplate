# recrutation-javascript

## Docker

**Build and start all services:**
```bash
docker compose up --build
```

**Start without rebuilding:**
```bash
docker compose up
```

**Stop all services:**
```bash
docker compose down
```

## Migrations

**Apply migrations (dev):**
```bash
npx prisma migrate dev
```

**Apply migrations (production):**
```bash
npx prisma migrate deploy
```

**Reset DB and re-run all migrations:**
```bash
npx prisma migrate reset
```

**Mark a migration as rolled back (does not undo SQL — manual SQL required):**
```bash
npx prisma migrate resolve --rolled-back <migration_name>
```
