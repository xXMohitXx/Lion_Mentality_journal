'use client';
import React from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Demo: accept any non-empty email/password
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    // Save login state in localStorage
    localStorage.setItem('loggedIn', 'true');
    router.push('/dashboard');
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-muted dark:bg-zinc-950 px-4">
      <form onSubmit={handleLogin} className="bg-card dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl shadow-sm p-8 flex flex-col gap-4 max-w-sm w-full">
        <div className="text-2xl font-bold mb-2">Login</div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" placeholder="Email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-zinc-200">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded bg-secondary dark:bg-zinc-800 px-3 py-2 text-sm dark:text-zinc-100" placeholder="Password" />
        </div>
        <button type="submit" className="mt-2 bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 font-semibold transition-colors">Login</button>
        <div className="text-xs text-muted-foreground mt-2">Don't have an account? <a href="/register" className="underline text-primary">Register</a></div>
      </form>
    </div>
  );
} 