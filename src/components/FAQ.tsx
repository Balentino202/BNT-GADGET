import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { faqs } from '../data/faqs';
import { WHATSAPP_LINK } from '../data/products';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[360px_1fr] gap-12 xl:gap-20 items-start">

          {/* Left: sticky heading */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24"
          >
            <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand text-xs font-bold uppercase tracking-widest rounded-full mb-5">
              Got Questions?
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
              Frequently
              <br />
              Asked
              <br />
              <span className="text-brand">Questions</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              Can't find what you're looking for? Chat with us directly — we respond within 5 minutes.
            </p>

            <div className="space-y-3">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-5 py-3 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#20c05c] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/25 text-sm w-fit"
              >
                <WhatsAppIcon />
                Ask on WhatsApp
              </a>
              <a
                href="mailto:bntgetservice@gmail.com"
                className="flex items-center gap-2.5 px-5 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-brand hover:text-brand transition-all text-sm w-fit"
              >
                <MessageCircle size={16} />
                Send an Email
              </a>
            </div>

            {/* Quick stats */}
            <div className="mt-10 pt-8 border-t border-gray-100 space-y-4">
              {[
                { label: 'Response time', value: '< 5 mins' },
                { label: 'Repair turnaround', value: '1–3 hours' },
                { label: 'Delivery (Lagos)', value: 'Same day' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{label}</span>
                  <span className="text-gray-900 font-bold text-sm">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: accordion */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                  open === i
                    ? 'border-brand/30 shadow-md shadow-brand/5'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 cursor-pointer group"
                >
                  <span
                    className={`font-semibold text-sm sm:text-base leading-snug transition-colors ${
                      open === i ? 'text-brand' : 'text-gray-900 group-hover:text-brand'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      open === i ? 'bg-brand text-white' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
