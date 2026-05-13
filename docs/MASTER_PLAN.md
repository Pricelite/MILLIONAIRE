# DevisPro AI - Blueprint complet

## 1) Architecture complete du projet

### Stack retenue (MVP pragmatique)
- Frontend: Next.js App Router (mobile-first, PWA ready)
- Backend: Supabase (Postgres + Auth + Storage + RLS)
- IA: OpenAI API (JSON strict pour devis)
- Paiement: Stripe (abonnements + paiements facture)
- Emails/relances: worker cron + provider SMTP/Resend

### Architecture logique
- `app/*`: UI web, dashboard, tunnel devis/facture
- `app/api/*`: API routes (generation IA, devis, factures, relances)
- `lib/ai/*`: prompts, validation JSON, fallback sans IA
- `lib/pricing/*`: moteur de prix, marges, TVA
- `lib/pdf/*`: rendu document devis/facture
- `supabase/schema.sql`: schema de production
- `docs/*`: produit, go-to-market, scaling

### Principes clean architecture
- Couches: `presentation -> application -> domain -> infrastructure`
- DTO valides par `zod`
- Aucune logique metier dans les composants UI
- Services idempotents sur flux critiques (paiement, relance, signature)

## 2) Roadmap MVP 30 jours

### Semaine 1
- Setup produit + auth + schema SQL
- CRUD clients, devis, lignes devis
- UX mobile premier ecran "Nouveau devis IA"

### Semaine 2
- Generation IA fiable (JSON schema + fallback)
- Moteur prix (materiaux, MO, marge, TVA)
- Export PDF devis pro + branding

### Semaine 3
- Signature electronique + statut "accepte"
- Conversion devis -> facture
- Relances devis/paiements automatisables

### Semaine 4
- Dashboard KPI + onboarding
- Stripe abonnements (Freemium/Premium)
- QA complete, perf mobile, tracking acquisition

## 3) Ecrans necessaires (MVP)

- Auth (email/google/apple)
- Onboarding artisan (entreprise, taux horaire, region, TVA)
- Dashboard KPI
- Liste clients + fiche client
- Liste devis + filtre statuts
- Nouveau devis IA (champ "decris ton chantier")
- Editeur devis (lignes, marge, TVA, conditions)
- Apercu PDF + envoi mail
- Signature client
- Liste factures + conversion depuis devis
- Suivi paiements + relances
- Parametres (branding, templates, abonnement)

## 4) Base SQL

- Fichier: `supabase/schema.sql`
- Tables incluses: `profiles`, `companies`, `company_members`, `clients`, `projects`, `quotes`, `quote_lines`, `invoices`, `invoice_lines`, `payments`, `reminders`, `price_library`, `document_templates`
- Securite: RLS activee + policies de base

## 5) APIs necessaires

### Core
- `POST /api/quotes/generate` -> IA vers devis structure
- `POST /api/quotes` -> creer devis
- `GET /api/quotes/:id` -> detail devis
- `PATCH /api/quotes/:id` -> maj
- `POST /api/quotes/:id/send` -> envoi client
- `POST /api/quotes/:id/accept` -> signature + acceptation

### Facturation
- `POST /api/invoices/from-quote/:quoteId`
- `GET /api/invoices/:id/pdf`
- `POST /api/payments/checkout` (Stripe)
- `POST /api/webhooks/stripe`

### Relances
- `POST /api/reminders/schedule`
- `POST /api/jobs/reminders/run`

## 6) Prompts IA optimises

### Prompt systeme
- "Tu es un metreur BTP France, prudent, realiste, et tu reponds uniquement en JSON strict."

### Prompt utilisateur template
- Input: description chantier + region + type client
- Output: titre, scope, heures, marge conseillee, lignes (materiaux/MO/frais), taux TVA

### Garde-fous
- Validation `zod`
- Re-try une fois si JSON invalide
- Fallback local deterministic si API indisponible

## 7) Systeme estimation materiaux/prix

### Modele
- Bibliotheque base prix par corps de metier
- Multiplicateur regional
- Marge parametree par artisan
- TVA par ligne (10% renovation, 20% standard, etc.)

### Formule
- `Sous-total HT = somme lignes`
- `Marge EUR = sous-total * marge%`
- `Total HT = sous-total + marge`
- `TVA = total HT * taux moyen pondere`
- `Total TTC = total HT + TVA`

## 8) Strategie SaaS rentable

### Offre
- Freemium: 5 devis/mois, PDF basique
- Pro 19 EUR: devis illimites, branding, factures
- Business 39 EUR: signature + relances auto
- Expert 79 EUR: IA avancee + analytics + multi-utilisateurs

### KPIs unit economics
- CAC cible: < 90 EUR
- ARPA cible: > 31 EUR
- Marge brute: > 80%
- Payback CAC: < 4 mois
- Churn mensuel cible: < 4.5%

## 9) Strategie acquisition artisans

### Acquisition paid
- Meta Ads geolocalisees metiers
- TikTok UGC demo chantier avant/apres
- Landing pages locales: "devis plombier Lyon", etc.

### Acquisition organique
- SEO longue traine "modele devis [metier]"
- Mini outils gratuits (calcul TVA, marge chantier)
- Partenariats negoce materiaux / centres de formation

### Funnel
- Hook: "Devis en 10 secondes"
- Lead magnet: essai sans CB 7 jours
- Activation: premier devis envoye en < 5 minutes

## 10) Identite branding premium

- Nom provisoire: DevisPro AI
- Proposition de valeur: "Decris ton chantier. L'IA cree ton devis."
- Ton: direct, pro, terrain
- Palette:
  - Bleu nuit `#0A2540`
  - Bleu action `#1967E6`
  - Vert succes `#14B86A`
  - Gris clair `#F6F8FB`
- UI: boutons larges, contraste fort, texte court, mobile first

## 11) Starter code complet

- Base code deja fournie dans ce repo:
  - UI dashboard + page generation devis
  - API `POST /api/quotes/generate`
  - Moteur estimation + TVA + marge
  - Prompting IA + validation schema
  - Schema Supabase production-ready
- Prochaine etape: brancher persistence DB + auth + Stripe webhooks

## 12) Strategie de scaling

### Technique
- Supabase pooling + indexes + pagination server-side
- Cache lecture (Redis) pour catalogues prix
- Queue jobs pour relances, PDF, OCR
- Observabilite: logs structures, traces API, alerting

### Produit
- V2 OCR factures fournisseur
- V2 dictation vocale chantier
- V2 estimation photo chantier
- V3 assistant IA vocal + planning equipe

