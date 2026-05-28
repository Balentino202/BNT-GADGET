import { Mail, MapPin, Phone } from 'lucide-react';

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12a10 10 0 1 0-11.5 9.9v-7h-2v-2.9h2v-2.2c0-2 1.2-3.2 3-3.2.9 0 1.8.17 1.8.17v2h-1c-1 0-1.3.63-1.3 1.27v1.93h2.3l-.37 2.9h-1.93v7A10 10 0 0 0 24 12z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);
const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.75 2c.39 0 .75.26.86.64a5.86 5.86 0 0 0 5.23 4.14c.5.03.9.44.9.94v2.01a.93.93 0 0 1-.97.94 8.63 8.63 0 0 1-3.1-.73v4.9a5.77 5.77 0 1 1-5.77-5.77c.2 0 .4.01.6.03v2.16a3.57 3.57 0 1 0 2.77 3.47V2.93c0-.52.42-.93.94-.93z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const navLinks = [
  { label: 'Shop Gadgets', href: '#gadgets' },
  { label: 'Repairs', href: '#services' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const categories = ['iPhones', 'Android Phones', 'MacBooks', 'iPads', 'Apple Watches', 'Gaming', 'Accessories'];

export default function Footer() {
  const handleNavClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="bg-gray-950 text-white">
      {/* Top CTA strip */}
      <div className="border-b border-white/5 bg-brand/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">Ready to buy or need a repair?</p>
            <p className="text-gray-400 text-sm">Reach us instantly on WhatsApp — response within 5 minutes!</p>
          </div>
          <a
            href="https://wa.me/2349163685180"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#20c05c] transition-all hover:shadow-lg hover:shadow-green-500/25 whitespace-nowrap shrink-0"
          >
            <WhatsAppIcon />
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/img/favicon.png"
                alt="BNT-GET SERVICE logo"
                className="w-12 h-12 object-contain"
              />
              <div className="flex flex-col leading-none">
                <span className="font-black text-white text-base tracking-tight">
                  BNT-GET <span className="text-brand-lighter">SERVICE</span>
                </span>
                <span className="text-brand-lighter text-[10px] font-semibold tracking-widest uppercase">Lagos, Nigeria</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-[240px]">
              Your trusted partner for authentic gadgets and professional repairs in Nigeria. Serving customers since 2019.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {[
                { Icon: InstagramIcon, href: 'https://www.instagram.com/balentino_online_gadget_store', label: 'Instagram' },
                { Icon: TikTokIcon, href: 'https://www.tiktok.com/@bnt.get.service?_t=ZT-90n0n3SNhUs&_r=1', label: 'TikTok' },
                { Icon: FacebookIcon, href: 'https://www.facebook.com/share/179z4naXte/?mibextid=wwXIfr', label: 'Facebook' },
                { Icon: WhatsAppIcon, href: 'https://wa.me/2349163685180', label: 'WhatsApp' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-white/8 hover:bg-brand rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5 text-gray-400 hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <button
                    onClick={() => handleNavClick(href)}
                    className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer hover:translate-x-0.5 inline-block"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleNavClick('#gadgets')}
                    className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer hover:translate-x-0.5 inline-block"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://wa.me/2349163685180"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <Phone size={15} className="mt-0.5 shrink-0 text-brand-lighter" />
                  <span className="text-sm leading-snug">+234 916 368 5180</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:bntgetservice@gmail.com"
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail size={15} className="mt-0.5 shrink-0 text-brand-lighter" />
                  <span className="text-sm leading-snug break-all">bntgetservice@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/PQdpjPxoRFduJJpdA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <MapPin size={15} className="mt-0.5 shrink-0 text-brand-lighter" />
                  <span className="text-sm leading-snug">No 8 Otigba Computer Village, Ikeja, Lagos</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} BNT-GET SERVICES. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open now — WhatsApp us anytime
          </p>
        </div>
      </div>
    </footer>
  );
}
