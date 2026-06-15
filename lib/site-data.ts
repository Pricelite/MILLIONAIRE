import {
  BadgeEuro,
  Brush,
  Gift,
  Image as ImageIcon,
  LayoutTemplate,
  Megaphone,
  MessageCircle,
  MonitorSmartphone,
  PanelsTopLeft,
  Sparkles,
  Star,
  Store,
  Ticket,
  Utensils
} from "lucide-react";

// Contenus centralisés pour modifier le site sans chercher dans chaque page.
export const company = {
  name: "Studio V Creation",
  slogan: "Je crée, vous publiez.",
  email: "contact.studio.vcreation@gmail.com",
  instagram: "https://www.instagram.com/studiovcreation",
  facebook: "https://www.facebook.com/studiovcreation",
  tiktok: "https://www.tiktok.com/@studiovcreation",
  x: "https://x.com/studiovcreation",
  linkedin: "https://www.linkedin.com/company/studio-v-creation",
  description:
    "Studio V Creation accompagne les commerçants, artisans, indépendants, associations et petites entreprises dans la création de supports de communication prêts à l’emploi."
};

// Zones à modifier avant publication des mentions légales.
export const legalInfo = {
  ownerName: "Studio V Creation",
  legalStatus: "Entreprise individuelle / micro-entreprise",
  address: "19 rue de la Tuilerie, 45240 La Ferté-Saint-Aubin, France",
  phone: "07 84 14 97 13",
  email: company.email,
  // TODO: renseigner le SIRET réel avant publication.
  siret: "En attente d’attribution",
  publicationDirector: "Virginie Cassegarin",
  hostingProvider: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    phone: "Non communiqué par l’hébergeur",
    website: "https://vercel.com"
  }
};

// Paramètres contractuels modifiables pour les Conditions Générales de Vente.
export const salesTermsInfo = {
  versionDate: "12 juin 2026",
  quoteValidityDays: 30,
  depositRate: "50 %",
  balancePaymentMoment: "avant la livraison finale des fichiers",
  includedRevisionRounds: 2,
  extraRevisionBilling:
    "Toute modification supplémentaire peut faire l’objet d’un devis complémentaire.",
  deliveryMethod: "livraison numérique par e-mail, lien de téléchargement ou espace partagé",
  fileFormats:
    "PNG, JPG, PDF ou autre format convenu lors de la commande",
  cancellationBeforeStart:
    "En cas d’annulation avant le démarrage de la prestation, les sommes versées peuvent être remboursées déduction faite des frais déjà engagés.",
  cancellationAfterStart:
    "En cas d’annulation après le démarrage, les sommes correspondant au travail déjà réalisé restent dues.",
  governingLaw: "droit français"
};

export const audiences = [
  "Coiffeurs",
  "Esthéticiennes",
  "Prothésistes ongulaires",
  "Tatoueurs",
  "Restaurants",
  "Snacks",
  "Boulangeries",
  "Artisans",
  "Commerçants",
  "Auto-entrepreneurs",
  "Associations"
];

export const services = [
  {
    slug: "publications-reseaux-sociaux",
    icon: MonitorSmartphone,
    title: "Publications réseaux sociaux",
    short: "Posts Facebook, Instagram et TikTok prêts à publier.",
    description:
      "Création de visuels adaptés à votre activité, votre offre et votre ton de marque pour alimenter vos réseaux avec régularité.",
    benefits: [
      "Format adapté à chaque plateforme",
      "Design cohérent avec votre image",
      "Message clair pour générer des demandes"
    ],
    delay: "24 à 72 h",
    price: "à partir de 10 €"
  },
  {
    slug: "stories",
    icon: PanelsTopLeft,
    title: "Stories",
    short: "Stories élégantes pour annoncer, vendre ou informer.",
    description:
      "Stories promotionnelles, informatives ou événementielles pour rester visible auprès de votre communauté.",
    benefits: [
      "Format vertical optimisé mobile",
      "Lisibilité rapide",
      "Style premium et professionnel"
    ],
    delay: "24 à 48 h",
    price: "à partir de 5 €"
  },
  {
    slug: "cartes-fidelite",
    icon: Ticket,
    title: "Cartes de fidélité",
    short: "Cartes imprimables pour fidéliser vos clients.",
    description:
      "Création d’une carte claire, élégante et adaptée à votre commerce pour encourager les retours clients.",
    benefits: [
      "Recto ou recto-verso",
      "Fichier prêt à imprimer",
      "Design cohérent avec votre univers"
    ],
    delay: "2 à 4 jours",
    price: "20 €"
  },
  {
    slug: "cartes-cadeaux",
    icon: Gift,
    title: "Cartes cadeaux",
    short: "Supports prêts à offrir pour vos prestations.",
    description:
      "Carte cadeau moderne et professionnelle, idéale pour salons, instituts, restaurants et prestations artisanales.",
    benefits: [
      "Mise en valeur de votre offre",
      "Format digital ou imprimable",
      "Aspect soigné et rassurant"
    ],
    delay: "2 à 4 jours",
    price: "20 €"
  },
  {
    slug: "flyers",
    icon: Megaphone,
    title: "Flyers",
    short: "Flyers promotionnels pour vos offres et événements.",
    description:
      "Conception d’un flyer impactant pour présenter une promotion, une ouverture, un événement ou une offre spéciale.",
    benefits: [
      "Hiérarchie claire de l’information",
      "Format imprimable",
      "Appel à l’action visible"
    ],
    delay: "3 à 5 jours",
    price: "25 €"
  },
  {
    slug: "affiches",
    icon: ImageIcon,
    title: "Affiches",
    short: "Affiches promotionnelles lisibles et attractives.",
    description:
      "Affiches pour vitrine, événement, lancement ou communication locale avec une composition professionnelle.",
    benefits: [
      "Format web ou impression",
      "Design premium",
      "Message visible au premier regard"
    ],
    delay: "3 à 5 jours",
    price: "25 €"
  },
  {
    slug: "cartes-visite",
    icon: BadgeEuro,
    title: "Cartes de visite",
    short: "Cartes professionnelles alignées à votre image.",
    description:
      "Carte de visite simple, chic et lisible pour laisser une première impression professionnelle.",
    benefits: [
      "Recto ou recto-verso",
      "Coordonnées bien organisées",
      "Fichier prêt à imprimer"
    ],
    delay: "2 à 4 jours",
    price: "20 €"
  },
  {
    slug: "menus",
    icon: Utensils,
    title: "Menus",
    short: "Menus et grilles tarifaires clairs et élégants.",
    description:
      "Création de menus pour restaurants, snacks, salons, instituts ou prestations avec une lecture fluide.",
    benefits: [
      "Structure claire des catégories",
      "Design adapté à votre univers",
      "Format digital ou imprimable"
    ],
    delay: "3 à 6 jours",
    price: "35 €"
  },
  {
    slug: "logos",
    icon: Sparkles,
    title: "Logos simples",
    short: "Logo simple pour poser les bases de votre image.",
    description:
      "Création d’un logo accessible, propre et utilisable sur vos supports de communication essentiels.",
    benefits: [
      "Direction visuelle claire",
      "Fichiers web fournis",
      "Déclinaisons simples possibles"
    ],
    delay: "4 à 7 jours",
    price: "50 €"
  },
  {
    slug: "bannieres-facebook",
    icon: LayoutTemplate,
    title: "Bannières Facebook",
    short: "Couvertures Facebook professionnelles.",
    description:
      "Bannière adaptée à votre page Facebook pour présenter votre activité, vos horaires ou votre univers.",
    benefits: [
      "Format couverture optimisé",
      "Image de page plus crédible",
      "Message d’accueil clair"
    ],
    delay: "24 à 72 h",
    price: "20 €"
  }
];

export const extraServices = [
  "Photos de profil professionnelles",
  "Calendriers éditoriaux",
  "Grilles tarifaires",
  "Supports événementiels",
  "Déclinaisons de visuels existants"
];

export const priceItems = [
  ["Publication simple", "10 €"],
  ["Pack 5 publications", "45 €"],
  ["Pack 10 publications", "80 €"],
  ["Story", "5 €"],
  ["Pack 10 stories", "40 €"],
  ["Calendrier éditorial", "30 €"],
  ["Carte de fidélité", "20 €"],
  ["Carte cadeau", "20 €"],
  ["Carte de visite", "20 €"],
  ["Flyer", "25 €"],
  ["Affiche promotionnelle", "25 €"],
  ["Menu", "35 €"],
  ["Logo simple", "50 €"],
  ["Bannière Facebook", "20 €"],
  ["Photo de profil", "15 €"]
];

export const packs = [
  {
    name: "Pack Découverte",
    price: "49 €",
    description: "Idéal pour tester une première série de supports.",
    features: ["3 publications", "2 stories", "1 photo de profil", "Mini direction visuelle"]
  },
  {
    name: "Pack Commerçant",
    price: "99 €",
    description: "Pour une présence locale plus complète et cohérente.",
    features: ["6 publications", "5 stories", "1 flyer ou carte", "Adaptation Facebook"]
  },
  {
    name: "Pack Premium",
    price: "149 €",
    description: "Pour préparer un lancement ou une communication complète.",
    features: ["10 publications", "10 stories", "1 support imprimable", "Bannière Facebook"]
  }
];

export const portfolioItems = [
  { title: "Publication Instagram", category: "Réseaux sociaux", tone: "Lancement beauté" },
  { title: "Flyer promotionnel", category: "Print", tone: "Offre commerce local" },
  { title: "Carte de fidélité", category: "Fidélisation", tone: "Institut chic" },
  { title: "Affiche événement", category: "Affiche", tone: "Annonce premium" },
  { title: "Logo simple", category: "Identité", tone: "Auto-entrepreneur" },
  { title: "Menu snack", category: "Menu", tone: "Lecture rapide" }
];

export const testimonials = [
  {
    quote:
      "Studio V Creation a donné une vraie cohérence à mes publications. Je gagne du temps et mon salon paraît beaucoup plus professionnel.",
    author: "Mélissa R.",
    role: "Coiffeuse indépendante"
  },
  {
    quote:
      "Les flyers étaient propres, lisibles et prêts à envoyer à l’impression. J’ai reçu plusieurs demandes après la diffusion.",
    author: "Karim B.",
    role: "Restaurant rapide"
  },
  {
    quote:
      "J’avais besoin d’une image plus soignée pour mon activité. Le résultat est élégant, simple à utiliser et livré rapidement.",
    author: "Anaïs L.",
    role: "Prothésiste ongulaire"
  }
];

export const reasons = [
  {
    icon: Brush,
    title: "Design prêt à publier",
    text: "Chaque support est livré dans un format exploitable immédiatement."
  },
  {
    icon: Store,
    title: "Pensé pour les petites structures",
    text: "Les offres restent simples, lisibles et adaptées aux besoins du terrain."
  },
  {
    icon: Star,
    title: "Image premium accessible",
    text: "Un rendu soigné pour inspirer confiance sans complexifier le projet."
  },
  {
    icon: MessageCircle,
    title: "Accompagnement clair",
    text: "Vous savez quoi fournir, ce qui sera livré et dans quel délai."
  }
];

