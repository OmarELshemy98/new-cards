import { db } from '@/firebaseConfig';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
export type Card = {id:string , name:string , email:string ,title:string};
const COLLECTION = 'business_cards' as const;



export async function getAll(uid: string) {
  if (!uid) return [];

  const colRef = collection(db, COLLECTION);
  const q = query(colRef, where('ownerId', '==', uid));
  const qs = await getDocs(q);
console.log('adadaadada', uid,qs.docs.length);

  return qs.docs.map(d => ({
    id: d.id,
    ...(d.data() as Omit<Card, 'id'>),
  }));
}
