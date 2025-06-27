'use client';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    localStorage.removeItem('loggedIn');
    setTimeout(() => {
      router.replace('/login');
    }, 1000);
  }, [router]);
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-muted dark:bg-zinc-950 px-4">
      <div className="bg-card dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl shadow-sm p-8 flex flex-col items-center gap-4 max-w-sm w-full">
        <div className="text-2xl font-bold mb-2">Logging out...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    </div>
  );
} 