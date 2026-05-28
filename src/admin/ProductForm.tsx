import { useState, useRef, type ChangeEvent } from 'react';
import { X, Plus, Loader2, ImagePlus, Trash2, Star } from 'lucide-react';
import { addProduct, updateProduct, uploadImage, deleteImage } from '../firebase/products';
import type { FirestoreProduct } from '../firebase/products';
import type { Product, ProductCategory, StockStatus } from '../types';
import { categoryLabels } from '../data/products';

const CATEGORIES: ProductCategory[] = ['iphone', 'android', 'macbook', 'ipad', 'watch', 'gaming', 'accessories'];

interface PriceOption { storage: string; price: string; }
interface PriceModel { modelName: string; options: PriceOption[]; }

function htmlToPriceModels(html: string): PriceModel[] {
  if (!html) return [{ modelName: '', options: [{ storage: '', price: '' }] }];
  const parts = html.split('<br/><br/>');
  return parts.map((part) => {
    const lines = part.split('<br/>').filter(Boolean);
    if (!lines[0]?.startsWith('•')) {
      const modelName = lines[0] ?? '';
      const options = lines.slice(1).map((l) => {
        const m = l.match(/^•\s*(.+?)\s*–\s*(.+)$/);
        return m ? { storage: m[1], price: m[2] } : null;
      }).filter(Boolean) as PriceOption[];
      return { modelName, options: options.length ? options : [{ storage: '', price: '' }] };
    }
    const options = lines.map((l) => {
      const m = l.match(/^•\s*(.+?)\s*–\s*(.+)$/);
      return m ? { storage: m[1], price: m[2] } : null;
    }).filter(Boolean) as PriceOption[];
    return { modelName: '', options: options.length ? options : [{ storage: '', price: '' }] };
  });
}

function priceModelsToHtml(models: PriceModel[]): string {
  return models
    .map((m, idx) => {
      const opts = m.options
        .filter((o) => o.storage || o.price)
        .map((o) => o.storage ? `• ${o.storage} – ${o.price}` : `• ${o.price}`)
        .join('<br/>');
      const block = m.modelName ? `${m.modelName}<br/>${opts}` : opts;
      return idx > 0 ? `<br/><br/>${block}` : block;
    })
    .join('');
}

interface Props {
  product?: FirestoreProduct;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductForm({ product, nextOrder, onClose, onSaved }: Props) {
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? '');
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? 'iphone');
  const [badge, setBadge] = useState(product?.badge ?? '');
  const [stockStatus, setStockStatus] = useState<StockStatus>(product?.stockStatus ?? 'in_stock');
  const [description, setDescription] = useState(product?.description ?? '');
  const [features, setFeatures] = useState<string[]>(product?.features ?? ['']);
  const [priceModels, setPriceModels] = useState<PriceModel[]>(
    htmlToPriceModels(product?.currentPrice ?? ''),
  );
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [thumbnail, setThumbnail] = useState(product?.thumbnail ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Image upload ──────────────────────────────────── */
  const handleImageFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const tempId = product?._docId ?? `new_${Date.now()}`;
      const urls = await Promise.all(files.map((f) => uploadImage(f, tempId)));
      setImages((prev) => {
        const next = [...prev, ...urls];
        if (!thumbnail) setThumbnail(next[0]);
        return next;
      });
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? String(err);
      setError(`Image upload failed: ${msg}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = async (url: string) => {
    await deleteImage(url);
    setImages((prev) => prev.filter((u) => u !== url));
    if (thumbnail === url) setThumbnail(images.find((u) => u !== url) ?? '');
  };

  const addImageUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith('http')) { setError('Please enter a valid image URL starting with http'); return; }
    setImages((prev) => {
      const next = [...prev, url];
      if (!thumbnail) setThumbnail(next[0]);
      return next;
    });
    setUrlInput('');
    setError('');
  };

  /* ── Price helpers ─────────────────────────────────── */
  const addPriceModel = () =>
    setPriceModels((p) => [...p, { modelName: '', options: [{ storage: '', price: '' }] }]);

  const removePriceModel = (mi: number) =>
    setPriceModels((p) => p.filter((_, i) => i !== mi));

  const setPriceModelName = (mi: number, v: string) =>
    setPriceModels((p) => p.map((m, i) => (i === mi ? { ...m, modelName: v } : m)));

  const addPriceOption = (mi: number) =>
    setPriceModels((p) =>
      p.map((m, i) => (i === mi ? { ...m, options: [...m.options, { storage: '', price: '' }] } : m)),
    );

  const removePriceOption = (mi: number, oi: number) =>
    setPriceModels((p) =>
      p.map((m, i) =>
        i === mi ? { ...m, options: m.options.filter((_, j) => j !== oi) } : m,
      ),
    );

  const setPriceOption = (mi: number, oi: number, field: keyof PriceOption, val: string) =>
    setPriceModels((p) =>
      p.map((m, i) =>
        i === mi
          ? { ...m, options: m.options.map((o, j) => (j === oi ? { ...o, [field]: val } : o)) }
          : m,
      ),
    );

  /* ── Feature helpers ───────────────────────────────── */
  const setFeature = (i: number, v: string) =>
    setFeatures((f) => f.map((x, j) => (j === i ? v : x)));

  const removeFeature = (i: number) =>
    setFeatures((f) => f.filter((_, j) => j !== i));

  /* ── Save ──────────────────────────────────────────── */
  const handleSave = async () => {
    if (!name.trim()) return setError('Product name is required.');
    if (!images.length) return setError('Upload at least one image.');
    if (!thumbnail) return setError('Select a thumbnail image.');
    setError('');
    setSaving(true);

    const data: Omit<Product, 'id'> = {
      name: name.trim(),
      category,
      badge: badge || undefined,
      stockStatus,
      description: description.trim(),
      currentPrice: priceModelsToHtml(priceModels),
      features: features.filter(Boolean),
      thumbnail,
      images,
    };

    try {
      if (isEdit) {
        await updateProduct(product._docId, data);
      } else {
        await addProduct(data, nextOrder);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? String(err);
      setError(`Save failed: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-800">
          <h2 className="text-white font-black text-xl">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
            <X size={22} />
          </button>
        </div>

        <div className="p-7 space-y-7">

          {/* Name + Category + Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="admin-label">Product Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. iPhone 17 Pro & 17 Pro Max"
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)} className="admin-input">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{categoryLabels[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Badge (optional)</label>
              <select value={badge} onChange={(e) => setBadge(e.target.value)} className="admin-input">
                <option value="">No badge</option>
                <option value="New">🟢 New</option>
                <option value="Hot">🔴 Hot</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Stock Status</label>
              <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value as StockStatus)} className="admin-input">
                <option value="in_stock">✅ In Stock</option>
                <option value="low_stock">⚠️ Low Stock (Only a Few Left)</option>
                <option value="out_of_stock">❌ Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="admin-label">Short Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Brand New iPhone 17 Pro — Boxed & Sealed!"
              className="admin-input"
            />
          </div>

          {/* Pricing */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="admin-label mb-0">Pricing</label>
              <button
                onClick={addPriceModel}
                className="flex items-center gap-1.5 text-xs text-brand font-semibold hover:text-brand-lighter transition-colors cursor-pointer"
              >
                <Plus size={13} /> Add Model Group
              </button>
            </div>

            <div className="space-y-4">
              {priceModels.map((model, mi) => (
                <div key={mi} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      value={model.modelName}
                      onChange={(e) => setPriceModelName(mi, e.target.value)}
                      placeholder="Model name (optional) e.g. iPhone 17 Pro Max"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand transition-all"
                    />
                    {priceModels.length > 1 && (
                      <button onClick={() => removePriceModel(mi)} className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {model.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input
                          value={opt.storage}
                          onChange={(e) => setPriceOption(mi, oi, 'storage', e.target.value)}
                          placeholder="Size / Variant (e.g. 256 GB)"
                          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 text-xs focus:outline-none focus:border-brand transition-all"
                        />
                        <input
                          value={opt.price}
                          onChange={(e) => setPriceOption(mi, oi, 'price', e.target.value)}
                          onBlur={(e) => {
                            const v = e.target.value.trim();
                            if (v && !v.startsWith('₦') && !v.startsWith('N')) {
                              setPriceOption(mi, oi, 'price', `₦${v}`);
                            }
                          }}
                          placeholder="Price (e.g. ₦2,100,000)"
                          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 text-xs focus:outline-none focus:border-brand transition-all"
                        />
                        {model.options.length > 1 && (
                          <button onClick={() => removePriceOption(mi, oi)} className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addPriceOption(mi)}
                    className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-brand transition-colors cursor-pointer"
                  >
                    <Plus size={12} /> Add size/option
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="admin-label mb-0">Key Features</label>
              {features.length < 4 && (
                <button
                  onClick={() => setFeatures((f) => [...f, ''])}
                  className="flex items-center gap-1.5 text-xs text-brand font-semibold hover:text-brand-lighter transition-colors cursor-pointer"
                >
                  <Plus size={13} /> Add Feature
                </button>
              )}
            </div>
            <div className="space-y-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={f}
                    onChange={(e) => setFeature(i, e.target.value)}
                    placeholder={`Feature ${i + 1} (e.g. Free Lagos Delivery)`}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand transition-all"
                  />
                  {features.length > 1 && (
                    <button onClick={() => removeFeature(i)} className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="admin-label">Product Images</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
              {images.map((url) => (
                <div key={url} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-800 border-2 border-transparent hover:border-brand transition-all">
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '';
                      e.currentTarget.parentElement!.style.border = '2px solid #ef4444';
                      e.currentTarget.insertAdjacentHTML('afterend', '<div class="absolute inset-0 flex items-center justify-center text-red-400 text-[9px] font-bold text-center p-1">❌ Wrong URL</div>');
                    }}
                  />
                  {/* Thumbnail badge */}
                  {thumbnail === url && (
                    <div className="absolute top-1 left-1 bg-brand text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <Star size={8} /> Main
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setThumbnail(url)}
                      title="Set as thumbnail"
                      className="w-7 h-7 bg-brand rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-dark transition-colors"
                    >
                      <Star size={12} className="text-white" />
                    </button>
                    <button
                      onClick={() => removeImage(url)}
                      title="Delete image"
                      className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={12} className="text-white" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Upload button */}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-700 hover:border-brand text-gray-600 hover:text-brand flex flex-col items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50"
              >
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
                <span className="text-[10px] font-medium">{uploading ? 'Uploading…' : 'Upload'}</span>
              </button>
            </div>
            <p className="text-gray-600 text-xs mb-3">
              ⭐ Hover an image and click the star to set it as the main card image
            </p>

            {/* Paste URL option */}
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                placeholder="Paste a direct image URL — must end in .jpg / .png / .webp"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand transition-all"
              />
              <button
                type="button"
                onClick={addImageUrl}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shrink-0"
              >
                Add URL
              </button>
            </div>
            <div className="mt-2 p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-[11px] text-gray-400 space-y-1">
              <p className="font-semibold text-gray-300">How to get the correct link from imgbb.com:</p>
              <p>1. Go to <span className="text-brand-lighter">imgbb.com</span> and upload your product photo</p>
              <p>2. After upload, look for <span className="text-white font-semibold">"Direct link"</span> (NOT "Viewer link" or "Image link")</p>
              <p>3. The link must look like: <span className="text-green-400">https://i.ibb.co/xxxxx/photo.jpg</span></p>
              <p>4. If you see <span className="text-red-400">ibb.co/xxxxx</span> (without the <strong>i.</strong>), that is the wrong link — keep looking for "Direct link"</p>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFiles}
              className="hidden"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-800 border border-gray-700 text-gray-300 font-semibold rounded-2xl hover:bg-gray-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand text-white font-bold rounded-2xl hover:bg-brand-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
