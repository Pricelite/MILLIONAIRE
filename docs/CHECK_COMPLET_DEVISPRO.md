# CHECK COMPLET - DevisPro AI

Date du controle: 12 mai 2026  
Controleur: Codex (audit technique local)

## 1. Controle general
- [x] Le projet compile (`pnpm build`)
- [x] Le typage TypeScript est valide (`pnpm typecheck`)
- [x] Le lint passe (`pnpm lint`) avec 2 warnings non bloquants (`<img>` optimisation)
- [x] Les routes principales existent
- [x] UI dashboard chargee et structuree
- [ ] Test manuel navigateur complet (console front) a faire en session live

## 2. Navigation et ecrans
- [x] `/dashboard`
- [x] `/devis/nouveau`
- [x] `/clients`
- [x] `/clients/ajouter`
- [x] `/prix`
- [x] Redirection `/` vers dashboard

## 3. APIs presentes
- [x] `POST /api/quotes/generate`
- [x] `POST /api/visuals/generate`
- [x] `GET/POST /api/pricing/library`
- [x] `PATCH/DELETE /api/pricing/library/[id]`
- [x] `POST /api/pricing/library/import`

## 4. Devis IA
- [x] Formulaire generation devis
- [x] Barre de chargement generation
- [x] Moteur estimation (materiaux, MO, marge, TVA)
- [x] Detection metier + hypotheses + score confiance
- [ ] Validation metier sur cas reels (20 a 30 chantiers tests) a faire
- [ ] Calibrage prix fin par region/metier a faire

## 5. Gestion clients
- [x] Ajout client (formulaire)
- [x] Liste "Mes clients"
- [x] Persistance locale navigateur pour la demo
- [ ] Persistance production Supabase a brancher (recommande)

## 6. Base de prix
- [x] Catalogue fallback riche multi-metiers
- [x] Ecran "Mes prix"
- [x] Ajout tarif manuel
- [x] Suppression tarif
- [x] Import CSV
- [x] Import Excel (`.xlsx`, `.xls`)
- [x] Mode import `append`
- [x] Mode import `replace`

## 7. Visuel IA
- [x] Coller une ou plusieurs photos (`Ctrl+V`)
- [x] Upload multiple images
- [x] Generation visuel IA avec progression
- [ ] Test qualite visuelle avec vraie cle OpenAI a faire

## 8. Build et performance
- [x] Build production OK (13 routes generees)
- [x] First load JS ~102 kB partage
- [ ] Audit Lighthouse mobile (perf/SEO/a11y) a faire

## 9. Securite et conformite (etat actuel)
- [ ] Authentification non imposee sur les routes API (a corriger avant prod)
- [ ] Controle d'acces multi-tenant non applique dans les endpoints (a corriger)
- [ ] Rate limiting absent (a ajouter)
- [ ] Journalisation securite absente (a ajouter)
- [ ] Politique RGPD complete (export/suppression/anonymisation) a finaliser

## 10. Donnees et robustesse
- [x] Validation d'entree via `zod` sur les endpoints principaux
- [x] Fallback catalogue local si Supabase indisponible
- [ ] Tests automatiques unitaires/e2e absents (a ajouter)
- [ ] Monitoring erreurs runtime absent (Sentry ou equivalent a ajouter)

## 11. Statut global du check
- Statut technique actuel: **Partiellement valide pour demo**
- Statut production: **A corriger avant mise en ligne**

## 12. Priorites de correction avant production
1. Proteger toutes les routes API via auth + checks d'appartenance entreprise.
2. Brancher la persistance clients/devis/factures sur Supabase (pas localStorage).
3. Ajouter rate limit, logs, et monitoring erreurs.
4. Ecrire tests e2e sur parcours critiques (devis, import prix, visuel IA).
5. Faire une campagne de tests metier reelle pour calibrer les prix.
