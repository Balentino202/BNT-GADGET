import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export interface Inquiry {
  _docId: string;
  name: string;
  phone: string;
  interest: string;
  message: string;
  read: boolean;
  createdAt: { seconds: number } | null;
}

export async function submitInquiry(data: Pick<Inquiry, 'name' | 'phone' | 'interest' | 'message'>) {
  return addDoc(collection(db, 'inquiries'), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Omit<Inquiry, '_docId'>), _docId: d.id }));
}

export async function markInquiryRead(docId: string) {
  return updateDoc(doc(db, 'inquiries', docId), { read: true });
}
