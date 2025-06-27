'use client';
import React from "react";

export default function JournalPage() {
  const [dateStr, setDateStr] = React.useState("");
  React.useEffect(() => {
    const now = new Date();
    setDateStr(now.toLocaleDateString());
  }, []);

  const [plan, setPlan] = React.useState("");
  const [learned, setLearned] = React.useState("");
  const [mistakes, setMistakes] = React.useState("");
  const [better, setBetter] = React.useState("");
  const [right, setRight] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // You can handle saving the journal here
    alert("Journal saved!\n" + JSON.stringify({ dateStr, plan, learned, mistakes, better, right }, null, 2));
  }

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 flex-col">
      <div className="w-full max-w-xl mt-10">
        <div className="mb-5"><span className="text-2xl font-bold">Daily Journal</span></div>
        <form onSubmit={handleSubmit} className="bg-card dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Date</label>
            <div className="rounded bg-muted dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100">{dateStr}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Plan for the day</label>
            <textarea value={plan} onChange={e => setPlan(e.target.value)} className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" rows={2} placeholder="What's your plan?" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-zinc-200">What I learned</label>
            <textarea value={learned} onChange={e => setLearned(e.target.value)} className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" rows={2} placeholder="What did you learn today?" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-zinc-200">What are my mistakes</label>
            <textarea value={mistakes} onChange={e => setMistakes(e.target.value)} className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" rows={2} placeholder="Any mistakes?" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Things which could be done better</label>
            <textarea value={better} onChange={e => setBetter(e.target.value)} className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" rows={2} placeholder="How can you improve?" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-zinc-200">What is done right today</label>
            <textarea value={right} onChange={e => setRight(e.target.value)} className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" rows={2} placeholder="What went well?" />
          </div>
          <button type="submit" className="mt-2 bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 font-semibold transition-colors">Save Journal</button>
        </form>
      </div>
    </div>
  );
} 