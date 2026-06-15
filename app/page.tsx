import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Crown,
  Gem,
  MessageCircle,
  Palette,
  PenTool,
  Quote,
  Send,
  Sparkles,
  Star,
  Wand2
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
import { SectionHeading } from "@/components/section-heading";
import {
  JsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
  servicesJsonLd
} from "@/lib/seo";
import { company, portfolioItems, services, testimonials } from "@/lib/site-data";

export const metadata = createPageMetadata("home");

const stats = [
  {
    value: "24-72 h",
    label: "pour les visuels simples selon le brief et la disponibilité."
  },
  {
    value: "10+",
    label: "formats de communication pour réseaux sociaux et supports print."
  },
  {
    value: "2",
    label: "séries de corrections incluses pour affiner le rendu."
  }
];

const processSteps = [
  {
    icon: MessageCircle,
    title: "Brief clair",
    text: "Vous envoyez votre activité, votre besoin, vos textes et vos inspirations."
  },
  {
    icon: Palette,
    title: "Direction visuelle",
    text: "Le support prend forme avec une esthétique cohérente, lisible et premium."
  },
  {
    icon: PenTool,
    title: "Création",
    text: "Les visuels sont conçus dans les formats adaptés à votre usage final."
  },
  {
    icon: Send,
    title: "Livraison",
    text: "Vous recevez des fichiers numériques prêts à publier ou à transmettre."
  }
];

const featuredServiceSlugs = [
  "publications-reseaux-sociaux",
  "stories",
  "flyers",
  "cartes-fidelite",
  "logos",
  "bannieres-facebook"
];

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
  const highlightedPortfolio = portfolioItems.slice(0, 4);

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

      <RevealSection className="trustStrip" aria-label="Preuves rapides">
        <span>Rose poudré</span>
        <span>Rose gold</span>
        <span>Mobile first</span>
        <span>Fichiers numériques</span>
        <span>Prêt à publier</span>
      </RevealSection>

      <RevealSection className="section splitSection">
        <div>
          <p className="eyebrow">Positionnement</p>
          <h2>Le studio qui transforme vos idées en supports soignés.</h2>
        </div>
        <div className="richText">
          <p>
            Les petites structures ont besoin de supports beaux, clairs et
            rapides à utiliser. Studio V Creation simplifie cette étape avec
            une direction visuelle féminine chic, moderne et professionnelle.
          </p>
          <p>
            Chaque création est pensée pour inspirer confiance dès les premières
            secondes, que ce soit sur Instagram, Facebook, TikTok, en vitrine ou
            dans les mains de vos clients.
          </p>
        </div>
      </RevealSection>

      <RevealSection className="section">
        <SectionHeading
          eyebrow="Chiffres clés"
          title="Une méthode claire pour avancer vite, sans perdre le niveau de détail."
          text="Des repères simples pour comprendre le rythme, le périmètre et la valeur de chaque création."
        />
        <StaggerGroup className="cardGrid threeColumns">
          {stats.map((stat) => (
            <MotionCard className="serviceCard" key={stat.value}>
              <Gem size={24} aria-hidden="true" />
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </MotionCard>
          ))}
        </StaggerGroup>
      </RevealSection>

      <RevealSection className="section blushBand">
        <SectionHeading
          eyebrow="Processus"
          title="Un déroulé simple, élégant et orienté livraison."
          text="Chaque étape est cadrée pour éviter les allers-retours inutiles et obtenir un support exploitable rapidement."
        />
        <StaggerGroup className="cardGrid fourColumns">
          {processSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <MotionCard className="reasonCard" key={step.title}>
                <Icon size={24} aria-hidden="true" />
                <h3>
                  {String(index + 1).padStart(2, "0")} · {step.title}
                </h3>
                <p>{step.text}</p>
              </MotionCard>
            );
          })}
        </StaggerGroup>
      </RevealSection>

      <RevealSection className="section">
        <SectionHeading
          eyebrow="Services vedettes"
          title="Les essentiels pour une présence plus professionnelle."
          text="Des supports pensés pour annoncer, vendre, fidéliser et harmoniser votre image de marque."
        />
        <StaggerGroup className="cardGrid threeColumns">
          {featuredServices.map((service) => {
            const Icon = service.icon;

            return (
              <MotionCard className="serviceCard" key={service.slug}>
                <Icon size={24} aria-hidden="true" />
                <h3>{service.title}</h3>
                <p>{service.short}</p>
                <span>{service.price}</span>
              </MotionCard>
            );
          })}
        </StaggerGroup>
        <div className="centerAction">
          <MotionButtonLink href="/services" className="button secondary">
            Explorer tous les services
            <ArrowRight size={18} aria-hidden="true" />
          </MotionButtonLink>
        </div>
      </RevealSection>

      <RevealSection className="section portfolioPreview">
        <div>
          <SectionHeading
            eyebrow="Portfolio"
            title="Une vitrine visuelle pensée comme une collection."
            text="Mettez en avant vos publications, flyers, cartes, affiches et logos dans une galerie claire et raffinée."
          />
          <div className="checkList">
            {highlightedPortfolio.map((item) => (
              <span key={item.title}>
                <CheckCircle2 size={18} aria-hidden="true" />
                {item.title}
              </span>
            ))}
          </div>
          <div className="centerAction">
            <MotionButtonLink href="/portfolio" className="button secondary">
              Découvrir les créations
              <ArrowRight size={18} aria-hidden="true" />
            </MotionButtonLink>
          </div>
        </div>
        <Image
          src="/images/studio-v-portfolio.webp"
          alt="Portfolio premium de supports de communication Studio V Creation"
          width={720}
          height={720}
          className="portfolioImage"
        />
      </RevealSection>

      <RevealSection className="quoteCta">
        <div>
          <p className="eyebrow">Offre stratégique</p>
          <h2>Votre prochaine campagne peut être prête à publier.</h2>
          <p>
            Idéal pour une ouverture, une promotion, une nouvelle prestation ou
            une reprise de communication plus cohérente.
          </p>
        </div>
        <MotionButtonLink href="/tarifs" className="button light">
          Voir les tarifs
          <ArrowRight size={18} aria-hidden="true" />
        </MotionButtonLink>
      </RevealSection>

      <RevealSection className="section">
        <SectionHeading
          eyebrow="Témoignages"
          title="Une expérience pensée pour rassurer autant que pour séduire."
          text="Exemples de retours clients présentés à titre illustratif."
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

      <RevealSection className="section splitSection">
        <div>
          <p className="eyebrow">Signature premium</p>
          <h2>Un style minimaliste qui laisse votre message respirer.</h2>
        </div>
        <StaggerGroup className="cardGrid">
          <MotionCard className="reasonCard">
            <Crown size={24} aria-hidden="true" />
            <h3>Féminin chic</h3>
            <p>
              Des compositions douces, élégantes et professionnelles, adaptées
              aux univers beauté, restauration, artisanat et commerce local.
            </p>
          </MotionCard>
          <MotionCard className="reasonCard">
            <Wand2 size={24} aria-hidden="true" />
            <h3>Prêt à l’emploi</h3>
            <p>
              Les fichiers sont livrés dans des formats utilisables rapidement,
              sans étape technique supplémentaire côté client.
            </p>
          </MotionCard>
          <MotionCard className="reasonCard">
            <Clock3 size={24} aria-hidden="true" />
            <h3>Lisibilité commerciale</h3>
            <p>
              Chaque support met en avant une offre, une information ou une
              action claire pour faciliter la prise de décision.
            </p>
          </MotionCard>
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

