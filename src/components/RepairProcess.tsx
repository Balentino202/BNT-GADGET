import { motion } from 'framer-motion';
import { MessageCircle, ClipboardCheck, Wrench, CheckCircle } from 'lucide-react';
import { WHATSAPP_LINK } from '../data/products';

const steps = [
  {
    icon: MessageCircle,
    step: '01',
    title: 'Contact Us',
    desc: 'Reach out via WhatsApp and describe your device issue. We respond within 5 minutes during business hours.',
    color: 'bg-blue-500',
  },
  {
    icon: ClipboardCheck,
    step: '02',
    title: 'Free Diagnosis',
    desc: 'Bring in your device for a free inspection and transparent quote. No hidden charges, no surprises.',
    color: 'bg-purple-500',
  },
  {
    icon: Wrench,
    step: '03',
    title: 'Expert Repair',
    desc: 'Our certified technicians fix your device fast using only quality parts and proven techniques.',
    color: 'bg-brand',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Pick Up & Go',
    desc: "You get notified when it's ready. Device is fully tested before handover — working like new.",
    color: 'bg-emerald-500',
  },
];

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function RepairProcess() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand text-xs font-bold uppercase tracking-widest rounded-full mb-5">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-5 leading-tight">
            Get Your Device Fixed
            <br />
            in <span className="text-brand">4 Simple Steps</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-base">
            Fast, transparent, and hassle-free. Most repairs are done same day.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-gradient-to-r from-gray-200 via-brand/30 to-gray-200 z-0" />

          {steps.map(({ icon: Icon, step, title, desc, color }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step icon ring */}
              <div className="relative mb-6 z-10">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-gray-100 group-hover:border-brand/30 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-lg">
                  <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                    <Icon size={22} className="text-white" />
                  </div>
                </div>
                {/* Step number badge */}
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
              </div>

              <p className="text-brand text-[11px] font-bold uppercase tracking-widest mb-1">Step {step}</p>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[220px]">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-center"
        >
          <p className="text-brand-lighter text-sm font-bold uppercase tracking-widest mb-3">No Fix · No Fee</p>
          <h3 className="text-white font-black text-2xl sm:text-3xl mb-3">
            Ready to get your device fixed?
          </h3>
          <p className="text-gray-400 text-base mb-8 max-w-md mx-auto">
            Chat with us on WhatsApp right now. Describe your issue and we'll give you a free quote — fast.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#25D366] text-white font-bold rounded-2xl text-base hover:bg-[#20c05c] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/30"
          >
            <WhatsAppIcon />
            Book a Repair on WhatsApp
          </a>
          <p className="text-gray-600 text-xs mt-4">Mon–Sat: 8AM–8PM · Sun: 1PM–5PM · Response within 5 mins</p>
        </motion.div>
      </div>
    </section>
  );
}
