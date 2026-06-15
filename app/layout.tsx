import type { Metadata } from "next";
import { MotionProvider } from "@/components/motion-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VirginieIaChat } from "@/components/virginie-ia-chat";
import {
  JsonLd,
  defaultOgImage,
  organizationJsonLd,
  siteUrl,
  websiteJsonLd
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Studio V Creation",
  title: {
    default: "Studio V Creation | Je crée, vous publiez.",
    template: "%s | Studio V Creation"
  },
  description:
    "Studio de création de supports de communication prêts à l’emploi pour commerçants, artisans, indépendants, associations et petites entreprises.",
  keywords: [
    "Studio V Creation",
    "création publications Instagram",
    "flyer professionnel",
    "carte de fidélité",
    "communication commerçant",
    "supports de communication"
  ],
  authors: [{ name: "Studio V Creation", url: siteUrl }],
  creator: "Studio V Creation",
  publisher: "Studio V Creation",
  category: "Création graphique et communication",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Studio V Creation | Je crée, vous publiez.",
    description:
      "Supports de communication prêts à l’emploi pour commerçants, artisans, indépendants et associations.",
    url: siteUrl,
    siteName: "Studio V Creation",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Studio V Creation - supports de communication prêts à publier"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio V Creation | Je crée, vous publiez.",
    description:
      "Création de publications, flyers, cartes, menus, logos simples et supports prêts à l’emploi.",
    images: [defaultOgImage]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  other: {
    "geo.region": "FR",
    "geo.placename": "France",
    "business:contact_data:country_name": "France"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        <MotionProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <VirginieIaChat />
        </MotionProvider>
      </body>
    </html>
  );
}

