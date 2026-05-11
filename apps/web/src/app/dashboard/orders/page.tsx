"use client";

import { currency } from "@restomaster/utils";
import { useMemo, useState } from "react";

type Product = { id: string; name: string; price: number; category: string };
type Line = { id: string; name: string; qty: number; unitPrice: number; total: number };

const products: Product[] = [
  { id: "p1", name: "Steak", price: 22, category: "Plats" },
  { id: "p2", name: "Burger", price: 15, category: "Plats" },
  { id: "p3", name: "Mojito", price: 11, category: "Cocktails" },
  { id: "p4", name: "Tiramisu", price: 8, category: "Desserts" }
];

export default function OrdersPage() {
  const [cart, setCart] = useState<Line[]>([]);

  function addProduct(product: Product) {
    setCart((prev) => {
      const found = prev.find((line) => line.id === product.id);
      if (!found) {
        return [...prev, { id: product.id, name: product.name, qty: 1, unitPrice: product.price, total: product.price }];
      }
      return prev.map((line) =>
        line.id === product.id ? { ...line, qty: line.qty + 1, total: (line.qty + 1) * line.unitPrice } : line
      );
    });
  }

  const total = useMemo(() => cart.reduce((sum, line) => sum + line.total, 0), [cart]);

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
        <h3 className="mb-3 text-lg font-bold">Produits</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => addProduct(product)}
              className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-left"
            >
              <p className="text-sm font-semibold">{product.name}</p>
              <p className="text-xs text-zinc-400">{product.category}</p>
              <p className="mt-2 font-black text-amber-400">{currency(product.price)}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
        <h3 className="mb-3 text-lg font-bold">Ticket caisse</h3>
        <div className="space-y-2">
          {cart.length === 0 ? <p className="text-sm text-zinc-400">Aucune ligne</p> : null}
          {cart.map((line) => (
            <div key={line.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-sm">
              <p className="font-semibold">{line.name}</p>
              <p className="text-zinc-400">{line.qty} x {currency(line.unitPrice)}</p>
              <p className="font-bold">{currency(line.total)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-400">Total TTC</p>
          <p className="text-2xl font-black">{currency(total)}</p>
        </div>
      </section>
    </div>
  );
}
