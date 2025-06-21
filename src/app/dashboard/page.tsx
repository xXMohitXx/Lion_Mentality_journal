import React from "react";

const stats = [
  { label: "Total P&L", value: "+$61,170", color: "text-green-600" },
  { label: "Win Rate", value: "68%", color: "text-blue-600" },
  { label: "Total Trades", value: "33", color: "text-primary" },
  { label: "Best Day", value: "+$52,680", color: "text-green-600" },
  { label: "Worst Day", value: "-$12,010", color: "text-red-500" },
];

export default function DashboardPage() {
  return (
    <div className="w-full px-8 py-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-2xl font-bold">Dashboard</span>
        <span className="text-muted-foreground text-sm">May 2024</span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card px-4 py-4 flex flex-col items-center shadow-sm">
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Performance chart placeholder */}
      <div className="rounded-xl bg-card border shadow-sm px-6 py-8 mb-8">
        <div className="font-semibold mb-2">Monthly Performance</div>
        <div className="h-40 w-full bg-muted rounded flex items-center justify-center text-muted-foreground">
          [Performance Chart]
        </div>
      </div>

      {/* Recent trades placeholder */}
      <div className="rounded-xl bg-card border shadow-sm px-6 py-8 mb-8">
        <div className="font-semibold mb-2">Recent Trades</div>
        <div className="flex gap-3">
          {["AAPL", "NVDA", "TSLA"].map((s) => (
            <div key={s} className="rounded-lg bg-muted px-4 py-3 flex-1 flex flex-col items-center">
              <div className="text-xs mb-1">May 10, 2024</div>
              <div className="font-semibold mb-2">{s}</div>
              <div className="h-8 w-full bg-white rounded" /> {/* mini chart placeholder */}
            </div>
          ))}
        </div>
      </div>

      {/* Journal summary placeholder */}
      <div className="rounded-xl bg-card border shadow-sm px-6 py-8">
        <div className="font-semibold mb-2">Journal Summary</div>
        <div className="text-muted-foreground text-sm">You wrote 5 journal entries this month. Keep up the consistency!</div>
      </div>
    </div>
  );
} 