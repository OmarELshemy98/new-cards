"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getAll, type Card } from "@/services/business-cards";

export default function BusinessCards() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // حماية: لازم يبقى فيه مستخدم
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/login");
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const data = await getAll("avapcfzkydNUQC6oI7CmQ1uuhf02");
        setCards(data);
      } catch (e) {
        setError((e as Error)?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="p-8 text-center">Loading…</p>;
  if (error)   return <p className="p-8 text-center text-red-600">Error: {error}</p>;
  if (!cards.length)
    return (
      <div className="p-8">
        <Header />
        <p className="text-gray-500">No data.</p>
      </div>
    );

  return (
    <div className="p-8">
      <Header />
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
    </div>
  );

  function Header() {
    return (
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Cards</h1>
          <p className="text-sm text-gray-500">
            {cards.length} item{cards.length !== 1 ? "s" : ""}
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
