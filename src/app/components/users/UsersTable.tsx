"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { AppUser } from "@/services/users";
import { deleteUser } from "@/services/users";
import s from "@/styles/components/users/UsersTable.module.css";

type Props = { users: AppUser[]; setUsers: React.Dispatch<React.SetStateAction<AppUser[]>> };

export default function UsersTable({ users, setUsers }: Props) {
  const { user: me } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onDelete(u: AppUser) {
    if (me?.uid === u.id) {
      alert("You can't delete your own account.");
      return;
    }

    if (!confirm(`Are you sure you want to delete user: ${u.email || u.id}?`)) return;
    try {
      setDeletingId(u.id);
      await deleteUser(u.id);
      setUsers(prev => prev.filter(x => x.id !== u.id));
    } catch (err) {
      alert((err as Error)?.message ?? "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  }

  if (!users.length) return <p className={s.empty}>No users found.</p>;

  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead className={s.thead}>
          <tr>
            <th className={s.th}>Email</th>
            <th className={s.th}>Name</th>
            <th className={s.th}>Role</th>
            <th className={s.th}>Created</th>
            <th className={s.th}>UID</th>
            <th className={s.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => {
            const isSelf = me?.uid === u.id;
            const disabled = deletingId === u.id || isSelf;

            return (
              <tr key={u.id} className={s.row}>
                <td className={s.td}><div style={{ wordBreak: "break-all" }}>{u.email || "—"}</div></td>
                <td className={s.td}><div>{u.name || "—"}</div></td>
                <td className={s.td}><div>{u.role || "—"}</div></td>
                <td className={s.td}><div>{u.createdAt ? u.createdAt.toLocaleString() : "—"}</div></td>
                <td className={s.td}><div style={{ wordBreak: "break-all" }}>{u.id}</div></td>
                <td className={s.td}>
                  <button
                    className={s.btnDanger}
                    onClick={() => onDelete(u)}
                    disabled={disabled}
                    title={isSelf ? "You cannot delete your own account" : "Delete user"}
                    aria-disabled={disabled}
                  >
                    {deletingId === u.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
