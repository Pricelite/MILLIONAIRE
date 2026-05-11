# RESTOMASTER v2

Monorepo SaaS restaurant: web (Next.js), api (NestJS), mobile (Expo), packages partages.

## Demarrage rapide

1. `pnpm install`
2. `docker compose up -d postgres`
3. `pnpm --filter @restomaster/api prisma:generate`
4. `pnpm --filter @restomaster/api prisma:migrate`
5. `pnpm --filter @restomaster/api prisma:seed`
6. `pnpm dev:stack`

Web: http://localhost:3000
API: http://localhost:4000
Docs API: http://localhost:4000/docs

Compte demo:
- email: antoniwelh@gmail.com
- password: Anthony45
