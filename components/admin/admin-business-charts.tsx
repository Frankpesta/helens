"use client";

import { formatMoney } from "@/lib/format";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const gridStroke = "rgba(148, 163, 184, 0.15)";
const axisTick = "#94a3b8";
const tooltipBg = "oklch(0.14 0.02 285)";
const tooltipBorder = "oklch(0.28 0.02 285)";
const gold = "oklch(0.82 0.14 88)";
const goldMuted = "oklch(0.82 0.14 88 / 0.35)";
const violet = "#a78bfa";

type RevenueRow = {
  label: string;
  revenue: number;
  orders: number;
  revenueCumulative: number;
};

type SignupRow = {
  label: string;
  signups: number;
  signupsCumulative: number;
};

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-md border px-3 py-2 text-xs shadow-lg"
      style={{ background: tooltipBg, borderColor: tooltipBorder }}
    >
      <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} className="text-foreground" style={{ color: p.color }}>
          {p.name}:{" "}
          {p.name === "Revenue" ?
            formatMoney(Math.round(p.value * 100))
          : String(Math.round(p.value))}
        </p>
      ))}
    </div>
  );
}

function SimpleTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-md border px-3 py-2 text-xs shadow-lg"
      style={{ background: tooltipBg, borderColor: tooltipBorder }}
    >
      <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} className="text-foreground">
          {p.name}: {Math.round(p.value)}
        </p>
      ))}
    </div>
  );
}

export function AdminBusinessCharts({
  revenueTrend,
  signupTrend,
}: {
  revenueTrend: { series: RevenueRow[] } | undefined;
  signupTrend: { series: SignupRow[] } | undefined;
}) {
  const rev = revenueTrend?.series ?? [];
  const sub = signupTrend?.series ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border/80 bg-card/50 p-4 shadow-sm ring-1 ring-gold/10 lg:col-span-2">
        <h2 className="font-heading text-lg text-foreground md:text-xl">
          Revenue &amp; order volume
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Paid, processing, shipped, and fulfilled orders by UTC day (order
          created). Bars = revenue; line = number of qualifying orders.
        </p>
        <div className="mt-4 h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rev} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: axisTick, fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: gridStroke }}
              />
              <YAxis
                yAxisId="rev"
                tick={{ fill: axisTick, fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
                width={44}
              />
              <YAxis
                yAxisId="ord"
                orientation="right"
                tick={{ fill: axisTick, fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={32}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                formatter={(value) => (
                  <span className="text-muted-foreground">{value}</span>
                )}
              />
              <Bar
                yAxisId="rev"
                dataKey="revenue"
                name="Revenue"
                fill={gold}
                radius={[3, 3, 0, 0]}
                maxBarSize={48}
              />
              <Line
                yAxisId="ord"
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke={violet}
                strokeWidth={2}
                dot={{ r: 2, fill: violet }}
                activeDot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card/50 p-4 shadow-sm ring-1 ring-gold/10">
        <h2 className="font-heading text-lg text-foreground md:text-xl">
          Cumulative revenue
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Running total over the window (same order set as above).
        </p>
        <div className="mt-4 h-[260px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rev} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revCumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gold} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: axisTick, fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: gridStroke }}
              />
              <YAxis
                tick={{ fill: axisTick, fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
                width={44}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.[0]) return null;
                  const v = payload[0].value as number;
                  return (
                    <div
                      className="rounded-md border px-3 py-2 text-xs shadow-lg"
                      style={{ background: tooltipBg, borderColor: tooltipBorder }}
                    >
                      <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
                      <p className="text-gold">{formatMoney(Math.round(v * 100))}</p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="revenueCumulative"
                stroke={gold}
                strokeWidth={2}
                fill="url(#revCumGrad)"
                name="Cumulative"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card/50 p-4 shadow-sm ring-1 ring-gold/10">
        <h2 className="font-heading text-lg text-foreground md:text-xl">
          Newsletter signups
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          New subscribers per day and running total (home + future sources).
        </p>
        <div className="mt-4 h-[260px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sub} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: axisTick, fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: gridStroke }}
              />
              <YAxis
                yAxisId="a"
                tick={{ fill: axisTick, fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={28}
              />
              <YAxis
                yAxisId="b"
                orientation="right"
                tick={{ fill: axisTick, fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={28}
              />
              <Tooltip content={<SimpleTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar
                yAxisId="a"
                dataKey="signups"
                name="New"
                fill={goldMuted}
                stroke={gold}
                strokeWidth={1}
                radius={[3, 3, 0, 0]}
                maxBarSize={40}
              />
              <Line
                yAxisId="b"
                type="monotone"
                dataKey="signupsCumulative"
                name="Total"
                stroke={gold}
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
