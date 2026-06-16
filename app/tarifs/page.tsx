import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  MessageCircle,
  Palette,
  PenLine,
  RefreshCcw,
  Wand2
} from "lucide-react";
import {
  HeroReveal,
  MotionButtonLink,
  MotionCard,
  RevealSection,
  StaggerGroup
} from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { JsonLd, breadcrumbJsonLd, createPageMetadata, pricesJsonLd } from "@/lib/seo";
import { services } from "@/lib/site-data";

export const metadata = createPageMetadata("tarifs");

const pricingServiceSlugs = [
  "publications-reseaux-sociaux",
  "stories",
  "cartes-fidelite",
  "flyers",
  "logos",
  "bannieres-facebook"
];

const pricingServiceImages: Record<string, string> = {
  "publications-reseaux-sociaux": "/images/services/service-publications-reseaux-sociaux.png",
  stories: "/images/services/service-stories.png",
  "cartes-fidelite": "/images/services/service-cartes-fidelite.png",
  flyers: "/images/services/service-flyers.png",
  logos: "/images/services/service-logos.png",
  "bannieres-facebook": "/images/services/service-bannieres-facebook.png"
};

const subscriptions = [
  {
    name: "Essentiel",
    price: "49 €/mois",
    description: "Pour garder une présence régulière sans y passer vos soirées.",
    features: ["4 publications", "2 stories", "conseils personnalisés"]
  },
  {
    name: "Équilibre",
    price: "89 €/mois",
    badge: "⭐ Recommandé",
    description: "La formule la plus adaptée pour vendre, informer et fidéliser.",
    features: ["8 publications", "4 stories", "accompagnement"]
  },
  {
    name: "Signature",
    price: "149 €/mois",
    description: "Pour une communication plus complète avec un suivi prioritaire.",
    features: [
      "12 publications",
      "8 stories",
      "priorité de traitement",
      "accompagnement premium"
    ]
  }
];

const advantages = [
  {
    icon: Palette,
    title: "Design professionnel"
  },
  {
    icon: Wand2,
    title: "Créations sur-mesure"
  },
  {
    icon: RefreshCcw,
    title: "Révisions incluses"
  },
  {
    icon: MessageCircle,
    title: "Accompagnement personnalisé"
  }
];

export default function TarifsPage() {
  const pricingServices = services.filter((service) =>
    pricingServiceSlugs.includes(service.slug)
  );

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

      <section className="pricingHero">
        <HeroReveal className="pricingHeroInner">
          <div className="pricingHeroCopy">
            <p className="eyebrow">Tarifs</p>
            <h1>Des tarifs simples pour développer votre image.</h1>
            <p>
              Choisissez la formule qui correspond à vos besoins. Je vous
              accompagne pour créer une communication professionnelle, cohérente
              et efficace.
            </p>
            <span>
              Virginie IA <Heart size={18} aria-hidden="true" />
            </span>
          </div>
          <div className="pricingHeroAvatar" aria-hidden="true">
            <Image
              src="/images/virginie-ia-avatar.webp"
              alt=""
              width={595}
              height={1425}
              priority
              className="pricingHeroAvatarImage"
            />
          </div>
        </HeroReveal>
      </section>

      <RevealSection className="section pricingServicesSection">
        <SectionHeading
          eyebrow="Tarifs à la carte"
          title="Prestations à la carte"
          text="Choisissez uniquement ce dont vous avez besoin."
        />
        <StaggerGroup className="pricingServiceGrid">
          {pricingServices.map((service) => (
            <MotionCard className="pricingServiceCard" key={service.slug}>
              <div className="pricingServiceImageWrap">
                <Image
                  src={pricingServiceImages[service.slug]}
                  alt={`Mockup ${service.title}`}
                  fill
                  className="pricingServiceImage"
                  sizes="(max-width: 640px) calc(100vw - 72px), (max-width: 980px) calc(50vw - 48px), 360px"
                />
              </div>
              <div className="pricingServiceBody">
                <div>
                  <h2>{service.title}</h2>
                  <p>{service.short}</p>
                  <small>{service.priceDetail}</small>
                </div>
                <div className="pricingServiceFooter">
                  <strong>{service.price}</strong>
                  <MotionButtonLink
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="button secondary"
                    ariaLabel={`Demander un devis pour ${service.title}`}
                  >
                    Demander un devis
                    <ArrowRight size={18} aria-hidden="true" />
                  </MotionButtonLink>
                </div>
              </div>
            </MotionCard>
          ))}
        </StaggerGroup>
      </RevealSection>

      <RevealSection className="section pricingSubscriptionsSection">
        <SectionHeading
          eyebrow="Abonnements"
          title="Des abonnements pensés pour votre visibilité"
          text="Gagnez du temps et restez visible toute l'année."
        />
        <StaggerGroup className="pricingSubscriptionGrid">
          {subscriptions.map((subscription) => (
            <MotionCard
              className={`pricingSubscriptionCard ${
                subscription.badge ? "recommended" : ""
              }`}
              key={subscription.name}
            >
              {subscription.badge ? (
                <span className="pricingSubscriptionBadge">{subscription.badge}</span>
              ) : null}
              <p className="pricingSubscriptionName">{subscription.name}</p>
              <strong>{subscription.price}</strong>
              <p>{subscription.description}</p>
              <div className="pricingSubscriptionFeatures">
                {subscription.features.map((feature) => (
                  <span key={feature}>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    {feature}
                  </span>
                ))}
              </div>
              <MotionButtonLink
                href={`/contact?formule=${encodeURIComponent(subscription.name)}`}
                className={subscription.badge ? "button primary" : "button secondary"}
                ariaLabel={`Choisir la formule ${subscription.name}`}
              >
                Choisir cette formule
                <ArrowRight size={18} aria-hidden="true" />
              </MotionButtonLink>
            </MotionCard>
          ))}
        </StaggerGroup>
      </RevealSection>

      <RevealSection className="section pricingAdvantagesSection">
        <SectionHeading
          eyebrow="Pourquoi choisir Studio V Creation"
          title="Un accompagnement pensé pour vous simplifier la communication."
        />
        <StaggerGroup className="pricingAdvantageGrid">
          {advantages.map((advantage) => {
            const Icon = advantage.icon;

            return (
              <MotionCard className="pricingAdvantageCard" key={advantage.title}>
                <Icon size={24} aria-hidden="true" />
                <h2>{advantage.title}</h2>
              </MotionCard>
            );
          })}
        </StaggerGroup>
      </RevealSection>

      <RevealSection className="section pricingAssistantSection">
        <div className="pricingAssistantAvatar" aria-hidden="true">
          <Image
            src="/images/virginie-ia-avatar.webp"
            alt=""
            width={595}
            height={1425}
            className="pricingAssistantImage"
          />
        </div>
        <div className="pricingAssistantCopy">
          <p className="eyebrow">Virginie IA</p>
          <h2>Besoin d’aide pour choisir la formule adaptée à votre projet ?</h2>
          <p>Je suis là pour vous guider.</p>
          <div className="pricingAssistantActions">
            <MotionButtonLink
              href="/contact?message=Bonjour%20Virginie%20IA%2C%20j%27ai%20besoin%20d%27aide%20pour%20choisir%20une%20formule."
              className="button secondary"
              ariaLabel="Parler à Virginie IA"
            >
              Parler à Virginie IA
              <MessageCircle size={18} aria-hidden="true" />
            </MotionButtonLink>
            <MotionButtonLink href="/contact" className="button primary">
              Demander un devis
              <ArrowRight size={18} aria-hidden="true" />
            </MotionButtonLink>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="pricingFinalCta">
        <div>
          <p className="eyebrow">Prêt à avancer ?</p>
          <h2>Prêt à développer votre image ?</h2>
          <p>Parlons ensemble de votre projet.</p>
        </div>
        <div className="pricingFinalActions">
          <MotionButtonLink href="/contact" className="button light">
            Demander un devis
            <ArrowRight size={18} aria-hidden="true" />
          </MotionButtonLink>
          <MotionButtonLink href="/contact" className="button ghostLight">
            Me contacter
            <PenLine size={18} aria-hidden="true" />
          </MotionButtonLink>
        </div>
      </RevealSection>
    </>
  );
}
