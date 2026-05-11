"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

import { Surface } from "./surface";

type KpiCardProps = {
  title: string;
  value: string;
  trend: string;
  hint: string;
};

export function KpiCard({ title, value, trend, hint }: KpiCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Surface className="p-4 md:p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-300">{title}</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-2xl font-extrabold text-zinc-50 md:text-3xl">{value}</p>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300">
            <TrendingUp className="h-3.5 w-3.5" />
            {trend}
          </span>
        </div>
        <p className="mt-2 text-xs text-zinc-300">{hint}</p>
      </Surface>
    </motion.div>
  );
}
