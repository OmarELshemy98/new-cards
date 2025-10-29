// app/cards/[id]/templates/medyour/MedyourCard.tsx
"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

export default function MedyourCard() {
  const { id } = useParams<{ id: string }>();

  // لو عندك في الداتا حقل legacyId يطابق أرقام المشروع القديم، استخدمه بدل id
  // const externalId = card.legacyId || id;
  const externalId = id; // مؤقتًا

  const url = useMemo(() => {
    return `/medyour-cards/index.html?id=${encodeURIComponent(String(externalId))}`;
  }, [externalId]);

  return (
    <iframe
      title="Medyour original card"
      src={url}
      style={{ display: "block", width: "100%", minHeight: "100vh", height: "100dvh", border: 0 }}
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      allow="clipboard-write; fullscreen"
    />
  );
}
