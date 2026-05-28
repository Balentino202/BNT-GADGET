import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { fetchProducts, deleteProduct, seedProducts, type FirestoreProduct } from '../firebase/products';
import { products as staticProducts, categoryLabels } from '../data/products';
import ProductForm from './ProductForm';
import {
  Plus, LogOut, Pencil, Trash2, Loader2, Package,
  RefreshCw, Upload, Search, Tag,
} from 'lucide-react';

export default function Dashboard() {
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<FirestoreProduct | undefined>();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  const load = async () => {
    setLoading(true);
    const list = await fetchProducts();
    setProducts(list);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (p: FirestoreProduct) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeleting(p._docId);
    await deleteProduct(p._docId, p.images);
    await load();
    setDeleting(null);
  };

  const handleEdit = (p: FirestoreProduct) => {
    setEditProduct(p);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditProduct(undefined);
    setShowForm(true);
  };

  const handleSeed = async () => {
    if (!window.confirm('This will import all current static products into Firebase. Continue?')) return;
    setSeeding(true);
    await seedProducts(staticProducts);
    await load();
    setSeeding(false);
    setSeedDone(true);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const categoryCount: Record<string, number> = {};
  products.forEach((p) => {
    categoryCount[p.category] = (categoryCount[p.category] ?? 0) + 1;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/img/favicon.png" alt="Logo" className="w-8 h-8 object-contain" />
            <div>
              <p className="font-black text-white text-sm leading-tight">BNT-GET SERVICE</p>
              <p className="text-brand-lighter text-[10px] font-semibold tracking-widest uppercase leading-tight">Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-dark transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Product</span>
            </button>
            <button
              onClick={() => signOut(auth)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-700 transition-all cursor-pointer"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: products.length, icon: Package, color: 'text-brand' },
            { label: 'iPhones', value: categoryCount['iphone'] ?? 0, icon: Tag, color: 'text-blue-400' },
            { label: 'Android', value: categoryCount['android'] ?? 0, icon: Tag, color: 'text-green-400' },
            { label: 'MacBooks', value: categoryCount['macbook'] ?? 0, icon: Tag, color: 'text-purple-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <Icon size={18} className={`${color} mb-2`} />
              <p className="text-white font-black text-2xl">{value}</p>
              <p className="text-gray-500 text-xs font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Seed button (first-time setup) */}
        {products.length === 0 && !loading && (
          <div className="mb-6 p-5 bg-brand/10 border border-brand/25 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white font-bold text-sm mb-1">🚀 First time setup</p>
              <p className="text-gray-400 text-xs">
                Your database is empty. Click to import all your existing products from the website into Firebase.
              </p>
            </div>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-60 cursor-pointer shrink-0"
            >
              {seeding ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {seeding ? 'Importing…' : 'Import Existing Products'}
            </button>
          </div>
        )}

        {seedDone && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl">
            <p className="text-emerald-400 text-sm font-semibold">✅ Products imported successfully! You can now edit them here.</p>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand transition-all"
            />
          </div>
          <button onClick={load} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer" title="Refresh">
            <RefreshCw size={15} />
          </button>
        </div>

        {/* Product list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-brand" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-gray-400 font-medium">
              {search ? 'No products match your search.' : 'No products yet. Click "Add Product" to get started.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div
                key={p._docId}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4 hover:border-gray-700 transition-all"
              >
                {/* Thumbnail */}
                <img
                  src={p.thumbnail}
                  alt={p.name}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-800 shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-white font-bold text-sm truncate">{p.name}</p>
                    {p.badge && (
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded-full text-white ${p.badge === 'New' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-brand-lighter text-xs font-semibold capitalize">{categoryLabels[p.category]}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{p.images.length} photo{p.images.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(p)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-brand text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    disabled={deleting === p._docId}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {deleting === p._docId ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Form modal */}
      {showForm && (
        <ProductForm
          product={editProduct}
          nextOrder={products.length}
          onClose={() => { setShowForm(false); setEditProduct(undefined); }}
          onSaved={load}
        />
      )}
    </div>
  );
}
