import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export interface WaitlistEntry {
  _docId: string;
  productId: string;
  productName: string;
  phone: string;
  createdAt: { seconds: number } | null;
}

export async function joinWaitlist(data: Pick<WaitlistEntry, 'productId' | 'productName' | 'phone'>) {
  return addDoc(collection(db, 'waitlist'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function fetchAllWaitlist(): Promise<WaitlistEntry[]> {
  const q = query(collection(db, 'waitlist'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Omit<WaitlistEntry, '_docId'>), _docId: d.id }));
}

export async function removeWaitlistEntry(docId: string) {
  return deleteDoc(doc(db, 'waitlist', docId));
}
