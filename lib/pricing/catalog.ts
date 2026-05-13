import { CatalogItem, PricingRegion } from "./types";

function item(
  code: string,
  label: string,
  category: CatalogItem["category"],
  unit: string,
  unitPrice: number,
  vatRate: number,
  tags: string[]
): CatalogItem {
  return { code, label, category, unit, unitPrice, vatRate, tags };
}

const BASE_CATALOG: CatalogItem[] = [
  // Carrelage
  item("CARRE_CERAM", "Carrelage ceramique standard", "materiau", "m2", 28, 0.2, ["carrelage", "sol", "mur"]),
  item("CARRE_GRES", "Carrelage gres cerame", "materiau", "m2", 42, 0.2, ["carrelage", "gres", "sol"]),
  item("FAIENCE", "Faience murale", "materiau", "m2", 31, 0.2, ["carrelage", "faience", "mur"]),
  item("COLLE_CARRE", "Colle carrelage", "materiau", "kg", 1.6, 0.2, ["carrelage", "colle"]),
  item("JOINT_CARRE", "Joint carrelage", "materiau", "kg", 2.2, 0.2, ["carrelage", "joint"]),
  item("RAGREAGE", "Ragreage autolissant", "materiau", "kg", 0.95, 0.2, ["carrelage", "sol", "preparation"]),
  item("PLINTHE_CARRE", "Plinthe carrelage", "materiau", "ml", 8.5, 0.2, ["carrelage", "plinthe"]),

  // Peinture / placo
  item("SOUS_COUCHE", "Sous-couche", "materiau", "l", 7.4, 0.2, ["peinture", "preparation"]),
  item("PEINT_MAT", "Peinture mate mur/plafond", "materiau", "l", 10.8, 0.2, ["peinture", "mur", "plafond"]),
  item("PEINT_SATIN", "Peinture satin lessivable", "materiau", "l", 12.5, 0.2, ["peinture", "mur"]),
  item("ENDUIT_LISSAGE", "Enduit de lissage", "materiau", "kg", 1.35, 0.2, ["peinture", "enduit"]),
  item("BANDE_JOINT", "Bande a joint placo", "materiau", "ml", 0.38, 0.2, ["placo", "joint"]),
  item("PLAQUE_BA13", "Plaque BA13", "materiau", "m2", 9.5, 0.2, ["placo", "cloison"]),
  item("RAIL_PLACO", "Rail placo", "materiau", "ml", 2.8, 0.2, ["placo", "ossature"]),

  // Electricite
  item("CABLE_15", "Cable electrique 1.5mm2", "materiau", "ml", 1.35, 0.2, ["electricite", "cable"]),
  item("CABLE_25", "Cable electrique 2.5mm2", "materiau", "ml", 1.9, 0.2, ["electricite", "cable"]),
  item("CABLE_6", "Cable electrique 6mm2", "materiau", "ml", 3.8, 0.2, ["electricite", "cable"]),
  item("GAINE_ICTA", "Gaine ICTA", "materiau", "ml", 0.95, 0.2, ["electricite", "gaine"]),
  item("PRISE", "Prise electrique", "materiau", "u", 12, 0.2, ["electricite", "prise"]),
  item("INTERRUPTEUR", "Interrupteur", "materiau", "u", 11, 0.2, ["electricite", "interrupteur"]),
  item("DISJONCTEUR", "Disjoncteur modulaire", "materiau", "u", 26, 0.2, ["electricite", "tableau"]),
  item("TABLEAU_ELEC", "Tableau electrique", "materiau", "u", 220, 0.2, ["electricite", "tableau"]),
  item("LUMINAIRE", "Luminaire standard", "materiau", "u", 55, 0.2, ["electricite", "luminaire"]),

  // Plomberie
  item("TUBE_CUIVRE", "Tube cuivre plomberie", "materiau", "ml", 9.8, 0.2, ["plomberie", "tube"]),
  item("TUBE_PER", "Tube PER", "materiau", "ml", 2.9, 0.2, ["plomberie", "tube"]),
  item("MULTICOUCHE", "Tube multicouche", "materiau", "ml", 4.4, 0.2, ["plomberie", "tube"]),
  item("RACCORD_PLOMB", "Raccord plomberie", "materiau", "u", 4.2, 0.2, ["plomberie", "raccord"]),
  item("SIPHON", "Siphon", "materiau", "u", 19, 0.2, ["plomberie", "evacuation"]),
  item("MITIGEUR", "Mitigeur lavabo", "materiau", "u", 89, 0.2, ["plomberie", "robinetterie"]),
  item("WC", "WC complet", "materiau", "u", 240, 0.2, ["plomberie", "wc"]),
  item("LAVABO", "Lavabo", "materiau", "u", 95, 0.2, ["plomberie", "lavabo"]),
  item("CHAUFFE_EAU", "Chauffe-eau 200L", "materiau", "u", 690, 0.2, ["plomberie", "chauffe-eau"]),

  // Menuiserie / fermetures
  item("PARQUET_STRAT", "Parquet stratifie", "materiau", "m2", 24, 0.2, ["menuiserie", "parquet"]),
  item("PARQUET_MASSIF", "Parquet massif", "materiau", "m2", 58, 0.2, ["menuiserie", "parquet"]),
  item("PLINTHE_BOIS", "Plinthe bois", "materiau", "ml", 6.8, 0.2, ["menuiserie", "plinthe"]),
  item("BLOC_PORTE", "Bloc porte interieur", "materiau", "u", 210, 0.2, ["menuiserie", "porte"]),
  item("PORTE_GAL", "Porte galandage", "materiau", "u", 460, 0.2, ["menuiserie", "porte"]),
  item("FENETRE_PVC", "Fenetre PVC", "materiau", "u", 390, 0.2, ["menuiserie", "fenetre"]),
  item("VOLET_ROULANT", "Volet roulant", "materiau", "u", 330, 0.2, ["menuiserie", "volet"]),
  item("DRESSING", "Kit dressing", "materiau", "u", 520, 0.2, ["menuiserie", "rangement"]),

  // Maconnerie / facade / toiture
  item("PARPAING", "Parpaing creux", "materiau", "u", 2.1, 0.2, ["maconnerie", "mur"]),
  item("BETON", "Beton pret a l'emploi", "materiau", "m3", 148, 0.2, ["maconnerie", "beton"]),
  item("TREILLIS", "Treillis soude", "materiau", "u", 42, 0.2, ["maconnerie", "dalle"]),
  item("MORTIER", "Mortier", "materiau", "kg", 0.62, 0.2, ["maconnerie", "mortier"]),
  item("ENDUIT_FACADE", "Enduit facade", "materiau", "m2", 13.5, 0.2, ["facade", "enduit"]),
  item("ISOLANT_EXT", "Isolant exterieur", "materiau", "m2", 29, 0.2, ["isolation", "exterieur"]),
  item("TUILE", "Tuile terre cuite", "materiau", "u", 1.8, 0.2, ["toiture", "tuile"]),
  item("ECRAN_TOITURE", "Ecran sous-toiture", "materiau", "m2", 4.6, 0.2, ["toiture", "etancheite"]),
  item("GOUTTIERE_ZINC", "Gouttiere zinc", "materiau", "ml", 18.5, 0.2, ["toiture", "gouttiere"]),

  // Sols / exterieur / paysagisme
  item("TERRE_VEGETALE", "Terre vegetale", "materiau", "m3", 38, 0.2, ["paysagiste", "terre"]),
  item("GAZON_ROULEAU", "Gazon en rouleau", "materiau", "m2", 8.2, 0.2, ["paysagiste", "gazon"]),
  item("GRAVIER", "Gravier decoratif", "materiau", "m3", 76, 0.2, ["paysagiste", "gravier"]),
  item("BORDURE_JARDIN", "Bordure jardin", "materiau", "ml", 7.2, 0.2, ["paysagiste", "bordure"]),
  item("DALLE_TERRASSE", "Dalle terrasse", "materiau", "m2", 34, 0.2, ["terrasse", "dalle"]),
  item("BOIS_TERRASSE", "Lame terrasse bois", "materiau", "m2", 62, 0.2, ["terrasse", "bois"]),
  item("GEOTEXTILE", "Geotextile", "materiau", "m2", 1.6, 0.2, ["paysagiste", "sol"]),

  // Isolations
  item("LAINE_VERRE", "Laine de verre", "materiau", "m2", 8.4, 0.2, ["isolation", "combles"]),
  item("LAINE_ROCHE", "Laine de roche", "materiau", "m2", 11.2, 0.2, ["isolation", "mur"]),
  item("PSE", "Panneau PSE", "materiau", "m2", 12.5, 0.2, ["isolation", "polystyrene"]),
  item("MEMBRANE_VAPEUR", "Membrane pare-vapeur", "materiau", "m2", 2.4, 0.2, ["isolation", "etancheite"]),

  // Main-d'oeuvre metier
  item("MO_CARRE", "Pose carrelage", "main_oeuvre", "heure", 48, 0.1, ["carrelage", "pose"]),
  item("MO_FAIENCE", "Pose faience murale", "main_oeuvre", "heure", 47, 0.1, ["carrelage", "faience"]),
  item("MO_PEINT", "Peinture interieure", "main_oeuvre", "heure", 44, 0.1, ["peinture"]),
  item("MO_PLACO", "Pose placo", "main_oeuvre", "heure", 46, 0.1, ["placo"]),
  item("MO_PLOMB", "Travaux plomberie", "main_oeuvre", "heure", 55, 0.1, ["plomberie"]),
  item("MO_ELEC", "Travaux electricite", "main_oeuvre", "heure", 56, 0.1, ["electricite"]),
  item("MO_MENUIS", "Pose menuiserie", "main_oeuvre", "heure", 52, 0.1, ["menuiserie"]),
  item("MO_MACON", "Travaux maconnerie", "main_oeuvre", "heure", 50, 0.1, ["maconnerie"]),
  item("MO_TOIT", "Travaux couverture", "main_oeuvre", "heure", 59, 0.1, ["toiture"]),
  item("MO_FACADE", "Travaux facade", "main_oeuvre", "heure", 49, 0.1, ["facade"]),
  item("MO_ISO", "Pose isolation", "main_oeuvre", "heure", 47, 0.1, ["isolation"]),
  item("MO_PAYSAGE", "Travaux paysagers", "main_oeuvre", "heure", 42, 0.1, ["paysagiste"]),
  item("MO_NETTOYAGE", "Nettoyage fin de chantier", "main_oeuvre", "heure", 34, 0.1, ["nettoyage"]),

  // Frais / forfaits
  item("DEPLACEMENT", "Deplacement chantier", "frais", "forfait", 35, 0.2, ["frais", "deplacement"]),
  item("PROTECTION", "Protection et nettoyage", "frais", "forfait", 48, 0.2, ["frais", "protection"]),
  item("LIVRAISON", "Livraison materiaux", "frais", "forfait", 65, 0.2, ["frais", "logistique"]),
  item("BENNE", "Location benne gravats", "frais", "forfait", 290, 0.2, ["frais", "dechets"]),
  item("STATIONNEMENT", "Frais stationnement", "frais", "forfait", 24, 0.2, ["frais", "stationnement"]),
  item("ECHAFAUDAGE", "Location echafaudage", "frais", "jour", 85, 0.2, ["frais", "echafaudage"]),
  item("ASSURANCE_CH", "Assurance chantier", "frais", "forfait", 42, 0.2, ["frais", "assurance"]),
  item("ETUDE_TECH", "Etude technique", "frais", "forfait", 120, 0.2, ["frais", "etude"])
];

const REGION_MULTIPLIER: Record<PricingRegion, number> = {
  fr_standard: 1,
  ile_de_france: 1.14,
  sud_est: 1.06,
  dom_tom: 1.18
};

export function getCatalog(region: PricingRegion) {
  const factor = REGION_MULTIPLIER[region];
  return BASE_CATALOG.map((item) => ({
    ...item,
    unitPrice: round2(item.unitPrice * factor)
  }));
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}
