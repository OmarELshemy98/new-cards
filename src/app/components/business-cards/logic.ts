"use client";

/**
 * logic.ts
 * - Types + Table structure + Helpers + Unified hook
 * - يحوّل قيم الفورم قبل الحفظ لتفادي أخطاء التايب (خصوصًا template="")
 */

import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Card } from "@/services/business-cards";
import { createCard, updateCard, deleteCard } from "@/services/business-cards";

/* ========== Types ========== */
export type TemplateType = "medyour" | "axiom" | "arcon" | "custom template";

export type FormValues = {
  name: string;
  title: string;
  email: string;
  website: string;
  template: TemplateType | "";
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  shortDescription: string;
  customerId: string;
};

/* ========== Table structure (Config) ========== */
export const TABLE_COLUMNS = [
  { key: "name",     label: "Name",     widthClass: "w-[22%]" },
  { key: "title",    label: "Title",    widthClass: "w-[18%]" },
  { key: "email",    label: "Email",    widthClass: "w-[18%]" },
  { key: "company",  label: "Company",  widthClass: "w-[18%]" },
  { key: "template", label: "Template", widthClass: "w-[12%]" },
  { key: "actions",  label: "Actions",  widthClass: "w-[12%]" },
] as const;

/* ========== Helpers ========== */
export function companyOptions(cards: Card[]) {
  const set = new Set<string>();
  cards.forEach((c) => c.customerId && set.add(c.customerId));
  return Array.from(set);
}

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

/** ✅ يحوّل قيم الفورم إلى بايلود Firestore مضبوط الأنواع */
function toPayload(values: FormValues): Partial<Omit<Card, "id" | "ownerId">> {
  return {
    name: values.name || undefined,
    title: values.title || undefined,
    email: values.email || undefined,
    website: values.website || undefined,
    template: values.template || undefined, // يتشال الـ "" لو موجود
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

/* ========== Unified hook (state + handlers) ========== */
type UseArgs = {
  cards: Card[];
  setCards: Dispatch<SetStateAction<Card[]>>;
  userId: string;
};

export function useBusinessCards({ cards, setCards, userId }: UseArgs) {
  // Filters
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "view" | "edit">("add");
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  // Derived
  const companies = useMemo(() => companyOptions(cards), [cards]);
  const filtered = useMemo(
    () => filterCards(cards, search, companyFilter),
    [cards, search, companyFilter]
  );

  // Actions
  const openAdd = () => { setModalMode("add"); setActiveCard(null); setModalOpen(true); };
  const openView = (card: Card) => { setModalMode("view"); setActiveCard(card); setModalOpen(true); };
  const openEdit = (card: Card) => { setModalMode("edit"); setActiveCard(card); setModalOpen(true); };

  const onDelete = async (card: Card) => {
    if (!confirm("Delete this card?")) return;
    await deleteCard(card.id);
    setCards((prev) => prev.filter((x) => x.id !== card.id));
  };

  const onSave = async (values: FormValues) => {
    const payload = toPayload(values);

    if (modalMode === "add") {
      // ownerId مضافة هنا فقط — الباقي payload نظيف
      const created = await createCard({ ...(payload as Omit<Card, "id">), ownerId: userId });
      setCards((prev) => [created, ...prev]);
    } else if (modalMode === "edit" && activeCard) {
      await updateCard(activeCard.id, payload);
      setCards((prev) =>
        prev.map((x) => (x.id === activeCard.id ? ({ ...x, ...payload } as Card) : x))
      );
    }

    setModalOpen(false);
  };

  return {
    // filters
    search, setSearch,
    companyFilter, setCompanyFilter,
    companies, filtered,

    // modal
    modalOpen, setModalOpen,
    modalMode,
    activeCard,

    // actions
    openAdd, openView, openEdit,
    onDelete, onSave,
  };
}
