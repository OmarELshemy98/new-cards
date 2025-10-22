// app/components/business-cards/BusinessCardsTable.tsx
/**
 * ✅ Table + Filters + Modal + Form(RHF) في ملف واحد
 * - CRUD: create/update/delete
 * - الفورم والمودال داخل الملف (حسب طلبك)
 * - بقية المنطق المتكرر في helpers/types لتقليل الطول
 */

"use client";

import React, { useMemo, useState, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type { Card } from "@/services/business-cards";
import { createCard, updateCard, deleteCard } from "@/services/business-cards";
import { companyOptions, filterCards, toPayload } from "./helpers";
import type { FormValues, TemplateType } from "./types";

/* ========== Props ========== */
type Props = {
  cards: Card[];
  setCards: Dispatch<SetStateAction<Card[]>>;
  userId: string;
};

/* ========== Component ========== */
export default function BusinessCardsTable({ cards, setCards, userId }: Props) {
  // بحث + فلتر
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  // مودال
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "view" | "edit">("add");
  const [active, setActive] = useState<Card | null>(null);

  // RHF
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      defaultValues: {
        name: "", title: "", email: "", website: "", template: "",
        linkedin: "", twitter: "", facebook: "", instagram: "",
        youtube: "", tiktok: "", shortDescription: "", customerId: "",
      },
      mode: "onBlur",
    });

  // بيانات مشتقة
  const companies = useMemo(() => companyOptions(cards), [cards]);
  const shown = useMemo(() => filterCards(cards, search, companyFilter), [cards, search, companyFilter]);

  // فتح المودال بحالاته
  function openAdd() {
    setMode("add"); setActive(null);
    reset({
      name: "", title: "", email: "", website: "", template: "",
      linkedin: "", twitter: "", facebook: "", instagram: "",
      youtube: "", tiktok: "", shortDescription: "", customerId: "",
    });
    setModalOpen(true);
  }
  function openView(c: Card) {
    setMode("view"); setActive(c); reset(fillForm(c)); setModalOpen(true);
  }
  function openEdit(c: Card) {
    setMode("edit"); setActive(c); reset(fillForm(c)); setModalOpen(true);
  }

  // حذف
  async function onDelete(c: Card) {
    if (!confirm("Delete this card?")) return;
    await deleteCard(c.id);
    setCards(prev => prev.filter(x => x.id !== c.id));
  }

  // حفظ/تعديل
  const onSubmit = handleSubmit(async (values: FormValues) => {
    const payload = toPayload(values);
    if (mode === "add") {
      const created = await createCard({ ...payload, ownerId: userId } as Omit<Card, "id">);
      setCards(prev => [created, ...prev]);
    } else if (mode === "edit" && active) {
      await updateCard(active.id, payload);
      setCards(prev => prev.map(x => (x.id === active.id ? ({ ...x, ...payload } as Card) : x)));
    }
    setModalOpen(false);
  });

  return (
    <div className="mt-2">
      {/* Header */}
      <Header count={shown.length} onAdd={openAdd} />

      {/* Filters */}
      <Filters
        search={search}
        setSearch={setSearch}
        company={companyFilter}
        setCompany={setCompanyFilter}
        companies={companies}
      />

      {/* Table */}
      {shown.length === 0 ? (
        <p className="text-gray-400 mt-6">No data.</p>
      ) : (
        <Table
          rows={shown}
          onRowClick={openView}
          onEdit={openEdit}
          onDelete={onDelete}
        />
      )}

      {/* Modal + Form (جوا نفس الملف) */}
      {modalOpen && (
        <Modal title={mode === "add" ? "Add Card" : mode === "edit" ? "Edit Card" : "View Card"} onClose={() => setModalOpen(false)}>
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3" autoComplete="off">
            {fields.map(f => (
              <Input
                key={f.name}
                label={f.label}
                type={f.type ?? "text"}
                required={!!f.required}
                readOnly={mode === "view"}
                error={errors[f.name as keyof FormValues]?.message as string | undefined}
                inputProps={{
                  ...register(f.name as keyof FormValues, f.rules),
                }}
              />
            ))}

            {/* Template select */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/70">
                Template<span className="text-red-400"> *</span>
              </label>
              <select
                disabled={mode === "view"}
                className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400 disabled:opacity-60"
                {...register("template", {
                  validate: (v: FormValues["template"]) => v ? true : "Template is required",
                })}
              >
                <option value="">Select template</option>
                <option value="medyour">medyour</option>
                <option value="axiom">axiom</option>
                <option value="arcon">arcon</option>
                <option value="custom template">custom template</option>
              </select>
              {errors.template?.message && (
                <span className="text-red-300 text-xs mt-0.5">{errors.template.message}</span>
              )}
            </div>

            {/* Textarea */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-xs text-white/70">Short description</label>
              <textarea
                readOnly={mode === "view"}
                className="min-h-[90px] rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400 disabled:opacity-60"
                {...register("shortDescription")}
              />
            </div>

            {/* Actions */}
            <div className="sm:col-span-2 mt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
                Cancel
              </button>
              {mode !== "view" && (
                <button type="submit" disabled={isSubmitting} className="rounded-lg border border-cyan-400/30 bg-cyan-400/20 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/30 disabled:opacity-60">
                  {isSubmitting ? "Saving..." : mode === "add" ? "Add card" : "Save changes"}
                </button>
              )}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ========== Small helpers inside same file ========== */

// تعريف حقول الإدخال في Array بدل تكرار JSX
const fields: {
  name: keyof FormValues;
  label: string;
  type?: string;
  required?: boolean;
  rules?: Record<string, unknown>;
}[] = [
  { name: "name", label: "Name", required: true, rules: { required: "Name is required" } },
  { name: "title", label: "Job title", required: true, rules: { required: "Job title is required" } },
  { name: "email", label: "Email", type: "email", required: true, rules: {
      required: "Email is required",
      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
    } },
  { name: "website", label: "Website", required: true, rules: { required: "Website is required" } },
  { name: "customerId", label: "Company (customerId)" },
  { name: "linkedin", label: "LinkedIn" },
  { name: "twitter", label: "Twitter" },
  { name: "facebook", label: "Facebook" },
  { name: "instagram", label: "Instagram" },
  { name: "youtube", label: "YouTube" },
  { name: "tiktok", label: "TikTok" },
];

/** تعبئة قيم RHF من كارت */
function fillForm(c: Card): FormValues {
  return {
    name: c.name || "",
    title: c.title || "",
    email: c.email || "",
    website: c.website || "",
    template: (c.template ?? "") as TemplateType | "",
    linkedin: c.linkedin || "",
    twitter: c.twitter || "",
    facebook: c.facebook || "",
    instagram: c.instagram || "",
    youtube: c.youtube || "",
    tiktok: c.tiktok || "",
    shortDescription: c.shortDescription || "",
    customerId: c.customerId || "",
  };
}

/* ========== Tiny UI components (نفس الملف) ========== */

function Header({ count, onAdd }: { count: number; onAdd: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Business Cards</h1>
        <p className="text-sm text-white/60">{count} item{count !== 1 ? "s" : ""}</p>
      </div>
      <button onClick={onAdd} className="rounded-lg border border-cyan-400/30 bg-cyan-400/20 px-3 py-2 text-sm hover:bg-cyan-400/30 transition">
        Add card
      </button>
    </div>
  );
}

function Filters({
  search, setSearch, company, setCompany, companies,
}: {
  search: string; setSearch: (v: string) => void;
  company: string; setCompany: (v: string) => void;
  companies: string[];
}) {
  return (
    <div className="mt-3 flex flex-col sm:flex-row gap-3">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, title, email, ..."
        className="w-full sm:w-[60%] rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400"
      />
      <select
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full sm:w-[40%] rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400"
      >
        <option value="">All companies</option>
        {companies.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}

function Table({
  rows, onRowClick, onEdit, onDelete,
}: {
  rows: Card[];
  onRowClick: (c: Card) => void;
  onEdit: (c: Card) => void;
  onDelete: (c: Card) => Promise<void>;
}) {
  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="hidden md:flex items-center px-4 py-3 bg-white/10 text-xs uppercase tracking-wide text-white/80">
        <div className="w-[22%]">Name</div>
        <div className="w-[18%]">Title</div>
        <div className="w-[18%]">Email</div>
        <div className="w-[18%]">Company</div>
        <div className="w-[12%]">Template</div>
        <div className="w-[12%] text-right">Actions</div>
      </div>
      <ul className="divide-y divide-white/10">
        {rows.map((c) => (
          <li key={c.id} className="px-4 py-3 hover:bg-white/5 transition cursor-pointer" onClick={() => onRowClick(c)}>
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0">
              <Cell label="Name" className="md:w-[22%]"><span className="font-medium">{c.name || "—"}</span></Cell>
              <Cell label="Title" className="md:w-[18%]"><span className="text-white/90">{c.title || "—"}</span></Cell>
              <Cell label="Email" className="md:w-[18%]"><span className="text-white/70 break-all">{c.email || "—"}</span></Cell>
              <Cell label="Company" className="md:w-[18%]"><span className="text-white/80">{c.customerId || "—"}</span></Cell>
              <Cell label="Template" className="md:w-[12%]"><span className="text-white/70">{c.template || "—"}</span></Cell>
              <div className="md:w-[12%] flex md:justify-end gap-2">
                <button onClick={(e) => { e.stopPropagation(); onEdit(c); }} className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15">Edit</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(c); }} className="rounded-lg border border-red-400/30 text-red-200 bg-red-500/10 px-2 py-1 text-xs hover:bg-red-500/20">Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Cell({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string; }) {
  return (
    <div className={`flex md:items-center md:justify-start ${className}`}>
      <span className="md:hidden min-w-[90px] text-xs uppercase tracking-wide text-white/50">{label}</span>
      <div className="md:ml-0 md:w-full">{children}</div>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode; }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-[92vw] max-w-2xl rounded-2xl bg-slate-900 border border-white/15 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white" aria-label="Close modal">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({
  label, type = "text", required = false, readOnly = false, error, inputProps,
}: {
  label: string; type?: string; required?: boolean; readOnly?: boolean; error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-white/70">
        {label}{required && <span className="text-red-400"> *</span>}
      </label>
      <input
        type={type}
        readOnly={readOnly}
        className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400 disabled:opacity-60"
        {...inputProps}
      />
      {error && <span className="text-red-300 text-xs mt-0.5">{error}</span>}
    </div>
  );
}
