// app/business-cards/page.tsx
/**
 * صفحة إدارة البزنس كاردز (مختصرة):
 * - حماية الأوث + جلب البيانات من Firestore.
 * - تمرير cards و setCards و userId لـ BusinessCardsTable.
 * - تم حذف زرار Logout (موجود في AppShell).
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getAll, type Card } from "@/services/business-cards";
import BusinessCardsTable from "@/app/components/business-cards/BusinessCardsTable";

export default function BusinessCardsPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  // حماية المسار
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // جلب البيانات
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setFetching(true);
        if (!user) {
          setFetching(false);
          return;
        }
        const data = await getAll(user.uid, { isAdmin });
        setCards(data);
      } catch (e) {
        setError((e as Error)?.message ?? "Unknown error");
      } finally {
        setFetching(false);
      }
    })();
  }, [user, isAdmin]);

  if (loading || fetching) return <p className="p-8 text-center">Loading…</p>;
  if (!user) return null;
  if (error) return <p className="p-8 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <BusinessCardsTable cards={cards} setCards={setCards} userId={user.uid} />
    </div>
  );
}
