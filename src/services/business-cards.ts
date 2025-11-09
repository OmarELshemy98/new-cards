/** src/services/business-cards.ts */
import { db } from "@/firebaseConfig";
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
  phone1?: string;
  phone2?: string;
  qrFilename?: string;
  vcfFilename?: string;
};

const COLLECTION = "business_cards" as const;

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

export async function createCard(data: Omit<Card, "id">): Promise<Card> {
  const colRef = collection(db, COLLECTION);
  const docRef = doc(colRef);
  const payloadWithId = { ...data, id: docRef.id } as const;
  await setDoc(docRef, sanitize(payloadWithId) as DocumentData);
  return { id: docRef.id, ...(payloadWithId as Omit<Card, "id">) } as Card;
}

export async function updateCard(
  id: string,
  data: Partial<Omit<Card, "id" | "ownerId">>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, sanitize(data) as UpdateData<DocumentData>);
}

export async function deleteCard(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

export async function getById(id: string): Promise<Card | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as Omit<Card, "id"> & Partial<Pick<Card, "id">>;

  if (!data.id) {
    try {
      await updateDoc(ref, { id: snap.id } as UpdateData<DocumentData>);
    } catch {}
  }
  return { id: snap.id, ...(data as Omit<Card, "id">) } as Card;
}

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

  if (updated > 0) await batch.commit();
  return updated;
}
