// app/components/business-cards/BusinessCardModal.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { Card } from "@/src/services/business-cards";
import type { FormValues, TemplateType } from "./types";
import s from "@/styles/components/business-cards/BusinessCardModal.module.css";

type Props = {
  open: boolean;
  mode: "add" | "view" | "edit";
  card: Card | null;
  onClose: () => void;
  onSave: (values: FormValues) => Promise<void> | void;
};

function ensureUrl(v: string) {
  const url = v.trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export default function BusinessCardModal({ open, mode, card, onClose, onSave }: Props) {
  const [formError, setFormError] = useState<string | null>(null);
  const closingAllowed = mode === "view"; // ما نقفلش وقت الحفظ
  const isView = mode === "view";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      title: "",
      email: "",
      website: "",
      template: "",
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
      youtube: "",
      tiktok: "",
      shortDescription: "",
      customerId: "",
    },
    mode: "onBlur",
  });

  // URL اختياري (لو اتكتب لازم يكون صالح)
  const urlRegex = /^(https?:\/\/)?([^\s.]+\.[^\s]{2,})(\/\S*)?$/i;
  const optionalUrlRule = useMemo(
    () => ({ validate: (v: string) => !v || urlRegex.test(v) || "Invalid URL" }),
    []
  );
  const websiteRequiredRule = useMemo(
    () => ({
      required: "Website is required",
      validate: (v: string) => urlRegex.test(v) || "Invalid URL",
    }),
    []
  );

  // راقب template لإظهار/إخفاء Company
  const templateValue = watch("template");

  // حمّل بيانات الكارت في الفورم
  useEffect(() => {
    if (!open) return;
    setFormError(null);
    if (card) {
      reset({
        name: (card.name || "").trim(),
        title: (card.title || "").trim(),
        email: (card.email || "").trim(),
        website: (card.website || "").trim(),
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

  // Esc للإغلاق السريع
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (closingAllowed || !isSubmitting)) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, isSubmitting, closingAllowed]);

  // فوكس على أول حقل فيه خطأ
  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const firstKey = Object.keys(errors)[0] as keyof FormValues | undefined;
    if (!firstKey) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`);
    el?.focus();
  }, [errors, open]);

  if (!open) return null;

  const onSubmit = handleSubmit(async (values) => {
    clearErrors();
    setFormError(null);

    // Trim الكل + Normalize للروابط
    const clean: FormValues = {
      ...values,
      name: values.name.trim(),
      title: values.title.trim(),
      email: values.email.trim(),
      website: ensureUrl(values.website),
      linkedin: values.linkedin ? ensureUrl(values.linkedin) : "",
      twitter: values.twitter ? ensureUrl(values.twitter) : "",
      facebook: values.facebook ? ensureUrl(values.facebook) : "",
      instagram: values.instagram ? ensureUrl(values.instagram) : "",
      youtube: values.youtube ? ensureUrl(values.youtube) : "",
      tiktok: values.tiktok ? ensureUrl(values.tiktok) : "",
      shortDescription: values.shortDescription?.trim() || "",
      customerId: values.customerId?.trim() || "",
    };

    try {
      await onSave(clean);
      onClose();
    } catch (e) {
      const msg = (e as Error)?.message || "Failed to save. Please try again.";
      // تصنيف بسيط للرسائل
      const pretty =
        /permission|denied/i.test(msg)
          ? "You do not have permission to perform this action."
          : /network|unavailable|timeout/i.test(msg)
          ? "Network issue. Check your connection and try again."
          : msg;

      setFormError(pretty);

      // لو فيه إيميل غلط (من السيرفر)، علم على الحقل
      if (/email/i.test(msg)) {
        setError("email", { type: "server", message: pretty });
      }
    }
  });

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="bc-modal-title" className={s.overlay}>
      <div
        className={s.backdrop}
        onClick={() => {
          if (closingAllowed || !isSubmitting) onClose();
        }}
      />
      <div className={s.modal} aria-busy={isSubmitting}>
        <div className={s.header}>
          <h2 id="bc-modal-title" className={s.title}>
            {mode === "add" ? "Add Card" : mode === "edit" ? "Edit Card" : "View Card"}
          </h2>
          <button
            type="button"
            className={s.close}
            onClick={() => (closingAllowed || !isSubmitting) && onClose()}
            aria-label="Close modal"
            disabled={isSubmitting && !closingAllowed}
          >
            ✕
          </button>
        </div>

        {/* Banner خطأ عام */}
        {formError && (
          <div
            role="alert"
            style={{
              margin: "8px 0 12px",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--danger-border)",
              background: "var(--danger-bg)",
              color: "var(--danger-text)",
              fontSize: 14,
            }}
          >
            {formError}
          </div>
        )}

        <form ref={formRef} onSubmit={onSubmit} className={s.form} autoComplete="off" noValidate>
          {/* Required: Name */}
          <Field label="Name" required readOnly={isView} error={errors.name?.message}>
            <input
              className={s.input}
              readOnly={isView}
              aria-required="true"
              aria-invalid={!!errors.name || undefined}
              {...register("name", { required: "Name is required" })}
            />
          </Field>

          {/* Required: Job title */}
          <Field label="Job title" required readOnly={isView} error={errors.title?.message}>
            <input
              className={s.input}
              readOnly={isView}
              aria-required="true"
              aria-invalid={!!errors.title || undefined}
              {...register("title", { required: "Job title is required" })}
            />
          </Field>

          {/* Required: Email */}
          <Field label="Email" required readOnly={isView} error={errors.email?.message}>
            <input
              type="email"
              className={s.input}
              readOnly={isView}
              aria-required="true"
              aria-invalid={!!errors.email || undefined}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
              })}
            />
          </Field>

          {/* Required: Website */}
          <Field label="Website" required readOnly={isView} error={errors.website?.message}>
            <input
              className={s.input}
              readOnly={isView}
              aria-required="true"
              aria-invalid={!!errors.website || undefined}
              {...register("website", websiteRequiredRule)}
            />
          </Field>

          {/* Required: Template */}
          <div>
            <label className={s.label} htmlFor="template">
              Template<span aria-hidden style={{ color: "#fda4af" }}> *</span>
            </label>
            <select
              id="template"
              className={s.select}
              disabled={isView}
              aria-required="true"
              aria-invalid={!!errors.template || undefined}
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

          {/* Company يظهر فقط مع custom template (اختياري) */}
          {templateValue === "custom template" && (
            <Field label="Company (customerId)" readOnly={isView}>
              <input className={s.input} readOnly={isView} {...register("customerId")} />
            </Field>
          )}

          {/* Socials — اختيارية مع URL-valid لو اتكتبت */}
          <Field label="LinkedIn" readOnly={isView} error={errors.linkedin?.message}>
            <input
              className={s.input}
              readOnly={isView}
              aria-invalid={!!errors.linkedin || undefined}
              {...register("linkedin", optionalUrlRule)}
            />
          </Field>
          <Field label="Twitter" readOnly={isView} error={errors.twitter?.message}>
            <input
              className={s.input}
              readOnly={isView}
              aria-invalid={!!errors.twitter || undefined}
              {...register("twitter", optionalUrlRule)}
            />
          </Field>
          <Field label="Facebook" readOnly={isView} error={errors.facebook?.message}>
            <input
              className={s.input}
              readOnly={isView}
              aria-invalid={!!errors.facebook || undefined}
              {...register("facebook", optionalUrlRule)}
            />
          </Field>
          <Field label="Instagram" readOnly={isView} error={errors.instagram?.message}>
            <input
              className={s.input}
              readOnly={isView}
              aria-invalid={!!errors.instagram || undefined}
              {...register("instagram", optionalUrlRule)}
            />
          </Field>
          <Field label="YouTube" readOnly={isView} error={errors.youtube?.message}>
            <input
              className={s.input}
              readOnly={isView}
              aria-invalid={!!errors.youtube || undefined}
              {...register("youtube", optionalUrlRule)}
            />
          </Field>
          <Field label="TikTok" readOnly={isView} error={errors.tiktok?.message}>
            <input
              className={s.input}
              readOnly={isView}
              aria-invalid={!!errors.tiktok || undefined}
              {...register("tiktok", optionalUrlRule)}
            />
          </Field>

          {/* Short description — اختياري */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label className={s.label} htmlFor="shortDescription">Short description</label>
            <textarea
              id="shortDescription"
              className={s.textarea}
              readOnly={isView}
              {...register("shortDescription")}
            />
          </div>

          <div className={s.actions}>
            <button
              type="button"
              className={s.btn}
              onClick={() => (closingAllowed || !isSubmitting) && onClose()}
              disabled={isSubmitting && !closingAllowed}
            >
              Cancel
            </button>
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
  label,
  required = false,
  readOnly = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  readOnly?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={s.label}>
        {label}
        {required && <span aria-hidden style={{ color: "#fda4af" }}> *</span>}
      </label>
      {children}
      {error && <div className={s.error}>{error}</div>}
    </div>
  );
}
