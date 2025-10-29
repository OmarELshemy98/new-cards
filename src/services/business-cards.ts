/**
 * 
 * ❓ ايه فكرة الملف ده ببساطة؟
 * 
 * - ده ملف معمُول يساعدنا نجيب "كروت البيزنس" بتاعت كل مستخدم بسهولة من قاعدة بيانات فايربيز (Firestore).
 * - بدل ما تكتب الكود كل مرة عشان تجيب الكروت من فايربيز، هنا في دالة بتاخد منك الـ uid (معرّف المستخدم)، وترجعلك كل الكروت بتاعته في مصفوفة، وانت تستخدم الداتا دي في أي صفحة أو مكوّن في الموقع.
 * 
 * - يعني باختصار: لو عندك مستخدم سجل دخول، وعايز تجيب كل كروته من القاعدة.. تستخدم الدالة دي، وترتاح من التفاصيل.
 */

import { db } from "@/src/firebaseConfig";
import { collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc, getDoc, type UpdateData, type DocumentData } from "firebase/firestore";

// بنعرف النوع / شكل الداتا بتاعة كل كارت
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

  // ⬇️ إضافات للقالب
  phone1?: string;
  phone2?: string;
  qrFilename?: string;   // مثال: "tm-mohamed-ibrahim.png"
  vcfFilename?: string;  // مثال: "mohamedibrahim.vcf"
};

const COLLECTION = "business_cards" as const;

// دالة بترجع كل الكروت اللي تخص مستخدم معين (من خلال uid)
export async function getAll(uid: string, opts?: { isAdmin?: boolean }) {
  if (!uid) return [];

  const colRef = collection(db, COLLECTION);
  const q = opts?.isAdmin ? undefined : query(colRef, where("ownerId", "==", uid));
  const qs = q ? await getDocs(q) : await getDocs(colRef);

  return qs.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Card, "id">),
  }));
}

// إنشاء كارت جديد
export async function createCard(data: Omit<Card, "id">) {
  const colRef = collection(db, COLLECTION);
  const docRef = await addDoc(colRef, data);
  const snap = await getDoc(docRef);
  return { id: docRef.id, ...(snap.data() as Omit<Card, "id">) } as Card;
}

// تحديث كارت
export async function updateCard(id: string, data: Partial<Omit<Card, "id" | "ownerId">>) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, data as UpdateData<DocumentData>);
}

// حذف كارت
export async function deleteCard(id: string) {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

// استخراج كارت بواسطة المعرف
export async function getById(id: string): Promise<Card | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Card, "id">) } as Card;
}
