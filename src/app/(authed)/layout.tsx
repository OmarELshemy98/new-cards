"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AppShell from "@/app/components/AppShell";

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, user, router]);
  if (loading || !user) return <div style={{minHeight:"60vh",display:"grid",placeItems:"center"}}>Loading…</div>;

  return <AppShell>{children}</AppShell>;
}
