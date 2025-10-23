"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function UsersPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isAdmin) router.replace("/"); // حظر غير الأدمن
  }, [user, isAdmin, router]);

  if (!isAdmin) return <p style={{padding: 32, textAlign: "center"}}>Loading…</p>;

  return (
    <div className="container" style={{border: "1px solid var(--border)", background: "#fff", borderRadius: 16, padding: 24}}>
      <h1 style={{fontSize: 22, fontWeight: 700}}>Users</h1>
      <p style={{opacity: .7, marginTop: 4}}>Admin-only area</p>
      <div style={{marginTop: 16, border: "1px solid var(--border)", background: "#fff", borderRadius: 12, padding: 16, color: "var(--text-dimmer)"}}>
        Nothing here yet. Coming soon.
      </div>
    </div>
  );
}
