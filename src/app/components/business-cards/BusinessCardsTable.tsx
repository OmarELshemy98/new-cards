"use client";

import React from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Card } from "@/services/business-cards";
import BusinessCardModal from "./BusinessCardModal";
import { TABLE_COLUMNS, useBusinessCards } from "./logic";
import s from "@/styles/components/business-cards/BusinessCardsTable.module.css";

type Props = {
  cards: Card[];
  setCards: Dispatch<SetStateAction<Card[]>>;
  userId: string;
};

export default function BusinessCardsTable({ cards, setCards, userId }: Props) {
  const {
    search, setSearch, companyFilter, setCompanyFilter, companies, filtered,
    modalOpen, modalMode, activeCard, setModalOpen,
    openAdd, openView, openEdit, onDelete, onSave,
  } = useBusinessCards({ cards, setCards, userId });

  return (
    <div>
      <div className={s.header}>
        <h1 className={s.title}>Business Cards</h1>
        <button className={s.addBtn} onClick={openAdd}>Add card</button>
      </div>

      <div className={s.filters}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, title, email, ..."
          className={s.input}
        />
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className={s.select}
        >
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className={s.empty}>No data.</p>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>
                {TABLE_COLUMNS.map(col => (
                  <th
                    key={col.key}
                    className={`${s.th} ${col.key === "actions" ? s.thActions : ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className={s.row}
                  role="button"
                  tabIndex={0}
                  onClick={() => openView(c)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openView(c)}
                >
                  <td className={s.td}><div>{c.name || "—"}</div></td>
                  <td className={s.td}><div>{c.title || "—"}</div></td>
                  <td className={s.td}><div style={{ wordBreak: "break-all" }}>{c.email || "—"}</div></td>
                  <td className={s.td}><div>{c.customerId || "—"}</div></td>
                  <td className={s.td}><div style={{ wordBreak: "break-all" }}>{c.id}</div></td>
                  <td className={`${s.td} ${s.tdActions}`}>
                    <div className={s.actions}>
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                        className={s.btn}
                        aria-label={`Edit ${c.name ?? "card"}`}
                      >Edit</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(c); }}
                        className={s.btnDanger}
                        aria-label={`Delete ${c.name ?? "card"}`}
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
