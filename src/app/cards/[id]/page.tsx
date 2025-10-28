// app/cards/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getById, type Card } from "@/services/business-cards";
import { BrandTemplate, getTemplateByCustomerId } from "./templates";

function ensureHttp(url?: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export default function CardPublicPage() {
  const params = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await getById(params.id);
        setCard(data);
      } catch (e) {
        setError((e as Error)?.message ?? "Failed to load card");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  const socials = useMemo(() => {
    if (!card) return [];
    return [
      { label: "LinkedIn", href: ensureHttp(card.linkedin) },
      { label: "Twitter/X", href: ensureHttp(card.twitter) },
      { label: "Facebook", href: ensureHttp(card.facebook) },
      { label: "Instagram", href: ensureHttp(card.instagram) },
      { label: "YouTube", href: ensureHttp(card.youtube) },
      { label: "TikTok", href: ensureHttp(card.tiktok) },
    ].filter(s => s.href && s.href.trim().length > 0);
  }, [card]);

  if (loading) return <div style={{ padding: 32, textAlign: "center" }}>Loading…</div>;
  if (error)   return <div style={{ padding: 32, color: "#b91c1c", textAlign: "center" }}>Error: {error}</div>;
  if (!card)   return <div style={{ padding: 32, textAlign: "center" }}>Card not found.</div>;

  // 🔑 حدّد القالب حسب customerId (مع normalize للحروف)
  const Template: BrandTemplate = getTemplateByCustomerId(card.customerId);

  return (
    <Template
      card={card}
      socials={socials}
      ensureHttp={ensureHttp}
    />
  );
}
