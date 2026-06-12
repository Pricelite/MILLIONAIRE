import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Crown, Sparkles } from "lucide-react";
import { QuoteCta } from "@/components/quote-cta";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";
import {
  JsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
  servicesJsonLd
} from "@/lib/seo";
import {
  audiences,
  company,
  extraServices,
  reasons,
  services,
  testimonials
} from "@/lib/site-data";

export const metadata = createPageMetadata("home");

export default function Home() {
  const featuredServices = services.slice(0, 6);

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Accueil", path: "/" }]), servicesJsonLd]} />
      <section className="hero">
        <Image
          src="/images/studio-v-hero.png"
          alt="Supports de communication élégants rose poudré et rose gold"
          fill
          priority
          className="heroImage"
          sizes="100vw"
        />
        <div className="heroOverlay" />
        <div className="heroContent">
          <p className="eyebrow heroEyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Communication prête à publier
          </p>
          <h1>{company.name}</h1>
          <p className="heroSlogan">{company.slogan}</p>
          <p className="heroLead">{company.description}</p>
          <div className="heroActions">
            <Link href="/contact" className="button primary">
              Demander un devis
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/portfolio" className="button ghost">
              Voir les créations
            </Link>
          </div>
        </div>
      </section>

      <section className="trustStrip" aria-label="Clientèle accompagnée">
        {audiences.slice(0, 7).map((audience) => (
          <span key={audience}>{audience}</span>
        ))}
      </section>

      <section className="section splitSection">
        <div>
          <p className="eyebrow">Présentation</p>
          <h2>Des supports professionnels pour les petites structures qui veulent gagner en crédibilité.</h2>
        </div>
        <div className="richText">
          <p>
            Studio V. Création conçoit des visuels simples à utiliser,
            cohérents et adaptés aux besoins du quotidien : réseaux sociaux,
            cartes, flyers, affiches, menus, logos simples et bannières.
          </p>
          <p>
            L’objectif est clair : vous faire gagner du temps, professionnaliser
            votre image et vous livrer des fichiers prêts à publier.
          </p>
        </div>
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Services"
          title="Tout ce qu’il faut pour communiquer avec style."
          text="Choisissez un support ponctuel ou composez un pack selon vos besoins du moment."
        />
        <div className="cardGrid threeColumns">
          {featuredServices.map((service) => {
            const Icon = service.icon;

            return (
              <article className="serviceCard" key={service.slug}>
                <Icon size={24} aria-hidden="true" />
                <h3>{service.title}</h3>
                <p>{service.short}</p>
                <span>{service.price}</span>
              </article>
            );
          })}
        </div>
        <div className="centerAction">
          <Link href="/services" className="button secondary">
            Découvrir tous les services
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section blushBand">
        <SectionHeading
          eyebrow="Pourquoi Studio V ?"
          title="Un rendu premium, sans complexité."
        />
        <div className="cardGrid fourColumns">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <article className="reasonCard" key={reason.title}>
                <Icon size={24} aria-hidden="true" />
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section portfolioPreview">
        <div>
          <SectionHeading
            eyebrow="Portfolio"
            title="Des emplacements prêts pour vos futures créations."
            text="La galerie est pensée pour présenter vos publications, flyers, cartes, affiches et logos."
          />
          <Link href="/portfolio" className="button secondary">
            Ouvrir la galerie
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <Image
          src="/images/studio-v-portfolio.png"
          alt="Galerie de supports de communication rose poudré"
          width={720}
          height={720}
          className="portfolioImage"
        />
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Témoignages"
          title="Des clientes rassurées par une image plus professionnelle."
        />
        <div className="cardGrid threeColumns">
          {testimonials.map((testimonial) => (
            <article className="testimonialCard" key={testimonial.author}>
              <Crown size={22} aria-hidden="true" />
              <p>“{testimonial.quote}”</p>
              <strong>{testimonial.author}</strong>
              <span>{testimonial.role}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section extrasSection">
        <div>
          <p className="eyebrow">Supports complémentaires</p>
          <h2>Une communication cohérente sur tous vos points de contact.</h2>
        </div>
        <div className="checkList">
          {extraServices.map((item) => (
            <span key={item}>
              <CheckCircle2 size={18} aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <QuoteCta />

      <section className="section contactPreview">
        <SectionHeading
          eyebrow="Contact"
          title="Décrivez votre besoin, je prépare votre devis."
          text="Le formulaire est déjà prêt pour collecter les demandes entrantes."
        />
        <ContactForm />
      </section>
    </>
  );
}
