import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Quote,
  Sparkles,
  Star
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import {
  HeroReveal,
  MotionButtonLink,
  MotionCard,
  MotionDetails,
  RevealSection,
  StaggerGroup
} from "@/components/motion-primitives";
import { ProjectInfographic } from "@/components/project-infographic";
import { SectionHeading } from "@/components/section-heading";
import {
  JsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
  servicesJsonLd
} from "@/lib/seo";
import { company, services, testimonials } from "@/lib/site-data";

export const metadata = createPageMetadata("home");

const featuredServiceSlugs = [
  "publications-reseaux-sociaux",
  "stories",
  "flyers",
  "cartes-fidelite",
  "logos",
  "bannieres-facebook"
];

const featuredServiceImages: Record<string, string> = {
  "publications-reseaux-sociaux": "/images/services/service-publications-reseaux-sociaux.png",
  stories: "/images/services/service-stories.png",
  "cartes-fidelite": "/images/services/service-cartes-fidelite.png",
  flyers: "/images/services/service-flyers.png",
  logos: "/images/services/service-logos.png",
  "bannieres-facebook": "/images/services/service-bannieres-facebook.png"
};

const premiumFaq = [
  {
    question: "Quels éléments dois-je fournir pour commander ?",
    answer:
      "Votre activité, le support souhaité, vos textes, vos couleurs, vos images si vous en avez, votre délai et vos inspirations."
  },
  {
    question: "Les fichiers sont-ils prêts à publier ?",
    answer:
      "Oui. Les supports sont livrés en format numérique adapté à l’usage prévu : réseaux sociaux, impression ou affichage web."
  },
  {
    question: "Puis-je demander des modifications ?",
    answer:
      "Oui. Les prestations prévoient des ajustements raisonnables afin de finaliser un rendu propre et cohérent avec votre besoin."
  },
  {
    question: "L’impression est-elle incluse ?",
    answer:
      "Non. Studio V Creation fournit les fichiers numériques. L’impression peut ensuite être réalisée auprès de l’imprimeur de votre choix."
  }
];

export default function Home() {
  const featuredServices = services.filter((service) =>
    featuredServiceSlugs.includes(service.slug)
  );

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Accueil", path: "/" }]), servicesJsonLd]} />

      <section className="hero">
        <Image
          src="/images/studio-v-hero.webp"
          alt="Supports de communication premium rose poudré et rose gold"
          fill
          priority
          className="heroImage"
          sizes="100vw"
        />
        <div className="heroOverlay" />
        <HeroReveal className="heroContent">
          <p className="eyebrow heroEyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Studio de communication graphique
          </p>
          <h1>Une image premium, prête à publier.</h1>
          <p className="heroSlogan">{company.slogan}</p>
          <p className="heroLead">
            {company.name} crée des publications, stories, flyers, cartes,
            menus, logos simples et bannières pour les commerces, artisans,
            indépendants et associations qui veulent une présence plus élégante.
          </p>
          <div className="heroActions">
            <MotionButtonLink href="/contact" className="button primary">
              Demander un devis
              <ArrowRight size={18} aria-hidden="true" />
            </MotionButtonLink>
            <MotionButtonLink href="/portfolio" className="button ghost">
              Voir le portfolio
            </MotionButtonLink>
          </div>
        </HeroReveal>
      </section>

      <RevealSection className="section featuredServicesSection">
        <div className="featuredServicesHeader">
          <div>
            <p className="eyebrow">SERVICES VEDETTES</p>
            <h2>Les essentiels pour une présence plus professionnelle.</h2>
            <p>
              Des supports pensés pour annoncer, vendre, fidéliser et harmoniser
              votre image de marque.
            </p>
          </div>
          <div className="featuredServicesAvatar">
            <Image
              src="/images/virginie-ia-avatar.webp"
              alt=""
              width={595}
              height={1425}
              className="featuredServicesAvatarImage"
            />
            <span>Accompagnement personnalisé</span>
          </div>
        </div>

        <StaggerGroup className="featuredServicesGrid">
          {featuredServices.map((service) => {
            const Icon = service.icon;

            return (
              <MotionCard className="featuredServiceCard" key={service.slug}>
                <div className="featuredServiceVisual">
                  <Image
                    src={featuredServiceImages[service.slug]}
                    alt={`Exemple visuel pour ${service.title}`}
                    fill
                    className="featuredServiceImage"
                    sizes="(max-width: 640px) calc(100vw - 72px), (max-width: 980px) calc(50vw - 48px), 360px"
                  />
                </div>
                <div className="featuredServiceMeta">
                  <span className="featuredServiceIcon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="featuredServicePrice">{service.price}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.short}</p>
                <small>{service.priceDetail}</small>
              </MotionCard>
            );
          })}
        </StaggerGroup>

        <MotionCard className="featuredServicesBanner">
          <div>
            <p>
              Des visuels qui vous ressemblent, pensés pour attirer, convaincre
              et fidéliser.
            </p>
            <div className="featuredServicesProofs">
              <span>
                <CheckCircle2 size={18} aria-hidden="true" />
                Design professionnel
              </span>
              <span>
                <CheckCircle2 size={18} aria-hidden="true" />
                Créations sur-mesure
              </span>
              <span>
                <CheckCircle2 size={18} aria-hidden="true" />
                Résultats concrets
              </span>
            </div>
          </div>
          <MotionButtonLink href="/services" className="button secondary">
            Explorer tous les services
            <ArrowRight size={18} aria-hidden="true" />
          </MotionButtonLink>
        </MotionCard>
      </RevealSection>

      <ProjectInfographic />

      <RevealSection className="section">
        <SectionHeading
          eyebrow="Témoignages"
          title="Une expérience simple, claire et rassurante."
          text="Des retours centrés sur l’écoute, la lisibilité et la qualité des supports livrés."
        />
        <StaggerGroup className="cardGrid threeColumns">
          {testimonials.map((testimonial) => (
            <MotionCard className="testimonialCard" key={testimonial.author}>
              <Quote size={22} aria-hidden="true" />
              <p>“{testimonial.quote}”</p>
              <strong>{testimonial.author}</strong>
              <span>{testimonial.role}</span>
            </MotionCard>
          ))}
        </StaggerGroup>
      </RevealSection>

      <RevealSection className="section blushBand">
        <SectionHeading
          eyebrow="FAQ"
          title="Les réponses avant de demander votre devis."
          text="Une sélection de questions fréquentes pour cadrer votre commande avec simplicité."
        />
        <StaggerGroup className="cardGrid">
          {premiumFaq.map((item) => (
            <MotionDetails className="reasonCard" key={item.question}>
              <summary>
                <Star size={18} aria-hidden="true" />
                {item.question}
              </summary>
              <p>{item.answer}</p>
            </MotionDetails>
          ))}
        </StaggerGroup>
      </RevealSection>

      <RevealSection className="section contactPreview">
        <SectionHeading
          eyebrow="Demande de devis"
          title="Décrivez votre projet, je prépare la suite."
          text="Indiquez votre activité, le support souhaité, votre délai et les éléments déjà disponibles."
        />
        <ContactForm />
      </RevealSection>
    </>
  );
}

