import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Images, ChevronDown, Loader2 } from 'lucide-react';
import { categoryLabels, WHATSAPP_NUMBER } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import type { ProductCategory } from '../types';
import Lightbox from './Lightbox';

const CATEGORIES: ProductCategory[] = ['all', 'iphone', 'android', 'macbook', 'ipad', 'watch', 'gaming', 'accessories'];
const PAGE_SIZE = 8;

const categoryIcons: Record<string, string> = {
  all: '🛍️',
  iphone: '📱',
  android: '🤖',
  macbook: '💻',
  ipad: '🖥️',
  watch: '⌚',
  gaming: '🎮',
  accessories: '🎧',
};

const badgeStyle: Record<string, string> = {
  New: 'bg-emerald-500',
  Hot: 'bg-red-500',
};

/** Extract the first ₦ price from an HTML string for a "From ₦X" label */
function extractFromPrice(html: string): string {
  const match = html.match(/₦([\d,]+)/);
  return match ? `₦${match[1]}` : '';
}

const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Products() {
  const { products, loading } = useProducts();
  const [category, setCategory] = useState<ProductCategory>('all');
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number; title: string } | null>(null);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchesCat = category === 'all' || p.category === category;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
      }),
    [category, search],
  );

  const visibleProducts = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const waLink = (name: string) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20BNT%2C%20I'm%20interested%20in%20the%20${encodeURIComponent(name)}%20from%20your%20website`;

  return (
    <section id="gadgets" className="py-24 bg-gray-50">
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 size={28} className="animate-spin text-brand" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Our Collection
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">
            Shop <span className="text-brand">Premium</span> Gadgets
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
            Authentic, brand-new gadgets — boxed & sealed. Best prices in Lagos with free delivery.
          </p>
        </motion.div>

        {/* Search + filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 space-y-5"
        >
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search gadgets — e.g. iPhone 17, MacBook..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setVisible(PAGE_SIZE);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all cursor-pointer border ${
                  category === cat
                    ? 'bg-brand text-white border-brand shadow-md shadow-brand/25'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand/50 hover:text-brand hover:bg-brand-50'
                }`}
              >
                <span>{categoryIcons[cat]}</span>
                {categoryLabels[cat]}
                {category === cat && filtered.length > 0 && (
                  <span className="ml-0.5 bg-white/25 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {filtered.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-500 text-lg font-medium">No gadgets found.</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search or category.</p>
            </motion.div>
          ) : (
            <motion.div
              key={`${category}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {visibleProducts.map((product, i) => {
                const fromPrice = extractFromPrice(product.currentPrice);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-brand/20 shadow-sm hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div
                      className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
                      onClick={() => setLightbox({ images: product.images, index: 0, title: product.name })}
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        loading={i < 4 ? 'eager' : 'lazy'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
                        <div className="bg-white text-gray-800 px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                          <Images size={13} />
                          View Photos
                        </div>
                      </div>

                      {/* Badge */}
                      {product.badge && (
                        <span
                          className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[11px] font-black text-white rounded-full uppercase tracking-wide ${badgeStyle[product.badge] ?? 'bg-brand'}`}
                        >
                          {product.badge}
                        </span>
                      )}

                      {/* Photo count */}
                      {product.images.length > 1 && (
                        <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/60 text-white text-[11px] font-medium rounded-lg backdrop-blur-sm">
                          <Images size={10} />
                          {product.images.length}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Category */}
                      <span className="text-[11px] font-bold text-brand uppercase tracking-widest mb-1">
                        {categoryIcons[product.category]} {categoryLabels[product.category]}
                      </span>

                      {/* Name */}
                      <h3 className="font-bold text-gray-900 text-sm leading-snug mb-3">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="mb-3">
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Starting from</p>
                        <p className="text-brand font-black text-xl leading-tight">{fromPrice}</p>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-4 flex-1">
                        {product.features.slice(0, 3).map((f) => (
                          <span
                            key={f}
                            className="px-2 py-0.5 bg-brand-50 text-brand text-[11px] rounded-md font-semibold"
                          >
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 mt-auto">
                        <a
                          href={waLink(product.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-white text-sm font-bold rounded-xl hover:bg-[#20c05c] transition-all hover:shadow-md hover:shadow-green-500/25 hover:-translate-y-0.5"
                        >
                          <WhatsAppIcon />
                          Order on WhatsApp
                        </a>
                        <button
                          onClick={() => setLightbox({ images: product.images, index: 0, title: product.name })}
                          className="w-full py-2 text-sm font-semibold text-brand border border-brand/30 rounded-xl hover:bg-brand-50 transition-all cursor-pointer"
                        >
                          See All Photos & Prices
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load more / ask for more */}
        {filtered.length > 0 && (
          <div className="text-center mt-12">
            {hasMore ? (
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-white font-bold rounded-2xl hover:bg-brand-dark transition-all hover:shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5 cursor-pointer"
              >
                Load More Gadgets
                <ChevronDown size={18} />
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-500 text-sm">
                  Showing all {filtered.length} gadget{filtered.length !== 1 ? 's' : ''}.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20BNT%2C%20I'm%20looking%20for%20a%20gadget%20not%20on%20your%20website`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-brand text-brand font-bold rounded-2xl hover:bg-brand hover:text-white transition-all hover:-translate-y-0.5"
                >
                  <WhatsAppIcon />
                  Ask for More Gadgets
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
