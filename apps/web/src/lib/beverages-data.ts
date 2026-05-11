export type BeverageSize = "Verre" | "Demi" | "Pinte" | "Bouteille";

export type BeverageCategory = {
  id: string;
  name: string;
  color: string;
  alcohol: "with" | "without" | "mixed";
};

export type BeverageItem = {
  id: string;
  name: string;
  categoryId: string;
  alcoholic: boolean;
  price: number;
  stock: number;
  image: string;
  promo?: string;
  happyHour?: { from: string; to: string; discountPercent: number };
  favorite?: boolean;
  sales: number;
  suggestedDishes: string[];
  sizes: BeverageSize[];
};

export const beverageSizes: Array<{ label: BeverageSize; multiplier: number }> = [
  { label: "Verre", multiplier: 1 },
  { label: "Demi", multiplier: 1.3 },
  { label: "Pinte", multiplier: 1.8 },
  { label: "Bouteille", multiplier: 2.4 }
];

export const beverageCategories: BeverageCategory[] = [
  { id: "softs", name: "Softs", color: "#38bdf8", alcohol: "without" },
  { id: "eaux", name: "Eaux", color: "#22d3ee", alcohol: "without" },
  { id: "jus", name: "Jus de fruits", color: "#fb923c", alcohol: "without" },
  { id: "cafes", name: "Cafes", color: "#92400e", alcohol: "without" },
  { id: "thes", name: "Thes & Infusions", color: "#22c55e", alcohol: "without" },
  { id: "cocktails-sans", name: "Cocktails sans alcool", color: "#34d399", alcohol: "without" },
  { id: "bieres", name: "Bieres", color: "#f59e0b", alcohol: "with" },
  { id: "vins-rouges", name: "Vins rouges", color: "#7f1d1d", alcohol: "with" },
  { id: "vins-blancs", name: "Vins blancs", color: "#fde68a", alcohol: "with" },
  { id: "roses", name: "Roses", color: "#f9a8d4", alcohol: "with" },
  { id: "champagnes", name: "Champagnes & Effervescents", color: "#eab308", alcohol: "with" },
  { id: "spiritueux", name: "Spiritueux", color: "#4c1d95", alcohol: "with" },
  { id: "cocktails-avec", name: "Cocktails alcoolises", color: "#22d3ee", alcohol: "with" },
  { id: "digestifs", name: "Digestifs", color: "#374151", alcohol: "with" }
];

const categoryImages: Record<string, string> = {
  softs: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=700&q=80",
  eaux: "https://images.unsplash.com/photo-1560847468-5eef330f455a?auto=format&fit=crop&w=700&q=80",
  jus: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=700&q=80",
  cafes: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=80",
  thes: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=700&q=80",
  "cocktails-sans": "https://images.unsplash.com/photo-1605270012917-bf157c5a9541?auto=format&fit=crop&w=700&q=80",
  bieres: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
  "vins-rouges": "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=700&q=80",
  "vins-blancs": "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=700&q=80",
  roses: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=80",
  champagnes: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=700&q=80",
  spiritueux: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=700&q=80",
  "cocktails-avec": "https://images.unsplash.com/photo-1563223771-375783ee91ad?auto=format&fit=crop&w=700&q=80",
  digestifs: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=700&q=80"
};

const pairings: Record<string, string[]> = {
  softs: ["Burger signature", "Pizza truffe"],
  eaux: ["Poisson grille", "Salade quinoa"],
  jus: ["Brunch", "Dessert du jour"],
  cafes: ["Tiramisu", "Fondant chocolat"],
  thes: ["Cheesecake", "Cookie maison"],
  "cocktails-sans": ["Tapas", "Planche veggie"],
  bieres: ["Burger", "Wings BBQ"],
  "vins-rouges": ["Entrecote", "Magret canard"],
  "vins-blancs": ["Saumon", "Risotto"],
  roses: ["Salade mediterraneenne", "Poke saumon"],
  champagnes: ["Huitres", "Carpaccio"],
  spiritueux: ["Cigare lounge", "Dessert praline"],
  "cocktails-avec": ["Nachos", "Tataki boeuf"],
  digestifs: ["Cafe gourmand", "Mignardises"]
};

const sizesByCategory: Record<string, BeverageSize[]> = {
  softs: ["Verre", "Demi", "Pinte", "Bouteille"],
  eaux: ["Verre", "Bouteille"],
  jus: ["Verre", "Pinte", "Bouteille"],
  cafes: ["Verre", "Demi"],
  thes: ["Verre", "Demi"],
  "cocktails-sans": ["Verre", "Pinte"],
  bieres: ["Demi", "Pinte", "Bouteille"],
  "vins-rouges": ["Verre", "Bouteille"],
  "vins-blancs": ["Verre", "Bouteille"],
  roses: ["Verre", "Bouteille"],
  champagnes: ["Verre", "Bouteille"],
  spiritueux: ["Verre", "Demi"],
  "cocktails-avec": ["Verre", "Pinte"],
  digestifs: ["Verre"]
};

const entries: Array<{ categoryId: string; alcoholic: boolean; names: string[]; basePrice: number }> = [
  { categoryId: "softs", alcoholic: false, basePrice: 4.5, names: ["Coca-Cola", "Pepsi", "Orangina", "Schweppes", "Ice Tea", "Sprite", "Fanta", "Limonade"] },
  { categoryId: "eaux", alcoholic: false, basePrice: 4.2, names: ["Evian", "Vittel", "Perrier", "San Pellegrino", "Badoit"] },
  { categoryId: "jus", alcoholic: false, basePrice: 5.2, names: ["Orange", "Pomme", "Ananas", "Mangue", "Multifruits", "Cranberry"] },
  { categoryId: "cafes", alcoholic: false, basePrice: 3.3, names: ["Espresso", "Double espresso", "Cappuccino", "Latte", "Americano", "Macchiato"] },
  { categoryId: "thes", alcoholic: false, basePrice: 3.8, names: ["The vert", "The noir", "Earl Grey", "Menthe", "Camomille", "Verveine"] },
  { categoryId: "cocktails-sans", alcoholic: false, basePrice: 8.5, names: ["Virgin Mojito", "Virgin Colada", "Virgin Spritz", "Shirley Temple"] },
  { categoryId: "bieres", alcoholic: true, basePrice: 6.8, names: ["Blonde", "Brune", "Blanche", "IPA", "Heineken", "Leffe", "Corona"] },
  { categoryId: "vins-rouges", alcoholic: true, basePrice: 7.9, names: ["Bordeaux", "Merlot", "Pinot Noir", "Cabernet Sauvignon"] },
  { categoryId: "vins-blancs", alcoholic: true, basePrice: 7.7, names: ["Chardonnay", "Sauvignon", "Riesling"] },
  { categoryId: "roses", alcoholic: true, basePrice: 7.5, names: ["Rose Provence", "Cote de Provence"] },
  { categoryId: "champagnes", alcoholic: true, basePrice: 11.9, names: ["Champagne", "Prosecco", "Cremant"] },
  { categoryId: "spiritueux", alcoholic: true, basePrice: 9.6, names: ["Whisky", "Vodka", "Gin", "Rhum", "Tequila", "Cognac"] },
  { categoryId: "cocktails-avec", alcoholic: true, basePrice: 10.2, names: ["Mojito", "Spritz", "Margarita", "Moscow Mule", "Pina Colada", "Negroni", "Cosmopolitan"] },
  { categoryId: "digestifs", alcoholic: true, basePrice: 7.8, names: ["Limoncello", "Get 27", "Baileys", "Chartreuse", "Calvados"] }
];

let id = 0;
export const beverageItems: BeverageItem[] = entries.flatMap((entry) =>
  entry.names.map((name, index) => {
    id += 1;
    const category = beverageCategories.find((item) => item.id === entry.categoryId);
    const price = Number((entry.basePrice + ((index % 3) * 0.7)).toFixed(2));
    const stock = 8 + ((id * 7) % 22);
    const promo = id % 9 === 0 ? "Promo -20%" : undefined;
    const happyHour = id % 5 === 0 ? { from: "17:00", to: "19:00", discountPercent: 15 } : undefined;
    const favorite = id % 6 === 0;
    const sales = 40 + ((id * 13) % 180);

    return {
      id: `bev-${id}`,
      name,
      categoryId: entry.categoryId,
      alcoholic: entry.alcoholic,
      price,
      stock,
      image: categoryImages[entry.categoryId],
      promo,
      happyHour,
      favorite,
      sales,
      suggestedDishes: pairings[entry.categoryId],
      sizes: sizesByCategory[entry.categoryId]
    };
  })
);

export const beverageSalesByHour = [
  { hour: "10h", value: 120 },
  { hour: "11h", value: 170 },
  { hour: "12h", value: 260 },
  { hour: "13h", value: 310 },
  { hour: "14h", value: 230 },
  { hour: "15h", value: 180 },
  { hour: "16h", value: 140 },
  { hour: "17h", value: 210 },
  { hour: "18h", value: 350 },
  { hour: "19h", value: 420 },
  { hour: "20h", value: 460 },
  { hour: "21h", value: 390 }
];

export const beverageHeatmap = [
  { time: "12h", softs: 26, eaux: 18, jus: 20, cafes: 14, thes: 9, cocktailsSans: 10, bieres: 16, vins: 14, cocktails: 12 },
  { time: "14h", softs: 22, eaux: 16, jus: 17, cafes: 18, thes: 12, cocktailsSans: 8, bieres: 11, vins: 10, cocktails: 9 },
  { time: "18h", softs: 19, eaux: 11, jus: 12, cafes: 8, thes: 6, cocktailsSans: 9, bieres: 22, vins: 18, cocktails: 20 },
  { time: "20h", softs: 28, eaux: 14, jus: 15, cafes: 7, thes: 5, cocktailsSans: 14, bieres: 33, vins: 26, cocktails: 31 },
  { time: "22h", softs: 17, eaux: 9, jus: 10, cafes: 5, thes: 4, cocktailsSans: 11, bieres: 25, vins: 22, cocktails: 27 }
];
