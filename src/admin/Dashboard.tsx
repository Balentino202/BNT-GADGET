import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { fetchProducts, deleteProduct, seedProducts, type FirestoreProduct } from '../firebase/products';
import { fetchInquiries, markInquiryRead, type Inquiry } from '../firebase/inquiries';
import { fetchAllWaitlist, removeWaitlistEntry, type WaitlistEntry } from '../firebase/waitlist';
import { products as staticProducts, categoryLabels } from '../data/products';
import ProductForm from './ProductForm';
import {
  Plus, LogOut, Pencil, Trash2, Loader2, Package,
  RefreshCw, Upload, Search, Tag, MessageSquare, Bell,
  CheckCheck, Phone, X,
} from 'lucide-react';

type Tab = 'products' | 'inquiries' | 'waitlist';

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('products');

  /* ── Products state ─────────────────────────────── */
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<FirestoreProduct | undefined>();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  /* ── Inquiries state ────────────────────────────── */
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  /* ── Waitlist state ─────────────────────────────── */
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loadingWaitlist, setLoadingWaitlist] = useState(false);

  /* ── Load functions ─────────────────────────────── */
  const loadProducts = async () => {
    setLoadingProducts(true);
    setProducts(await fetchProducts());
    setLoadingProducts(false);
  };

  const loadInquiries = async () => {
    setLoadingInquiries(true);
    setInquiries(await fetchInquiries());
    setLoadingInquiries(false);
  };

  const loadWaitlist = async () => {
    setLoadingWaitlist(true);
    setWaitlist(await fetchAllWaitlist());
    setLoadingWaitlist(false);
  };

  useEffect(() => { loadProducts(); }, []);

  useEffect(() => {
    if (tab === 'inquiries' && inquiries.length === 0) loadInquiries();
    if (tab === 'waitlist' && waitlist.length === 0) loadWaitlist();
  }, [tab]);

  /* ── Product handlers ───────────────────────────── */
  const handleDelete = async (p: FirestoreProduct) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeleting(p._docId);
    await deleteProduct(p._docId, p.images);
    await loadProducts();
    setDeleting(null);
  };

  const handleSeed = async () => {
    if (!window.confirm('Import all current static products into Firebase?')) return;
    setSeeding(true);
    await seedProducts(staticProducts);
    await loadProducts();
    setSeeding(false);
    setSeedDone(true);
  };

  /* ── Inquiry handlers ───────────────────────────── */
  const handleMarkRead = async (docId: string) => {
    await markInquiryRead(docId);
    setInquiries((prev) => prev.map((i) => i._docId === docId ? { ...i, read: true } : i));
  };

  /* ── Waitlist handlers ──────────────────────────── */
  const handleRemoveWaitlist = async (docId: string) => {
    await removeWaitlistEntry(docId);
    setWaitlist((prev) => prev.filter((w) => w._docId !== docId));
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const unreadCount = inquiries.filter((i) => !i.read).length;

  const categoryCount: Record<string, number> = {};
  products.forEach((p) => { categoryCount[p.category] = (categoryCount[p.category] ?? 0) + 1; });

  const formatDate = (ts: { seconds: number } | null) => {
    if (!ts) return '—';
    return new Date(ts.seconds * 1000).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

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
              onClick={() => { setEditProduct(undefined); setShowForm(true); }}
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          {([
            { id: 'products' as Tab, label: 'Products', icon: Package },
            { id: 'inquiries' as Tab, label: 'Inquiries', icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : null },
            { id: 'waitlist' as Tab, label: 'Waitlist', icon: Bell, badge: waitlist.length > 0 ? waitlist.length : null },
          ]).map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                tab === id
                  ? 'border-brand text-brand-lighter'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={15} />
              {label}
              {badge !== null && badge !== undefined && (
                <span className="bg-brand text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS TAB ──────────────────────────────── */}
        {tab === 'products' && (
          <>
            {products.length === 0 && !loadingProducts && (
              <div className="mb-6 p-5 bg-brand/10 border border-brand/25 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-white font-bold text-sm mb-1">🚀 First time setup</p>
                  <p className="text-gray-400 text-xs">Database is empty. Import your existing products to get started.</p>
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
                <p className="text-emerald-400 text-sm font-semibold">✅ Products imported! You can now edit them.</p>
              </div>
            )}

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
              <button onClick={loadProducts} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer" title="Refresh">
                <RefreshCw size={15} />
              </button>
            </div>

            {loadingProducts ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-brand" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">📦</p>
                <p className="text-gray-400 font-medium">
                  {search ? 'No products match your search.' : 'No products yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((p) => (
                  <div key={p._docId} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4 hover:border-gray-700 transition-all">
                    <img src={p.thumbnail} alt={p.name} className="w-16 h-16 rounded-xl object-cover bg-gray-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-white font-bold text-sm truncate">{p.name}</p>
                        {p.badge && (
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded-full text-white ${p.badge === 'New' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                            {p.badge}
                          </span>
                        )}
                        {p.stockStatus === 'low_stock' && (
                          <span className="px-2 py-0.5 text-[10px] font-black rounded-full text-white bg-orange-500">Low Stock</span>
                        )}
                        {p.stockStatus === 'out_of_stock' && (
                          <span className="px-2 py-0.5 text-[10px] font-black rounded-full text-white bg-gray-600">Out of Stock</span>
                        )}
                      </div>
                      <p className="text-brand-lighter text-xs font-semibold capitalize">{categoryLabels[p.category]}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{p.images.length} photo{p.images.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => { setEditProduct(p); setShowForm(true); }}
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
          </>
        )}

        {/* ── INQUIRIES TAB ─────────────────────────────── */}
        {tab === 'inquiries' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-400 text-sm">{inquiries.length} inquiry{inquiries.length !== 1 ? 'ies' : 'y'} total · {unreadCount} unread</p>
              <button onClick={loadInquiries} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer" title="Refresh">
                <RefreshCw size={15} />
              </button>
            </div>

            {loadingInquiries ? (
              <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-brand" /></div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-gray-400 font-medium">No inquiries yet.</p>
                <p className="text-gray-600 text-sm mt-1">When customers fill the contact form, they appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq._docId} className={`bg-gray-900 border rounded-2xl p-5 transition-all ${inq.read ? 'border-gray-800' : 'border-brand/30 bg-brand/5'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-white font-bold text-sm">{inq.name}</p>
                          {!inq.read && (
                            <span className="px-2 py-0.5 bg-brand text-white text-[10px] font-black rounded-full">NEW</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Phone size={12} className="text-green-400 shrink-0" />
                          <a href={`https://wa.me/${inq.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-400 text-sm font-semibold hover:underline">
                            {inq.phone}
                          </a>
                        </div>
                        {inq.interest && (
                          <p className="text-brand-lighter text-xs mb-1">
                            <span className="text-gray-500">Interested in:</span> {inq.interest}
                          </p>
                        )}
                        {inq.message && (
                          <p className="text-gray-400 text-sm leading-relaxed mt-2 bg-gray-800/50 rounded-xl p-3">{inq.message}</p>
                        )}
                        <p className="text-gray-600 text-xs mt-2">{formatDate(inq.createdAt)}</p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(inq.name)}%2C%20this%20is%20BNT-GET%20SERVICE.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl hover:bg-[#20c05c] transition-all cursor-pointer"
                        >
                          Reply
                        </a>
                        {!inq.read && (
                          <button
                            onClick={() => handleMarkRead(inq._docId)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-400 text-xs font-semibold rounded-xl hover:text-white transition-all cursor-pointer"
                          >
                            <CheckCheck size={13} /> Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── WAITLIST TAB ──────────────────────────────── */}
        {tab === 'waitlist' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-400 text-sm">{waitlist.length} customer{waitlist.length !== 1 ? 's' : ''} waiting for restocks</p>
              <button onClick={loadWaitlist} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer" title="Refresh">
                <RefreshCw size={15} />
              </button>
            </div>

            {loadingWaitlist ? (
              <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-brand" /></div>
            ) : waitlist.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">🔔</p>
                <p className="text-gray-400 font-medium">No waitlist entries yet.</p>
                <p className="text-gray-600 text-sm mt-1">Customers who click "Notify Me" on out-of-stock products appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {waitlist.map((entry) => (
                  <div key={entry._docId} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand/15 border border-brand/20 rounded-xl flex items-center justify-center shrink-0">
                      <Bell size={18} className="text-brand-lighter" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{entry.productName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Phone size={11} className="text-green-400 shrink-0" />
                        <a href={`https://wa.me/${entry.phone.replace(/\D/g, '')}?text=Hi!%20The%20${encodeURIComponent(entry.productName)}%20is%20back%20in%20stock%20at%20BNT-GET%20SERVICE!`} target="_blank" rel="noopener noreferrer" className="text-green-400 text-sm font-semibold hover:underline">
                          {entry.phone}
                        </a>
                      </div>
                      <p className="text-gray-600 text-xs mt-0.5">{formatDate(entry.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/${entry.phone.replace(/\D/g, '')}?text=Hi!%20The%20${encodeURIComponent(entry.productName)}%20is%20back%20in%20stock%20at%20BNT-GET%20SERVICE!%20%F0%9F%8E%89`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl hover:bg-[#20c05c] transition-all"
                      >
                        Notify
                      </a>
                      <button
                        onClick={() => handleRemoveWaitlist(entry._docId)}
                        className="p-2 bg-gray-800 border border-gray-700 text-gray-500 hover:text-red-400 rounded-xl transition-all cursor-pointer"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {showForm && (
        <ProductForm
          product={editProduct}
          nextOrder={products.length}
          onClose={() => { setShowForm(false); setEditProduct(undefined); }}
          onSaved={loadProducts}
        />
      )}
    </div>
  );
}
