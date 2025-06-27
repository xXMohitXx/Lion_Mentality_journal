'use client';
import React from "react";

type Day = { date: string; profit: string; trades: number; color: string; disabled?: boolean };

const mockData: { [key: string]: Day[] } = {
  "2024-05": [
    { date: "06 Mon", profit: "$0", trades: 0, color: "text-muted-foreground" },
    { date: "07 Tue", profit: "+$21.49k", trades: 15, color: "text-green-600" },
    { date: "08 Wed", profit: "$0", trades: 0, color: "text-muted-foreground" },
    { date: "09 Thu", profit: "-$12.01k", trades: 7, color: "text-red-500" },
    { date: "10 Fri", profit: "+$52.68k", trades: 11, color: "text-green-600" },
    { date: "11 Sat", profit: "$0", trades: 0, color: "text-muted-foreground", disabled: true },
    { date: "12 Sun", profit: "$0", trades: 0, color: "text-muted-foreground", disabled: true },
  ],
  "2024-06": [
    { date: "03 Mon", profit: "+$5.00k", trades: 3, color: "text-green-600" },
    { date: "04 Tue", profit: "-$2.00k", trades: 2, color: "text-red-500" },
    { date: "05 Wed", profit: "$0", trades: 0, color: "text-muted-foreground" },
    { date: "06 Thu", profit: "+$1.50k", trades: 1, color: "text-green-600" },
    { date: "07 Fri", profit: "$0", trades: 0, color: "text-muted-foreground" },
    { date: "08 Sat", profit: "$0", trades: 0, color: "text-muted-foreground", disabled: true },
    { date: "09 Sun", profit: "$0", trades: 0, color: "text-muted-foreground", disabled: true },
  ],
  "2025-06": [
    { date: "02 Mon", profit: "+$10.00k", trades: 5, color: "text-green-600" },
    { date: "03 Tue", profit: "-$1.00k", trades: 2, color: "text-red-500" },
    { date: "04 Wed", profit: "+$3.00k", trades: 4, color: "text-green-600" },
    { date: "05 Thu", profit: "+$2.00k", trades: 1, color: "text-green-600" },
    { date: "06 Fri", profit: "-$500", trades: 1, color: "text-red-500" },
    { date: "07 Sat", profit: "$0", trades: 0, color: "text-muted-foreground", disabled: true },
    { date: "08 Sun", profit: "$0", trades: 0, color: "text-muted-foreground", disabled: true },
  ],
  "2025-01": [
    { date: "01 Wed", profit: "+$2.00k", trades: 2, color: "text-green-600" },
    { date: "02 Thu", profit: "-$500", trades: 1, color: "text-red-500" },
    { date: "03 Fri", profit: "+$1.00k", trades: 1, color: "text-green-600" },
    { date: "04 Sat", profit: "$0", trades: 0, color: "text-muted-foreground", disabled: true },
    { date: "05 Sun", profit: "$0", trades: 0, color: "text-muted-foreground", disabled: true },
  ],
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  INR: '₹',
  GBP: '£',
  JPY: '¥',
};

function parseProfit(profit: string) {
  // Remove $ and commas, handle negatives and k (thousands)
  if (!profit) return 0;
  let p = profit.replace(/[$,+]/g, "");
  let mult = 1;
  if (p.includes("-")) mult = -1;
  p = p.replace("-", "");
  if (p.toLowerCase().includes("k")) {
    p = p.replace(/k/i, "");
    return mult * parseFloat(p) * 1000;
  }
  return mult * parseFloat(p);
}

function getSmoothPath(points: {x: number, y: number}[]) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` Q ${midX} ${prev.y}, ${midX} ${(prev.y + curr.y) / 2}`;
    d += ` T ${curr.x} ${curr.y}`;
  }
  return d;
}

function PerformanceChart({ days, currency }: { days: Day[]; currency: string }) {
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
  const [mouse, setMouse] = React.useState<{x: number, y: number} | null>(null);
  if (!days.length) return <div className="h-40 w-full bg-muted rounded flex items-center justify-center text-muted-foreground">No data</div>;
  const values = days.map(d => parseProfit(d.profit));
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const chartHeight = 200;
  const chartWidth = Math.max(400, 60 * (days.length - 1) + 80);
  const padding = 40;
  const y = (v: number) => {
    if (max === min) return chartHeight / 2;
    return padding + (chartHeight - 2 * padding) - ((v - min) / (max - min)) * (chartHeight - 2 * padding);
  };
  const x = (i: number) => padding + i * ((chartWidth - 2 * padding) / (days.length - 1));
  const points = values.map((v, i) => ({ x: x(i), y: y(v) }));
  // Grid lines
  const gridLines = [0.25, 0.5, 0.75].map(f => (
    <line
      key={f}
      x1={padding}
      x2={chartWidth - padding}
      y1={padding + f * (chartHeight - 2 * padding)}
      y2={padding + f * (chartHeight - 2 * padding)}
      stroke="#e5e7eb"
      strokeDasharray="4 2"
    />
  ));

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const rect = (e.target as SVGSVGElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    setMouse({ x: mouseX, y: e.clientY - rect.top });
    // Find closest point
    let minDist = Infinity;
    let idx = null;
    for (let i = 0; i < points.length; i++) {
      const dist = Math.abs(points[i].x - mouseX);
      if (dist < minDist) {
        minDist = dist;
        idx = i;
      }
    }
    setHoverIdx(idx);
  }

  function handleMouseLeave() {
    setHoverIdx(null);
    setMouse(null);
  }

  function formatProfitTooltip(profit: string) {
    if (!profit) return '';
    let p = profit.replace(/[$,+]/g, "");
    let mult = 1;
    if (p.includes("-")) mult = -1;
    p = p.replace("-", "");
    let value = 0;
    if (p.toLowerCase().includes("k")) {
      p = p.replace(/k/i, "");
      value = mult * parseFloat(p) * 1000;
    } else {
      value = mult * parseFloat(p);
    }
    if (isNaN(value)) return '';
    return `${currencySymbols[currency]}${value.toLocaleString()}`;
  }

  return (
    <div className="overflow-x-auto flex justify-center">
      <div className="relative" style={{ width: chartWidth, height: chartHeight }}>
        <svg
          width={chartWidth}
          height={chartHeight}
          className="block"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid */}
          <line x1={padding} x2={padding} y1={padding} y2={chartHeight-padding} stroke="#e5e7eb" />
          <line x1={chartWidth-padding} x2={chartWidth-padding} y1={padding} y2={chartHeight-padding} stroke="#e5e7eb" />
          {gridLines}
          {/* Smooth line */}
          <path
            d={getSmoothPath(points)}
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
          />
          {/* Points */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={hoverIdx === i ? 7 : 5}
              fill={hoverIdx === i ? "#16a34a" : "#22c55e"}
              className="cursor-pointer transition-colors"
            />
          ))}
          {/* X axis labels */}
          {points.map((pt, i) => (
            <text
              key={i}
              x={pt.x}
              y={chartHeight - 8}
              textAnchor="middle"
              fontSize="11"
              fill="#888"
            >
              {days[i].date.split(" ")[0]}
            </text>
          ))}
        </svg>
        {/* Tooltip */}
        {hoverIdx !== null && mouse && (
          <div
            className="absolute z-10 px-3 py-2 rounded bg-zinc-900 text-white text-xs shadow-lg pointer-events-none"
            style={{
              left: Math.max(0, Math.min(points[hoverIdx].x - 60, chartWidth - 120)),
              top: Math.max(0, points[hoverIdx].y - 56)
            }}
          >
            <div className="font-semibold">{days[hoverIdx].date}</div>
            <div>P&amp;L: <span className="font-mono">{formatProfitTooltip(days[hoverIdx].profit)}</span></div>
            <div>Trades: {days[hoverIdx].trades}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const today = new Date();
  const [view, setView] = React.useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [currency, setCurrency] = React.useState('USD');
  const monthKey = `${view.year}-${String(view.month + 1).padStart(2, "0")}`;
  const days = mockData[monthKey] || [];

  function changeMonth(delta: number) {
    setView((v) => {
      let newMonth = v.month + delta;
      let newYear = v.year;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      return { year: newYear, month: newMonth };
    });
  }

  // Helper to format profit with selected currency
  function formatProfit(profit: string) {
    // Remove $ and commas, handle negatives and k (thousands)
    if (!profit) return '';
    let p = profit.replace(/[$,+]/g, "");
    let mult = 1;
    if (p.includes("-")) mult = -1;
    p = p.replace("-", "");
    let value = 0;
    if (p.toLowerCase().includes("k")) {
      p = p.replace(/k/i, "");
      value = mult * parseFloat(p) * 1000;
    } else {
      value = mult * parseFloat(p);
    }
    if (isNaN(value)) return '';
    return `${currencySymbols[currency]}${value.toLocaleString()}`;
  }

  return (
    <div className="w-full px-8 py-6">
      {/* Month row with navigation */}
      <div className="mb-5 flex items-center gap-2">
        <button onClick={() => changeMonth(-1)} className="rounded border px-2 py-1">&#8592;</button>
        <span className="text-2xl font-bold">{monthNames[view.month]}, {view.year}</span>
        <button onClick={() => changeMonth(1)} className="rounded border px-2 py-1">&#8594;</button>
      </div>

      {/* Currency selector */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm font-medium">Currency:</label>
        <select value={currency} onChange={e=>setCurrency(e.target.value)} className="rounded bg-secondary dark:bg-zinc-800 px-2 py-1 text-sm dark:text-zinc-100">
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="INR">INR (₹)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
        </select>
      </div>

      {/* Daily cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-5">
        {days.length > 0 ? (
          days.map((day: Day, idx: number) => (
            <div key={day.date} className={`min-w-[140px] rounded-xl border bg-card px-4 py-3 flex flex-col gap-2 shadow-sm ${day.disabled?'opacity-40 pointer-events-none':''}`}>
              <div className="text-sm font-semibold">{day.date}</div>
              <div className={`text-lg font-bold ${day.color}`}>{formatProfit(day.profit)}</div>
              <div className="text-xs text-muted-foreground">{day.trades} trades</div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground">No data for this month.</div>
        )}
      </div>

      {/* top trades card placeholder */}
      <div className="mb-6">
        <div className="font-semibold mb-2">This month's top trades</div>
        <div className="flex gap-3">
          {(() => {
            const journals: Record<string, string> = {
              "ETSY": "Followed the plan, good entry and exit.",
              "AAPL": "Could have held longer, but managed risk well.",
              "NVDA": "Missed the morning move, but caught a reversal.",
            };
            return ["ETSY","AAPL","NVDA"].map(s =>
            <div key={s} className="rounded-xl bg-card border shadow-sm px-6 py-4 flex-1">
              <div className="text-xs mb-1">May 6, 2024 09:30</div>
              <div className="font-semibold mb-3">{s}</div>
                <div className="h-12 w-full bg-muted rounded flex items-center px-3 text-sm text-muted-foreground">
                  {journals[s]}
                </div>
            </div>
            );
          })()}
        </div>
      </div>

      {/* trades chart card placeholder */}
      <div className="mb-6">
        <div className="font-semibold mb-2">This month's performance chart</div>
        <div className="rounded-xl bg-card border shadow-sm px-6 py-6">
          <PerformanceChart days={days} currency={currency} />
        </div>
      </div>
    </div>
  );
}
