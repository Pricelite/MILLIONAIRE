"use client";

import { currency } from "@restomaster/utils";
import { ArrowUpRight, Bot, Smartphone, WifiOff } from "lucide-react";

import { KpiCard } from "@/components/ui/kpi-card";
import { MiniAreaChart } from "@/components/ui/mini-area-chart";
import { ProgressRow } from "@/components/ui/progress-row";
import { StatusBadge } from "@/components/ui/status-badge";
import { Surface } from "@/components/ui/surface";
import { dashboardMetrics, recentActivity, salesSeries, stockAlerts } from "@/lib/mock-data";

const kpiCards = [
  {
    title: "CA du jour",
    value: currency(dashboardMetrics.revenueToday),
    trend: "+12.4%",
    hint: "vs meme jour semaine precedente"
  },
  {
    title: "Commandes",
    value: String(dashboardMetrics.ordersToday),
    trend: "+8.2%",
    hint: "ticket moyen en progression"
  },
  {
    title: "Tables actives",
    value: String(dashboardMetrics.activeTables),
    trend: "+3 tables",
    hint: "rotation optimale ce midi"
  },
  {
    title: "Reservations",
    value: String(dashboardMetrics.reservationsToday),
    trend: "+14%",
    hint: "forte traction canal web"
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Surface className="p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Ventes en temps reel</p>
              <h3 className="text-xl font-extrabold text-white">Courbe service</h3>
            </div>
            <StatusBadge label="WebSocket online" tone="success" />
          </div>
          <MiniAreaChart values={salesSeries.map((point) => point.sales)} labels={salesSeries.map((point) => point.label)} />
        </Surface>

        <Surface className="space-y-4 p-4 md:p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Stock faible</h3>
            <StatusBadge label="4 alertes" tone="warning" />
          </div>
          {stockAlerts.map((item) => {
            const percent = (item.level / item.threshold) * 100;
            return <ProgressRow key={item.name} label={item.name} value={`${item.level}/${item.threshold}`} percent={percent} danger={percent < 55} />;
          })}
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Surface className="p-4 md:p-5">
          <h3 className="mb-4 text-lg font-bold text-white">Activite recente</h3>
          <div className="space-y-3">
            {recentActivity.map((event) => (
              <div key={event.id} className="flex items-start justify-between rounded-2xl border border-white/10 bg-zinc-900/50 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{event.title}</p>
                  <p className="text-xs text-zinc-400">{event.detail}</p>
                </div>
                <span className="text-xs text-zinc-500">{event.ago}</span>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="grid gap-3 p-4 md:p-5">
          <button type="button" className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/50 px-3 py-3 text-left">
            <div>
              <p className="text-sm font-semibold text-white">QR Menu</p>
              <p className="text-xs text-zinc-400">652 scans aujourd&apos;hui</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-sky-300" />
          </button>
          <button type="button" className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/50 px-3 py-3 text-left">
            <div>
              <p className="text-sm font-semibold text-white">Mode hors ligne</p>
              <p className="text-xs text-zinc-400">Synchronisation automatique active</p>
            </div>
            <WifiOff className="h-4 w-4 text-zinc-400" />
          </button>
          <button type="button" className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/50 px-3 py-3 text-left">
            <div>
              <p className="text-sm font-semibold text-white">App mobile serveur</p>
              <p className="text-xs text-zinc-400">9 appareils connectes</p>
            </div>
            <Smartphone className="h-4 w-4 text-emerald-300" />
          </button>
          <button type="button" className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/50 px-3 py-3 text-left">
            <div>
              <p className="text-sm font-semibold text-white">Predictions IA</p>
              <p className="text-xs text-zinc-400">Pic de demande prevu a 20h15</p>
            </div>
            <Bot className="h-4 w-4 text-violet-300" />
          </button>
        </Surface>
      </div>
    </div>
  );
}
