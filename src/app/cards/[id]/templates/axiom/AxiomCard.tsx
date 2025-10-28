// app/cards/[id]/templates/axiom/AxiomCard.tsx
"use client";
import type { BrandTemplateProps } from "../index";
import s from "@/styles/components/pages/cards/[id]/templates/axiom/AxiomCard.module.css";
export default function AxiomCard({ card, socials, ensureHttp }: BrandTemplateProps) {
  return (
    <div className={s.root}>
      <div className={s.card}>
        <header className={s.header}>
          <div>
            <h1 className={s.name}>{card.name || "Unnamed"}</h1>
            <p className={s.title}>{card.title || "—"}</p>
          </div>
          {card.website && (
            <a className={s.cta} href={ensureHttp(card.website)} target="_blank" rel="noopener noreferrer">
              Website
            </a>
          )}
        </header>

        <section className={s.grid}>
          <Tile label="Email" value={card.email ? <a href={`mailto:${card.email}`}>{card.email}</a> : "—"} />
          <Tile label="Company" value={card.customerId || "—"} />
          <Tile label="Template" value={card.template || "—"} />
          <Tile
            label="Website"
            value={card.website ? <a href={ensureHttp(card.website)} target="_blank" rel="noreferrer">{card.website}</a> : "—"}
          />
        </section>

        {card.shortDescription && (
          <section className={s.about}>
            <h2>About</h2>
            <p>{card.shortDescription}</p>
          </section>
        )}

        {socials.length > 0 && (
          <section className={s.socials}>
            <h2>Social</h2>
            <div className={s.chips}>
              {socials.map(soc => (
                <a key={soc.label} className={s.chip} href={soc.href} target="_blank" rel="noreferrer">
                  {soc.label}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={s.tile}>
      <div className={s.label}>{label}</div>
      <div className={s.value}>{value}</div>
    </div>
  );
}
