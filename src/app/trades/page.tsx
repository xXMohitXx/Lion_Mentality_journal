'use client';
import React from "react";

export default function TradesPage() {
  const [stock, setStock] = React.useState("");
  const [entry, setEntry] = React.useState("");
  const [exit, setExit] = React.useState("");
  const [qty, setQty] = React.useState("");
  const [type, setType] = React.useState<'long' | 'short'>("long");
  const [image, setImage] = React.useState<File | null>(null);
  const [imgUrl, setImgUrl] = React.useState<string | null>(null);
  const [dateStr, setDateStr] = React.useState('');
  const [timeStr, setTimeStr] = React.useState('');
  const [trades, setTrades] = React.useState<any[]>([]);

  React.useEffect(() => {
    const now = new Date();
    setDateStr(now.toLocaleDateString());
    setTimeStr(now.toLocaleTimeString());
  }, []);

  function calcPNL() {
    const e = parseFloat(entry);
    const x = parseFloat(exit);
    const q = parseFloat(qty);
    if (isNaN(e) || isNaN(x) || isNaN(q)) return "-";
    if (type === "long") return (q * (x - e)).toFixed(2);
    return (q * (e - x)).toFixed(2);
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImgUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTrades([{
      stock,
      entry,
      exit,
      qty,
      type,
      pnl: calcPNL(),
      date: dateStr,
      time: timeStr,
      imgUrl,
    }, ...trades]);
    setStock(""); setEntry(""); setExit(""); setQty(""); setImage(null); setImgUrl(null);
  }

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 flex-col">
      <div className="w-full max-w-xl mt-10">
        <div className="mb-5"><span className="text-2xl font-bold">Add Trade</span></div>
        <form onSubmit={handleSubmit} className="bg-card dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Stock Name</label>
            <input value={stock} onChange={e => setStock(e.target.value)} className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" placeholder="e.g. AAPL" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Entry Price</label>
              <input value={entry} onChange={e => setEntry(e.target.value)} type="number" className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" placeholder="e.g. 150.00" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Exit Price</label>
              <input value={exit} onChange={e => setExit(e.target.value)} type="number" className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" placeholder="e.g. 155.00" />
            </div>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Quantity</label>
              <input value={qty} onChange={e => setQty(e.target.value)} type="number" className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" placeholder="e.g. 10" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Trade Type</label>
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => setType("long")}
                  className={`px-4 py-2 rounded-l bg-secondary dark:bg-zinc-800 border dark:border-zinc-700 ${type === "long" ? "!bg-green-600 !text-white" : "dark:text-zinc-100"}`}>Long</button>
                <button type="button" onClick={() => setType("short")}
                  className={`px-4 py-2 rounded-r bg-secondary dark:bg-zinc-800 border dark:border-zinc-700 ${type === "short" ? "!bg-red-500 !text-white" : "dark:text-zinc-100"}`}>Short</button>
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Calculated P&L</label>
              <div className="rounded bg-muted dark:bg-zinc-800 px-3 py-2 text-sm font-mono dark:text-zinc-100">{calcPNL()}</div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Date & Time</label>
              <div className="rounded bg-muted dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100">{dateStr} {timeStr}</div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Chart Image</label>
            <input type="file" accept="image/*" onChange={handleImage} className="block w-full text-sm" />
            {imgUrl && <img src={imgUrl} alt="Chart" className="mt-2 rounded max-h-40" />}
          </div>
          <button type="submit" className="mt-2 bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 font-semibold transition-colors">Add Trade</button>
        </form>
      </div>
      {/* Trades Table */}
      <div className="w-full max-w-5xl mt-10">
        <div className="mb-3 text-xl font-semibold">All Trades</div>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-xl overflow-hidden text-sm">
            <thead className="bg-muted dark:bg-zinc-800">
              <tr>
                <th className="px-3 py-2 text-left">Stock</th>
                <th className="px-3 py-2 text-left">Entry</th>
                <th className="px-3 py-2 text-left">Exit</th>
                <th className="px-3 py-2 text-left">Qty</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">P&L</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">Chart</th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-muted-foreground">
                    No trades yet.
                  </td>
                </tr>
              ) : (
                trades.map((t, i) => (
                  <tr key={i} className="border-b dark:border-zinc-800">
                    <td className="px-3 py-2 font-medium">{t.stock}</td>
                    <td className="px-3 py-2">{t.entry}</td>
                    <td className="px-3 py-2">{t.exit}</td>
                    <td className="px-3 py-2">{t.qty}</td>
                    <td className="px-3 py-2 capitalize">{t.type}</td>
                    <td className={`px-3 py-2 font-mono ${parseFloat(t.pnl) >= 0 ? 'text-green-600' : 'text-red-500'}`}>{t.pnl}</td>
                    <td className="px-3 py-2">{t.date}</td>
                    <td className="px-3 py-2">{t.time}</td>
                    <td className="px-3 py-2">{t.imgUrl && <img src={t.imgUrl} alt="Chart" className="h-10 rounded" />}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 