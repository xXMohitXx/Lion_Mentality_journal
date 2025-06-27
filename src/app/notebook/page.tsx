'use client';
import React from "react";

function getMonthName(year: number, month: number) {
  return `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function NotebookPage() {
  // Notebooks: { name, year, month, id }
  const today = new Date();
  const [notebooks, setNotebooks] = React.useState([
    { id: 1, name: getMonthName(today.getFullYear(), today.getMonth()), year: today.getFullYear(), month: today.getMonth() }
  ]);
  const [selectedId, setSelectedId] = React.useState(1);
  const [adding, setAdding] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [editingId, setEditingId] = React.useState<number|null>(null);
  const [editName, setEditName] = React.useState("");
  // Demo: store journal/trade status per notebook/date
  const [entries, setEntries] = React.useState<{[key:string]: {journal?: boolean, trade?: boolean}}>(() => ({}));
  const [deleteId, setDeleteId] = React.useState<number|null>(null);

  const selected = notebooks.find(n => n.id === selectedId);
  if (!selected) return null;
  const days = getDaysInMonth(selected.year, selected.month);
  const firstDay = getFirstDayOfMonth(selected.year, selected.month);
  const monthKey = `${selected.year}-${selected.month+1}`;

  function handleAddNotebook(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const id = Date.now();
    setNotebooks([...notebooks, { id, name: newName, year: today.getFullYear(), month: today.getMonth() }]);
    setSelectedId(id);
    setNewName("");
    setAdding(false);
  }
  function handleEditNotebook(e: React.FormEvent) {
    e.preventDefault();
    setNotebooks(notebooks.map(n => n.id === editingId ? { ...n, name: editName } : n));
    setEditingId(null);
    setEditName("");
  }
  function toggleEntry(day: number, type: 'journal'|'trade') {
    const key = `${monthKey}-${day}`;
    setEntries(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: !prev[key]?.[type]
      }
    }));
  }
  function handleDeleteNotebook(id: number) {
    if (notebooks.length === 1) return; // Prevent deleting the last notebook
    setNotebooks(notebooks.filter(n => n.id !== id));
    if (selectedId === id) setSelectedId(notebooks.find(n => n.id !== id)?.id || 1);
    setDeleteId(null);
  }

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center px-4">
      <div className="w-full max-w-3xl mt-10">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-2xl font-bold">Notebooks</span>
          <button onClick={() => setAdding(true)} className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1 text-sm font-semibold transition-colors">+ Add Notebook</button>
        </div>
        <div className="flex gap-3 flex-wrap mb-8">
          {notebooks.map(n => (
            <div key={n.id} className={`px-4 py-2 rounded-lg border dark:border-zinc-800 cursor-pointer flex items-center gap-2 ${selectedId===n.id ? 'bg-green-100 dark:bg-green-900 border-green-600' : 'bg-card dark:bg-zinc-900'}`}
              onClick={() => setSelectedId(n.id)}>
              {editingId === n.id ? (
                <form onSubmit={handleEditNotebook} className="flex gap-2 items-center">
                  <input value={editName} onChange={e=>setEditName(e.target.value)} className="rounded bg-secondary dark:bg-zinc-800 px-2 py-1 text-sm dark:text-zinc-100" />
                  <button type="submit" className="text-green-600 font-bold">✔</button>
                  <button type="button" onClick={()=>setEditingId(null)} className="text-red-500 font-bold">✖</button>
                </form>
              ) : (
                <>
                  <span>{n.name}</span>
                  <button onClick={e=>{e.stopPropagation();setEditingId(n.id);setEditName(n.name);}} className="text-xs text-muted-foreground hover:text-primary">✏️</button>
                  {notebooks.length > 1 && (
                    <button onClick={e=>{e.stopPropagation();setDeleteId(n.id);}} className="text-xs text-red-500 hover:text-red-700 ml-1">🗑️</button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        {adding && (
          <form onSubmit={handleAddNotebook} className="mb-8 flex gap-2 items-center">
            <input value={newName} onChange={e=>setNewName(e.target.value)} className="rounded bg-secondary dark:bg-zinc-800 px-2 py-1 text-sm dark:text-zinc-100" placeholder="Notebook name (e.g. July 2024)" />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1 text-sm font-semibold">Add</button>
            <button type="button" onClick={()=>setAdding(false)} className="text-red-500 font-bold">✖</button>
          </form>
        )}
        {deleteId !== null && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl border dark:border-zinc-800 max-w-xs w-full">
              <div className="mb-4 text-lg font-semibold text-red-600 flex items-center gap-2">⚠️ Delete Notebook?</div>
              <div className="mb-4 text-sm text-muted-foreground">This action cannot be undone. Are you sure you want to delete this notebook?</div>
              <div className="flex gap-3 justify-end">
                <button onClick={()=>setDeleteId(null)} className="px-3 py-1 rounded bg-muted dark:bg-zinc-800">Cancel</button>
                <button onClick={()=>handleDeleteNotebook(deleteId!)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
              </div>
            </div>
          </div>
        )}
        {/* Calendar for selected notebook */}
        <div className="bg-card dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl shadow-sm p-6">
          <div className="mb-4 text-lg font-semibold">{selected.name}</div>
          <div className="grid grid-cols-7 gap-2 text-xs mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(<div key={d} className="font-medium text-muted-foreground dark:text-zinc-300 text-center">{d}</div>))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array(firstDay).fill(null).map((_,i)=><div key={"empty-"+i}></div>)}
            {Array.from({length:days},(_,i)=>{
              const day = i+1;
              const key = `${monthKey}-${day}`;
              return (
                <div key={day} className="rounded-lg bg-muted dark:bg-zinc-800 p-2 flex flex-col items-center gap-1">
                  <div className="font-semibold text-sm">{day}</div>
                  <div className="flex gap-1">
                    <button onClick={()=>toggleEntry(day,'journal')} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${entries[key]?.journal ? 'bg-green-600 text-white' : 'bg-secondary dark:bg-zinc-700 text-muted-foreground'}`}>J</button>
                    <button onClick={()=>toggleEntry(day,'trade')} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${entries[key]?.trade ? 'bg-blue-600 text-white' : 'bg-secondary dark:bg-zinc-700 text-muted-foreground'}`}>T</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 