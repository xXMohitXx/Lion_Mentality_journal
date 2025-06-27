'use client';
import React from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState("");
  const router = useRouter();

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !confirm) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    // Save login state in localStorage
    localStorage.setItem('loggedIn', 'true');
    router.push('/dashboard');
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-muted dark:bg-zinc-950 px-4">
      <form onSubmit={handleRegister} className="bg-card dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl shadow-sm p-8 flex flex-col gap-4 max-w-sm w-full">
        <div className="text-2xl font-bold mb-2">Register</div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" placeholder="Email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" placeholder="Password" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Confirm Password</label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" placeholder="Confirm Password" />
        </div>
        <button type="submit" className="mt-2 bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 font-semibold transition-colors">Register</button>
        <div className="text-xs text-muted-foreground mt-2">Already have an account? <a href="/login" className="underline text-primary">Login</a></div>
      </form>
    </div>
  );
} 