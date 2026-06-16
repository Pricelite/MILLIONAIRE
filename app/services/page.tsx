import Link from "next/link";
import { ArrowRight, Clock3, Gem } from "lucide-react";
import { QuoteCta } from "@/components/quote-cta";
import { SectionHeading } from "@/components/section-heading";
import {
  JsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
  servicesJsonLd
} from "@/lib/seo";
import { services } from "@/lib/site-data";

export const metadata = createPageMetadata("services");

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Services", path: "/services" }
          ]),
          servicesJsonLd
        ]}
      />
      <section className="pageHero compactHero">
        <p className="eyebrow">Services</p>
        <h1>Des supports de communication prêts à publier.</h1>
        <p>
          Chaque prestation est conçue pour rendre votre activité plus visible,
          plus professionnelle et plus facile à comprendre.
        </p>
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Catalogue"
          title="Choisissez le support adapté à votre besoin."
          text="Les délais sont indicatifs et peuvent varier selon la complexité du projet."
        />
        <div className="serviceDetailGrid">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article className="serviceDetailCard" id={service.slug} key={service.slug}>
                <div className="serviceDetailHeader">
                  <Icon size={26} aria-hidden="true" />
                  <div>
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>
                  </div>
                </div>

                <div className="benefitList">
                  {service.benefits.map((benefit) => (
                    <span key={benefit}>
                      <Gem size={16} aria-hidden="true" />
                      {benefit}
                    </span>
                  ))}
                </div>

                <div className="serviceMeta">
                  <span>
                    <Clock3 size={16} aria-hidden="true" />
                    Délai : {service.delay}
                  </span>
                  <div className="servicePriceDetail">
                    <strong>{service.price}</strong>
                    <small>{service.priceDetail}</small>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section centeredSection">
        <p className="eyebrow">Besoin sur mesure</p>
        <h2>Vous pouvez aussi combiner plusieurs supports dans un pack.</h2>
        <Link href="/tarifs" className="button secondary">
          Voir les tarifs
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <QuoteCta />
    </>
  );
}

