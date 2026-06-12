import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { QuoteCta } from "@/components/quote-cta";
import { SectionHeading } from "@/components/section-heading";
import { JsonLd, breadcrumbJsonLd, createPageMetadata, pricesJsonLd } from "@/lib/seo";
import { packs, priceItems } from "@/lib/site-data";

export const metadata = createPageMetadata("tarifs");

export default function TarifsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Tarifs", path: "/tarifs" }
          ]),
          pricesJsonLd
        ]}
      />
      <section className="pageHero">
        <p className="eyebrow">Tarifs</p>
        <h1>Des prix clairs pour avancer rapidement.</h1>
        <p>
          Les prestations sont pensées pour les commerçants, artisans,
          indépendants, associations et petites entreprises.
        </p>
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="À la carte"
          title="Commandez uniquement ce dont vous avez besoin."
        />
        <div className="priceTable">
          {priceItems.map(([label, price]) => (
            <div className="priceRow" key={label}>
              <span>{label}</span>
              <strong>{price}</strong>
            </div>
          ))}
        </div>
        <p className="printNote">Impression non incluse.</p>
      </section>

      <section className="section blushBand">
        <SectionHeading
          eyebrow="Packs"
          title="Des formules simples pour une communication plus complète."
        />
        <div className="cardGrid threeColumns">
          {packs.map((pack) => (
            <article className="packCard" key={pack.name}>
              <p className="packName">{pack.name}</p>
              <strong>{pack.price}</strong>
              <p>{pack.description}</p>
              <div className="packFeatures">
                {pack.features.map((feature) => (
                  <span key={feature}>
                    <CheckCircle2 size={17} aria-hidden="true" />
                    {feature}
                  </span>
                ))}
              </div>
              <Link href="/contact" className="button primary">
                Demander ce pack
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <QuoteCta />
    </>
  );
}
