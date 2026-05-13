# DevisPro AI (Starter MVP)

Application SaaS moderne pour artisans:
"Decris ton chantier. L'IA cree ton devis."

## Demarrage

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Variables d'environnement

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (par defaut `gpt-4.1-mini`)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Schema SQL

Importer `supabase/schema.sql` dans Supabase SQL Editor.

## Endpoints MVP

- `POST /api/quotes/generate`
  - input:
  ```json
  { "description": "Pose carrelage salle de bain 12m2", "region": "fr_standard" }
  ```
  - output: devis structure avec lignes, TVA, marge, total TTC

## Docs produit

- [Blueprint complet](docs/MASTER_PLAN.md)

