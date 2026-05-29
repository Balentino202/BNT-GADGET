import { motion } from 'framer-motion';
import { BadgeCheck, Truck, Shield, Handshake, ArrowRight } from 'lucide-react';
import { WHATSAPP_LINK } from '../data/products';

const reasons = [
  {
    icon: Handshake,
    tag: 'Price Match',
    title: 'Best Prices in Nigeria',
    desc: "We beat any genuine competitor's price. Negotiable on bulk orders and repeat customers.",
    gradient: 'from-orange-400 to-brand',
    bg: 'bg-orange-50',
  },
  {
    icon: BadgeCheck,
    tag: '100% Authentic',
    title: 'Verified Original Products',
    desc: 'Every gadget is genuinely sourced, boxed & sealed. No clone, no refurbished — ever.',
    gradient: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50',
  },
  {
    icon: Shield,
    tag: 'Extended Coverage',
    title: '1-Year Warranty Included',
    desc: 'Full warranty on all new gadgets. Free repair and parts replacement within the warranty period.',
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: Truck,
    tag: 'Fast Shipping',
    title: 'Free Lagos Delivery',
    desc: 'Same-day delivery in Lagos. 24–48 hrs nationwide. We deliver to your doorstep — no stress.',
    gradient: 'from-purple-400 to-violet-500',
    bg: 'bg-purple-50',
  },
];

export default function WhyUs() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">

          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand text-xs font-bold uppercase tracking-widest rounded-full mb-5">
              Why Choose Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
              Nigeria's Most
              <br />
              <span className="text-brand">Trusted</span> Gadget
              <br />
              Store Since 2019
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
              We're not just another gadget store — we're your technology partner. Over 10,000 customers
              trust us for authentic products and expert repairs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#gadgets"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#gadgets')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-2xl hover:bg-brand-dark transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/30"
              >
                Shop Gadgets
                <ArrowRight size={16} />
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all hover:-translate-y-0.5"
              >
                Talk to Us
              </a>
            </div>

            {/* Metrics row */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 mt-10 pt-8 border-t border-gray-100">
              {[
                { value: '10K+', label: 'Happy Customers' },
                { value: '5K+', label: 'Devices Repaired' },
                { value: '7 Yrs', label: 'In Business' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-gray-900">{value}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Feature cards 2×2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map(({ icon: Icon, tag, title, desc, gradient, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-gray-200"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
                  <div className={`bg-gradient-to-br ${gradient} rounded-lg w-9 h-9 flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                  </div>
                </div>
                <p className="text-[11px] font-bold text-brand uppercase tracking-widest mb-1">{tag}</p>
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
