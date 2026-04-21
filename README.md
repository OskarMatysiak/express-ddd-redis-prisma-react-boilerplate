# recrutation-javascript

## Docker

**Build and start all services (fresh):**
```bash
npm run docker:fresh
```

**Build images:**
```bash
npm run docker:build
```

**Start services:**
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
