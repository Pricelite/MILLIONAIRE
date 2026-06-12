# Studio V Creation

Site internet professionnel complet pour Studio V Creation, studio de supports
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
pnpm dev
```

Ouvrir ensuite `http://localhost:3000`.

## Formulaire de contact

Le formulaire envoie les demandes via FormSubmit vers
`contact.studio.vcreation@gmail.com`, sans API interne et sans clé secrète.

Au premier envoi, FormSubmit demande une confirmation par e-mail sur
`contact.studio.vcreation@gmail.com`. Après confirmation, les demandes arrivent
directement dans cette boîte mail.

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

## Note

Impression non incluse dans les tarifs affichés.

