"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <p className="p-8 text-center">Loading…</p>;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/40 p-10">
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-400/25 to-fuchsia-400/25 blur-3xl"
      />
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-white/70 mt-1">Overview & insights</p>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
          <span className="inline-block h-2 w-2 rounded-full bg-yellow-300/90" />
          Coming soon
        </div>
        <h2 className="mt-4 text-2xl font-semibold">We’re crafting your analytics</h2>
        <p className="mt-2 text-white/60 max-w-md mx-auto">
          Stay tuned for a clean dashboard with KPIs, trends, and activity. Meanwhile,
          you can manage your business cards from the sidebar.
        </p>
      </div>
    </div>
  );
}
