// app/components/business-cards/helpers.ts
import type { Card } from "@/services/business-cards";
import type { FormValues } from "./types";

/** تحويل قيم الفورم لبايلود Firestore */
export function toPayload(values: FormValues): Partial<Omit<Card, "id" | "ownerId">> {
  return {
    name: values.name,
    title: values.title,
    email: values.email,
    website: values.website,
    template: values.template || undefined,
    linkedin: values.linkedin || undefined,
    twitter: values.twitter || undefined,
    facebook: values.facebook || undefined,
    instagram: values.instagram || undefined,
    youtube: values.youtube || undefined,
    tiktok: values.tiktok || undefined,
    shortDescription: values.shortDescription || undefined,
    customerId: values.customerId || undefined,
  };
}

/** استخراج الشركات المتاحة للفلترة */
export function companyOptions(cards: Card[]) {
  const set = new Set<string>();
  cards.forEach(c => c.customerId && set.add(c.customerId));
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
          .map((v: unknown) => String(v ?? "").toLowerCase())
          .some((v) => v.includes(q))
      : true;
    const matchesCompany = company ? c.customerId === company : true;
    return matchesTerm && matchesCompany;
  });
}
