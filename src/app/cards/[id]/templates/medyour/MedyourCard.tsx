// app/cards/[id]/templates/medyour/MedyourCard.tsx
"use client";
import type { BrandTemplateProps } from "../index";
import s from "@/styles/components/pages/cards/[id]/templates/medyour/MedyourCard.module.css";

export default function MedyourCard({ card, socials, ensureHttp }: BrandTemplateProps) {
  return (
    <div className={s.root}>
      <div className={s.card}>
        <header className={s.header}>
          <div className={s.brandDot} aria-hidden />
          <div>
            <h1 className={s.name}>{card.name || "Unnamed"}</h1>
            <p className={s.title}>{card.title || "—"}</p>
          </div>
          {card.website && (
            <a className={s.cta} href={ensureHttp(card.website)} target="_blank" rel="noopener noreferrer">
              Visit website
            </a>
          )}
        </header>

        <section className={s.info}>
          <Item label="Email">
            {card.email ? <a href={`mailto:${card.email}`}>{card.email}</a> : "—"}
          </Item>
          <Item label="Company">{card.customerId || "—"}</Item>
          <Item label="Template">{card.template || "—"}</Item>
          <Item label="Website">
            {card.website ? <a href={ensureHttp(card.website)} target="_blank" rel="noreferrer">{card.website}</a> : "—"}
          </Item>
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
            <div className={s.tags}>
              {socials.map(soc => (
                <a key={soc.label} className={s.tag} href={soc.href} target="_blank" rel="noreferrer">
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

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={s.item}>
      <dt className={s.dt}>{label}</dt>
      <dd className={s.dd}>{children}</dd>
    </div>
  );
}
