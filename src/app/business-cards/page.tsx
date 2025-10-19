"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getAll, type Card } from "@/services/business-cards";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";

export default function BusinessCards() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  // لو مفيش مستخدم، رجّع للوجين
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // جلب الداتا
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setFetching(true);
        // 👇 هنا استخدم الـ UID الثابت
        const data = await getAll("avapcfzkydNUQC6oI7CmQ1uuhf02");
        setCards(data);
      } catch (e) {
        setError((e as Error)?.message ?? "Unknown error");
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  if (loading || fetching) return <p className="p-8 text-center">Loading…</p>;
  if (!user) return null;
  if (error) return <p className="p-8 text-center text-red-600">Error: {error}</p>;

  return (
    <div className="p-8">
      <Header count={cards.length} />
      {cards.length === 0 ? (
        <p className="text-gray-500">No data.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
              <p className="text-xs text-gray-500 mb-1">ID: {c.id}</p>
              <h2 className="text-xl font-semibold mb-1">{c.name || "—"}</h2>
              <p className="text-gray-600">{c.title || "—"}</p>
              <p className="text-gray-500">{c.email || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  function Header({ count }: { count: number }) {
    return (
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Cards</h1>
          <p className="text-sm text-gray-500">
            {count} item{count !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => signOut(auth).then(() => router.replace("/login"))}
          className="border px-3 py-1.5 rounded"
        >
          Logout
        </button>
      </div>
    );
  }
}
