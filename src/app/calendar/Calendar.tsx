import React from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar({ selected, onSelect }: {
  selected: Date;
  onSelect: (date: Date) => void;
}) {
  const [view, setView] = React.useState({
    year: selected.getFullYear(),
    month: selected.getMonth(),
  });

  const daysInMonth = getDaysInMonth(view.year, view.month);
  const firstDay = getFirstDayOfMonth(view.year, view.month);

  const today = new Date();
  const monthName = new Date(view.year, view.month, 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 shadow-sm p-4 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setView(v => {
            const newMonth = v.month === 0 ? 11 : v.month - 1;
            const newYear = v.month === 0 ? v.year - 1 : v.year;
            return { year: newYear, month: newMonth };
          })}
          className="px-2 py-1 rounded hover:bg-muted dark:hover:bg-zinc-800"
        >&#8592;</button>
        <span className="font-semibold dark:text-white">{monthName} {view.year}</span>
        <button
          onClick={() => setView(v => {
            const newMonth = v.month === 11 ? 0 : v.month + 1;
            const newYear = v.month === 11 ? v.year + 1 : v.year;
            return { year: newYear, month: newMonth };
          })}
          className="px-2 py-1 rounded hover:bg-muted dark:hover:bg-zinc-800"
        >&#8594;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs text-center mb-1">
        {daysOfWeek.map(d => <div key={d} className="font-medium text-muted-foreground dark:text-zinc-300">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(null).map((_, i) => <div key={"empty-"+i}></div>)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(view.year, view.month, i + 1);
          const isSelected = selected.toDateString() === date.toDateString();
          const isToday = today.toDateString() === date.toDateString();
          return (
            <button
              key={i}
              className={`rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors
                ${isSelected ? "bg-primary text-white dark:!bg-green-600 dark:!text-white" : isToday ? "border border-primary text-primary dark:border-green-400 dark:text-green-400" : "hover:bg-muted dark:hover:bg-zinc-800 dark:text-zinc-200"}`}
              onClick={() => onSelect(date)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
} 