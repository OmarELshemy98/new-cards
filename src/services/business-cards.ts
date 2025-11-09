/** src/services/business-cards.ts
 *
 * - createCard: ينشئ doc ref أولاً ويضيف الحقل id داخل الداتا قبل الحفظ.
 * - getById: لو الوثيقة القديمة ما فيهاش id، يحدّثها بهدوء.
 * - backfillCardIds: دالة اختيارية لملء id لكل الوثائق القديمة مرة واحدة.
 * - sanitize: تمنع undefined وتعمل trim للـ strings قبل الكتابة على Firestore.
 */

import { db } from "@/src/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  writeBatch,
  type UpdateData,
  type DocumentData,
} from "firebase/firestore";

// تعريف نوع الكارت
export type Card = {
  id: string;
  name?: string;
  email?: string;
  title?: string;
  ownerId?: string;
  website?: string;
  template?: "medyour" | "axiom" | "arcon" | "custom template";
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  shortDescription?: string;
  customerId?: string;

  // إضافات
  phone1?: string;
  phone2?: string;
  qrFilename?: string; // مثال: "tm-mohamed-ibrahim.png"
  vcfFilename?: string; // مثال: "mohamedibrahim.vcf"
};

const COLLECTION = "business_cards" as const;

/** util: إزالة undefined و null و السلاسل الفارغة + trim للـ strings */
function sanitize<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out = {} as Partial<T>;
  for (const [k, v] of Object.entries(obj) as [keyof T, T[keyof T]][]) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string") {
      const t = v.trim();
      if (t === "") continue;
      out[k] = t as unknown as T[keyof T];
    } else {
      out[k] = v;
    }
  }
  return out;
}

/** إرجاع كل الكروت الخاصة بمستخدم (أو كل الكروت لو isAdmin=true) */
export async function getAll(uid: string, opts?: { isAdmin?: boolean }): Promise<Card[]> {
  if (!uid) return [];
  const colRef = collection(db, COLLECTION);
  const q = opts?.isAdmin ? undefined : query(colRef, where("ownerId", "==", uid));
  const qs = q ? await getDocs(q) : await getDocs(colRef);
  return qs.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Card, "id">),
  }));
}

/** إنشاء كارت جديد + تخزين id كحقل داخل الوثيقة (مع sanitize) */
export async function createCard(data: Omit<Card, "id">): Promise<Card> {
  const colRef = collection(db, COLLECTION);
  const docRef = doc(colRef); // نولّد مرجع عشان ناخد الـ id
  const payloadWithId = { ...data, id: docRef.id } as const;
  await setDoc(docRef, sanitize(payloadWithId) as DocumentData);
  // بنرجّع نسخة موحّدة
  return { id: docRef.id, ...(payloadWithId as Omit<Card, "id">) } as Card;
}

/** تحديث كارت (مع sanitize) */
export async function updateCard(
  id: string,
  data: Partial<Omit<Card, "id" | "ownerId">>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, sanitize(data) as UpdateData<DocumentData>);
}

/** حذف كارت */
export async function deleteCard(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

/** جلب كارت بالمعرّف — ويعمل تصحيح id لو مفقود في الداتا القديمة */
export async function getById(id: string): Promise<Card | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as Omit<Card, "id"> & Partial<Pick<Card, "id">>;

  // لو حقل id مش موجود جوّه الوثيقة، نحدّثه بهدوء (لا يؤثر على النتيجة المرجعة)
  if (!data.id) {
    try {
      await updateDoc(ref, { id: snap.id } as UpdateData<DocumentData>);
    } catch {
      // تجاهل أي خطأ صامتًا
    }
  }

  return { id: snap.id, ...(data as Omit<Card, "id">) } as Card;
}

/** (اختياري) باكفيل لتعبئة حقل id لكل الوثائق القديمة مرة واحدة — ترجع عدد الوثائق التي تم تعديلها */
export async function backfillCardIds(): Promise<number> {
  const colRef = collection(db, COLLECTION);
  const snap = await getDocs(colRef);
  const batch = writeBatch(db);

  let updated = 0;
  snap.docs.forEach((d) => {
    const data = d.data() as Partial<Card>;
    if (!data.id) {
      batch.update(d.ref, { id: d.id });
      updated += 1;
    }
  });

  if (updated > 0) {
    await batch.commit();
  }
  return updated;
}
