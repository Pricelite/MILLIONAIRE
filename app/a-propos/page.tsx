import Link from "next/link";
import { ArrowRight, Heart, ShieldCheck, Wand2 } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { JsonLd, breadcrumbJsonLd, createPageMetadata, siteUrl } from "@/lib/seo";

export const metadata = createPageMetadata("aPropos");

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "À propos de Studio V. Création",
  description:
    "Histoire, mission et valeurs de Studio V. Création, studio de supports de communication prêts à l’emploi.",
  url: `${siteUrl}/a-propos`,
  inLanguage: "fr-FR"
};

const values = [
  {
    icon: Heart,
    title: "Écoute",
    text: "Chaque support part de votre activité, de votre clientèle et de votre manière de communiquer."
  },
  {
    icon: Wand2,
    title: "Simplicité",
    text: "Vous recevez des fichiers prêts à publier, sans jargon et sans process compliqué."
  },
  {
    icon: ShieldCheck,
    title: "Professionnalisme",
    text: "Le rendu doit inspirer confiance dès les premières secondes."
  }
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "À propos", path: "/a-propos" }
          ]),
          aboutJsonLd
        ]}
      />
      <section className="pageHero">
        <p className="eyebrow">À propos</p>
        <h1>Une image plus professionnelle, accessible aux petites structures.</h1>
        <p>
          Studio V. Création est né d’une envie simple : aider les commerces,
          artisans, indépendants et associations à communiquer avec des supports
          beaux, clairs et prêts à l’emploi.
        </p>
      </section>

      <section className="section storySection">
        <div>
          <SectionHeading
            eyebrow="Mon histoire"
            title="J’ai créé Studio V. Création pour simplifier la communication visuelle."
          />
        </div>
        <div className="richText">
          <p>
            Beaucoup de petites entreprises savent quoi vendre, mais manquent de
            temps ou d’outils pour présenter leurs offres avec une image
            professionnelle. Studio V. Création répond à ce besoin avec des
            supports simples, élégants et directement utilisables.
          </p>
          <p>
            Ma mission est de transformer vos idées, promotions et informations
            en visuels cohérents qui valorisent votre activité et rassurent vos
            futurs clients.
          </p>
        </div>
      </section>

      <section className="section blushBand">
        <SectionHeading eyebrow="Valeurs" title="Un accompagnement humain, clair et soigné." />
        <div className="cardGrid threeColumns">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article className="reasonCard" key={value.title}>
                <Icon size={24} aria-hidden="true" />
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section centeredSection">
        <p className="eyebrow">Mission</p>
        <h2>Créer des supports que vous pouvez utiliser immédiatement.</h2>
        <Link href="/contact" className="button primary">
          Parler de mon projet
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
