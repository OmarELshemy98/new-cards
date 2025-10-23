"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Card } from "@/services/business-cards";
import type { FormValues, TemplateType } from "./types";
import s from "./BusinessCardModal.module.css";

type Props = {
  open: boolean;
  mode: "add" | "view" | "edit";
  card: Card | null;
  onClose: () => void;
  onSave: (values: FormValues) => Promise<void> | void;
};

export default function BusinessCardModal({ open, mode, card, onClose, onSave }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      name: "", title: "", email: "", website: "", template: "",
      linkedin: "", twitter: "", facebook: "", instagram: "",
      youtube: "", tiktok: "", shortDescription: "", customerId: "",
    },
    mode: "onBlur",
  });

  const urlRule = {
    pattern: {
      value: /^(https?:\/\/)?([^\s.]+\.[^\s]{2,})(\/\S*)?$/i,
      message: "Invalid URL",
    },
  };

  useEffect(() => {
    if (!open) return;
    if (card) {
      reset({
        name: card.name || "",
        title: card.title || "",
        email: card.email || "",
        website: card.website || "",
        template: (card.template ?? "") as TemplateType | "",
        linkedin: card.linkedin || "",
        twitter: card.twitter || "",
        facebook: card.facebook || "",
        instagram: card.instagram || "",
        youtube: card.youtube || "",
        tiktok: card.tiktok || "",
        shortDescription: card.shortDescription || "",
        customerId: card.customerId || "",
      });
    } else {
      reset();
    }
  }, [open, card, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="bc-modal-title" className={s.overlay}>
      <div className={s.backdrop} onClick={onClose} />
      <div className={s.modal}>
        <div className={s.header}>
          <h2 id="bc-modal-title" className={s.title}>
            {mode === "add" ? "Add Card" : mode === "edit" ? "Edit Card" : "View Card"}
          </h2>
          <button type="button" className={s.close} onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit((values) => onSave(values))} className={s.form} autoComplete="off">
          <Field label="Name" required readOnly={mode === "view"} error={errors.name?.message}>
            <input className={s.input} readOnly={mode === "view"} {...register("name", { required: "Name is required" })} />
          </Field>
          <Field label="Job title" required readOnly={mode === "view"} error={errors.title?.message}>
            <input className={s.input} readOnly={mode === "view"} {...register("title", { required: "Job title is required" })} />
          </Field>
          <Field label="Email" required readOnly={mode === "view"} error={errors.email?.message}>
            <input type="email" className={s.input} readOnly={mode === "view"} {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            })} />
          </Field>
          <Field label="Website" required readOnly={mode === "view"} error={errors.website?.message}>
            <input className={s.input} readOnly={mode === "view"} {...register("website", { required: "Website is required", ...urlRule })} />
          </Field>

          <div>
            <label className={s.label} htmlFor="template">Template<span aria-hidden style={{color:"#fda4af"}}> *</span></label>
            <select id="template" className={s.select} disabled={mode === "view"}
              {...register("template", { validate: (v) => (v ? true : "Template is required") })}
            >
              <option value="">Select template</option>
              <option value="medyour">medyour</option>
              <option value="axiom">axiom</option>
              <option value="arcon">arcon</option>
              <option value="custom template">custom template</option>
            </select>
            {errors.template?.message && <div className={s.error}>{errors.template.message}</div>}
          </div>

          <Field label="Company (customerId)" readOnly={mode === "view"}>
            <input className={s.input} readOnly={mode === "view"} {...register("customerId")} />
          </Field>
          <Field label="LinkedIn" readOnly={mode === "view"}>
            <input className={s.input} readOnly={mode === "view"} {...register("linkedin", urlRule)} />
          </Field>
          <Field label="Twitter" readOnly={mode === "view"}>
            <input className={s.input} readOnly={mode === "view"} {...register("twitter", urlRule)} />
          </Field>
          <Field label="Facebook" readOnly={mode === "view"}>
            <input className={s.input} readOnly={mode === "view"} {...register("facebook", urlRule)} />
          </Field>
          <Field label="Instagram" readOnly={mode === "view"}>
            <input className={s.input} readOnly={mode === "view"} {...register("instagram", urlRule)} />
          </Field>
          <Field label="YouTube" readOnly={mode === "view"}>
            <input className={s.input} readOnly={mode === "view"} {...register("youtube", urlRule)} />
          </Field>
          <Field label="TikTok" readOnly={mode === "view"}>
            <input className={s.input} readOnly={mode === "view"} {...register("tiktok", urlRule)} />
          </Field>

          <div style={{gridColumn: "1 / -1"}}>
            <label className={s.label} htmlFor="shortDescription">Short description</label>
            <textarea id="shortDescription" className={s.textarea} readOnly={mode === "view"} {...register("shortDescription")} />
          </div>

          <div className={s.actions}>
            <button type="button" className={s.btn} onClick={onClose}>Cancel</button>
            {mode !== "view" && (
              <button type="submit" className={s.btnPrimary} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : mode === "add" ? "Add card" : "Save changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label, required=false, readOnly=false, error, children,
}: { label: string; required?: boolean; readOnly?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={s.label}>{label}{required && <span aria-hidden style={{color:"#fda4af"}}> *</span>}</label>
      {children}
      {error && <div className={s.error}>{error}</div>}
    </div>
  );
}
