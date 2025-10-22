"use client";

/**
 * BusinessCardModal
 * - مودال منفصل (الفورم بـ React Hook Form)
 * - يستقبل open/mode/card/onClose/onSave
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Card } from "@/services/business-cards";
import type { FormValues, TemplateType } from "./logic";

type Props = {
  open: boolean;
  mode: "add" | "view" | "edit";
  card: Card | null;
  onClose: () => void;
  onSave: (values: FormValues) => Promise<void> | void;
};

export default function BusinessCardModal({ open, mode, card, onClose, onSave }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "", title: "", email: "", website: "", template: "",
      linkedin: "", twitter: "", facebook: "", instagram: "",
      youtube: "", tiktok: "", shortDescription: "", customerId: "",
    },
    mode: "onBlur",
  });

  // Fill on open/card change
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

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="bc-modal-title" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-[92vw] max-w-2xl rounded-2xl bg-slate-900 border border-white/15 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 id="bc-modal-title" className="text-lg font-semibold">
            {mode === "add" ? "Add Card" : mode === "edit" ? "Edit Card" : "View Card"}
          </h2>
          <button type="button" onClick={onClose} className="text-white/70 hover:text-white" aria-label="Close modal">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit((values) => onSave(values))} className="grid grid-cols-1 sm:grid-cols-2 gap-3" autoComplete="off">
          <Input label="Name" required readOnly={mode === "view"} error={errors.name?.message} inputProps={{ ...register("name", { required: "Name is required" }) }} />
          <Input label="Job title" required readOnly={mode === "view"} error={errors.title?.message} inputProps={{ ...register("title", { required: "Job title is required" }) }} />
          <Input label="Email" type="email" required readOnly={mode === "view"} error={errors.email?.message} inputProps={{
            ...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } }),
          }} />
          <Input label="Website" required readOnly={mode === "view"} error={errors.website?.message} inputProps={{ ...register("website", { required: "Website is required" }) }} />

          {/* Template */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/70" htmlFor="template">Template<span className="text-red-400"> *</span></label>
            <select
              id="template"
              disabled={mode === "view"}
              className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400 disabled:opacity-60"
              {...register("template", { validate: (v) => (v ? true : "Template is required") })}
            >
              <option value="">Select template</option>
              <option value="medyour">medyour</option>
              <option value="axiom">axiom</option>
              <option value="arcon">arcon</option>
              <option value="custom template">custom template</option>
            </select>
            {errors.template?.message && <span className="text-red-300 text-xs mt-0.5">{errors.template.message}</span>}
          </div>

          <Input label="Company (customerId)" readOnly={mode === "view"} inputProps={{ ...register("customerId") }} />
          <Input label="LinkedIn" readOnly={mode === "view"} inputProps={{ ...register("linkedin") }} />
          <Input label="Twitter" readOnly={mode === "view"} inputProps={{ ...register("twitter") }} />
          <Input label="Facebook" readOnly={mode === "view"} inputProps={{ ...register("facebook") }} />
          <Input label="Instagram" readOnly={mode === "view"} inputProps={{ ...register("instagram") }} />
          <Input label="YouTube" readOnly={mode === "view"} inputProps={{ ...register("youtube") }} />
          <Input label="TikTok" readOnly={mode === "view"} inputProps={{ ...register("tiktok") }} />

          {/* Description */}
          <div className="sm:col-span-2 flex flex-col gap-1">
            <label className="text-xs text-white/70" htmlFor="shortDescription">Short description</label>
            <textarea
              id="shortDescription"
              readOnly={mode === "view"}
              className="min-h-[90px] rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400 disabled:opacity-60"
              {...register("shortDescription")}
            />
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 mt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">Cancel</button>
            {mode !== "view" && (
              <button type="submit" disabled={isSubmitting} className="rounded-lg border border-cyan-400/30 bg-cyan-400/20 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/30 disabled:opacity-60">
                {isSubmitting ? "Saving..." : mode === "add" ? "Add card" : "Save changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

/* Small input */
function Input({
  label, type = "text", required = false, readOnly = false, error, inputProps,
}: {
  label: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-white/70">{label}{required && <span className="text-red-400"> *</span>}</label>
      <input type={type} readOnly={readOnly} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400 disabled:opacity-60" {...inputProps} />
      {error && <span className="text-red-300 text-xs mt-0.5">{error}</span>}
    </div>
  );
}
