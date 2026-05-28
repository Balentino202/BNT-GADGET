import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './config';
import type { Product } from '../types';

const COL = 'products';

export type FirestoreProduct = Product & { _docId: string; order: number };

/** Subscribe to real-time product updates, newest additions first */
export function subscribeToProducts(cb: (products: FirestoreProduct[]) => void) {
  const q = query(collection(db, COL), orderBy('order', 'desc'));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ ...(d.data() as Omit<FirestoreProduct, '_docId'>), _docId: d.id }));
    cb(list);
  });
}

/** One-time fetch (used by admin) */
export async function fetchProducts(): Promise<FirestoreProduct[]> {
  const q = query(collection(db, COL), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as Omit<FirestoreProduct, '_docId'>), _docId: d.id }));
}

/** Add a new product */
export async function addProduct(product: Omit<Product, 'id'>, order: number) {
  return addDoc(collection(db, COL), {
    ...product,
    order,
    createdAt: serverTimestamp(),
  });
}

/** Update existing product */
export async function updateProduct(docId: string, data: Partial<Product>) {
  return updateDoc(doc(db, COL, docId), { ...data, updatedAt: serverTimestamp() });
}

/** Delete product (and its Storage images) */
export async function deleteProduct(docId: string, imageUrls: string[]) {
  await deleteDoc(doc(db, COL, docId));
  await Promise.allSettled(
    imageUrls.map((url) => {
      try {
        const r = ref(storage, url);
        return deleteObject(r);
      } catch {
        return Promise.resolve();
      }
    }),
  );
}

/** Upload a single image file, returns its public download URL */
export async function uploadImage(file: File, productId: string): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `products/${productId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/** Delete a single image from Storage by its URL */
export async function deleteImage(url: string) {
  try {
    await deleteObject(ref(storage, url));
  } catch {
    // ignore — image may already be gone
  }
}

/** Seed the database with the static product list (one-time import) */
export async function seedProducts(staticProducts: Product[]) {
  const batch = writeBatch(db);
  staticProducts.forEach((p, i) => {
    const docRef = doc(collection(db, COL));
    batch.set(docRef, { ...p, order: i, createdAt: serverTimestamp() });
  });
  await batch.commit();
}
