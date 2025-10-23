"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAll, type Card } from "@/services/business-cards";
import BusinessCardsTable from "@/app/components/business-cards/BusinessCardsTable";

export default function BusinessCardsPage() {
  const { user, isAdmin } = useAuth();

  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setFetching(true);
        const data = await getAll(user!.uid, { isAdmin });
        setCards(data);
      } catch (e) {
        setError((e as Error)?.message ?? "Unknown error");
      } finally {
        setFetching(false);
      }
    })();
  }, [user, isAdmin]);

  if (fetching) return <p style={{padding: 32, textAlign: "center"}}>Loading…</p>;
  if (error)   return <p style={{padding: 32, textAlign: "center", color: "#b91c1c"}}>Error: {error}</p>;

  return (
    <div className="container">
      <BusinessCardsTable cards={cards} setCards={setCards} userId={user!.uid} />
    </div>
  );
}
