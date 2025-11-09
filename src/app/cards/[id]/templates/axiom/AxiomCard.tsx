/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as QRCode from "qrcode"; // ⬅️ import آمن لأنواع TS
import type { BrandTemplateProps } from "../index";
import s from "@/styles/components/pages/cards/[id]/templates/axiom/AxiomCard.module.css";

/* glyphs كما هي */
function PhoneGlyph() { /* ... نفس الكود */ 
  return (
    <svg viewBox="0 0 24 24" className={s.callGlyph} aria-hidden>
      <path stroke="currentColor" strokeWidth="2" fill="none" d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.05 11.05 0 003.89.74 1 1 0 011 1v3.61a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.61a1 1 0 011 1c0 1.33.26 2.61.74 3.89a1 1 0 01-.21 1.11l-2.2 2.2z"/>
    </svg>
  );
}
function DownloadGlyph() { /* ... */ 
  return (
    <svg viewBox="0 0 24 24" className={s.downloadSvg} aria-hidden>
      <path stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12"/>
    </svg>
  );
}
function PlusGlyph() { /* ... */ 
  return (
    <svg viewBox="0 0 24 24" className={s.plusSvg} aria-hidden>
      <line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* helpers: vCard + download */
const esc = (v?: string) => (v ?? "").trim().replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
function buildVCard(opts: {
  name: string;
  company?: string;
  title?: string;
  phones?: { value: string; type?: "CELL" | "WORK" | "HOME" }[];
  email?: string;
  website?: string;
  address?: string;
  note?: string;
}) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${esc(opts.name)};;;`,
    `FN:${esc(opts.name)}`,
    opts.company ? `ORG:${esc(opts.company)}` : "",
    opts.title ? `TITLE:${esc(opts.title)}` : "",
    ...(opts.phones ?? []).filter(p => p.value).map(p => `TEL;TYPE=${p.type ?? "CELL"},VOICE:${esc(p.value)}`),
    opts.email ? `EMAIL;TYPE=INTERNET,PREF:${esc(opts.email)}` : "",
    opts.website ? `URL:${esc(opts.website)}` : "",
    opts.address ? `ADR;TYPE=WORK:;;${esc(opts.address)};;;;` : "",
    opts.note ? `NOTE:${esc(opts.note)}` : "",
    "END:VCARD",
  ].filter(Boolean).join("\n");
}
function downloadText(filename: string, text: string, mime = "text/vcard;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/* types الإضافية */
type ExtraFields = {
  company?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
};

type BaseCard = BrandTemplateProps["card"];
type CardWithExtras = BaseCard & ExtraFields;

export default function AxiomCard({ card, socials: _socials, ensureHttp }: BrandTemplateProps) {
  void _socials;

  const [overlayHidden, setOverlayHidden] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOverlayHidden(true), 2000); return () => clearTimeout(t); }, []);

  const c = card as CardWithExtras;

  const name = c.name || "Unnamed";
  const title = c.title || "—";
  const company = c.company || "Axiom";
  const phone1 = c.phone1 || "";
  const phone2 = c.phone2 || "";
  const email = c.email || "";
  const websiteHref = ensureHttp(c.website || "");
  const websiteText = (c.website || "").replace(/^https?:\/\//i, "");
  const address = c.address || "";
  const description = c.shortDescription || "Axiom — Modern digital identity. (Description missing in Firestore document)";

  const orderedSocials = [
    c.instagram && { label: "Instagram", href: ensureHttp(c.instagram), src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png", color: "#2563eb" },
    c.facebook  && { label: "Facebook",  href: ensureHttp(c.facebook),  src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", color: "#1d4ed8" },
    c.linkedin  && { label: "LinkedIn",  href: ensureHttp(c.linkedin),  src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png", color: "#1e40af" },
  ].filter(Boolean) as { label: string; href: string; src: string; color: string }[];

  const hasX = Boolean(c.twitter);

  // ✅ توليد وتحميل QR كـ PNG
  async function onDownloadQR() {
    try {
      const profileUrl = `${window.location.origin}/cards/${c.id}`;
      const dataUrl = await QRCode.toDataURL(profileUrl, {
        errorCorrectionLevel: "H",
        width: 512,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${(name || "qr").replace(/\s+/g, "_")}_QR.png`;
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) {
      console.error(e);
      alert("Failed to generate QR code. Please try again.");
    }
  }

  // ✅ Add to contacts — vCard كاملة
  function onDownloadVcf() {
    const vCard = buildVCard({
      name, company, title,
      phones: [
        ...(phone1 ? [{ value: phone1, type: "CELL" as const }] : []),
        ...(phone2 ? [{ value: phone2, type: "WORK" as const }] : []),
      ],
      email,
      website: websiteHref,
      address,
      note: description,
    });
    downloadText(`${(name || "contact").replace(/\s+/g, "_")}.vcf`, vCard);
  }

  return (
    <div className={s.root}>
      {/* Banner */}
      <div className={s.banner} aria-hidden>
        <Image className={s.bannerImg} src="/axiom-cards/image/header.jpg" alt="" fill priority sizes="(max-width: 448px) 100vw, 448px" />
        <div className={s.avatarWrap}>
          <Image className={s.avatarImg} src="/axiom-cards/image/logo.png" alt="Profile" width={128} height={128} priority />
        </div>
      </div>

      {/* Overlay */}
      {!overlayHidden && (
        <div className={s.overlay} aria-hidden>
          <Image className={s.overlayImg} src="/axiom-cards/image/landing-logo.png" alt="Landing Logo" width={192} height={192} priority />
        </div>
      )}

      {/* Main */}
      <main className={s.main}>
        <section className={s.identity}>
          <h2 className={s.name}>{name}</h2>
          <div className={s.title}>{title}</div>
          <div className={s.company}>{company}</div>
        </section>

        {/* Icons */}
        <div className={s.iconRow}>
          {phone1 && (
            <a className={s.iconBtn} href={`tel:${phone1}`} aria-label="Call phone 1">
              <svg viewBox="0 0 32 32" className={s.iconSvg} aria-hidden>
                <rect x="8" y="4" width="16" height="24" rx="3" stroke="black" strokeWidth="2.2" fill="none" />
                <rect x="14" y="24" width="4" height="3" rx="1" fill="black" />
              </svg>
            </a>
          )}
          {phone2 && (
            <a className={s.iconBtn} href={`tel:${phone2}`} aria-label="Call phone 2">
              <svg viewBox="0 0 32 32" className={s.iconSvg} aria-hidden>
                <rect x="8" y="4" width="16" height="24" rx="3" stroke="black" strokeWidth="2.2" fill="none" />
                <rect x="14" y="24" width="4" height="3" rx="1" fill="black" />
              </svg>
            </a>
          )}
          {email && (
            <a className={s.iconBtn} href={`mailto:${email}`} aria-label="Send email">
              <svg viewBox="0 0 24 24" className={s.iconSvg} aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="black" strokeWidth="2.2" fill="none" />
                <polyline points="3,7 12,13 21,7" stroke="black" strokeWidth="2.2" fill="none" />
              </svg>
            </a>
          )}
        </div>

        {/* Contact & Socials */}
        <div className={s.stack}>
          <section className={s.contactCard}>
            <div className={s.contactHeader}>
              <span className={s.contactIcon}><PhoneGlyph /></span>
              <span className={s.contactTitle}>Contact Me</span>
            </div>
            <hr className={s.hr} />
            {phone1 && (<a className={s.contactLine} href={`tel:${phone1}`}><span className={s.contactLabel}>Call</span><br /><span className={s.contactValue}>{phone1}</span></a>)}
            {phone2 && (<a className={s.contactLine} href={`tel:${phone2}`}><span className={s.contactLabel}>Call</span><br /><span className={s.contactValue}>{phone2}</span></a>)}
            {email && (<a className={s.contactLine} href={`mailto:${email}`}><span className={s.contactLabel}>Email</span><br /><span className={s.contactValue}>{email}</span></a>)}
            {address && (
              <a className={s.contactLine} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer">
                <span className={s.contactLabel}>Address</span><br /><span className={s.contactValue}>{address}</span>
              </a>
            )}
          </section>

          {(orderedSocials.length > 0 || hasX) && (
            <section className={s.socialSection}>
              <h3 className={s.followTitle}>Follow Us</h3>
              <div className={s.socialGrid}>
                {orderedSocials.map(soc => (
                  <a key={soc.label} className={s.socialItem} href={soc.href} target="_blank" rel="noreferrer">
                    <div className={s.socialLeft}>
                      <img src={soc.src} alt={soc.label} className={s.socialIcon} />
                      <span className={s.socialName} style={{ color: soc.color }}>{soc.label}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className={s.arrowSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
                {hasX && (
                  <a className={s.socialItem} href={ensureHttp(c.twitter!)} target="_blank" rel="noreferrer">
                    <div className={s.socialLeft}>
                      <span className={s.socialIcon} style={{ display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"2.5rem", height:"2.5rem", color:"#000" }}>
                          <rect width="120" height="120" rx="24" fill="white" />
                          <path d="M86.4 32H99.2L72.8 61.12L103.2 96H81.6L62.56 74.08L40.8 96H28L56.16 65.12L27.2 32H49.12L66.08 51.36L86.4 32ZM82.56 89.44H88.8L48.16 38.08H41.6L82.56 89.44Z" fill="currentColor"/>
                        </svg>
                      </span>
                      <span className={s.socialName} style={{ color:"#1e40af" }}>X</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className={s.arrowSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Website */}
          <section className={s.websiteCard}>
            <a className={s.websiteLink} href={websiteHref} target="_blank" rel="noreferrer">{websiteText}</a>
            <span className={s.websiteSub}>Description</span>
            <p className={s.websiteDesc}>{description}</p>
          </section>

          {/* QR Download */}
          <div className={s.qrWrap}>
            <button type="button" className={s.qrBtn} onClick={onDownloadQR}>
              <DownloadGlyph /> Download QR
            </button>
          </div>
        </div>
      </main>

      {/* Add to Contacts */}
      <div className={s.fab}>
        <button type="button" className={s.fabBtn} onClick={() => {
          const vCard = buildVCard({
            name, company, title,
            phones: [
              ...(phone1 ? [{ value: phone1, type: "CELL" as const }] : []),
              ...(phone2 ? [{ value: phone2, type: "WORK" as const }] : []),
            ],
            email,
            website: websiteHref,
            address,
            note: description,
          });
          downloadText(`${(name || "contact").replace(/\s+/g, "_")}.vcf`, vCard);
        }}>
          <span className={s.fabText}>Add to Contacts</span>
          <span className={s.fabCircle}><PlusGlyph /></span>
        </button>
      </div>
    </div>
  );
}
