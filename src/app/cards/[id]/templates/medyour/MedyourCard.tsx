// app/cards/[id]/templates/medyour/MedyourCard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { BrandTemplateProps } from "../index";
import s from "@/styles/components/pages/cards/[id]/templates/medyour/MedyourCard.module.css";

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" className={s.callGlyph} aria-hidden>
      <path stroke="currentColor" strokeWidth="2" fill="none"
        d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.05 11.05 0 003.89.74 1 1 0 011 1v3.61a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.61a1 1 0 011 1c0 1.33.26 2.61.74 3.89a1 1 0 01-.21 1.11l-2.2 2.2z"/>
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" className={s.arrowSvg} aria-hidden>
      <path stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
  );
}
function DownloadGlyph() {
  return (
    <svg viewBox="0 0 24 24" className={s.downloadSvg} aria-hidden>
      <path stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12"/>
    </svg>
  );
}
function PlusGlyph() {
  return (
    <svg viewBox="0 0 24 24" className={s.plusSvg} aria-hidden>
      <line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

export default function MedyourCard({ card, socials, ensureHttp }: BrandTemplateProps) {
  const [overlayHidden, setOverlayHidden] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOverlayHidden(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const name = card.name || "Unnamed";
  const title = card.title || "—";
  const company = "MedYour";

  const phone1 = card.phone1 || "+20 105 600 7500";
  const phone2 = card.phone2 || "+20 105 500 7600";
  const email  = card.email  || "ak@medyour.com";

  const socialsWithFallback = socials.length
    ? socials
    : [
        { label: "Instagram", href: "https://www.instagram.com/medyouregypt/" },
        { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61576602431934" },
        { label: "LinkedIn",  href: "https://www.linkedin.com/company/medyouregypt/" },
        { label: "X",         href: "https://x.com/medyouregypt" },
      ];

  const websiteHref = ensureHttp(card.website || "https://www.medyour.com");
  const websiteText = (card.website || "www.medyour.com").replace(/^https?:\/\//i, "");
  const description =
    card.shortDescription ||
    "Medyour is a comprehensive digital platform offering easy and fast access to reliable, high-quality healthcare. We provide smart tools and user-friendly apps for individuals and families, along with dedicated solutions for corporates to efficiently manage employee healthcare, removing traditional healthcare barriers.";

  const vcfUrl = useMemo(() => {
    return card.vcfFilename ? `/medyour-cards/image/vcards/${card.vcfFilename}` : undefined;
  }, [card.vcfFilename]);

  const qrPng = useMemo(() => {
    return card.qrFilename ? `/medyour-cards/image/qr-codes/${card.qrFilename}` : undefined;
  }, [card.qrFilename]);

  function onDownloadQR() {
    if (!qrPng) { alert("QR code not available for this profile."); return; }
    const a = document.createElement("a");
    a.href = qrPng;
    a.download = qrPng.split("/").pop() || "qr.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className={s.root}>
      {/* Banner */}
      <div className={s.banner} aria-hidden>
        <Image
          className={s.bannerImg}
          src="/medyour-cards/image/header.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 448px) 100vw, 448px"
        />
        <div className={s.avatarWrap}>
          <Image
            className={s.avatarImg}
            src="/medyour-cards/image/medyour-logo.png"
            alt="Profile"
            width={128}
            height={128}
            priority
          />
        </div>
      </div>

      {/* Landing overlay */}
      {!overlayHidden && (
        <div className={s.overlay} aria-hidden>
          <Image
            className={s.overlayImg}
            src="/medyour-cards/image/landing-logo.png"
            alt="Landing Logo"
            width={192} height={192} priority
          />
        </div>
      )}

      {/* Main */}
      <main className={s.main}>
        {/* Identity */}
        <section className={s.identity}>
          <h2 className={s.name}>{name}</h2>
          <div className={s.title}>{title}</div>
          <div className={s.company}>{company}</div>
        </section>

        {/* Icon Row */}
        <div className={s.iconRow}>
          <a className={s.iconBtn} href={`tel:${phone1}`} aria-label="Call phone 1">
            <svg viewBox="0 0 32 32" className={s.iconSvg} aria-hidden>
              <rect x="8" y="4" width="16" height="24" rx="3" stroke="black" strokeWidth="2.2" fill="none"/>
              <rect x="14" y="24" width="4" height="3" rx="1" fill="black"/>
            </svg>
          </a>
          <a className={s.iconBtn} href={`tel:${phone2}`} aria-label="Call phone 2">
            <svg viewBox="0 0 32 32" className={s.iconSvg} aria-hidden>
              <rect x="8" y="4" width="16" height="24" rx="3" stroke="black" strokeWidth="2.2" fill="none"/>
              <rect x="14" y="24" width="4" height="3" rx="1" fill="black"/>
            </svg>
          </a>
          <a className={s.iconBtn} href={`mailto:${email}`} aria-label="Send email">
            <svg viewBox="0 0 24 24" className={s.iconSvg} aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="black" strokeWidth="2.2" fill="none"/>
              <polyline points="3,7 12,13 21,7" stroke="black" strokeWidth="2.2" fill="none"/>
            </svg>
          </a>
        </div>

        {/* Stack */}
        <div className={s.stack}>
          {/* Contact Card */}
          <section className={s.contactCard}>
            <div className={s.contactHeader}>
              <span className={s.contactIcon}><PhoneGlyph /></span>
              <span className={s.contactTitle}>Contact Me</span>
            </div>
            <hr className={s.hr} />
            <a className={s.contactLine} href={`tel:${phone1}`}>
              <span className={s.contactLabel}>Call Us</span><br /> <span className={s.contactValue}>{phone1}</span>
            </a>
            <a className={s.contactLine} href={`tel:${phone2}`}>
              <span className={s.contactLabel}>Call Us</span><br /> <span className={s.contactValue}>{phone2}</span>
            </a>
            <a className={s.contactLine} href={`mailto:${email}`}>
              <span className={s.contactLabel}>Email</span><br /> <span className={s.contactValue}>{email}</span>
            </a>
          </section>

          {/* Socials */}
          <section className={s.socialSection}>
            <h3 className={s.followTitle}>Follow Us </h3>
            <div className={s.socialGrid}>
              {socialsWithFallback.map((soc) => {
                const label = soc.label.toLowerCase();
                const socialNameClass =
                  label.includes("instagram") ? "insta" :
                  label.includes("facebook")  ? "facebook" :
                  label.includes("linkedin")  ? "linkedin" : "x";

                const InlineIcon = () => {
                  if (label.includes("instagram")) {
                    return (
                      <svg viewBox="0 0 448 512" className={s.socialIcon} aria-hidden>
                        <path d="M224 202a54 54 0 1 0 54 54 54 54 0 0 0-54-54Z M398.8 80A94.7 94.7 0 0 0 368 69.2C338.9 64 292.4 64 224 64S109.1 64 80 69.2A94.7 94.7 0 0 0 49.2 80C20.1 109.1 16 155.6 16 224s4.1 114.9 9.2 144A94.7 94.7 0 0 0 80 398.8C109.1 404 155.6 408 224 408s114.9-4.1 144-9.2A94.7 94.7 0 0 0 398.8 368C404 338.9 408 292.4 408 224s-4.1-114.9-9.2-144Z" fill="#000"/>
                      </svg>
                    );
                  }
                  if (label.includes("facebook")) {
                    return (
                      <svg viewBox="0 0 320 512" className={s.socialIcon} aria-hidden>
                        <path d="M279.14 288l14.22-92.66h-88.91V127.25c0-25.35 12.42-50.06 52.24-50.06H295V6.26S270.43 0 248.36 0C197.67 0 160 32.47 160 91.8v103.54H86.41V288H160v224h100.2V288z" fill="#1877F2"/>
                      </svg>
                    );
                  }
                  if (label.includes("linkedin")) {
                    return (
                      <svg viewBox="0 0 448 512" className={s.socialIcon} aria-hidden>
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.4 0 53.7A53.79 53.79 0 0 1 107.58 53.7c0 29.7-24.09 54.4-53.79 54.4zM447.9 448h-92.68V302.4c0-34.7-.7-79.3-48.29-79.3-48.29 0-55.7 37.7-55.7 76.6V448H158.5V148.9h88.94v40.8h1.3c12.4-23.5 42.6-48.3 87.7-48.3 93.8 0 111.1 61.8 111.1 142.3z" fill="#0A66C2"/>
                      </svg>
                    );
                  }
                  return (
                    <svg viewBox="0 0 120 120" className={s.socialIcon} aria-hidden>
                      <rect width="120" height="120" rx="24" fill="white"/>
                      <path d="M86.4 32H99.2L72.8 61.12L103.2 96H81.6L62.56 74.08L40.8 96H28L56.16 65.12L27.2 32H49.12L66.08 51.36L86.4 32ZM82.56 89.44H88.8L48.16 38.08H41.6L82.56 89.44Z" fill="black"/>
                    </svg>
                  );
                };

                return (
                  <a key={soc.label} className={s.socialItem} href={soc.href} target="_blank" rel="noreferrer">
                    <div className={s.socialLeft}>
                      <InlineIcon />
                      <span className={`${s.socialName} ${socialNameClass}`}>{soc.label}</span>
                    </div>
                    <ArrowRight />
                  </a>
                );
              })}
            </div>
          </section>

          {/* Website Card */}
          <section className={s.websiteCard}>
            <a className={s.websiteLink} href={websiteHref} target="_blank" rel="noreferrer">
              {websiteText}
            </a>
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

      {/* Floating Add-to-Contact */}
      {vcfUrl && (
        <div className={s.fab}>
          <a className={s.fabBtn} href={vcfUrl} download>
            <span className={s.fabText}>Add to Contact</span>
            <span className={s.fabCircle}><PlusGlyph /></span>
          </a>
        </div>
      )}
    </div>
  );
}
