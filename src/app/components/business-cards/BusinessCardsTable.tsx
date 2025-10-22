"use client";

/**
 * BusinessCardsTable
 * - جدول فقط + استهلاك الهوك والكونفيج من logic.ts
 * - المودال منفصل في ملفه
 */

import React from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Card } from "@/services/business-cards";
import BusinessCardModal from "./BusinessCardModal";
import { TABLE_COLUMNS, useBusinessCards } from "./logic";

type Props = {
  cards: Card[];
  setCards: Dispatch<SetStateAction<Card[]>>;
  userId: string;
};

export default function BusinessCardsTable({ cards, setCards, userId }: Props) {
  const {
    // filters
    search, setSearch, companyFilter, setCompanyFilter, companies, filtered,
    // modal
    modalOpen, modalMode, activeCard, setModalOpen,
    // actions
    openAdd, openView, openEdit, onDelete, onSave,
  } = useBusinessCards({ cards, setCards, userId });

  return (
    <div className="mt-2">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Business Cards</h1>
        <button
          onClick={openAdd}
          className="rounded-lg border border-cyan-400/30 bg-cyan-400/20 px-3 py-2 text-sm hover:bg-cyan-400/30 transition"
        >
          Add card
        </button>
      </div>

      {/* Filters */}
      <div className="mt-3 flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, title, email, ..."
          className="w-full sm:w-[60%] rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400"
        />
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="w-full sm:w-[40%] rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400"
        >
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 mt-6">No data.</p>
      ) : (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="hidden md:table-header-group bg-white/10 text-xs uppercase tracking-wide text-white/80">
              <tr>
                {TABLE_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 font-medium text-left ${col.widthClass} ${col.key === "actions" ? "text-right" : ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-white/5 cursor-pointer"
                  onClick={() => openView(c)}
                >
                  <td className="px-4 py-3">
                    <span className="md:hidden text-xs uppercase text-white/50">Name</span>
                    <div className="font-medium">{c.name || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="md:hidden text-xs uppercase text-white/50">Title</span>
                    <div className="text-white/90">{c.title || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="md:hidden text-xs uppercase text-white/50">Email</span>
                    <div className="text-white/70 break-all">{c.email || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="md:hidden text-xs uppercase text-white/50">Company</span>
                    <div className="text-white/80">{c.customerId || "—"}</div>
                  </td>
                  <td className="px-4 py-3 text-white/70">{c.template || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex md:justify-end gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                        className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(c); }}
                        className="rounded-lg border border-red-400/30 text-red-200 bg-red-500/10 px-2 py-1 text-xs hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <BusinessCardModal
        open={modalOpen}
        mode={modalMode}
        card={activeCard}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
      />
    </div>
  );
}
