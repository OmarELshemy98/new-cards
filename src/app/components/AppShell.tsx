// app/components/AppShell.tsx
// ده الكود المسؤول عن الـ Sidebar + هيكل التطبيق العام (App Shell)

"use client";

import { useState } from "react"; // ✔️ شلنا useMemo لأنه غير لازم هنا
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function AppShell({ children }: { children: React.ReactNode }) {
  // حالة المستخدم وصلاحياته
  const { user, isAdmin } = useAuth();

  // مسار الصفحة الحالي + الراوتر
  const pathname = usePathname();
  const router = useRouter();

  // فتح/غلق السايدبار (موبايل)
  const [open, setOpen] = useState(false);

  // هل نخفي السايدبار (صفحة /login)؟
  const hideSidebar = pathname?.startsWith("/login");

  // ✅ حسب طلبك: لو مش في /login ومفيش يوزر -> منرجّعش أي UI
  if (!hideSidebar && !user) return null;

  // ✅ روابط السايدبار ثابتة (مش محتاجة useMemo)
  const nav = [
    { label: "Dashboard", href: "/dashboard", adminOnly: false },
    { label: "Users", href: "/users", adminOnly: true },
    { label: "Business Cards", href: "/business-cards", adminOnly: false },
  ] as const;

  async function onLogout() {
    await signOut(auth);
    router.replace("/login");
  }

  // لو إحنا على /login: ما تعرضش السايدبار، فقط المحتوى (صفحة اللوجين)
  if (hideSidebar) return <>{children}</>;

  return (
    <div className="min-h-dvh">
      {/* زر فتح السايدبار للموبايل */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="md:hidden fixed top-3 left-3 z-50 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm"
        aria-expanded={open}
        aria-controls="sidebar"
      >
        Menu
      </button>

      {/* السايدبار */}
      <aside
        id="sidebar"
        className={[
          "fixed z-40 top-0 left-0 h-full w-64",
          "border-r border-white/10 bg-slate-900/70 backdrop-blur",
          "transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {/* هيدر السايدبار */}
        <div className="p-4 border-b border-white/10">
          <div className="text-xs uppercase tracking-wide text-white/60">Welcome</div>
          <div className="mt-1 font-medium text-white/90 truncate">
            {user?.email ?? "Guest"}
          </div>
        </div>

        {/* روابط التنقل */}
        <nav className="p-3 space-y-1">
          {nav.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-cyan-400/20 border border-cyan-300/25"
                    : "border border-transparent hover:border-white/10 hover:bg-white/5",
                ].join(" ")}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* زر الخروج */}
        <div className="mt-auto absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="md:ml-64 p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
