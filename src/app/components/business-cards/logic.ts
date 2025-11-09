"use client";

import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Card } from "@/services/business-cards";
import { createCard, updateCard, deleteCard } from "@/services/business-cards";
import { companyOptions, filterCards, toPayload } from "./helpers";
import type { FormValues } from "./types";

/* ... باقي الملف كما هو ... */


export const TABLE_COLUMNS = [
  { key: "name",     label: "Name",     widthClass: "w-[22%]" },
  { key: "title",    label: "Title",    widthClass: "w-[18%]" },
  { key: "email",    label: "Email",    widthClass: "w-[18%]" },
  { key: "company",  label: "Company",  widthClass: "w-[18%]" },
  { key: "customerId", label: "customerId", widthClass: "w-[12%]" },
  { key: "actions",  label: "Actions",  widthClass: "w-[12%]" },
] as const;

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
  const openAdd  = () => { setModalMode("add");  setActiveCard(null);  setModalOpen(true); };
  const openView = (card: Card) => { setModalMode("view"); setActiveCard(card); setModalOpen(true); };
  const openEdit = (card: Card) => { setModalMode("edit"); setActiveCard(card); setModalOpen(true); };

  const onDelete = async (card: Card) => {
    if (!confirm("Delete this card?")) return;
    await deleteCard(card.id);
    setCards(prev => prev.filter(x => x.id !== card.id));
  };

  const onSave = async (values: FormValues) => {
    const payload = toPayload(values);

    if (modalMode === "add") {
      const created = await createCard({ ...(payload as Omit<Card, "id">), ownerId: userId });
      setCards(prev => [created, ...prev]);
    } else if (modalMode === "edit" && activeCard) {
      await updateCard(activeCard.id, payload);
      setCards(prev => prev.map(x => (x.id === activeCard.id ? ({ ...x, ...payload } as Card) : x)));
    }

    setModalOpen(false);
  };

  return {
    // filters
    search, setSearch,
    companyFilter, setCompanyFilter,
    companies, filtered,
    // modal
    modalOpen, setModalOpen, modalMode, activeCard,
    // actions
    openAdd, openView, openEdit, onDelete, onSave,
  };
}
