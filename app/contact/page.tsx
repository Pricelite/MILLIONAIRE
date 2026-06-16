import Link from "next/link";
import { Facebook, Instagram, Mail, Music2 } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { company } from "@/lib/site-data";
import { JsonLd, breadcrumbJsonLd, createPageMetadata, siteUrl } from "@/lib/seo";

export const metadata = createPageMetadata("contact");

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Studio V Creation",
  description:
    "Page de contact pour demander un devis de création de supports de communication.",
  url: `${siteUrl}/contact`,
  inLanguage: "fr-FR",
  mainEntity: {
    "@type": "Organization",
    name: company.name,
    email: company.email,
    url: siteUrl
  }
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Contact", path: "/contact" }
          ]),
          contactJsonLd
        ]}
      />
      <section className="pageHero">
        <p className="eyebrow">Contact</p>
        <h1>Demandez votre devis personnalisé.</h1>
        <p>
          Indiquez votre activité, le type de support souhaité, votre délai et
          les éléments déjà disponibles.
        </p>
      </section>

      <section className="section contactPageGrid">
        <div>
          <SectionHeading
            eyebrow="Formulaire"
            title="Envoyez les informations principales."
            text="Plus votre demande est précise, plus le devis pourra être clair."
          />
          <ContactForm />
        </div>

        <aside className="contactAside">
          <h2>Coordonnées</h2>
          <a href={`mailto:${company.email}`} className="contactLine">
            <Mail size={18} aria-hidden="true" />
            {company.email}
          </a>
          <div className="contactSocials">
            <Link href={company.instagram}>
              <Instagram size={18} aria-hidden="true" />
              Instagram
            </Link>
            <Link href={company.facebook}>
              <Facebook size={18} aria-hidden="true" />
              Facebook
            </Link>
            <Link href={company.tiktok}>
              <Music2 size={18} aria-hidden="true" />
              TikTok
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}

