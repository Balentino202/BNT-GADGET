import { motion } from 'framer-motion';
import { Smartphone, Laptop, Tablet, Watch, CheckCircle2, MessageCircle } from 'lucide-react';
import { services } from '../data/services';
import { WHATSAPP_LINK } from '../data/products';

const icons = [Smartphone, Laptop, Tablet, Watch];

const cardColors = [
  { border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: 'bg-blue-600', num: 'text-blue-100' },
  { border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: 'bg-purple-600', num: 'text-purple-100' },
  { border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: 'bg-emerald-600', num: 'text-emerald-100' },
  { border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: 'bg-brand', num: 'text-orange-100' },
];

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Services() {
  return (
    <section id="services" className="py-24 bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-brand/20 border border-brand/30 text-brand-lighter text-xs font-bold uppercase tracking-widest rounded-full mb-5">
            Repair Services
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Expert Repairs for
            <br />
            <span className="text-brand">Every Device</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            Professional, fast and affordable repairs at No 8 Otigba Computer Village, Ikeja Lagos.
            Most repairs completed same day.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {services.map((svc, i) => {
            const Icon = icons[i];
            const color = cardColors[i];
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`group relative bg-gray-900 border ${color.border} rounded-2xl p-6 hover:border-opacity-60 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 overflow-hidden`}
              >
                {/* Big background number */}
                <span className={`absolute top-3 right-4 text-7xl font-black ${color.num} opacity-10 select-none leading-none`}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${color.icon}`}>
                  <Icon size={22} className="text-white" />
                </div>

                {/* Category badge */}
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide mb-3 ${color.badge}`}>
                  {svc.id.replace('-', ' ')}
                </span>

                <h3 className="font-bold text-white text-lg mb-1 leading-tight">{svc.title}</h3>
                <p className="text-gray-500 text-xs mb-5 leading-relaxed">{svc.subtitle}</p>

                <ul className="space-y-2">
                  {svc.repairs.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle2 size={14} className="text-brand-lighter flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-brand/20 to-brand-light/10 border border-brand/20 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-white font-bold text-xl mb-1">Device broken? We'll fix it today.</h3>
            <p className="text-gray-400 text-sm">Free diagnosis · No fix, no fee · Same-day repairs available</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20c05c] transition-all hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5"
            >
              <WhatsAppIcon />
              Book a Repair
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              <MessageCircle size={16} />
              Get a Quote
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
