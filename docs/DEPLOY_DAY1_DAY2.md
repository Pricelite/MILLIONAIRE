# DevisPro AI - Deploiement Day 1 / Day 2

Ce document accompagne le hardening API + multi-tenant pricing.

## 1) Variables d'environnement

Configurer:

- `ENFORCE_API_AUTH=true` en production
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

En local dev, `ENFORCE_API_AUTH=false` est autorise pour continuer les tests UI.

## 2) Mise a jour schema SQL

Appliquer `supabase/schema.sql` mis a jour ou jouer les commandes equivalentes:

- `price_library.company_id` obligatoire
- index multi-tenant `idx_price_library_company_region_active`
- index unique partiel `uq_price_library_company_code_region_active`
- policies RLS `company_members_*` et `price_library_*`

## 3) Backfill pre-requis (base existante)

Si des lignes `price_library` existent deja avec `company_id IS NULL`, il faut les rattacher avant passage `NOT NULL`.

Exemple (cas simple mono-entreprise):

```sql
do $$
declare single_company_id uuid;
declare companies_count int;
begin
  select count(*) into companies_count from public.companies;
  if companies_count = 1 then
    select id into single_company_id from public.companies limit 1;
    update public.price_library
    set company_id = single_company_id
    where company_id is null;
  end if;
end $$;
```

Ensuite verifier:

```sql
select count(*) as null_company_rows
from public.price_library
where company_id is null;
```

Le resultat doit etre `0` avant de passer en production.

## 4) Verification post-deploiement

1. Sans token bearer:
   - `/api/pricing/library` => `401` (si `ENFORCE_API_AUTH=true`)
   - `/api/quotes/generate` => `401`
   - `/api/visuals/generate` => `401`
2. Avec token valide et `x-company-id`:
   - CRUD pricing fonctionne uniquement sur la societe cible.
3. Logs:
   - verifier absence de fuite stacktrace cote client.

