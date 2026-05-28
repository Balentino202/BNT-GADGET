import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { subscribeToProducts, type FirestoreProduct } from '../firebase/products';
import { products as staticProducts } from '../data/products';
import type { Product } from '../types';

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  fromFirestore: boolean;
}

const ProductsContext = createContext<ProductsContextValue>({
  products: staticProducts,
  loading: false,
  fromFirestore: false,
});

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);
  const [fromFirestore, setFromFirestore] = useState(false);

  useEffect(() => {
    const unsub = subscribeToProducts((docs: FirestoreProduct[]) => {
      if (docs.length > 0) {
        setProducts(docs);
        setFromFirestore(true);
      } else {
        setProducts(staticProducts);
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
