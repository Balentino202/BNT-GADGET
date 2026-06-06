import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { submitInquiry } from '../firebase/inquiries';

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12a10 10 0 1 0-11.5 9.9v-7h-2v-2.9h2v-2.2c0-2 1.2-3.2 3-3.2.9 0 1.8.17 1.8.17v2h-1c-1 0-1.3.63-1.3 1.27v1.93h2.3l-.37 2.9h-1.93v7A10 10 0 0 0 24 12z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);
const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.75 2c.39 0 .75.26.86.64a5.86 5.86 0 0 0 5.23 4.14c.5.03.9.44.9.94v2.01a.93.93 0 0 1-.97.94 8.63 8.63 0 0 1-3.1-.73v4.9a5.77 5.77 0 1 1-5.77-5.77c.2 0 .4.01.6.03v2.16a3.57 3.57 0 1 0 2.77 3.47V2.93c0-.52.42-.93.94-.93z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const hours = [
  { day: 'Monday – Friday', time: '9:00 AM – 8:00 PM', active: true },
  { day: 'Saturday', time: '10:00 AM – 7:00 PM', active: true },
  { day: 'Sunday', time: '2:00 PM – 5:00 PM', active: true },
];

const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/share/179z4naXte/?mibextid=wwXIfr', Icon: FacebookIcon, color: 'hover:bg-blue-600' },
  { label: 'Instagram', href: 'https://www.instagram.com/balentino_online_gadget_store', Icon: InstagramIcon, color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@bnt.get.service?_t=ZT-90n0n3SNhUs&_r=1', Icon: TikTokIcon, color: 'hover:bg-gray-800' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', interest: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInquiry = async () => {
    if (!form.name.trim()) { setFormError('Please enter your name.'); return; }
    if (!form.phone.trim()) { setFormError('Please enter your WhatsApp number.'); return; }
    setFormError('');
    setSending(true);
    try {
      await submitInquiry({ name: form.name.trim(), phone: form.phone.trim(), interest: form.interest.trim(), message: form.message.trim() });
      setSent(true);
    } catch (err: unknown) {
      setFormError((err as { message?: string })?.message ?? 'Failed to send. Please try WhatsApp instead.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-brand/20 border border-brand/30 text-brand-lighter text-xs font-bold uppercase tracking-widest rounded-full mb-5">
            Reach Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Get in <span className="text-brand">Touch</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            Ready to buy a gadget, book a repair, or just have a question? We're a WhatsApp message away.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">

          {/* WhatsApp — big card */}
          <motion.a
            href="https://wa.me/2349163685180"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 group bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl p-8 flex flex-col justify-between min-h-[260px] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300"
          >
            <div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                <WhatsAppIcon />
              </div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Preferred Contact</p>
              <h3 className="text-white font-black text-2xl mb-2">WhatsApp</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Order gadgets, book repairs, or ask anything. Responses within 5 minutes during business hours.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-2">
              <span className="text-white font-bold text-base sm:text-lg">+234 916 368 5180</span>
              <span className="text-white/60 text-sm group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </motion.a>

          {/* Right: Email + Map + Hours stacked */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Email */}
            <motion.a
              href="mailto:bntgetservice@gmail.com"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-brand/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-brand/15 border border-brand/20 rounded-xl flex items-center justify-center mb-4">
                <Mail size={20} className="text-brand-lighter" />
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Email</p>
              <h3 className="text-white font-bold text-base mb-2">Send an Email</h3>
              <p className="text-gray-500 text-xs leading-relaxed break-all">bntgetservice@gmail.com</p>
            </motion.a>

            {/* Location */}
            <motion.a
              href="https://maps.app.goo.gl/PQdpjPxoRFduJJpdA"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-brand/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-brand/15 border border-brand/20 rounded-xl flex items-center justify-center mb-4">
                <MapPin size={20} className="text-brand-lighter" />
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Visit Us</p>
              <h3 className="text-white font-bold text-base mb-2">Our Store</h3>
              <p className="text-gray-500 text-xs leading-relaxed">No 6 Otigba, Last Floor, Shop 4, Computer Village, Ikeja, Lagos</p>
            </motion.a>

            {/* Opening hours */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand/15 border border-brand/20 rounded-lg flex items-center justify-center">
                  <Clock size={15} className="text-brand-lighter" />
                </div>
                <p className="text-white font-bold text-sm">Business Hours</p>
              </div>
              <div className="space-y-2.5">
                {hours.map(({ day, time, active }) => (
                  <div key={day} className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 text-xs">{day}</span>
                    <span className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-600'}`}>{time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-2.5 bg-brand/10 border border-brand/20 rounded-xl">
                <p className="text-brand-lighter text-xs font-medium text-center">
                  ⚡ WhatsApp replies within 5 mins
                </p>
              </div>
            </motion.div>

            {/* Social */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
            >
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Stay Connected</p>
              <h3 className="text-white font-bold text-sm mb-2">Follow Us</h3>
              <p className="text-gray-600 text-xs mb-5 leading-relaxed">
                Latest deals, new arrivals & tech tips on social media.
              </p>
              <div className="flex gap-3">
                {socials.map(({ label, href, Icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-11 h-11 bg-gray-800 text-gray-400 hover:text-white rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5 ${color}`}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Inquiry Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-gray-900 border border-gray-800 rounded-3xl p-8"
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-brand/15 border border-brand/25 text-brand-lighter text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                Send a Message
              </span>
              <h3 className="text-white font-black text-2xl mb-2">Leave Us Your Details</h3>
              <p className="text-gray-500 text-sm">Fill this form and we'll reach out to you on WhatsApp within minutes.</p>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <CheckCircle2 size={52} className="text-emerald-400 mx-auto mb-4" />
                <h4 className="text-white font-black text-xl mb-2">Message Received!</h4>
                <p className="text-gray-400 text-sm">We'll WhatsApp you very soon. Thank you!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Your Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Chukwuemeka"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">WhatsApp Number *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="e.g. 08012345678"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Interested In (optional)</label>
                  <input
                    type="text"
                    value={form.interest}
                    onChange={(e) => setForm((f) => ({ ...f, interest: e.target.value }))}
                    placeholder="e.g. iPhone 17 Pro, MacBook repair, Samsung Galaxy..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Message (optional)</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Any additional details or questions..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand transition-all resize-none"
                  />
                </div>

                {formError && <p className="text-red-400 text-sm">{formError}</p>}

                <button
                  onClick={handleInquiry}
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand text-white font-bold rounded-2xl hover:bg-brand-dark transition-all disabled:opacity-60 cursor-pointer text-sm"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
