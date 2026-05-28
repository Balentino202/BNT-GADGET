import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { subscribeToProducts, type FirestoreProduct } from '../firebase/products';
import { products as staticProducts } from '../data/products';

interface ProductsContextValue {
  products: FirestoreProduct[];
  loading: boolean;
  fromFirestore: boolean;
}

const staticAsFirestore: FirestoreProduct[] = staticProducts.map((p, i) => ({ ...p, _docId: p.id, order: i }));

const ProductsContext = createContext<ProductsContextValue>({
  products: staticAsFirestore,
  loading: false,
  fromFirestore: false,
});

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<FirestoreProduct[]>(staticAsFirestore);
  const [loading, setLoading] = useState(true);
  const [fromFirestore, setFromFirestore] = useState(false);

  useEffect(() => {
    const unsub = subscribeToProducts((docs: FirestoreProduct[]) => {
      if (docs.length > 0) {
        setProducts(docs);
        setFromFirestore(true);
      } else {
        setProducts(staticAsFirestore);
        setFromFirestore(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, fromFirestore }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);
