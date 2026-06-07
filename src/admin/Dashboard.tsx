import { useState, useEffect, useMemo, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { fetchProducts, deleteProduct, seedProducts, updateProduct, setProductOrder, type FirestoreProduct } from '../firebase/products';
import { subscribeToInquiries, markInquiryRead, setInquiryResponded, deleteInquiry, type Inquiry } from '../firebase/inquiries';
import { subscribeToWaitlist, removeWaitlistEntry, type WaitlistEntry } from '../firebase/waitlist';
import { products as staticProducts, categoryLabels } from '../data/products';
import type { ProductCategory, StockStatus } from '../types';
import ProductForm from './ProductForm';
import {
  Plus, LogOut, Pencil, Trash2, Loader2, Package,
  RefreshCw, Upload, Search, MessageSquare, Bell,
  CheckCheck, Phone, X, ArrowUp, ArrowDown, Download,
  AlertTriangle, Wrench, Copy, Check, Eye, EyeOff,
} from 'lucide-react';

type Tab = 'products' | 'inquiries' | 'waitlist';
type StockFilter = 'all' | StockStatus;
type InquiryFilter = 'all' | 'unread' | 'repair' | 'general';

const STOCK_OPTS: { value: StockStatus; label: string }[] = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];

const CATEGORIES: ProductCategory[] = ['iphone', 'android', 'macbook', 'ipad', 'watch', 'gaming', 'accessories'];

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('products');

  /* ── Products state ─────────────────────────────── */
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<ProductCategory | 'all'>('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<FirestoreProduct | undefined>();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  /* ── Inquiries state ────────────────────────────── */
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [inqFilter, setInqFilter] = useState<InquiryFilter>('all');

  /* ── Waitlist state ─────────────────────────────── */
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loadingWaitlist, setLoadingWaitlist] = useState(true);
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);

  /* ── Live "new lead" toast ──────────────────────── */
  const [toast, setToast] = useState<string | null>(null);
  const seenInquiryIds = useRef<Set<string> | null>(null);

  /* ── Load functions ─────────────────────────────── */
  const loadProducts = async () => {
    setLoadingProducts(true);
    setProducts(await fetchProducts());
    setLoadingProducts(false);
  };

  // Short chime when a new lead arrives (no asset needed)
  const beep = () => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.42);
      osc.onended = () => ctx.close();
    } catch { /* audio unavailable — ignore */ }
  };

  // Products: one-time fetch (+ manual refresh). Inquiries & waitlist: live.
  useEffect(() => {
    loadProducts();
    const unsubInq = subscribeToInquiries((list) => {
      if (seenInquiryIds.current === null) {
        // first snapshot — establish baseline, don't alert for existing messages
        seenInquiryIds.current = new Set(list.map((i) => i._docId));
      } else {
        const fresh = list.filter((i) => !seenInquiryIds.current!.has(i._docId));
        fresh.forEach((i) => seenInquiryIds.current!.add(i._docId));
        if (fresh.length > 0) {
          const f = fresh[0];
          setToast(fresh.length === 1
            ? `🔔 New ${f.type === 'repair' ? 'repair request' : 'inquiry'} from ${f.name}`
            : `🔔 ${fresh.length} new inquiries just came in`);
          beep();
        }
      }
      setInquiries(list);
      setLoadingInquiries(false);
    });
    const unsubWait = subscribeToWaitlist((list) => {
      setWaitlist(list);
      setLoadingWaitlist(false);
    });
    return () => { unsubInq(); unsubWait(); };
  }, []);

  // Auto-dismiss the toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

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

  const handleStockChange = async (p: FirestoreProduct, status: StockStatus) => {
    setProducts((prev) => prev.map((x) => (x._docId === p._docId ? { ...x, stockStatus: status } : x)));
    await updateProduct(p._docId, { stockStatus: status });
  };

  const handleTogglePublish = async (p: FirestoreProduct) => {
    const newPublished = !(p.published !== false); // visible → hide, hidden → show
    setProducts((prev) => prev.map((x) => (x._docId === p._docId ? { ...x, published: newPublished } : x)));
    await updateProduct(p._docId, { published: newPublished });
  };

  // Display order mirrors the live site (highest `order` first)
  const orderedProducts = useMemo(
    () => [...products].sort((a, b) => b.order - a.order),
    [products],
  );

  const canReorder = !search && catFilter === 'all' && stockFilter === 'all';

  const handleMove = async (docId: string, dir: 'up' | 'down') => {
    const idx = orderedProducts.findIndex((p) => p._docId === docId);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= orderedProducts.length) return;
    const a = orderedProducts[idx];
    const b = orderedProducts[swapIdx];
    setMoving(docId);
    setProducts((prev) => prev.map((p) => {
      if (p._docId === a._docId) return { ...p, order: b.order };
      if (p._docId === b._docId) return { ...p, order: a.order };
      return p;
    }));
    await Promise.all([setProductOrder(a._docId, b.order), setProductOrder(b._docId, a.order)]);
    setMoving(null);
  };

  const handleExport = () => {
    const data = products.map(({ _docId, order, ...rest }) => ({ order, ...rest }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bnt-products-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Inquiry handlers ───────────────────────────── */
  const handleMarkRead = async (docId: string) => {
    setInquiries((prev) => prev.map((i) => (i._docId === docId ? { ...i, read: true } : i)));
    await markInquiryRead(docId);
  };
  const handleToggleResponded = async (inq: Inquiry) => {
    const next = !inq.responded;
    setInquiries((prev) => prev.map((i) => (i._docId === inq._docId ? { ...i, responded: next, read: true } : i)));
    await setInquiryResponded(inq._docId, next);
  };
  const handleDeleteInquiry = async (docId: string) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    setInquiries((prev) => prev.filter((i) => i._docId !== docId));
    await deleteInquiry(docId);
  };

  /* ── Waitlist handlers ──────────────────────────── */
  const handleRemoveWaitlist = async (docId: string) => {
    setWaitlist((prev) => prev.filter((w) => w._docId !== docId));
    await removeWaitlistEntry(docId);
  };
  const copyNumbers = (productId: string, entries: WaitlistEntry[]) => {
    navigator.clipboard?.writeText(entries.map((e) => e.phone).join('\n'));
    setCopiedGroup(productId);
    setTimeout(() => setCopiedGroup((g) => (g === productId ? null : g)), 1800);
  };

  /* ── Derived data ───────────────────────────────── */
  const displayedProducts = orderedProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === 'all' || p.category === catFilter;
    const status = p.stockStatus ?? 'in_stock';
    const matchesStock = stockFilter === 'all' || status === stockFilter;
    return matchesSearch && matchesCat && matchesStock;
  });

  const unreadCount = inquiries.filter((i) => !i.read).length;
  const outOfStockCount = products.filter((p) => p.stockStatus === 'out_of_stock').length;

  const displayedInquiries = inquiries.filter((i) => {
    if (inqFilter === 'unread') return !i.read;
    if (inqFilter === 'repair') return i.type === 'repair';
    if (inqFilter === 'general') return (i.type ?? 'general') === 'general';
    return true;
  });

  const waitlistGroups = useMemo(() => {
    const map = new Map<string, { productId: string; productName: string; entries: WaitlistEntry[] }>();
    waitlist.forEach((e) => {
      const g = map.get(e.productId) ?? { productId: e.productId, productName: e.productName, entries: [] };
      g.entries.push(e);
      map.set(e.productId, g);
    });
    return [...map.values()].sort((a, b) => b.entries.length - a.entries.length);
  }, [waitlist]);

  const formatDate = (ts: { seconds: number } | null) => {
    if (!ts) return '—';
    return new Date(ts.seconds * 1000).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Live new-lead toast */}
      {toast && (
        <button
          onClick={() => { setTab('inquiries'); setInqFilter('unread'); setToast(null); }}
          className="fixed top-4 right-4 z-50 flex items-center gap-3 max-w-[90vw] sm:max-w-sm px-4 py-3 bg-brand text-white rounded-2xl shadow-2xl shadow-brand/40 cursor-pointer text-left"
        >
          <span className="text-sm font-bold leading-snug">{toast}</span>
          <span className="text-white/80 text-xs font-semibold whitespace-nowrap">View →</span>
        </button>
      )}

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

        {/* Stats row — business pulse */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Products', value: products.length, icon: Package, color: 'text-brand', tab: 'products' as Tab },
            { label: 'Out of Stock', value: outOfStockCount, icon: AlertTriangle, color: outOfStockCount > 0 ? 'text-orange-400' : 'text-gray-500', tab: 'products' as Tab, onClick: () => { setTab('products'); setStockFilter('out_of_stock'); } },
            { label: 'Unread Inquiries', value: unreadCount, icon: MessageSquare, color: unreadCount > 0 ? 'text-emerald-400' : 'text-gray-500', tab: 'inquiries' as Tab, onClick: () => { setTab('inquiries'); setInqFilter('unread'); } },
            { label: 'On Waitlist', value: waitlist.length, icon: Bell, color: waitlist.length > 0 ? 'text-blue-400' : 'text-gray-500', tab: 'waitlist' as Tab, onClick: () => setTab('waitlist') },
          ].map(({ label, value, icon: Icon, color, onClick }) => (
            <button
              key={label}
              onClick={onClick ?? (() => {})}
              className="text-left bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all cursor-pointer"
            >
              <Icon size={18} className={`${color} mb-2`} />
              <p className="text-white font-black text-2xl">{value}</p>
              <p className="text-gray-500 text-xs font-medium">{label}</p>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 overflow-x-auto scrollbar-hide">
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

            {/* Toolbar: search + export + refresh */}
            <div className="flex items-center gap-3 mb-4">
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
              <button onClick={handleExport} className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-300 hover:text-white text-sm font-semibold transition-colors cursor-pointer" title="Export products as JSON backup">
                <Download size={15} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button onClick={loadProducts} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer" title="Refresh">
                <RefreshCw size={15} />
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value as ProductCategory | 'all')}
                className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-gray-300 text-xs font-semibold focus:outline-none focus:border-brand cursor-pointer"
              >
                <option value="all">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{categoryLabels[c] ?? c}</option>
                ))}
              </select>
              {([{ value: 'all', label: 'All stock' }, ...STOCK_OPTS] as { value: StockFilter; label: string }[]).map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStockFilter(s.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    stockFilter === s.value
                      ? 'bg-brand border-brand text-white'
                      : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
              {!canReorder && (
                <span className="text-gray-600 text-xs ml-1">· Clear filters to reorder products</span>
              )}
            </div>

            {loadingProducts ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-brand" />
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">📦</p>
                <p className="text-gray-400 font-medium">
                  {search || catFilter !== 'all' || stockFilter !== 'all' ? 'No products match your filters.' : 'No products yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayedProducts.map((p, i) => {
                  const isVisible = p.published !== false;
                  return (
                  <div key={p._docId} className={`bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-wrap items-center gap-3 sm:gap-4 hover:border-gray-700 transition-all ${isVisible ? '' : 'opacity-60'}`}>
                    {/* Reorder controls */}
                    {canReorder && (
                      <div className="flex sm:flex-col gap-0.5 shrink-0">
                        <button
                          onClick={() => handleMove(p._docId, 'up')}
                          disabled={i === 0 || moving === p._docId}
                          className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 disabled:opacity-25 disabled:hover:bg-transparent transition-all cursor-pointer"
                          title="Move up (shows earlier on site)"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          onClick={() => handleMove(p._docId, 'down')}
                          disabled={i === displayedProducts.length - 1 || moving === p._docId}
                          className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 disabled:opacity-25 disabled:hover:bg-transparent transition-all cursor-pointer"
                          title="Move down (shows later on site)"
                        >
                          <ArrowDown size={15} />
                        </button>
                      </div>
                    )}
                    <img src={p.thumbnail} alt={p.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-gray-800 shrink-0" />
                    <div className="flex-1 min-w-[130px]">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-white font-bold text-sm truncate">{p.name}</p>
                        {p.badge && (
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded-full text-white ${p.badge === 'New' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                            {p.badge}
                          </span>
                        )}
                        {!isVisible && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded-full text-white bg-gray-600">
                            <EyeOff size={10} /> Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-brand-lighter text-xs font-semibold capitalize">{categoryLabels[p.category]}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{p.images.length} photo{p.images.length !== 1 ? 's' : ''}</p>
                    </div>
                    {/* Actions cluster — wraps to its own row on mobile */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                      <select
                        value={p.stockStatus ?? 'in_stock'}
                        onChange={(e) => handleStockChange(p, e.target.value as StockStatus)}
                        className={`shrink-0 text-xs font-bold rounded-xl px-3 py-2 border cursor-pointer focus:outline-none transition-all ${
                          (p.stockStatus ?? 'in_stock') === 'out_of_stock'
                            ? 'bg-gray-700/40 border-gray-600 text-gray-300'
                            : (p.stockStatus === 'low_stock'
                              ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300')
                        }`}
                        title="Change stock status"
                      >
                        {STOCK_OPTS.map((s) => (
                          <option key={s.value} value={s.value} className="bg-gray-900 text-white">{s.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isVisible
                            ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        }`}
                        title={isVisible ? 'Hide from site' : 'Show on site'}
                      >
                        {isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        onClick={() => { setEditProduct(p); setShowForm(true); }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-brand text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      >
                        <Pencil size={13} /> <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        disabled={deleting === p._docId}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        {deleting === p._docId ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── INQUIRIES TAB ─────────────────────────────── */}
        {tab === 'inquiries' && (
          <>
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {([
                  { value: 'all' as InquiryFilter, label: 'All' },
                  { value: 'unread' as InquiryFilter, label: `Unread${unreadCount ? ` (${unreadCount})` : ''}` },
                  { value: 'repair' as InquiryFilter, label: 'Repairs' },
                  { value: 'general' as InquiryFilter, label: 'General' },
                ]).map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setInqFilter(f.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      inqFilter === f.value
                        ? 'bg-brand border-brand text-white'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-400" title="Updates in real time">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>

            {loadingInquiries ? (
              <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-brand" /></div>
            ) : displayedInquiries.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-gray-400 font-medium">{inqFilter === 'all' ? 'No inquiries yet.' : 'No messages match this filter.'}</p>
                <p className="text-gray-600 text-sm mt-1">When customers fill the contact or repair form, they appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayedInquiries.map((inq) => {
                  const isRepair = inq.type === 'repair';
                  return (
                    <div key={inq._docId} className={`bg-gray-900 border rounded-2xl p-5 transition-all ${inq.read ? 'border-gray-800' : 'border-brand/30 bg-brand/5'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="text-white font-bold text-sm">{inq.name}</p>
                            {!inq.read && (
                              <span className="px-2 py-0.5 bg-brand text-white text-[10px] font-black rounded-full">NEW</span>
                            )}
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${isRepair ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-700/50 text-gray-300'}`}>
                              {isRepair ? <Wrench size={10} /> : <MessageSquare size={10} />}
                              {isRepair ? 'Repair' : 'General'}
                            </span>
                            {inq.responded && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 text-emerald-300 text-[10px] font-bold rounded-full">
                                <CheckCheck size={10} /> Responded
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Phone size={12} className="text-green-400 shrink-0" />
                            <a href={`https://wa.me/${inq.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-400 text-sm font-semibold hover:underline">
                              {inq.phone}
                            </a>
                          </div>
                          {isRepair && (inq.device || inq.issue) && (
                            <div className="flex flex-wrap gap-1.5 mb-1">
                              {inq.device && <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-lg">{inq.device}</span>}
                              {inq.issue && <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-lg">{inq.issue}</span>}
                            </div>
                          )}
                          {inq.interest && !isRepair && (
                            <p className="text-brand-lighter text-xs mb-1">
                              <span className="text-gray-500">Interested in:</span> {inq.interest}
                            </p>
                          )}
                          {inq.message && (
                            <p className="text-gray-400 text-sm leading-relaxed mt-2 bg-gray-800/50 rounded-xl p-3">{inq.message}</p>
                          )}
                          <p className="text-gray-600 text-xs mt-2">{formatDate(inq.createdAt)}</p>
                        </div>
                        <div className="flex flex-row flex-wrap sm:flex-col gap-2 shrink-0">
                          <a
                            href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(inq.name)}%2C%20this%20is%20BNT-GET%20SERVICE.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl hover:bg-[#20c05c] transition-all cursor-pointer"
                          >
                            Reply
                          </a>
                          <button
                            onClick={() => handleToggleResponded(inq)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer border ${
                              inq.responded
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                            }`}
                            title="Toggle responded"
                          >
                            <CheckCheck size={13} /> {inq.responded ? 'Done' : 'Mark done'}
                          </button>
                          {!inq.read && !inq.responded && (
                            <button
                              onClick={() => handleMarkRead(inq._docId)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-400 text-xs font-semibold rounded-xl hover:text-white transition-all cursor-pointer"
                            >
                              Read
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteInquiry(inq._docId)}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                            title="Delete message"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── WAITLIST TAB ──────────────────────────────── */}
        {tab === 'waitlist' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-400 text-sm">{waitlist.length} request{waitlist.length !== 1 ? 's' : ''} across {waitlistGroups.length} product{waitlistGroups.length !== 1 ? 's' : ''}</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-400" title="Updates in real time">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>

            {loadingWaitlist ? (
              <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-brand" /></div>
            ) : waitlistGroups.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">🔔</p>
                <p className="text-gray-400 font-medium">No waitlist entries yet.</p>
                <p className="text-gray-600 text-sm mt-1">Customers who click "Notify Me" on out-of-stock products appear here.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {waitlistGroups.map((group) => (
                  <div key={group.productId} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    {/* Group header — demand at a glance */}
                    <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-800 bg-gray-900/60">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-brand/15 border border-brand/20 rounded-xl flex items-center justify-center shrink-0">
                          <Bell size={18} className="text-brand-lighter" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-bold text-sm truncate">{group.productName}</p>
                          <p className="text-brand-lighter text-xs font-semibold">{group.entries.length} {group.entries.length === 1 ? 'person' : 'people'} waiting</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyNumbers(group.productId, group.entries)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shrink-0"
                        title="Copy all numbers for a broadcast"
                      >
                        {copiedGroup === group.productId ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        {copiedGroup === group.productId ? 'Copied' : 'Copy numbers'}
                      </button>
                    </div>
                    {/* Members */}
                    <div className="divide-y divide-gray-800">
                      {group.entries.map((entry) => (
                        <div key={entry._docId} className="flex items-center gap-3 p-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Phone size={11} className="text-green-400 shrink-0" />
                              <a href={`https://wa.me/${entry.phone.replace(/\D/g, '')}?text=Hi!%20The%20${encodeURIComponent(entry.productName)}%20is%20back%20in%20stock%20at%20BNT-GET%20SERVICE!`} target="_blank" rel="noopener noreferrer" className="text-green-400 text-sm font-semibold hover:underline">
                                {entry.phone}
                              </a>
                            </div>
                            <p className="text-gray-600 text-xs mt-0.5">{formatDate(entry.createdAt)}</p>
                          </div>
                          <a
                            href={`https://wa.me/${entry.phone.replace(/\D/g, '')}?text=Hi!%20The%20${encodeURIComponent(entry.productName)}%20is%20back%20in%20stock%20at%20BNT-GET%20SERVICE!%20%F0%9F%8E%89`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl hover:bg-[#20c05c] transition-all shrink-0"
                          >
                            Notify
                          </a>
                          <button
                            onClick={() => handleRemoveWaitlist(entry._docId)}
                            className="p-2 bg-gray-800 border border-gray-700 text-gray-500 hover:text-red-400 rounded-xl transition-all cursor-pointer shrink-0"
                            title="Remove"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
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
