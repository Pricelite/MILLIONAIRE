"use client";

import { currency } from "@restomaster/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Beer,
  Coffee,
  CupSoda,
  Citrus,
  Droplets,
  FlaskConical,
  GlassWater,
  Heart,
  Leaf,
  Martini,
  Plus,
  Search,
  Sparkles,
  Star,
  Wine,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { StatusBadge } from "@/components/ui/status-badge";
import { Surface } from "@/components/ui/surface";
import {
  beverageCategories,
  beverageHeatmap,
  beverageItems,
  beverageSalesByHour,
  beverageSizes,
  type BeverageItem,
  type BeverageSize
} from "@/lib/beverages-data";

type FilterType = "all" | "alcohol" | "without-alcohol";

type CartLine = {
  key: string;
  itemId: string;
  name: string;
  size: BeverageSize;
  qty: number;
  unitPrice: number;
};

const icons: Record<string, LucideIcon> = {
  softs: CupSoda,
  eaux: Droplets,
  jus: Citrus,
  cafes: Coffee,
  thes: Leaf,
  "cocktails-sans": GlassWater,
  bieres: Beer,
  "vins-rouges": Wine,
  "vins-blancs": Wine,
  roses: Wine,
  champagnes: Sparkles,
  spiritueux: FlaskConical,
  "cocktails-avec": Martini,
  digestifs: GlassWater
};

function getMultiplier(size: BeverageSize) {
  return beverageSizes.find((entry) => entry.label === size)?.multiplier ?? 1;
}

function isHappyHourActive() {
  const hour = new Date().getHours();
  return hour >= 17 && hour <= 19;
}

function toneByStock(stock: number) {
  if (stock <= 10) return "danger" as const;
  if (stock <= 16) return "warning" as const;
  return "success" as const;
}

export default function BeveragesPage() {
  const [items, setItems] = useState<BeverageItem[]>(beverageItems);
  const [activeCategoryId, setActiveCategoryId] = useState(beverageCategories[0]?.id ?? "softs");
  const [filter, setFilter] = useState<FilterType>("all");
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState<BeverageItem | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, BeverageSize>>({});
  const [cart, setCart] = useState<CartLine[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const happyHourLive = isHappyHourActive();

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => item.categoryId === activeCategoryId)
      .filter((item) => {
        if (filter === "alcohol") return item.alcoholic;
        if (filter === "without-alcohol") return !item.alcoholic;
        return true;
      })
      .filter((item) => (favoritesOnly ? Boolean(item.favorite) : true))
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  }, [items, activeCategoryId, filter, favoritesOnly, query]);

  const lowStockCount = useMemo(() => items.filter((item) => item.stock <= 10).length, [items]);
  const alcoholCount = useMemo(() => items.filter((item) => item.alcoholic).length, [items]);
  const nonAlcoholCount = useMemo(() => items.filter((item) => !item.alcoholic).length, [items]);

  const categoryVolume = useMemo(() => {
    return beverageCategories.map((category) => ({
      name: category.name,
      sales: items.filter((item) => item.categoryId === category.id).reduce((sum, item) => sum + item.sales, 0)
    }));
  }, [items]);

  const topHeatmap = useMemo(() => {
    return [...items].sort((a, b) => b.sales - a.sales).slice(0, 12);
  }, [items]);

  function getSize(item: BeverageItem) {
    return selectedSizes[item.id] ?? item.sizes[0] ?? "Verre";
  }

  function computePrice(item: BeverageItem, size: BeverageSize) {
    const rawPrice = item.price * getMultiplier(size);
    if (happyHourLive && item.happyHour) {
      return rawPrice * (1 - item.happyHour.discountPercent / 100);
    }
    return rawPrice;
  }

  function toggleFavorite(itemId: string) {
    setItems((current) => current.map((item) => (item.id === itemId ? { ...item, favorite: !item.favorite } : item)));
  }

  function addToCart(item: BeverageItem) {
    if (item.stock <= 0) return;

    const size = getSize(item);
    const key = `${item.id}:${size}`;
    const unitPrice = computePrice(item, size);

    setCart((current) => {
      const found = current.find((line) => line.key === key);
      if (found) {
        return current.map((line) => (line.key === key ? { ...line, qty: line.qty + 1 } : line));
      }
      return [...current, { key, itemId: item.id, name: item.name, size, qty: 1, unitPrice }];
    });

    setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, stock: Math.max(0, entry.stock - 1) } : entry)));
  }

  function changeQty(lineKey: string, delta: number) {
    const target = cart.find((line) => line.key === lineKey);
    if (!target) return;

    if (delta < 0 && target.qty === 1) {
      setCart((current) => current.filter((line) => line.key !== lineKey));
      setItems((current) => current.map((entry) => (entry.id === target.itemId ? { ...entry, stock: entry.stock + 1 } : entry)));
      return;
    }

    if (delta > 0) {
      const stockEntry = items.find((entry) => entry.id === target.itemId);
      if (!stockEntry || stockEntry.stock <= 0) return;
      setItems((current) => current.map((entry) => (entry.id === target.itemId ? { ...entry, stock: entry.stock - 1 } : entry)));
    }

    if (delta < 0) {
      setItems((current) => current.map((entry) => (entry.id === target.itemId ? { ...entry, stock: entry.stock + 1 } : entry)));
    }

    setCart((current) => current.map((line) => (line.key === lineKey ? { ...line, qty: Math.max(1, line.qty + delta) } : line)));
  }

  const subtotal = useMemo(() => cart.reduce((sum, line) => sum + line.qty * line.unitPrice, 0), [cart]);

  return (
    <div className="space-y-4">
      <Surface className="grid gap-3 p-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/65 p-3">
          <p className="text-xs uppercase tracking-wider text-zinc-400">CA boissons (jour)</p>
          <p className="text-2xl font-black text-white">{currency(2740)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/65 p-3">
          <p className="text-xs uppercase tracking-wider text-zinc-400">Produits alcoolises</p>
          <p className="text-2xl font-black text-white">{alcoholCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/65 p-3">
          <p className="text-xs uppercase tracking-wider text-zinc-400">Produits sans alcool</p>
          <p className="text-2xl font-black text-white">{nonAlcoholCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/65 p-3">
          <p className="text-xs uppercase tracking-wider text-zinc-400">Stock critique</p>
          <p className="text-2xl font-black text-rose-300">{lowStockCount}</p>
        </div>
      </Surface>

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <Surface className="space-y-3 p-3">
          <div className="rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2">
            <p className="text-xs uppercase tracking-wider text-zinc-400">Categories boissons</p>
          </div>
          <div className="space-y-2">
            {beverageCategories.map((category) => {
              const Icon = icons[category.id] ?? CupSoda;
              const active = activeCategoryId === category.id;
              const categoryCount = items.filter((item) => item.categoryId === category.id).length;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategoryId(category.id)}
                  className={
                    active
                      ? "flex w-full items-center justify-between rounded-xl border border-white/25 bg-zinc-800/95 px-3 py-2 text-left"
                      : "flex w-full items-center justify-between rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2 text-left"
                  }
                >
                  <span className="flex items-center gap-2">
                    <span className="rounded-lg p-1.5" style={{ backgroundColor: `${category.color}25`, color: category.color }}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-zinc-100">{category.name}</span>
                  </span>
                  <span className="text-xs text-zinc-400">{categoryCount}</span>
                </button>
              );
            })}
          </div>
        </Surface>

        <div className="space-y-4">
          <Surface className="space-y-3 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative min-w-64 flex-1">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Recherche instantanee boisson..."
                  className="h-10 w-full rounded-xl border border-white/10 bg-zinc-900/65 pl-9 pr-3 text-sm text-zinc-100"
                />
              </label>

              <button
                type="button"
                onClick={() => setFilter("all")}
                className={filter === "all" ? "rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-sky-950" : "rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-200"}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setFilter("without-alcohol")}
                className={filter === "without-alcohol" ? "rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-emerald-950" : "rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-200"}
              >
                Sans alcool
              </button>
              <button
                type="button"
                onClick={() => setFilter("alcohol")}
                className={filter === "alcohol" ? "rounded-xl bg-amber-400 px-3 py-2 text-sm font-semibold text-amber-950" : "rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-200"}
              >
                Alcool
              </button>
              <button
                type="button"
                onClick={() => setFavoritesOnly((state) => !state)}
                className={favoritesOnly ? "rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-rose-950" : "rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-200"}
              >
                Favoris
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => {
                const size = getSize(item);
                const calculated = computePrice(item, size);
                const category = beverageCategories.find((entry) => entry.id === item.categoryId);

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70"
                  >
                    <button type="button" onClick={() => setSelected(item)} className="w-full text-left">
                      <div className="h-28 w-full bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                      <div className="space-y-2 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-bold text-white">{item.name}</p>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              toggleFavorite(item.id);
                            }}
                            className="rounded-md p-1 text-zinc-300 hover:text-rose-300"
                          >
                            {item.favorite ? <Heart className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="rounded-full px-2 py-0.5" style={{ color: category?.color, backgroundColor: `${category?.color ?? "#38bdf8"}25` }}>
                            {category?.name}
                          </span>
                          <StatusBadge label={`Stock ${item.stock}`} tone={toneByStock(item.stock)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-black text-sky-300">{currency(calculated)}</p>
                          <select
                            value={size}
                            onChange={(event) => setSelectedSizes((current) => ({ ...current, [item.id]: event.target.value as BeverageSize }))}
                            className="rounded-lg border border-white/10 bg-zinc-900 px-2 py-1 text-xs"
                          >
                            {item.sizes.map((entry) => (
                              <option key={entry} value={entry}>
                                {entry}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          {item.promo ? <StatusBadge label={item.promo} tone="warning" /> : <span className="text-xs text-zinc-500">-</span>}
                          {item.happyHour ? <StatusBadge label={`Happy hour ${item.happyHour.from}-${item.happyHour.to}`} tone={happyHourLive ? "success" : "info"} /> : null}
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="flex w-full items-center justify-center gap-2 border-t border-white/10 bg-zinc-800/80 px-3 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-700"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter rapide
                    </button>
                  </motion.article>
                );
              })}
            </div>
          </Surface>

          <Surface className="grid gap-4 p-4 xl:grid-cols-2">
            <div className="h-56">
              <p className="mb-2 text-sm font-semibold text-zinc-200">Ventes boissons par heure</p>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={beverageSalesByHour}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                    <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full animate-pulse rounded-xl bg-zinc-900/60" />
              )}
            </div>
            <div className="h-56">
              <p className="mb-2 text-sm font-semibold text-zinc-200">Volume par categorie</p>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryVolume.slice(0, 8)}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" height={50} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="sales" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full animate-pulse rounded-xl bg-zinc-900/60" />
              )}
            </div>
          </Surface>

          <Surface className="space-y-3 p-4">
            <p className="text-sm font-semibold text-zinc-200">Heatmap boissons les plus vendues</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
              {topHeatmap.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/10 p-2"
                  style={{ background: `linear-gradient(135deg, rgba(56,189,248,${Math.max(0.15, item.sales / 220)}), rgba(8,47,73,0.55))` }}
                >
                  <p className="truncate text-xs font-semibold text-white">{item.name}</p>
                  <p className="text-[11px] text-zinc-200">{item.sales} ventes</p>
                </div>
              ))}
            </div>

            <div className="grid gap-2 md:grid-cols-5">
              {beverageHeatmap.map((row) => {
                const total = row.softs + row.eaux + row.jus + row.cafes + row.thes + row.cocktailsSans + row.bieres + row.vins + row.cocktails;
                return (
                  <div key={row.time} className="rounded-xl border border-white/10 bg-zinc-900/60 p-2 text-center">
                    <p className="text-xs text-zinc-400">{row.time}</p>
                    <p className="text-base font-black text-sky-300">{total}</p>
                  </div>
                );
              })}
            </div>
          </Surface>
        </div>

        <Surface className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Commande boissons</h3>
            <StatusBadge label={happyHourLive ? "Happy hour active" : "Happy hour planifie"} tone={happyHourLive ? "success" : "info"} />
          </div>

          <div className="max-h-[460px] space-y-2 overflow-auto pr-1">
            {cart.length === 0 ? <p className="text-sm text-zinc-400">Ajoute des boissons depuis le catalogue.</p> : null}
            {cart.map((line) => (
              <article key={line.key} className="rounded-xl border border-white/10 bg-zinc-900/65 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">{line.name}</p>
                    <p className="text-xs text-zinc-400">Taille: {line.size}</p>
                  </div>
                  <p className="text-sm font-bold text-sky-300">{currency(line.qty * line.unitPrice)}</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" onClick={() => changeQty(line.key, -1)} className="rounded-lg border border-white/10 px-2 py-1 text-xs">-</button>
                  <span className="text-sm">{line.qty}</span>
                  <button type="button" onClick={() => changeQty(line.key, 1)} className="rounded-lg border border-white/10 px-2 py-1 text-xs">+</button>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-sky-400/25 bg-sky-500/10 p-3">
            <p className="text-xs uppercase tracking-wider text-zinc-300">Total boissons</p>
            <p className="text-2xl font-black text-white">{currency(subtotal)}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3">
            <p className="mb-2 text-xs uppercase tracking-wider text-zinc-400">Suggestions automatiques plats</p>
            <div className="flex flex-wrap gap-2">
              {(selected?.suggestedDishes ?? ["Burger signature", "Poke saumon"]).map((dish) => (
                <span key={dish} className="rounded-full border border-white/10 bg-zinc-800 px-2 py-1 text-xs text-zinc-200">
                  {dish}
                </span>
              ))}
            </div>
          </div>
        </Surface>
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl rounded-3xl border border-white/15 bg-zinc-950/95 p-4"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">Detail boisson</p>
                  <h4 className="text-2xl font-black text-white">{selected.name}</h4>
                </div>
                <button type="button" onClick={() => setSelected(null)} className="rounded-lg border border-white/10 p-1.5 text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="h-44 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${selected.image})` }} />

              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-zinc-900/65 p-3">
                  <p className="text-xs text-zinc-400">Prix de base</p>
                  <p className="text-lg font-bold text-sky-300">{currency(selected.price)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/65 p-3">
                  <p className="text-xs text-zinc-400">Stock</p>
                  <p className="text-lg font-bold text-zinc-100">{selected.stock}</p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-white/10 bg-zinc-900/65 p-3">
                <p className="text-xs text-zinc-400">Tailles disponibles</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSizes((current) => ({ ...current, [selected.id]: size }))}
                      className={
                        (selectedSizes[selected.id] ?? selected.sizes[0]) === size
                          ? "rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-sky-950"
                          : "rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-200"
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {selected.promo ? <StatusBadge label={selected.promo} tone="warning" /> : null}
                {selected.happyHour ? <StatusBadge label={`Happy hour ${selected.happyHour.from}-${selected.happyHour.to}`} tone="success" /> : null}
                <StatusBadge label={selected.alcoholic ? "Alcool" : "Sans alcool"} tone={selected.alcoholic ? "danger" : "info"} />
              </div>

              <button type="button" onClick={() => addToCart(selected)} className="mt-4 w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-bold text-sky-950">
                Ajouter a la commande
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
