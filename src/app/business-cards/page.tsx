"use client";

/**
 * الهدف:
 * - عرض البزنس كاردز في شكل جدول منظم و Responsive باستخدام Tailwind + Flex.
 * - على الموبايل: كل صف يبقى عمودي، ومع كل قيمة يظهر ليبل (Name/Title/Email/ID).
 * - على الديسكتوب: Header فوق + الصفوف في سطر واحد (Flex Row).
 */

import { useEffect, useMemo, useState } from "react";              // useState/useEffect لإدارة الحالة وجلب البيانات
import { useRouter } from "next/navigation";              // راوتر علشان ريدايركت لو مفيش يوزر
import { useAuth } from "@/hooks/useAuth";                // هوك الأوث (user/loading)
import { getAll, createCard, updateCard, deleteCard, type Card } from "@/services/business-cards"; // دوال CRUD + نوع الكارت
import { auth } from "@/firebaseConfig";                  // نسخة الأوث
import { signOut } from "firebase/auth";                  // تسجيل خروج من فايربيز

// الكمبوننت الرئيسي للصفحة
export default function BusinessCards() {
  const router = useRouter();                              // راوتر لإعادة التوجيه
  const { user, loading, isAdmin } = useAuth();            // من الأوث: المستخدم + حالة التحميل + أدمن؟
  const [cards, setCards] = useState<Card[]>([]);          // ستايت للكروت اللي هنعرِضها
  const [error, setError] = useState<string | null>(null); // ستايت للخطأ لو حصل
  const [fetching, setFetching] = useState(true);          // ستايت لتحميل البيانات
  const [modalOpen, setModalOpen] = useState(false);       // حالة البوب أب
  const [modalMode, setModalMode] = useState<"add" | "view" | "edit">("add"); // وضع المودال
  const [activeCard, setActiveCard] = useState<Card | null>(null); // الكارت الحالي للعرض/التعديل

  type TemplateType = "medyour" | "axiom" | "arcon" | "custom template";

  // حقول النموذج
  const [form, setForm] = useState({
    name: "",
    title: "",
    email: "",
    website: "",
    template: "" as TemplateType | "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    shortDescription: "",
    customerId: "",
  });

  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  // حماية المسار: لو حددنا إن مفيش يوزر -> نروح لصفحة اللوجين
  useEffect(() => {
    if (!loading && !user) router.replace("/login");       // بعد ما اللودينج يخلص: لو مفيش يوزر اعمل ريدايركت
  }, [loading, user, router]);                             // اتنفّذ لما أي حاجة من دول تتغير

  // جلب البيانات من Firestore
  useEffect(() => {
    (async () => {
      try {
        setError(null);                                    // امسح أي خطأ قديم
        setFetching(true);                                 // فعل حالة التحميل
        // ملاحظة: فضّلت أخليها بالـ UID الحقيقي لو موجود. لو مش لوجين، بنعمل redirect فوق.
        // لو لسه مجرّب بيوزر ثابت، رجّع السطر اللي تحت بالهاردكود.
        if (!user) return;                                  // أمان: لو مفيش يوزر هنا، بلاش نكمل
        const data = await getAll(user.uid, { isAdmin });   // الأدمن يشوف الكل
        // const data = await getAll("avapcfzkydNUQC6oI7CmQ1uuhf02"); // (بديل للتجربة)
        setCards(data);                                     // خزّن الكروت في الستايت
      } catch (e) {
        setError((e as Error)?.message ?? "Unknown error"); // خزن رسالة الخطأ المقروءة
      } finally {
        setFetching(false);                                 // خلّصنا تحميل
      }
    })();
  }, [user, isAdmin]);                                      // لو اليوزر/أدمن اتغير — هنعيد الجلب

  // تحضير بيانات للبحث/الفلترة
  const companyOptions = useMemo(() => {
    const set = new Set<string>();
    cards.forEach(c => { if (c.customerId) set.add(c.customerId); });
    return Array.from(set);
  }, [cards]);

  const filteredCards = useMemo(() => {
    const term = search.trim().toLowerCase();
    return cards.filter(c => {
      const matchesTerm = term
        ? [
            c.name,
            c.title,
            c.email,
            c.website,
            c.template,
            c.linkedin,
            c.twitter,
            c.facebook,
            c.instagram,
            c.youtube,
            c.tiktok,
            c.shortDescription,
          ]
            .map(v => (v || "").toString().toLowerCase())
            .some(v => v.includes(term))
        : true;
      const matchesCompany = companyFilter ? c.customerId === companyFilter : true;
      return matchesTerm && matchesCompany;
    });
  }, [cards, search, companyFilter]);

  function openAdd() {
    setModalMode("add");
    setActiveCard(null);
    setForm({
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
    });
    setModalOpen(true);
  }

  function openView(card: Card) {
    setModalMode("view");
    setActiveCard(card);
    setForm({
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
    setModalOpen(true);
  }

  function openEdit(card: Card) {
    // افتح المودال بوضع التعديل مباشرة بدون نداء openView لتفادي التكرار
    setModalMode("edit");
    setActiveCard(card);
    setForm({
      name: card.name || "",
      title: card.title || "",
      email: card.email || "",
      website: card.website || "",
      template: (card.template ?? "") as "medyour" | "axiom" | "arcon" | "custom template" | "",
      linkedin: card.linkedin || "",
      twitter: card.twitter || "",
      facebook: card.facebook || "",
      instagram: card.instagram || "",
      youtube: card.youtube || "",
      tiktok: card.tiktok || "",
      shortDescription: card.shortDescription || "",
      customerId: card.customerId || "",
    });
    setModalOpen(true);
  }

  async function onDelete(card: Card) {
    if (!confirm("Delete this card?")) return;
    await deleteCard(card.id);
    setCards(prev => prev.filter(c => c.id !== card.id));
  }

  async function onSubmit() {
    if (!user) return;
    // validate required
    if (!form.name || !form.title || !form.email || !form.website || !form.template) {
      alert("Please fill all required fields and select a template.");
      return;
    }
    setSaving(true);
    try {
      const payload = formToPayload(form);
      if (modalMode === "add") {
        const created = await createCard({
          ...payload,
          ownerId: user.uid,
        } as Omit<Card, "id">);
        setCards(prev => [created, ...prev]);
      } else if (modalMode === "edit" && activeCard) {
        await updateCard(activeCard.id, { ...payload });
        setCards(prev => prev.map(c => (c.id === activeCard.id ? { ...c, ...payload } as Card : c)));
      }
      setModalOpen(false);
    } catch (e) {
      alert((e as Error)?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  // حالات التحميل/الخطأ/عدم وجود يوزر
  if (loading || fetching) return <p className="p-8 text-center">Loading…</p>;         // لسه بنحدّد/بنجيب
  if (!user) return null;                                                                     // حصل redirect
  if (error) return <p className="p-8 text-center text-red-500">Error: {error}</p>;          // خطأ

  // الواجهة الرئيسية: هيدر + جدول مرن
  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* هيدر بسيط: عنوان + عدّاد + زر Logout */}
      <Header count={filteredCards.length} onAdd={openAdd} />

      {/* شريط البحث والفلاتر */}
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
          {companyOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* لو مفيش داتا خالص */}
      {filteredCards.length === 0 ? (
        <p className="text-gray-400 mt-6">No data.</p>
      ) : (
        // الغلاف العام للجدول: خلفية خفيفة + بوردر + كورنرز + أوڤرفلو لو العمود طول على الموبايل
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          {/* صف عناوين الأعمدة — بنظهره من أول md وطالع، وعلى الموبايل هنستبدله بليبل جوه كل خانة */}
          <div className="hidden md:flex items-center px-4 py-3 bg-white/10 text-xs uppercase tracking-wide text-white/80">
            {/* الأعمدة: هنوزّع نسب عرض مرنة بثبات علشان يبقى الشكل مصفوف */}
            <div className="w-[22%]">Name</div>
            <div className="w-[18%]">Title</div>
            <div className="w-[18%]">Email</div>
            <div className="w-[18%]">Company</div>
            <div className="w-[12%]">Template</div>
            <div className="w-[12%] text-right">Actions</div>
          </div>

          {/* جسم الجدول: كل كارت = صف */}
          <ul className="divide-y divide-white/10">
            {filteredCards.map((c) => (
              <li key={c.id} className="px-4 py-3 hover:bg-white/5 transition cursor-pointer" onClick={() => openView(c)}>
                {/* الصف نفسه:
                    - على الموبايل: عمودي (flex-col) وبين الخانات مسافات.
                    - على الديسكتوب: أفقي (flex-row) ومحاذاة وسط. */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0">
                  
                  {/* خانة الاسم */}
                  <Cell label="Name" className="md:w-[22%]">
                    <span className="font-medium">{c.name || "—"}</span>
                  </Cell>

                  {/* خانة التايتل */}
                  <Cell label="Title" className="md:w-[18%]">
                    <span className="text-white/90">{c.title || "—"}</span>
                  </Cell>

                  {/* خانة الإيميل */}
                  <Cell label="Email" className="md:w-[18%]">
                    <span className="text-white/70 break-all">{c.email || "—"}</span>
                  </Cell>

                  {/* الشركة */}
                  <Cell label="Company" className="md:w-[18%]">
                    <span className="text-white/80">{c.customerId || "—"}</span>
                  </Cell>

                  {/* القالب */}
                  <Cell label="Template" className="md:w-[12%]">
                    <span className="text-white/70">{c.template || "—"}</span>
                  </Cell>

                  {/* الأكشنز */}
                  <div className="md:w-[12%] flex md:justify-end gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                      className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
                    >Edit</button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(c); }}
                      className="rounded-lg border border-red-400/30 text-red-200 bg-red-500/10 px-2 py-1 text-xs hover:bg-red-500/20"
                    >Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* المودال للعرض/الإضافة/التعديل */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-[92vw] max-w-2xl rounded-2xl bg-slate-900 border border-white/15 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">
                {modalMode === "add" ? "Add Card" : modalMode === "edit" ? "Edit Card" : "View Card"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Name" required value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} readOnly={modalMode === "view"} />
              <Input label="Job title" required value={form.title} onChange={(v) => setForm(f => ({ ...f, title: v }))} readOnly={modalMode === "view"} />
              <Input label="Email" type="email" required value={form.email} onChange={(v) => setForm(f => ({ ...f, email: v }))} readOnly={modalMode === "view"} />
              <Input label="Website" required value={form.website} onChange={(v) => setForm(f => ({ ...f, website: v }))} readOnly={modalMode === "view"} />

              {/* Template select */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/70">Template<span className="text-red-400"> *</span></label>
                <select
  value={companyFilter}
  onChange={(e) => setCompanyFilter(e.target.value)}
  className="w-full sm:w-[40%] h-8 rounded-md border border-white/15  px-2 py-1 text-xs text-black outline-none focus:border-cyan-400"
>

                  <option value="">Select template</option>
                  <option value="medyour">medyour</option>
                  <option value="axiom">axiom</option>
                  <option value="arcon">arcon</option>
                  <option value="custom template">custom template</option>
                </select>
              </div>
              <Input label="Company (customerId)" value={form.customerId} onChange={(v) => setForm(f => ({ ...f, customerId: v }))} readOnly={modalMode === "view"} />

              <Input label="LinkedIn" value={form.linkedin} onChange={(v) => setForm(f => ({ ...f, linkedin: v }))} readOnly={modalMode === "view"} />
              <Input label="Twitter" value={form.twitter} onChange={(v) => setForm(f => ({ ...f, twitter: v }))} readOnly={modalMode === "view"} />
              <Input label="Facebook" value={form.facebook} onChange={(v) => setForm(f => ({ ...f, facebook: v }))} readOnly={modalMode === "view"} />
              <Input label="Instagram" value={form.instagram} onChange={(v) => setForm(f => ({ ...f, instagram: v }))} readOnly={modalMode === "view"} />
              <Input label="YouTube" value={form.youtube} onChange={(v) => setForm(f => ({ ...f, youtube: v }))} readOnly={modalMode === "view"} />
              <Input label="TikTok" value={form.tiktok} onChange={(v) => setForm(f => ({ ...f, tiktok: v }))} readOnly={modalMode === "view"} />

              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs text-white/70">Short description</label>
                <textarea
                  readOnly={modalMode === "view"}
                  value={form.shortDescription}
                  onChange={(e) => setForm(f => ({ ...f, shortDescription: e.target.value }))}
                  className="min-h-[90px] rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">Cancel</button>
              {modalMode !== "view" && (
                <button onClick={onSubmit} disabled={saving} className="rounded-lg border border-cyan-400/30 bg-cyan-400/20 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/30 disabled:opacity-60">
                  {saving ? "Saving..." : modalMode === "add" ? "Add card" : "Save changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /**
   * Header: كومبوننت داخلي بسيط للهيدر (عنوان + عدّاد + زرار لوج آوت).
   * - مخلّيه داخلي (جوه نفس الملف) علشان الكود يبقى مُلموم.
   */
  function Header({ count, onAdd }: { count: number; onAdd: () => void }) {
    return (
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Business Cards</h1>
          <p className="text-sm text-white/60">
            {count} item{count !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAdd}
            className="rounded-lg border border-cyan-400/30 bg-cyan-400/20 px-3 py-2 text-sm hover:bg-cyan-400/30 transition"
          >
            Add card
          </button>
          {/* زرار اللوج آوت */}
          <button
            onClick={() => signOut(auth).then(() => router.replace("/login"))}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
}

/**
 * Cell: كومبوننت “خلية” مرنة للجدول.
 * - على الموبايل: بتعرض ليبل صغير فوق القيمة (عشان مفيش Header ظاهر).
 * - على الديسكتوب: بتخفي الليبل وتسيب القيمة بس، وتاخد عرض ثابت حسب العمود.
 * Props:
 * - label: النص اللي يظهر كليبل على الموبايل (Name/Title/Email/ID).
 * - children: القيمة المعروضة.
 * - className: علشان نحدد عرض العمود على الديسكتوب (md:w-...).
 */
function Cell({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex md:items-center md:justify-start ${className}`}>
      {/* الليبل — ظاهر على الموبايل بس */}
      <span className="md:hidden min-w-[90px] text-xs uppercase tracking-wide text-white/50">
        {label}
      </span>
      {/* القيمة — تاخد بقية العرض */}
      <div className="md:ml-0 md:w-full">{children}</div>
    </div>
  );
}

// عنصر إدخال بسيط
function Input({ label, value, onChange, type = "text", required = false, readOnly = false }:{
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-white/70">{label}{required && <span className="text-red-400"> *</span>}</label>
      <input
        readOnly={readOnly}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400 disabled:opacity-60"
      />
    </div>
  );
}

// تحويل فورم لبايلود مضبوط مع الأنواع (منع قيمة "" للقالب)
function formToPayload(form: {
  name: string; title: string; email: string; website: string; template: "medyour" | "axiom" | "arcon" | "custom template" | "";
  linkedin: string; twitter: string; facebook: string; instagram: string; youtube: string; tiktok: string;
  shortDescription: string; customerId: string;
}) {
  const payload: Partial<Omit<Card, "id" | "ownerId">> = {
    name: form.name,
    title: form.title,
    email: form.email,
    website: form.website,
    template: form.template || undefined,
    linkedin: form.linkedin || undefined,
    twitter: form.twitter || undefined,
    facebook: form.facebook || undefined,
    instagram: form.instagram || undefined,
    youtube: form.youtube || undefined,
    tiktok: form.tiktok || undefined,
    shortDescription: form.shortDescription || undefined,
    customerId: form.customerId || undefined,
  };
  return payload;
}
