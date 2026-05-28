import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 7, suffix: '+', label: 'Years in Business', emoji: '🏆' },
  { value: 10000, suffix: '+', label: 'Happy Customers', emoji: '😊' },
  { value: 5000, suffix: '+', label: 'Devices Repaired', emoji: '🔧' },
  { value: 500, suffix: '+', label: 'Products Sold Monthly', emoji: '📦' },
];

function CountUp({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function Stats() {
  return (
    <section className="py-24 bg-brand relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-5">
            Our Track Record
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Trusted by Thousands
            <br />
            Across Nigeria
          </h2>
          <p className="text-white/70 text-base max-w-md mx-auto">
            Numbers that prove our commitment to quality, authenticity, and customer satisfaction.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map(({ value, suffix, label, emoji }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8 text-center hover:bg-white/15 transition-colors group"
            >
              <p className="text-3xl sm:text-4xl mb-3">{emoji}</p>
              <p className="text-3xl sm:text-5xl font-black text-white leading-none mb-2">
                <CountUp target={value} />
                {suffix}
              </p>
              <p className="text-white/65 text-xs sm:text-sm font-medium leading-snug">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
