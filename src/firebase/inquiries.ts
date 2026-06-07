import { collection, addDoc, getDocs, onSnapshot, query, orderBy, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export type InquiryType = 'general' | 'repair';

export interface Inquiry {
  _docId: string;
  name: string;
  phone: string;
  interest: string;
  message: string;
  type?: InquiryType;
  device?: string;
  issue?: string;
  read: boolean;
  responded?: boolean;
  createdAt: { seconds: number } | null;
}

type SubmitData = Pick<Inquiry, 'name' | 'phone' | 'interest' | 'message'> &
  Partial<Pick<Inquiry, 'type' | 'device' | 'issue'>>;

export async function submitInquiry(data: SubmitData) {
  return addDoc(collection(db, 'inquiries'), {
    ...data,
    type: data.type ?? 'general',
    read: false,
    responded: false,
    createdAt: serverTimestamp(),
  });
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Omit<Inquiry, '_docId'>), _docId: d.id }));
}

/** Live subscription — newest first. Returns an unsubscribe function. */
export function subscribeToInquiries(cb: (inquiries: Inquiry[]) => void) {
  const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ ...(d.data() as Omit<Inquiry, '_docId'>), _docId: d.id })));
  });
}

export async function markInquiryRead(docId: string) {
  return updateDoc(doc(db, 'inquiries', docId), { read: true });
}

export async function setInquiryResponded(docId: string, responded: boolean) {
  return updateDoc(doc(db, 'inquiries', docId), { responded, read: true });
}

export async function deleteInquiry(docId: string) {
  return deleteDoc(doc(db, 'inquiries', docId));
}
