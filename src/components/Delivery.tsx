import { motion } from 'framer-motion';
import { Bike, Truck, MapPin, PackageCheck, ArrowRight } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/products';

const zones = [
  {
    icon: Bike,
    tag: 'Same Day',
    title: 'Within Lagos',
    time: 'Delivered today',
    desc: 'Free doorstep delivery across Lagos on most orders. A dispatch rider brings it straight to your address.',
    highlight: true,
  },
  {
    icon: Truck,
    tag: '1–3 Days',
    title: 'Nationwide',
    time: 'Abuja, PH, Kano & beyond',
    desc: 'We ship anywhere in Nigeria via trusted couriers (GIG, God is Good, DHL for express). Tracking shared on WhatsApp.',
    highlight: false,
  },
  {
    icon: MapPin,
    tag: 'Free',
    title: 'Store Pickup',
    time: 'Ready in minutes',
    desc: 'Prefer to come in? Pick up at No 6 Otigba, Last Floor, Shop 4, Computer Village, Ikeja. Inspect and test before you pay.',
    highlight: false,
  },
];

const steps = [
  'Confirm your order & address on WhatsApp',
  'We send the IMEI, photos & a video of your exact unit',
  'Pay, then we package, dispatch & share tracking',
];

export default function Delivery() {
  const waMsg = 'Hi BNT, I’d like to know the delivery options and timeline to my location.';

  return (
    <section id="delivery" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand text-xs font-bold uppercase tracking-widest rounded-full mb-5">
            Delivery & Dispatch
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-5 leading-tight">
            We Deliver <span className="text-brand">Nationwide</span>
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            Not in Lagos? No problem. Order from anywhere in Nigeria and we’ll get it to your
            doorstep safely — with tracking every step of the way.
          </p>
        </motion.div>

        {/* Zones */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {zones.map(({ icon: Icon, tag, title, time, desc, highlight }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                highlight
                  ? 'bg-brand text-white border-brand shadow-lg shadow-brand/25'
                  : 'bg-gray-50 border-gray-100 hover:shadow-xl hover:border-gray-200'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  highlight ? 'bg-white/20' : 'bg-brand-50 border border-brand-100'
                }`}
              >
                <Icon size={22} className={highlight ? 'text-white' : 'text-brand'} />
              </div>
              <span
                className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 ${
                  highlight ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand'
                }`}
              >
                {tag}
              </span>
              <h3 className={`font-black text-lg mb-0.5 ${highlight ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <p className={`text-xs font-semibold mb-3 ${highlight ? 'text-white/80' : 'text-brand'}`}>{time}</p>
              <p className={`text-sm leading-relaxed ${highlight ? 'text-white/85' : 'text-gray-500'}`}>{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How delivery works + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 border border-gray-100 rounded-3xl p-7 sm:p-9 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <PackageCheck size={20} className="text-brand" />
              <h3 className="font-bold text-gray-900 text-lg">How delivery works</h3>
            </div>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={step} className="flex gap-4 items-center">
                  <div className="w-9 h-9 rounded-2xl bg-brand text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-brand/30">
                    {i + 1}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-5">
              * Orders are dispatched once payment is confirmed. For total peace of mind, we share the
              IMEI, photos and a live video of your exact unit <strong>before</strong> you pay — so you
              know precisely what’s coming. Prefer to inspect in person? Pick up and pay at our store.
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6">
            <p className="text-white font-black text-xl mb-1">Outside Lagos?</p>
            <p className="text-gray-400 text-sm mb-5">
              Tell us your location and we’ll confirm the exact delivery fee and timeline in minutes.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/30"
            >
              Check Delivery to My Area
              <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
