export type TableState = "Libre" | "Occupee" | "Reservee" | "Paiement en attente";
export type OrderState = "En attente" | "En preparation" | "Prete" | "Servie" | "Annulee";

export type DashboardMetrics = {
  revenueToday: number;
  ordersToday: number;
  activeTables: number;
  reservationsToday: number;
};

export const dashboardMetrics: DashboardMetrics = {
  revenueToday: 8420,
  ordersToday: 126,
  activeTables: 18,
  reservationsToday: 42
};

export const salesSeries = [
  { label: "10h", sales: 320 },
  { label: "11h", sales: 450 },
  { label: "12h", sales: 980 },
  { label: "13h", sales: 1280 },
  { label: "14h", sales: 860 },
  { label: "15h", sales: 520 },
  { label: "16h", sales: 430 },
  { label: "17h", sales: 640 },
  { label: "18h", sales: 1020 },
  { label: "19h", sales: 1460 },
  { label: "20h", sales: 1660 },
  { label: "21h", sales: 1250 }
];

export const stockAlerts = [
  { name: "Saumon frais", level: 18, threshold: 25, supplier: "Atlantis Seafood" },
  { name: "Mozzarella", level: 12, threshold: 30, supplier: "Laiterie Centrale" },
  { name: "Menthe fraiche", level: 8, threshold: 20, supplier: "Green Farm" },
  { name: "Brioche burger", level: 21, threshold: 40, supplier: "Boulangerie Nova" }
];

export const recentActivity = [
  { id: "A1", title: "Commande #845 servie", detail: "Table 14 - 82 EUR", ago: "il y a 2 min" },
  { id: "A2", title: "Reservation confirmee", detail: "Famille Morel - 6 pers", ago: "il y a 5 min" },
  { id: "A3", title: "Alerte stock", detail: "Mozzarella sous seuil", ago: "il y a 9 min" },
  { id: "A4", title: "Paiement CB recu", detail: "Ticket #761 - 47 EUR", ago: "il y a 14 min" }
];

export const tables = [
  { id: "T1", zone: "Terrasse", state: "Libre" as TableState, seats: 2, server: "Amine", minutes: 0 },
  { id: "T2", zone: "Terrasse", state: "Occupee" as TableState, seats: 4, server: "Sarah", minutes: 38 },
  { id: "T3", zone: "Salle", state: "Reservee" as TableState, seats: 6, server: "Lina", minutes: 0 },
  { id: "T4", zone: "Salle", state: "Paiement en attente" as TableState, seats: 4, server: "Nora", minutes: 74 },
  { id: "T5", zone: "Bar", state: "Occupee" as TableState, seats: 2, server: "Omar", minutes: 21 },
  { id: "T6", zone: "VIP", state: "Libre" as TableState, seats: 8, server: "Karim", minutes: 0 }
];

export const posCategories = ["Entrees", "Plats", "Desserts", "Boissons chaudes", "Bieres", "Softs", "Cocktails"];

export const posItems = [
  { id: "P1", name: "Burrata Truffe", category: "Entrees", price: 14, image: "https://images.unsplash.com/photo-1603079847632-6c44f1f2de9f?auto=format&fit=crop&w=400&q=80" },
  { id: "P2", name: "Saumon Miso", category: "Plats", price: 24, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80" },
  { id: "P3", name: "Pasta Tartufata", category: "Plats", price: 19, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&q=80" },
  { id: "P4", name: "Cheesecake Yuzu", category: "Desserts", price: 9, image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80" },
  { id: "P5", name: "Matcha Latte", category: "Boissons chaudes", price: 6, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80" },
  { id: "P6", name: "Espresso", category: "Boissons chaudes", price: 3, image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=400&q=80" },
  { id: "P7", name: "IPA Artisanale", category: "Bieres", price: 8, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80" },
  { id: "P8", name: "Pils Blonde", category: "Bieres", price: 7, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80" },
  { id: "P9", name: "Matcha Tonic", category: "Softs", price: 7, image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80" },
  { id: "P10", name: "Citronnade Maison", category: "Softs", price: 6, image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=400&q=80" },
  { id: "P11", name: "Negroni", category: "Cocktails", price: 12, image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=400&q=80" }
];

export const liveOrders = [
  { id: "O-201", table: "T2", state: "En preparation" as OrderState, priority: "Haute", eta: 7, items: 4 },
  { id: "O-202", table: "T5", state: "En attente" as OrderState, priority: "Normale", eta: 14, items: 2 },
  { id: "O-203", table: "T3", state: "Prete" as OrderState, priority: "Urgente", eta: 0, items: 6 },
  { id: "O-204", table: "T8", state: "Servie" as OrderState, priority: "Normale", eta: 0, items: 3 },
  { id: "O-205", table: "T6", state: "Annulee" as OrderState, priority: "Basse", eta: 0, items: 1 }
];

export const kitchenStations = [
  {
    station: "Grill",
    tickets: [
      { id: "K-88", items: "Steak x2, Burger x1", priority: "Urgente", elapsed: 11 },
      { id: "K-89", items: "Saumon x1", priority: "Haute", elapsed: 7 }
    ]
  },
  {
    station: "Froid",
    tickets: [{ id: "K-90", items: "Cesar x2, Tartare x1", priority: "Normale", elapsed: 6 }]
  },
  {
    station: "Pass",
    tickets: [{ id: "K-91", items: "Dressage desserts x3", priority: "Haute", elapsed: 4 }]
  }
];

export const reservations = [
  { id: "R1", name: "Julie Bernard", people: 2, time: "12:30", table: "T1", channel: "Google", status: "Confirmee" },
  { id: "R2", name: "Marc Delon", people: 4, time: "13:00", table: "T3", channel: "Telephone", status: "En attente" },
  { id: "R3", name: "Groupe Nexa", people: 10, time: "20:30", table: "VIP", channel: "Site web", status: "Confirmee" }
];

export const menuItems = [
  { id: "M1", name: "Tataki de boeuf", category: "Entrees", price: 15, available: true, allergens: "Gluten, Soja" },
  { id: "M2", name: "Risotto safran", category: "Plats", price: 22, available: true, allergens: "Lait" },
  { id: "M3", name: "Pavlova fruits rouges", category: "Desserts", price: 11, available: false, allergens: "Oeuf" },
  { id: "M4", name: "Cocktail Basil Smash", category: "Boissons", price: 13, available: true, allergens: "Aucun" }
];

export const inventoryItems = [
  { id: "I1", ingredient: "Filet de boeuf", currentKg: 12.2, minKg: 15, supplier: "Prime Meat", lastPurchase: "08/05" },
  { id: "I2", ingredient: "Riz Arborio", currentKg: 24.1, minKg: 10, supplier: "Italia Food", lastPurchase: "10/05" },
  { id: "I3", ingredient: "Citron vert", currentKg: 3.2, minKg: 8, supplier: "Fresh Citrus", lastPurchase: "11/05" }
];

export const employees = [
  { id: "E1", name: "Sarah M.", role: "Serveur", shift: "11:00-19:00", checkin: "10:56", performance: 94 },
  { id: "E2", name: "Karim L.", role: "Caisse", shift: "12:00-22:00", checkin: "11:59", performance: 91 },
  { id: "E3", name: "Nora P.", role: "Cuisine", shift: "09:00-17:00", checkin: "08:54", performance: 88 },
  { id: "E4", name: "Lina F.", role: "Manager", shift: "10:00-20:00", checkin: "09:49", performance: 97 }
];

export const loyalty = [
  { id: "C1", name: "Emma Robert", tier: "VIP", points: 4820, lastOrder: "11/05", coupon: "-15% dessert" },
  { id: "C2", name: "Noah Petit", tier: "Gold", points: 2750, lastOrder: "10/05", coupon: "Cafe offert" },
  { id: "C3", name: "Lea Martin", tier: "Silver", points: 940, lastOrder: "09/05", coupon: "-10% midi" }
];

export const advancedStats = {
  monthlyRevenue: 183400,
  yearlyRevenue: 1843000,
  marginRate: 23.6,
  peakHours: ["12:30", "13:00", "20:00", "20:30"],
  topProducts: [
    { name: "Saumon Miso", sold: 312 },
    { name: "Negroni", sold: 287 },
    { name: "Pasta Tartufata", sold: 254 }
  ]
};

export const settingsBlocks = [
  { title: "Restaurant", items: ["Nom commercial", "Fuseau horaire", "Adresses", "Multi-restaurants"] },
  { title: "Fiscalite", items: ["TVA standard", "TVA reduite", "Regles de service"] },
  { title: "Branding", items: ["Logo", "Couleurs", "Theme ticket", "QR menu"] },
  { title: "Paiements", items: ["CB", "Apple Pay", "QR", "Especes"] },
  { title: "Materiel", items: ["Imprimantes cuisine", "Imprimante caisse", "Tiroir-caisse"] }
];
