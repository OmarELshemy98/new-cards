// app/components/business-cards/helpers.ts
import type { Card } from "@/services/business-cards";
import type { FormValues } from "./types";

/** شيل undefined والسلاسل الفاضية قبل الإرسال لـ Firestore — بدون any */
function clean<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out = {} as Partial<T>;

  // ندي Object.entries typing مضبوط بدل ما يرجّع ([string, any][])
  for (const [k, v] of Object.entries(obj) as [keyof T, T[keyof T]][]) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;

    // رجّع string مُهذّب لو كانت القيمة string
    out[k] = (typeof v === "string" ? (v.trim() as unknown as T[keyof T]) : v) as T[keyof T];
  }
  return out;
}

/** تحويل قيم الفورم لبايلود Firestore بدون undefined */
export function toPayload(values: FormValues): Partial<Omit<Card, "id" | "ownerId">> {
  return clean({
    name: values.name,
    title: values.title,
    email: values.email,
    website: values.website,
    // template مطلوب، بس لو فاضي ما نبعتوش (RHF يمنع السابميت أصلاً)
    template: values.template || undefined,

    linkedin: values.linkedin,
    twitter: values.twitter,
    facebook: values.facebook,
    instagram: values.instagram,
    youtube: values.youtube,
    tiktok: values.tiktok,

    shortDescription: values.shortDescription,
    customerId: values.customerId,
  });
}

/** استخراج الشركات المتاحة للفلترة */
export function companyOptions(cards: Card[]) {
  const set = new Set<string>();
  cards.forEach((c) => c.customerId && set.add(c.customerId));
  return Array.from(set);
}

/** تطبيق البحث + الفلترة */
export function filterCards(cards: Card[], term: string, company: string) {
  const q = term.trim().toLowerCase();
  return cards.filter((c) => {
    const matchesTerm = q
      ? [
          c.name, c.title, c.email, c.website, c.template,
          c.linkedin, c.twitter, c.facebook, c.instagram,
          c.youtube, c.tiktok, c.shortDescription,
        ]
          .map((v) => String(v ?? "").toLowerCase())
          .some((v) => v.includes(q))
      : true;

    const matchesCompany = company ? c.customerId === company : true;
    return matchesTerm && matchesCompany;
  });
}
