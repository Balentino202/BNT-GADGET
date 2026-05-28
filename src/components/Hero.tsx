import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MessageCircle, Shield, Truck, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { WHATSAPP_LINK } from '../data/products';
import { useProducts } from '../context/ProductsContext';

const stats = [
  { value: '2019', label: 'Est. Year', icon: Star },
  { value: '5.0★', label: 'Rating', icon: Star },
  { value: 'Free', label: 'Lagos Delivery', icon: Truck },
  { value: '1-Yr', label: 'Warranty', icon: Shield },
];

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Hero() {
  const { products } = useProducts();
  const featured = products.slice(0, 5);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % featured.length), 3500);
    return () => clearInterval(t);
  }, []);

  const prev = () => setActive((i) => (i - 1 + featured.length) % featured.length);
  const next = () => setActive((i) => (i + 1) % featured.length);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/img/background.webp" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Glow accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand/15 rounded-full blur-3xl z-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-16">
          <div className="grid lg:grid-cols-[1fr_420px] gap-10 xl:gap-16 items-center">

            {/* ── Left: Copy ─────────────────────────────────── */}
            <div>
              {/* Badge row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap items-center gap-2 mb-7"
              >
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand/25 border border-brand/50 text-[#f59e0b] rounded-full text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-[#f59e0b] rounded-full animate-pulse" />
                  Nigeria's #1 Gadget Store
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 border border-white/20 text-white/90 rounded-full text-xs font-medium">
                  ★★★★★ 5.0 Rated
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="text-[clamp(2.6rem,6vw,4.5rem)] font-black text-white leading-[1.05] tracking-tight mb-6"
              >
                Premium Gadgets,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] via-brand-lighter to-brand">
                  Unbeatable
                </span>{' '}
                Prices.
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg mb-9"
              >
                Authentic iPhones, MacBooks, Samsung, iPads & more — boxed &amp; sealed.
                Expert repairs at Otigba Computer Village, Ikeja Lagos.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 mb-10"
              >
                <a
                  href="#gadgets"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#gadgets')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand text-white font-bold rounded-2xl text-base hover:bg-brand-dark transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/40"
                >
                  <ShoppingBag size={20} />
                  Shop Gadgets
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#25D366] text-white font-bold rounded-2xl text-base hover:bg-[#20c05c] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/30"
                >
                  <WhatsAppIcon />
                  WhatsApp Us
                </a>
                <a
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl text-base border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-0.5 backdrop-blur-sm"
                >
                  <MessageCircle size={18} />
                  Repairs
                </a>
              </motion.div>

              {/* Trust markers */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-wrap gap-x-5 gap-y-2"
              >
                {['✅ 100% Authentic', '🚚 Free Lagos Delivery', '🛡️ 1-Year Warranty', '🔧 Expert Repairs'].map((t) => (
                  <span key={t} className="text-gray-400 text-sm font-medium">
                    {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* ── Right: Product showcase ─────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Card */}
                <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-black/20">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={active}
                        src={featured[active].thumbnail}
                        alt={featured[active].name}
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.45 }}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    {/* Nav arrows */}
                    <button
                      onClick={prev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>

                    {/* Badge */}
                    {featured[active].badge && (
                      <span className={`absolute top-3 left-3 px-2.5 py-0.5 text-xs font-bold text-white rounded-full ${featured[active].badge === 'New' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {featured[active].badge}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-brand-lighter text-[11px] font-bold uppercase tracking-widest mb-1">
                          {featured[active].category}
                        </p>
                        <h3 className="text-white font-bold text-base leading-snug mb-1">
                          {featured[active].name}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {featured[active].description}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* Dots */}
                    <div className="flex items-center gap-1.5 mt-4">
                      {featured.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActive(i)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            i === active ? 'bg-brand w-6' : 'bg-white/25 w-1.5 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating hot deals badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-br from-brand to-brand-dark text-white px-4 py-1.5 rounded-2xl shadow-lg font-bold text-sm rotate-3">
                  🔥 Hot Deals
                </div>

                {/* Floating rating */}
                <div className="absolute -bottom-4 -left-4 bg-white text-gray-800 px-4 py-2.5 rounded-2xl shadow-xl font-semibold text-sm flex items-center gap-2 -rotate-2">
                  <span className="text-yellow-400 text-base">★★★★★</span>
                  <span>5.0 Rating</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="relative z-10 bg-black/50 backdrop-blur-xl border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map(({ value, label }, i) => (
              <div
                key={label}
                className={`py-5 px-6 text-center ${i < stats.length - 1 ? 'border-r border-white/10' : ''}`}
              >
                <p className="text-white font-black text-2xl sm:text-3xl mb-0.5">{value}</p>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
