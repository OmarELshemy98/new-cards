// services/users.ts
import { db } from "@/firebaseConfig";
import {
  collection, getDocs, getDoc, doc, deleteDoc,
  Timestamp, type DocumentData
} from "firebase/firestore";

export type AppUser = {
  id: string;          // UID (document id)
  email?: string;
  name?: string;
  role?: string;       // "user" | "admin" ... حسب عندك
  createdAt?: Date;
};

const COLLECTION = "users" as const;

function mapDoc(d: DocumentData): AppUser {
  const data = d.data() ;
  const createdAt =
    data?.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : typeof data?.createdAt === "number"
        ? new Date(data.createdAt)
        : undefined;

  return {
    id: d.id,
    email: data?.email ?? "",
    name: data?.name ?? "",
    role: data?.role ?? "",
    createdAt,
  };
}

export async function getAllUsers(): Promise<AppUser[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map(mapDoc);
}

export async function getUserById(id: string): Promise<AppUser | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists() ? mapDoc(snap) : null;
}

export async function deleteUser(id: string) {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
