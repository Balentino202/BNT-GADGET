import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/products';

const accepts = [
  { emoji: '📱', label: 'iPhones', sub: 'All models from iPhone 11+' },
  { emoji: '💻', label: 'MacBooks', sub: 'Air & Pro, Intel / M-chip' },
  { emoji: '🖥️', label: 'iPads', sub: 'All iPad generations' },
  { emoji: '🤖', label: 'Samsung', sub: 'Galaxy S & Note series' },
  { emoji: '🔵', label: 'Google Pixel', sub: 'Pixel 6 and above' },
  { emoji: '⌚', label: 'Apple Watch', sub: 'Series 6 and above' },
];

const steps = [
  { step: '01', title: 'Send Us Photos', desc: 'WhatsApp us clear photos of your device — front, back, and any damage.' },
  { step: '02', title: 'Get a Valuation', desc: 'We\'ll send you a fair market price within minutes. No obligation.' },
  { step: '03', title: 'Get Paid', desc: 'Agree on the price, bring the device, get paid on the spot or via transfer.' },
];

const conditions = [
  'Device powers on normally',
  'No major screen cracks',
  'Original or functional parts',
  'IMEI not blacklisted (for phones)',
];

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function WeAlsoBuy() {
  const waMsg = 'Hi BNT, I want to sell my device. Can you give me a valuation?';

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand text-xs font-bold uppercase tracking-widest rounded-full mb-5">
            Sell Your Device
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-5 leading-tight">
            We Also <span className="text-brand">Buy</span>
            <br />
            Your Used Devices
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            Upgrading your gadget? Don't let your old device collect dust. We offer the best
            trade-in prices in Lagos — instant valuation, same-day payment.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start mb-16">

          {/* Left: devices we buy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-gray-900 font-bold text-lg mb-5">Devices we buy:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {accepts.map(({ emoji, label, sub }) => (
                <div
                  key={label}
                  className="group bg-gray-50 border border-gray-100 hover:border-brand/30 hover:bg-brand-50 rounded-2xl p-4 transition-all duration-200"
                >
                  <span className="text-3xl mb-2 block">{emoji}</span>
                  <p className="font-bold text-gray-900 text-sm">{label}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-snug">{sub}</p>
                </div>
              ))}
            </div>

            {/* Condition requirements */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
              <p className="font-bold text-gray-900 text-sm mb-3">Basic condition requirements:</p>
              <ul className="space-y-2">
                {conditions.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={15} className="text-brand shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
              <p className="text-gray-400 text-xs mt-3">
                * Even damaged devices may be eligible — contact us to find out.
              </p>
            </div>
          </motion.div>

          {/* Right: process + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-gray-900 font-bold text-lg mb-6">How it works:</h3>
            <div className="space-y-4 mb-8">
              {steps.map(({ step, title, desc }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-2xl bg-brand text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-brand/30">
                    {step}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-0.5">{title}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA card */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <p className="text-white font-black text-xl mb-1">Ready to sell?</p>
              <p className="text-gray-400 text-sm mb-5">
                Get your free valuation in minutes — no commitment required.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20c05c] transition-all hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5"
              >
                <WhatsAppIcon />
                Get a Free Valuation
                <ArrowRight size={16} />
              </a>
              <p className="text-gray-600 text-xs text-center mt-3">
                We respond within 5 minutes · No obligation · Best prices guaranteed
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
