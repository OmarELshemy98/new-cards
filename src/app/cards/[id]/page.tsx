"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getById, type Card } from "@/services/business-cards";

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
      { label: "LinkedIn", key: "linkedin", href: ensureHttp(card.linkedin) },
      { label: "Twitter/X", key: "twitter", href: ensureHttp(card.twitter) },
      { label: "Facebook", key: "facebook", href: ensureHttp(card.facebook) },
      { label: "Instagram", key: "instagram", href: ensureHttp(card.instagram) },
      { label: "YouTube", key: "youtube", href: ensureHttp(card.youtube) },
      { label: "TikTok", key: "tiktok", href: ensureHttp(card.tiktok) },
    ].filter(s => s.href && s.href.trim().length > 0);
  }, [card]);

  if (loading) return <div style={{ padding: 32, textAlign: "center" }}>Loading…</div>;
  if (error) return <div style={{ padding: 32, color: "#b91c1c", textAlign: "center" }}>Error: {error}</div>;
  if (!card) return <div style={{ padding: 32, textAlign: "center" }}>Card not found.</div>;

  return (
    <div style={{ padding: 16 }}>
      <div style={{
        maxWidth: 720, margin: "0 auto",
        border: "1px solid var(--border)", background: "#fff", borderRadius: 16,
        padding: 24
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.01em" }}>
              {card.name || "Unnamed"}
            </h1>
            <p style={{ color: "var(--text-dim)", marginTop: 4 }}>
              {card.title || "—"}
            </p>
          </div>

          {card.website && (
            <a
              href={ensureHttp(card.website)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid var(--primary-border)",
                background: "var(--primary-soft)",
                color: "var(--text)",
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              Visit website
            </a>
          )}
        </div>

        <div style={{
          marginTop: 16, padding: 16, borderRadius: 12, background: "var(--panel-2)", border: "1px solid var(--border)"
        }}>
          <dl style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, alignItems: "baseline" }}>
            <dt style={{ color: "var(--text-dimmer)" }}>Email</dt>
            <dd style={{ overflowWrap: "anywhere" }}>{card.email || "—"}</dd>

            <dt style={{ color: "var(--text-dimmer)" }}>Company</dt>
            <dd>{card.customerId || "—"}</dd>

            <dt style={{ color: "var(--text-dimmer)" }}>Template</dt>
            <dd>{card.template || "—"}</dd>

            <dt style={{ color: "var(--text-dimmer)" }}>Website</dt>
            <dd>
              {card.website ? (
                <a href={ensureHttp(card.website)} target="_blank" rel="noopener noreferrer">
                  {card.website}
                </a>
              ) : "—"}
            </dd>
          </dl>
        </div>

        {card.shortDescription && (
          <div style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>About</h2>
            <p style={{ lineHeight: 1.6 }}>{card.shortDescription}</p>
          </div>
        )}

        {socials.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Social</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {socials.map(s => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "#fff",
                    textDecoration: "none",
                    color: "var(--text)"
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
