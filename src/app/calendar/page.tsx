'use client';
import React from "react";
import Calendar from "./Calendar";
import Link from "next/link";

const mockData: Record<string, { pnl: string; journal: string }> = {
  "2024-05-10": { pnl: "+$2,000", journal: "Great day! Followed the plan." },
  "2024-05-11": { pnl: "-$500", journal: "Took a bad trade, need to review." },
};

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function CalendarPage() {
  const [selected, setSelected] = React.useState(() => new Date());
  const key = formatDateKey(selected);
  const entry = mockData[key];

  return (
    <div className="w-full px-8 py-6">
      <div className="mb-5"><span className="text-2xl font-bold">Calendar</span></div>
      <Calendar selected={selected} onSelect={setSelected} />
      <div className="mt-8">
        <div className="rounded-xl bg-card border shadow-sm px-6 py-6">
          <div className="font-semibold mb-2">Details for {selected.toDateString()}</div>
          {entry ? (
            <div className="space-y-2">
              <div>P&amp;L: <span className="font-bold text-green-600">{entry.pnl}</span></div>
              <div>Journal: <span className="text-muted-foreground">{entry.journal}</span></div>
              <div className="flex gap-4 mt-2">
                <Link href={`/journal?date=${key}`} className="underline text-primary">View Journal</Link>
                <Link href={`/reports?date=${key}`} className="underline text-primary">View P&amp;L</Link>
                <Link href={`/trades?date=${key}`} className="underline text-primary">View Trades</Link>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">No data for this date.</div>
          )}
        </div>
      </div>
    </div>
  );
} 