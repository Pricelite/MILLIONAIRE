import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { JsonLd, breadcrumbJsonLd, createPageMetadata, siteUrl } from "@/lib/seo";
import { portfolioItems } from "@/lib/site-data";

export const metadata = createPageMetadata("portfolio");

const portfolioJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Portfolio Studio V Creation",
  description:
    "Galerie de créations graphiques : publications, flyers, cartes de fidélité, affiches et logos.",
  url: `${siteUrl}/portfolio`,
  inLanguage: "fr-FR"
};

export default function PortfolioPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Portfolio", path: "/portfolio" }
          ]),
          portfolioJsonLd
        ]}
      />
      <section className="pageHero">
        <p className="eyebrow">Portfolio</p>
        <h1>Une galerie prête à accueillir vos créations.</h1>
        <p>
          Les emplacements ci-dessous servent de base propre pour ajouter vos
          futures publications, flyers, cartes, affiches et logos.
        </p>
      </section>

      <section className="section portfolioLayout">
        <Image
          src="/images/studio-v-portfolio.png"
          alt="Mockup de supports de communication Studio V Creation"
          width={900}
          height={900}
          className="portfolioHeroImage"
        />

        <div className="portfolioGallery">
          {portfolioItems.map((item, index) => (
            <article className="portfolioTile" key={item.title}>
              <div className={`mockup mockup${index + 1}`}>
                <span>{item.category}</span>
              </div>
              <h2>{item.title}</h2>
              <p>{item.tone}</p>
            </article>
          ))}
          <article className="portfolioTile addTile">
            <div className="mockup emptyMockup">
              <Plus size={28} aria-hidden="true" />
            </div>
            <h2>Nouvelle création</h2>
            <p>Emplacement prévu pour ajouter un prochain visuel.</p>
          </article>
        </div>
      </section>

      <section className="section centeredSection">
        <SectionHeading
          eyebrow="Votre projet"
          title="Ajoutons bientôt vos supports dans cette galerie."
        />
        <Link href="/contact" className="button primary">
          Demander une création
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}

