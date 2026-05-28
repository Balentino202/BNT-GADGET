import { motion } from 'framer-motion';
import { testimonials } from '../data/testimonials';

const avatarColors = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-brand to-brand-dark',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-600',
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand text-xs font-bold uppercase tracking-widest rounded-full mb-5">
            Customer Reviews
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-5 leading-tight">
            What Our{' '}
            <span className="text-brand">Customers</span> Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <span className="text-gray-900 font-bold text-lg">5.0</span>
            <span className="text-gray-400 text-sm">· 10,000+ happy customers</span>
          </div>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Don't just take our word for it — real reviews from real customers across Nigeria.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.35) }}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/8 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Large quote mark */}
              <span className="absolute top-5 right-6 text-6xl font-black text-gray-100 leading-none select-none group-hover:text-brand/10 transition-colors">
                "
              </span>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-yellow-400 text-base">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6 relative z-10">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-sm`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{t.author}</p>
                  <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                    <span>📍</span> {t.location}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-bold text-brand bg-brand-50 px-2 py-0.5 rounded-full">Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-400 text-sm mt-10"
        >
          ✅ All reviews are from real customers. We never fake testimonials.
        </motion.p>
      </div>
    </section>
  );
}
