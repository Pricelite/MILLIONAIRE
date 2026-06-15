import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { JsonLd, breadcrumbJsonLd, createPageMetadata, siteUrl } from "@/lib/seo";
import { portfolioItems } from "@/lib/site-data";

export const metadata = createPageMetadata("portfolio");

const portfolioJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Portfolio Studio V Creation",
  description:
    "Galerie d’exemples de créations graphiques : publications, flyers, cartes de fidélité, affiches et logos.",
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
        <h1>Des exemples de créations prêtes à publier.</h1>
        <p>
          Découvrez des visuels d’exemple pour imaginer vos futures
          publications, flyers, cartes, affiches, logos et menus.
        </p>
      </section>

      <section className="section portfolioLayout">
        <aside className="portfolioIntroCard">
          <Image
            src="/images/studio-v-portfolio.webp"
            alt="Mockup de supports de communication Studio V Creation"
            width={900}
            height={900}
            className="portfolioHeroImage"
          />
          <div className="portfolioIntroText">
            <p className="eyebrow">Créations sur mesure</p>
            <h2>Virginie transforme vos idées en supports prêts à utiliser.</h2>
            <p>
              Publications pour les réseaux sociaux, flyers, cartes de fidélité,
              menus, affiches ou logo simple : chaque visuel est pensé pour
              valoriser votre activité, présenter clairement votre offre et vous
              faire gagner du temps.
            </p>
          </div>
        </aside>

        <div className="portfolioGallery">
          {/* TODO: remplacer ou compléter ces exemples par des projets réels avant toute utilisation commerciale. */}
          {portfolioItems.map((item) => (
            <article className="portfolioTile" key={item.title}>
              <div className="portfolioThumb">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 980px) 50vw, 340px"
                />
              </div>
              <div className="portfolioTileBody">
                <span className="portfolioCategory">{item.category}</span>
                <h2>{item.title}</h2>
                <p>{item.tone}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section centeredSection">
        <SectionHeading
          eyebrow="Votre projet"
          title="Créons un visuel adapté à votre activité."
        />
        <Link href="/contact" className="button primary">
          Demander une création
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}

