"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import s from "@/styles/components/AppShell.module.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // اقفل المينيو تلقائيًا عند أي تنقل
  useEffect(() => { setOpen(false); }, [pathname]);

  const nav = [
    { label: "Dashboard", href: "/dashboard", adminOnly: false },
    { label: "Users", href: "/users", adminOnly: true },
    { label: "Business Cards", href: "/business-cards", adminOnly: false },
  ] as const;

  async function onLogout() { await logout(); router.replace("/login"); }

  return (
    <div className={s.wrapper}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={s.menuBtn}
        aria-expanded={open}
        aria-controls="sidebar"
      >
        Menu
      </button>

      {/* خليك حريص: لازم s.open يكون مُعرّف في CSS Module */}
      <aside id="sidebar" className={`${s.sidebar} ${open ? s.open : ""}`}>
        <div className={s.header}>
          <div className={s.welcome}>Welcome</div>
          <div className={s.email}>{user?.email ?? "Guest"}</div>
        </div>

        <nav className={s.nav}>
          {nav.map(item => {
            if (item.adminOnly && !isAdmin) return null;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${s.link} ${active ? s.active : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={s.logout}>
          <button type="button" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      <main className={s.main}>{children}</main>
    </div>
  );
}
