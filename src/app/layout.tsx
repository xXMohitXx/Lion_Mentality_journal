'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

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
];

function ThemeToggle() {
  const [dark, setDark] = React.useState(false);

  // On mount, read from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') setDark(true);
    if (stored === 'light') setDark(false);
  }, []);

  // Update HTML and localStorage when dark changes
  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
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

function SidebarProfile() {
  const [name, setName] = React.useState('Your Name');
  const [email, setEmail] = React.useState('user@email.com');
  const [editing, setEditing] = React.useState(false);
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [showDelete, setShowDelete] = React.useState(false);
  const fileInput = React.useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  }
  function handleRemoveAvatar() {
    setAvatar(null);
    if (fileInput.current) fileInput.current.value = '';
  }
  function handleDeleteProfile() {
    setName('');
    setEmail('');
    setAvatar(null);
    setShowDelete(false);
  }

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-lg font-bold text-green-700 overflow-hidden cursor-pointer" onClick={() => fileInput.current?.click()}>
          {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : 'LM'}
        </div>
        {avatar && (
          <button onClick={handleRemoveAvatar} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✖</button>
        )}
        <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>
      <div className="flex flex-col flex-1">
        {editing ? (
          <>
            <input value={name} onChange={e=>setName(e.target.value)} className="rounded bg-secondary dark:bg-zinc-800 px-2 py-1 text-sm dark:text-zinc-100 mb-1" placeholder="Name" />
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">{email || <span className="text-muted-foreground">No Email</span>}</span>
          </>
        ) : (
          <>
            <span className="font-semibold text-sm truncate max-w-[120px]">{name || <span className="text-muted-foreground">No Name</span>}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">{email || <span className="text-muted-foreground">No Email</span>}</span>
          </>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {editing ? (
          <button onClick={()=>setEditing(false)} className="text-green-600 text-xs">✔</button>
        ) : (
          <button onClick={()=>setEditing(true)} className="text-xs text-muted-foreground hover:text-primary">✏️</button>
        )}
        <button onClick={()=>setShowDelete(true)} className="text-xs text-red-500 hover:text-red-700">🗑️</button>
      </div>
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl border dark:border-zinc-800 max-w-xs w-full">
            <div className="mb-4 text-lg font-semibold text-red-600 flex items-center gap-2">⚠️ Delete Profile?</div>
            <div className="mb-4 text-sm text-muted-foreground">This will clear your profile info and remove your avatar. Are you sure?</div>
            <div className="flex gap-3 justify-end">
              <button onClick={()=>setShowDelete(false)} className="px-3 py-1 rounded bg-muted dark:bg-zinc-800">Cancel</button>
              <button onClick={handleDeleteProfile} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarLogout() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  React.useEffect(() => {
    setLoggedIn(localStorage.getItem('loggedIn') === 'true');
    const handler = () => setLoggedIn(localStorage.getItem('loggedIn') === 'true');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  if (!loggedIn) return null;
  return (
    <a href="/logout" className="block mt-2 text-red-600 hover:text-red-700 text-sm font-semibold text-center">Logout</a>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/register";
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/register";
  return (
    <div className="min-h-screen flex bg-muted">
      {!hideSidebar && (
        <aside className="w-64 bg-white dark:bg-zinc-900 border-r px-4 py-6 flex flex-col h-screen gap-4 fixed left-0 top-0 z-30">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl font-bold">Lion<span className="text-green-600">Mentality</span></span>
          </div>
          <SidebarProfile />
          <nav className="flex flex-col gap-1 flex-1 mt-4">
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
          <SidebarLogout />
        </aside>
      )}
      <div className={`flex-1 min-h-screen bg-background dark:bg-zinc-950 ${!hideSidebar ? 'ml-64' : ''}`}>
        <ClientBody>{children}</ClientBody>
      </div>
    </div>
  );
}
