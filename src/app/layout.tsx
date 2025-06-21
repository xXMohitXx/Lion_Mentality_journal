'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Link from "next/link";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: "🏠" },
  { name: "Calendar", path: "/calendar", icon: "📅" },
  { name: "Reports", path: "/reports", icon: "📊" },
  { name: "Trades", path: "/trades", icon: "💼" },
  { name: "Journal", path: "/journal", icon: "📝" },
  { name: "Notebook", path: "/notebook", icon: "📔" },
  { name: "New trade", path: "/new-trade", icon: "➕" },
];

function ThemeToggle() {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  return (
    <button
      className="w-10 h-6 flex items-center rounded-full bg-secondary dark:bg-zinc-800 border border-input dark:border-zinc-700 relative transition-colors duration-300 focus:outline-none mb-2 mt-2"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
      type="button"
    >
      <span
        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300 ${dark ? 'translate-x-4 bg-zinc-900' : 'translate-x-0 bg-yellow-400'}`}
        style={{ boxShadow: dark ? '0 0 6px #fff8' : '0 0 6px #facc15' }}
      />
      <span className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center text-base" style={{pointerEvents: 'none'}}>
        <span className="">☀️</span>
      </span>
      <span className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center text-base" style={{pointerEvents: 'none'}}>
        <span className="">🌙</span>
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <div className="min-h-screen flex bg-muted">
          {/* Sidebar */}
          <aside className="w-64 bg-white dark:bg-zinc-900 border-r px-4 py-6 flex flex-col h-screen gap-4 fixed left-0 top-0 z-30">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              {/* Replace with optimized SVG or shadcn icon later */}
              <span className="text-2xl font-bold">Lion<span className="text-green-600">Mentality</span></span>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
              {navItems.map((item) => (
                <Link key={item.name} href={item.path} className="flex items-center gap-2 py-2 px-3 rounded hover:bg-accent text-sm font-medium transition-colors">
                  <span aria-hidden>{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
          </aside>
          {/* Main content */}
          <div className="flex-1 min-h-screen bg-background dark:bg-zinc-950 ml-64">
            <ClientBody>{children}</ClientBody>
          </div>
        </div>
      </body>
    </html>
  );
}
