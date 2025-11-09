// app/cards/[id]/templates/medyour/MedyourCard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import * as QRCode from "qrcode"; // ⬅️ import آمن لأنواع TS
import type { BrandTemplateProps } from "../index";
import s from "@/styles/components/pages/cards/[id]/templates/medyour/MedyourCard.module.css";

/* UI glyphs (كما هي) */
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

/* Helper: vCard + download */
const esc = (v?: string) => (v ?? "").trim().replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
function buildVCard(opts: {
  name: string;
  company?: string;
  title?: string;
  phones?: { value: string; type?: "CELL" | "WORK" | "HOME" }[];
  email?: string;
  website?: string;
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

/* Twitter tile (كما هي) */
function TwitterXSocialItem() { /* ... نفس كودك بدون تغيير */ 
  return (
    <a href="https://x.com/medyouregypt" target="_blank" rel="noreferrer" className={s.socialItem}
       style={{ background:"#fff",borderRadius:"0.75rem",boxShadow:"0 1px 6px #0001",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.75rem 1rem",cursor:"pointer",transition:"all 0.2s" }}>
      <div className={s.socialLeft} style={{ display:"flex",alignItems:"center",gap:"0.5rem" }}>
        <span style={{ width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:40,height:40,color:"#000" }}>
            <rect width="120" height="120" rx="24" fill="white" />
            <path d="M86.4 32H99.2L72.8 61.12L103.2 96H81.6L62.56 74.08L40.8 96H28L56.16 65.12L27.2 32H49.12L66.08 51.36L86.4 32ZM82.56 89.44H88.8L48.16 38.08H41.6L82.56 89.44Z" fill="currentColor"/>
          </svg>
        </span>
        <span className={s.socialName} style={{ color:"#1e40af",fontWeight:500,fontSize:"1rem" }}>X</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className={s.arrowSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color:"#9ca3af", width:"1.25rem", height:"1.25rem" }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

export default function MedyourCard({ card, ensureHttp }: BrandTemplateProps) {
  const [overlayHidden, setOverlayHidden] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOverlayHidden(true), 2000); return () => clearTimeout(t); }, []);

  const name = card.name || "Unnamed";
  const title = card.title || "—";
  const company = "MedYour";
  const phone1 = card.phone1 || "+20 105 600 7500";
  const phone2 = card.phone2 || "+20 105 500 7600";
  const email = card.email || "ak@medyour.com";

  const orderedSocials = [
    { label: "Instagram", href: "https://www.instagram.com/medyouregypt/", src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png", color: "#2563eb" },
    { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61576602431934", src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", color: "#1d4ed8" },
    { label: "LinkedIn",  href: "https://www.linkedin.com/company/medyouregypt/", src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png", color: "#1e40af" },
  ];

  const websiteHref = ensureHttp(card.website || "https://www.medyour.com");
  const websiteText = (card.website || "www.medyour.com").replace(/^https?:\/\//i, "");
  const description =
    card.shortDescription ||
    "Medyour is a comprehensive digital platform offering easy and fast access to reliable, high-quality healthcare. We provide smart tools and user-friendly apps for individuals and families, along with dedicated solutions for corporates to efficiently manage employee healthcare, removing traditional healthcare barriers.";

  const vcfUrl = useMemo(() => (card.vcfFilename ? `/medyour-cards/image/vcards/${card.vcfFilename}` : undefined), [card.vcfFilename]);

  // ✅ توليد وتحميل QR (PNG) من الـ client
  async function onDownloadQR() {
    try {
      const profileUrl = `${window.location.origin}/cards/${card.id}`;
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

  // ✅ Add to Contact — ملف ثابت إن وُجد وإلا vCard ديناميكي
  function onAddContactClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (vcfUrl) return;
    e.preventDefault();
    const vCard = buildVCard({
      name, company, title,
      phones: [
        ...(phone1 ? [{ value: phone1, type: "CELL" as const }] : []),
        ...(phone2 ? [{ value: phone2, type: "WORK" as const }] : []),
      ],
      email,
      website: websiteHref,
      note: description,
    });
    downloadText(`${(name || "contact").replace(/\s+/g, "_")}.vcf`, vCard);
  }

  return (
    <div className={s.root}>
      {/* Banner */}
      <div className={s.banner} aria-hidden>
        <Image className={s.bannerImg} src="/medyour-cards/image/header.jpg" alt="" fill priority sizes="(max-width: 448px) 100vw, 448px" />
        <div className={s.avatarWrap}>
          <Image className={s.avatarImg} src="/medyour-cards/image/medyour-logo.png" alt="Profile" width={128} height={128} priority />
        </div>
      </div>

      {/* Overlay */}
      {!overlayHidden && (
        <div className={s.overlay} aria-hidden>
          <Image className={s.overlayImg} src="/medyour-cards/image/landing-logo.png" alt="Landing Logo" width={192} height={192} priority />
        </div>
      )}

      {/* Main */}
      <main className={s.main}>
        <section className={s.identity}>
          <h2 className={s.name}>{name}</h2>
          <div className={s.title}>{title}</div>
          <div className={s.company}>{company}</div>
        </section>

        <div className={s.iconRow}>
          <a className={s.iconBtn} href={`tel:${phone1}`} aria-label="Call phone 1">
            <svg viewBox="0 0 32 32" className={s.iconSvg} aria-hidden>
              <rect x="8" y="4" width="16" height="24" rx="3" stroke="black" strokeWidth="2.2" fill="none" />
              <rect x="14" y="24" width="4" height="3" rx="1" fill="black" />
            </svg>
          </a>
          <a className={s.iconBtn} href={`tel:${phone2}`} aria-label="Call phone 2">
            <svg viewBox="0 0 32 32" className={s.iconSvg} aria-hidden>
              <rect x="8" y="4" width="16" height="24" rx="3" stroke="black" strokeWidth="2.2" fill="none" />
              <rect x="14" y="24" width="4" height="3" rx="1" fill="black" />
            </svg>
          </a>
          <a className={s.iconBtn} href={`mailto:${email}`} aria-label="Send email">
            <svg viewBox="0 0 24 24" className={s.iconSvg} aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="black" strokeWidth="2.2" fill="none" />
              <polyline points="3,7 12,13 21,7" stroke="black" strokeWidth="2.2" fill="none" />
            </svg>
          </a>
        </div>

        <div className={s.stack}>
          {/* Contact */}
          <section className={s.contactCard}>
            <div className={s.contactHeader}>
              <span className={s.contactIcon}><PhoneGlyph /></span>
              <span className={s.contactTitle}>Contact Me</span>
            </div>
            <hr className={s.hr} />
            <a className={s.contactLine} href={`tel:${phone1}`}><span className={s.contactLabel}>Call Us</span><br /><span className={s.contactValue}>{phone1}</span></a>
            <a className={s.contactLine} href={`tel:${phone2}`}><span className={s.contactLabel}>Call Us</span><br /><span className={s.contactValue}>{phone2}</span></a>
            <a className={s.contactLine} href={`mailto:${email}`}><span className={s.contactLabel}>Email</span><br /><span className={s.contactValue}>{email}</span></a>
          </section>

          {/* Socials */}
          <section className={s.socialSection}>
            <h3 className={s.followTitle}>Follow Us</h3>
            <div className={s.socialGrid}>
              {orderedSocials.map(soc => (
                <a key={soc.label} className={s.socialItem} href={soc.href} target="_blank" rel="noreferrer">
                  <div className={s.socialLeft}>
                    <Image src={soc.src} alt={soc.label} className={s.socialIcon} width={24} height={24} />
                    <span className={s.socialName} style={{ color: soc.color }}>{soc.label}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={s.arrowSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color:"#9ca3af", width:"1.25rem", height:"1.25rem" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
              <TwitterXSocialItem />
            </div>
          </section>

          {/* Website */}
          <section className={s.websiteCard}>
            <a className={s.websiteLink} href={websiteHref} target="_blank" rel="noreferrer">{websiteText}</a>
            <span className={s.websiteSub}>Description</span>
            <p className={s.websiteDesc}>{description}</p>
          </section>

          {/* QR Download */}
          <div className={s.qrWrap}>
            <button type="button" className={s.qrBtn} onClick={onDownloadQR}>
              <DownloadGlyph /> Download QR Code
            </button>
          </div>
        </div>
      </main>

      {/* Add to Contact */}
      <div className={s.fab}>
        <a className={s.fabBtn} href={vcfUrl ?? "#"} download={vcfUrl ? "" : undefined} onClick={onAddContactClick} aria-label="Add to Contact" title="Add to Contact">
          <span className={s.fabText}>Add to Contact</span>
          <span className={s.fabCircle}><PlusGlyph /></span>
        </a>
      </div>
    </div>
  );
}
