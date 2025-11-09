"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import UsersTable from "@/app/components/users/UsersTable";
import { getAllUsers, type AppUser } from "@/services/users";

export default function UsersPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isAdmin) router.replace("/");
  }, [user, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        setError(null);
        setLoading(true);
        const list = await getAllUsers();
        list.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
        setUsers(list);
      } catch (e) {
        setError((e as Error)?.message ?? "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  if (!isAdmin) return <p style={{padding: 32, textAlign: "center"}}>Loading…</p>;
  if (loading)  return <p style={{padding: 32, textAlign: "center"}}>Loading users…</p>;
  if (error)    return <p style={{padding: 32, textAlign: "center", color: "#b91c1c"}}>Error: {error}</p>;

  return (
    <div className="container" style={{border: "1px solid var(--border)", background: "#fff", borderRadius: 16, padding: 24}}>
      <h1 style={{fontSize: 22, fontWeight: 700}}>Users</h1>
      <p style={{opacity: .7, marginTop: 4}}>Admin-only area</p>

      <UsersTable users={users} setUsers={setUsers} />
    </div>
  );
}
