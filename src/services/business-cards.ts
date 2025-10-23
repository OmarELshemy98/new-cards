  /**
 * 
 * ❓ ايه فكرة الملف ده ببساطة؟
 * 
 * - ده ملف معمول يساعدنا نجيب "كروت البيزنس" بتاعت كل مستخدم بسهولة من قاعدة بيانات فايربيز (Firestore).
 * - بدل ما تكتب الكود كل مرة عشان تجيب الكروت من فايربيز، هنا في دالة بتاخد منك الـ uid (معرّف المستخدم)، وترجعلك كل الكروت بتاعته في مصفوفة، وانت تستخدم الداتا دي في أي صفحة أو مكوّن في الموقع.
 * 
 * - يعني باختصار: لو عندك مستخدم سجل دخول، وعايز تجيب كل كروته من القاعدة.. تستخدم الدالة دي، وترتاح من التفاصيل.
 */

// بنستورد قاعدة البيانات اللي عملناها في firebaseConfig
import { db } from "@/src/firebaseConfig";

// بنستورد شوية دوال من فايربيز Firestore:
// - collection: عشان نشاور على مجموعة الكروت
// - getDocs: عشان نجيب كل المستندات (الكروت)
// - query/where: نفلتر الكروت حسب مين صاحبها
import { collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc, getDoc, type UpdateData, type DocumentData } from "firebase/firestore";

// بنعرف النوع / شكل الداتا بتاعة كل كارت
export type Card = {
  id: string;      // المعرف الفريد للكارت (Firestore document id)
  name?: string;   // اسم الشخص
  email?: string;  // الإيميل
  title?: string;  // الوظيفة
  ownerId?: string; // معرّف صاحب الكارت (uid)
  website?: string;
  template?: "medyour" | "axiom" | "arcon" | "custom template";
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  shortDescription?: string;
  customerId?: string; // الشركة/العميل لاستخدامها في الفلترة
};

// اسم مجموعة الكروت في فايربيز
const COLLECTION = "business_cards" as const;

// دالة بترجع كل الكروت اللي تخص مستخدم معين (من خلال uid)
export async function getAll(uid: string, opts?: { isAdmin?: boolean }) {
  // لو uid مش موجود (مثلاً المستخدم مش مسجل دخول)، رجع مصفوفة فاضية
  if (!uid) return [];

  // بنشاور على مجموعة الكروت
  const colRef = collection(db, COLLECTION);

  // الأدمن يشوف كل الكروت، غير الأدمن يفلتر على ownerId
  const q = opts?.isAdmin ? undefined : query(colRef, where("ownerId", "==", uid));

  // بننفذ الاستعلام ونستنى النتيجة
  const qs = q ? await getDocs(q) : await getDocs(colRef);

  // بنرجّع مصفوفة كروت: كل واحد فيهم فيه id و باقي البيانات
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
