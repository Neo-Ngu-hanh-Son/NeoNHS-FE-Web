import { motion } from "framer-motion";
import { LineChart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RevenueTrendPoint } from "@/types/adminDashboard";

function formatCompactNumber(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toString();
}

function formatVND(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

export function RevenueTrendsCard({ points }: { points: RevenueTrendPoint[] }) {
  const maxRevenue = Math.max(...points.map((p) => p.revenue), 1);
  const totalRevenue = points.reduce((acc, p) => acc + p.revenue, 0);
  const totalTransactions = points.reduce((acc, p) => acc + (p.transactionCount || 0), 0);
  const averageRevenue = points.length > 0 ? totalRevenue / points.length : 0;
  const peak = points.reduce(
    (best, p) => (p.revenue > best.revenue ? p : best),
    points[0] ?? ({ period: "", revenue: 0, transactionCount: 0 } as RevenueTrendPoint),
  );

  const getPathData = (data: number[]) => {
    if (data.length === 0) return "";
    if (data.length === 1) return `M 0,200 L 500,200`;

    const coords = data.map((val, i) => ({
      x: (i / (data.length - 1)) * 500,
      y: 200 - (val / maxRevenue) * 170,
    }));

    let d = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) d += ` L ${coords[i].x},${coords[i].y}`;
    return d;
  };

  return (
    <Card className="shadow-sm border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-slate-50/60 to-white dark:from-white/5 dark:to-transparent">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <LineChart className="size-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-black text-slate-900 dark:text-white">Revenue Trends</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Performance over time
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1.5 text-slate-600 dark:text-slate-300">
          <TrendingUp className="size-4 text-primary" />
          <span className="text-xs font-bold tabular-nums">{formatCompactNumber(totalRevenue)}</span>
          <span className="text-[11px] opacity-70">VND total</span>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Total</p>
            <p className="mt-1 text-lg font-black tabular-nums text-slate-900 dark:text-white">{formatVND(totalRevenue)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Average</p>
            <p className="mt-1 text-lg font-black tabular-nums text-slate-900 dark:text-white">{formatVND(averageRevenue)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Peak</p>
            <p className="mt-1 text-lg font-black tabular-nums text-slate-900 dark:text-white">{formatVND(peak?.revenue || 0)}</p>
            {peak?.period && <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">{peak.period}</p>}
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Transactions</p>
            <p className="mt-1 text-lg font-black tabular-nums text-slate-900 dark:text-white">{totalTransactions.toLocaleString()}</p>
          </div>
        </div>

        <div className="relative h-[240px] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(31,111,67,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.03))] dark:bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.35))]" />

          <div className="absolute inset-0 px-6 py-5">
            <svg className="w-full h-full relative z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="gradient-rev" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>

              {points.length > 0 && (
                <>
                  <path d={getPathData(points.map((p) => p.revenue)) + " V 200 H 0 Z"} fill="url(#gradient-rev)" />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: "linear" }}
                    d={getPathData(points.map((p) => p.revenue))}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </div>

          <div className="absolute bottom-3 left-6 right-6 flex justify-between gap-2 z-20">
            {points.slice(0, 6).map((p, idx) => (
              <div key={`${p.periodKey}-${idx}`} className="flex flex-col items-center min-w-0">
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter truncate max-w-[64px]">
                  {p.period}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

