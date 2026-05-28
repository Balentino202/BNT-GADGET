import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAq7qtvS1HIU9D3pY1qTbZ3ILxJ7_hr9SI',
  authDomain: 'bnt-gadget.firebaseapp.com',
  projectId: 'bnt-gadget',
  storageBucket: 'bnt-gadget.firebasestorage.app',
  messagingSenderId: '846458471560',
  appId: '1:846458471560:web:bb376cce41aa1eacd84b3d',
  measurementId: 'G-BT7MR1GBRZ',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
