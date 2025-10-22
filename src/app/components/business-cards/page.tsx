"use client";

/**
 * صفحة عرض وإدارة البزنس كاردز
 * - حماية: لو مفيش يوزر => /login
 * - Fetch: getAll (الأدمن يشوف الكل)
 * - بتمرر الداتا لـ BusinessCardsTable
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getAll, type Card } from "@/services/business-cards";
import BusinessCardsTable from "@/app/components/business-cards/BusinessCardsTable";

export default function BusinessCardsPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  const [cards, setCards] = useState<Card[]>([]);
  const [fetching, setFetching] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, user, router]);

  useEffect(() => {
    (async () => {
      try {
        if (!user) return;
        setErr(null);
        setFetching(true);
        const data = await getAll(user.uid, { isAdmin });
        setCards(data);
      } catch (e) {
        setErr((e as Error)?.message ?? "Unknown error");
      } finally {
        setFetching(false);
      }
    })();
  }, [user, isAdmin]);

  if (loading || fetching) return <p className="p-8 text-center">Loading…</p>;
  if (!user) return null;
  if (err) return <p className="p-8 text-center text-red-500">Error: {err}</p>;

  return <BusinessCardsTable cards={cards} setCards={setCards} userId={user.uid} />;
}
