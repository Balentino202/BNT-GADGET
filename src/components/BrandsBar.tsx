import { motion } from 'framer-motion';

const brands = [
  { name: 'Apple', emoji: '🍎', color: '#555' },
  { name: 'Samsung', emoji: '📱', color: '#1428A0' },
  { name: 'Google', emoji: '🔵', color: '#4285F4' },
  { name: 'Sony', emoji: '🎮', color: '#003087' },
  { name: 'PlayStation', emoji: '🕹️', color: '#003791' },
  { name: 'MacBook', emoji: '💻', color: '#555' },
  { name: 'AirPods', emoji: '🎧', color: '#555' },
  { name: 'iPad', emoji: '🖥️', color: '#555' },
];

const BrandChip = ({ name, emoji }: { name: string; emoji: string }) => (
  <div className="flex items-center gap-2.5 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm mx-3 select-none">
    <span className="text-xl">{emoji}</span>
    <span className="font-bold text-gray-700 text-sm whitespace-nowrap">{name}</span>
  </div>
);

export default function BrandsBar() {
  const doubled = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="py-10 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6"
      >
        Authentic products from the world's top brands
      </motion.p>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        <div
          className="flex items-center"
          style={{
            width: 'max-content',
            animation: 'marquee 28s linear infinite',
          }}
        >
          {doubled.map((b, i) => (
            <BrandChip key={i} name={b.name} emoji={b.emoji} />
          ))}
        </div>
      </div>
    </section>
  );
}
