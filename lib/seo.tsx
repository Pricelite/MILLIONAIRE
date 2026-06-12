import type { Metadata } from "next";
import { audiences, company, packs, priceItems, services } from "@/lib/site-data";

export const siteUrl = "https://studiovcreation.fr";
export const defaultOgImage = "/images/studio-v-hero.png";

type PageKey =
  | "home"
  | "services"
  | "tarifs"
  | "portfolio"
  | "aPropos"
  | "contact"
  | "mentionsLegales";

type PageSeo = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
};

export const pageSeo: Record<PageKey, PageSeo> = {
  home: {
    path: "/",
    title: "Studio V. Création | Supports de communication prêts à publier",
    description:
      "Studio V. Création crée des publications, flyers, cartes, menus, logos simples et supports prêts à l’emploi pour commerçants, artisans, indépendants et associations.",
    keywords: [
      "Studio V Création",
      "supports de communication",
      "création publication Instagram",
      "création flyer professionnel",
      "communication commerçant",
      "studio créatif France"
    ]
  },
  services: {
    path: "/services",
    title: "Services de création graphique pour commerçants et artisans",
    description:
      "Découvrez les services Studio V. Création : publications réseaux sociaux, stories, cartes de fidélité, cartes cadeaux, flyers, affiches, menus, logos et bannières Facebook.",
    keywords: [
      "création visuels réseaux sociaux",
      "création story Instagram",
      "création carte de fidélité",
      "création carte cadeau",
      "création menu restaurant",
      "création bannière Facebook"
    ]
  },
  tarifs: {
    path: "/tarifs",
    title: "Tarifs création graphique | Packs dès 49 €",
    description:
      "Consultez les tarifs Studio V. Création : publication dès 10 €, story dès 5 €, flyer 25 €, logo simple 50 € et packs communication dès 49 €. Impression non incluse.",
    keywords: [
      "tarif création flyer",
      "prix publication Instagram",
      "tarif carte de visite",
      "pack communication commerçant",
      "logo simple tarif",
      "tarifs graphiste France"
    ]
  },
  portfolio: {
    path: "/portfolio",
    title: "Portfolio créations graphiques | Réseaux sociaux, flyers et logos",
    description:
      "Parcourez le portfolio Studio V. Création : exemples de publications, flyers, cartes de fidélité, affiches, logos simples et supports de communication.",
    keywords: [
      "portfolio création graphique",
      "exemples publications Instagram",
      "exemples flyers",
      "exemples cartes fidélité",
      "créations graphiques commerce"
    ]
  },
  aPropos: {
    path: "/a-propos",
    title: "À propos de Studio V. Création",
    description:
      "Découvrez l’histoire, la mission et les valeurs de Studio V. Création, studio de supports de communication premium pour petites structures.",
    keywords: [
      "à propos Studio V Création",
      "studio communication France",
      "création supports petites entreprises",
      "communication visuelle artisans"
    ]
  },
  contact: {
    path: "/contact",
    title: "Contact et demande de devis | Studio V. Création",
    description:
      "Contactez Studio V. Création pour une demande de devis : publications, flyers, affiches, cartes, menus, logos simples et packs communication.",
    keywords: [
      "demande devis graphiste",
      "contact Studio V Création",
      "devis création flyer",
      "devis communication commerçant",
      "création supports de communication France"
    ]
  },
  mentionsLegales: {
    path: "/mentions-legales",
    title: "Mentions légales",
    description:
      "Consultez les mentions légales du site Studio V. Création : éditeur, hébergeur, propriété intellectuelle, données personnelles et contact.",
    keywords: [
      "mentions légales Studio V Création",
      "éditeur site Studio V Création",
      "hébergeur Studio V Création",
      "données personnelles Studio V Création"
    ]
  }
};

export const routes = Object.values(pageSeo).map((page) => ({
  url: `${siteUrl}${page.path}`,
  path: page.path
}));

export function createPageMetadata(page: PageKey): Metadata {
  const seo = pageSeo[page];
  const url = `${siteUrl}${seo.path}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.path
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: company.name,
      locale: "fr_FR",
      type: "website",
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${company.name} - supports de communication prêts à publier`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [defaultOgImage]
    }
  };
}

// Composant serveur pour injecter du JSON-LD valide dans le HTML.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c")
      }}
    />
  );
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${siteUrl}/#organization`,
  name: company.name,
  url: siteUrl,
  slogan: company.slogan,
  description: company.description,
  image: `${siteUrl}${defaultOgImage}`,
  logo: `${siteUrl}${defaultOgImage}`,
  email: company.email,
  areaServed: {
    "@type": "Country",
    name: "France"
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "FR",
    addressLocality: "France"
  },
  sameAs: [company.instagram, company.facebook, company.tiktok],
  priceRange: "€€",
  knowsAbout: [
    "Publications réseaux sociaux",
    "Flyers",
    "Affiches promotionnelles",
    "Cartes de fidélité",
    "Cartes cadeaux",
    "Menus",
    "Logos simples",
    "Bannières Facebook"
  ],
  audience: audiences.map((audience) => ({
    "@type": "Audience",
    audienceType: audience
  }))
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: company.name,
  description: company.description,
  inLanguage: "fr-FR",
  publisher: {
    "@id": `${siteUrl}/#organization`
  }
};

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`
    }))
  };
}

export const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Services Studio V. Création",
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: service.title,
      description: service.description,
      provider: {
        "@id": `${siteUrl}/#organization`
      },
      areaServed: "France",
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: service.price.replace(/[^0-9]/g, "") || undefined,
        availability: "https://schema.org/InStock"
      }
    }
  }))
};

export const pricesJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Tarifs Studio V. Création",
  itemListElement: [
    ...priceItems.map(([name, price]) => ({
      "@type": "Offer",
      name,
      priceCurrency: "EUR",
      price: price.replace(/[^0-9]/g, "")
    })),
    ...packs.map((pack) => ({
      "@type": "Offer",
      name: pack.name,
      description: pack.description,
      priceCurrency: "EUR",
      price: pack.price.replace(/[^0-9]/g, "")
    }))
  ]
};
