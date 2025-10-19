// services/business-cards.ts
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export type Card = {
  id: string;
  name?: string;
  email?: string;
  title?: string;
  ownerId?: string;
};

const COLLECTION = "business_cards" as const;

export async function getAll(uid: string) {
  if (!uid) return [];
  const colRef = collection(db, COLLECTION);
  const q = query(colRef, where("ownerId", "==", uid));
  const qs = await getDocs(q);
  return qs.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Card, "id">),
  }));
}
