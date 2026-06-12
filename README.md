# Studio V. Création

Site internet professionnel complet pour Studio V. Création, studio de supports
de communication prêts à l’emploi.

## Pages incluses

- Accueil avec bannière, slogan, services, arguments, témoignages et formulaire.
- Services avec détail, avantages, délais et tarifs indicatifs.
- Tarifs avec prestations à la carte, packs et mention impression.
- Portfolio avec galerie moderne et emplacements pour futures créations.
- À propos avec histoire, mission et valeurs.
- Contact avec formulaire, e-mail et liens réseaux sociaux.

## Installation

```bash
pnpm install
pnpm add @getbrevo/brevo
pnpm dev
```

Ouvrir ensuite `http://localhost:3000`.

## Variables d’environnement

Créer un fichier `.env.local` en local et ajouter les mêmes variables dans
Vercel, section `Project Settings > Environment Variables`.

```bash
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME="Studio V. Création"
CONTACT_RECEIVER_EMAIL=
```

- `BREVO_API_KEY` : clé API Brevo Transactional Email.
- `BREVO_SENDER_EMAIL` : adresse expéditrice validée dans Brevo.
- `BREVO_SENDER_NAME` : nom affiché comme expéditeur.
- `CONTACT_RECEIVER_EMAIL` : adresse qui reçoit les demandes de devis.

La clé Brevo reste uniquement côté serveur dans `app/api/contact/route.ts`.

## Commandes utiles

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

## Arborescence principale

```text
app/
  api/contact/route.ts
  a-propos/page.tsx
  contact/page.tsx
  portfolio/page.tsx
  services/page.tsx
  tarifs/page.tsx
  layout.tsx
  page.tsx
  robots.ts
  sitemap.ts
components/
  contact-form.tsx
  quote-cta.tsx
  section-heading.tsx
  site-footer.tsx
  site-header.tsx
lib/
  seo.tsx
  site-data.ts
public/
  images/studio-v-hero.png
  images/studio-v-portfolio.png
.env.example
package.json
```

## Modifier les contenus

- Les textes, tarifs, packs, témoignages et liens sociaux sont dans `lib/site-data.ts`.
- La page d’accueil est dans `app/page.tsx`.
- Les pages internes sont dans `app/services`, `app/tarifs`, `app/portfolio`, `app/a-propos` et `app/contact`.
- Les styles sont dans `app/globals.css`.
- Les visuels sont dans `public/images`.

## Mise en ligne

Le projet est prêt pour Vercel, Netlify ou tout hébergeur compatible Next.js.
Lancer `pnpm build` avant publication pour vérifier la version production.
Pour Vercel, renseigner les variables Brevo côté serveur avant le premier
déploiement.

## Note

Impression non incluse dans les tarifs affichés.
