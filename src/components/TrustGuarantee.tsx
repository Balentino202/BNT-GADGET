import { motion } from 'framer-motion';
import { ShieldCheck, PackageCheck, Store, ScanLine, BadgeCheck, HandCoins, ArrowRight } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/products';

const guarantees = [
  {
    icon: PackageCheck,
    title: 'Sealed, Boxed & Verified',
    desc: 'Every gadget is brand-new in its original sealed box. Inspect and test it with us in-store before you pay — or get a live video of your exact unit before we ship.',
  },
  {
    icon: Store,
    title: 'A Real Shop You Can Walk Into',
    desc: 'We’re not a faceless online seller. Visit us at No 6 Otigba, Last Floor, Shop 4, Computer Village, Ikeja — a physical store with a real address and real people.',
  },
  {
    icon: ScanLine,
    title: 'IMEI & Authenticity Verified',
    desc: 'We check IMEI status and serial numbers with you on the spot. No blacklisted devices, no clones, no refurbished units sold as new.',
  },
  {
    icon: BadgeCheck,
    title: '1-Year Warranty in Writing',
    desc: 'Genuine warranty on all new gadgets, plus our own repair guarantee. If something goes wrong, you have us — not a dead end.',
  },
  {
    icon: HandCoins,
    title: 'See Exactly What You’re Buying',
    desc: 'Walk in and test it before you pay. Ordering online? We send the IMEI, photos and a live video of your exact unit first — so you’re never paying blind.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Since 2019',
    desc: 'Over 10,000 customers and hundreds of verified reviews. We trade on reputation — one bad deal isn’t worth our name.',
  },
];

const redFlags = [
  'Prices that look “too good to be true” with pressure to pay fast',
  'Sellers who refuse a physical address or a video call of the item',
  'Demands for payment with no receipt, IMEI, or video proof the item exists',
  'No warranty, no receipt, and no way to reach them after payment',
];

export default function TrustGuarantee() {
  const waMsg = 'Hi BNT, before I buy I’d like to confirm a few things about your buyer protection and warranty.';

  return (
    <section id="trust" className="py-24 bg-brand-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand text-xs font-bold uppercase tracking-widest rounded-full mb-5">
            Shop With Confidence
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-5 leading-tight">
            Buy Safely. <span className="text-brand">No Stories.</span>
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            Computer Village has earned a tricky reputation — so we do business the opposite way.
            Here’s exactly how we protect you, every single order.
          </p>
        </motion.div>

        {/* Guarantee grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {guarantees.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group bg-white border border-brand-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 group-hover:bg-brand group-hover:border-brand transition-colors">
                <Icon size={22} className="text-brand group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Red flags + CTA */}
        <div className="grid lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 rounded-2xl p-7"
          >
            <p className="text-white font-black text-lg mb-1">🚩 Don’t get scammed anywhere</p>
            <p className="text-gray-400 text-sm mb-5">
              Whether you buy from us or not, walk away from any seller who shows these signs:
            </p>
            <ul className="space-y-3">
              {redFlags.map((flag) => (
                <li key={flag} className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed">
                  <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                  {flag}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-brand-100 rounded-2xl p-7 flex flex-col justify-center"
          >
            <ShieldCheck size={36} className="text-brand mb-4" />
            <h3 className="font-black text-gray-900 text-xl mb-2">Still cautious? Good.</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Ask us anything before you commit — request a live video of the exact unit, confirm the
              warranty terms, or arrange to inspect in-store. We’d rather earn your trust than rush a sale.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-2xl hover:bg-brand-dark transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/30"
            >
              Ask Before You Buy
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
