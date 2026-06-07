import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Laptop, Tablet, Watch, ChevronRight, RefreshCw, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/products';
import { submitInquiry } from '../firebase/inquiries';

type DeviceKey = 'iphone' | 'android' | 'macbook' | 'ipad' | 'watch';
type IssueKey = 'screen' | 'battery' | 'charging' | 'camera' | 'water' | 'software' | 'other';

const devices: { key: DeviceKey; label: string; icon: typeof Smartphone; emoji: string }[] = [
  { key: 'iphone', label: 'iPhone', icon: Smartphone, emoji: '📱' },
  { key: 'android', label: 'Android', icon: Smartphone, emoji: '🤖' },
  { key: 'macbook', label: 'MacBook / Laptop', icon: Laptop, emoji: '💻' },
  { key: 'ipad', label: 'iPad / Tablet', icon: Tablet, emoji: '🖥️' },
  { key: 'watch', label: 'Smartwatch', icon: Watch, emoji: '⌚' },
];

const issues: { key: IssueKey; label: string; emoji: string }[] = [
  { key: 'screen', label: 'Screen / Display', emoji: '🖥️' },
  { key: 'battery', label: 'Battery', emoji: '🔋' },
  { key: 'charging', label: 'Charging Port', emoji: '🔌' },
  { key: 'camera', label: 'Camera', emoji: '📷' },
  { key: 'water', label: 'Water Damage', emoji: '💧' },
  { key: 'software', label: 'Software / Unlock', emoji: '💾' },
  { key: 'other', label: 'Other Issue', emoji: '🔧' },
];

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function RepairEstimator() {
  const [device, setDevice] = useState<DeviceKey | null>(null);
  const [issue, setIssue] = useState<IssueKey | null>(null);

  /* Optional "request a callback" form (saved to admin, no WhatsApp needed) */
  const [showCallback, setShowCallback] = useState(false);
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbSending, setCbSending] = useState(false);
  const [cbSent, setCbSent] = useState(false);
  const [cbError, setCbError] = useState('');

  const selectedDevice = devices.find((d) => d.key === device) ?? null;
  const selectedIssue = issues.find((i) => i.key === issue) ?? null;
  const ready = !!(selectedDevice && selectedIssue);

  const waMessage = ready
    ? `Hi BNT, I'd like a repair quote for my ${selectedDevice!.label} — issue: ${selectedIssue!.label}. What would it cost?`
    : '';

  const reset = () => {
    setDevice(null); setIssue(null);
    setShowCallback(false); setCbName(''); setCbPhone('');
    setCbSent(false); setCbError('');
  };

  const handleCallback = async () => {
    if (!cbName.trim()) { setCbError('Please enter your name.'); return; }
    if (!cbPhone.trim()) { setCbError('Please enter your phone number.'); return; }
    setCbError('');
    setCbSending(true);
    try {
      await submitInquiry({
        name: cbName.trim(),
        phone: cbPhone.trim(),
        interest: `Repair: ${selectedDevice!.label} — ${selectedIssue!.label}`,
        message: '',
        type: 'repair',
        device: selectedDevice!.label,
        issue: selectedIssue!.label,
      });
      setCbSent(true);
    } catch {
      setCbError('Could not send. Please use WhatsApp instead.');
    } finally {
      setCbSending(false);
    }
  };

  return (
    <section className="py-24 bg-gray-950 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-brand/20 border border-brand/30 text-brand-lighter text-xs font-bold uppercase tracking-widest rounded-full mb-5">
            Instant Repair Quote
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            How Much Will
            <br />
            My Repair <span className="text-brand">Cost?</span>
          </h2>
          <p className="text-gray-400 text-base max-w-lg mx-auto">
            Pick your device and the issue — get your exact quote in minutes on WhatsApp. Free diagnosis at our store.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-10"
        >
          {/* Step 1: Device */}
          <div className="mb-8">
            <p className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-black flex items-center justify-center">1</span>
              Select your device
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {devices.map((d) => (
                <button
                  key={d.key}
                  onClick={() => { setDevice(d.key); setIssue(null); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all cursor-pointer hover:-translate-y-0.5 ${
                    device === d.key
                      ? 'bg-brand border-brand text-white shadow-lg shadow-brand/30'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-brand/50 hover:text-white'
                  }`}
                >
                  <span className="text-2xl">{d.emoji}</span>
                  <span className="text-xs font-semibold leading-tight">{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Issue */}
          <AnimatePresence>
            {device && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <p className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-black flex items-center justify-center">2</span>
                  What's the issue?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {issues.map((iss) => (
                    <button
                      key={iss.key}
                      onClick={() => setIssue(iss.key)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer hover:-translate-y-0.5 ${
                        issue === iss.key
                          ? 'bg-brand border-brand text-white shadow-lg shadow-brand/25'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-brand/50 hover:text-white'
                      }`}
                    >
                      <span className="text-lg shrink-0">{iss.emoji}</span>
                      <span className="text-xs font-semibold leading-tight">{iss.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {ready && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="bg-gradient-to-br from-brand/20 to-brand-light/10 border border-brand/30 rounded-2xl p-6 sm:p-8"
              >
                <p className="text-brand-lighter text-xs font-bold uppercase tracking-widest mb-3">
                  Your Repair Request
                </p>

                {/* Selection summary chips */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-white font-bold text-sm">
                    <span className="text-lg">{selectedDevice!.emoji}</span>
                    {selectedDevice!.label}
                  </span>
                  <span className="text-gray-500">·</span>
                  <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-white font-bold text-sm">
                    <span className="text-lg">{selectedIssue!.emoji}</span>
                    {selectedIssue!.label}
                  </span>
                </div>

                <h3 className="text-white font-black text-2xl sm:text-3xl leading-tight mb-2">
                  Get your <span className="text-brand-lighter">exact price</span> in minutes
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                  Prices vary by exact model, parts and damage — so we quote you the real figure directly,
                  no surprises. Send your request and we'll reply on WhatsApp right away.
                </p>

                <div className="mt-5 grid sm:grid-cols-3 gap-2.5">
                  {[
                    { icon: '🩺', text: 'Free diagnosis' },
                    { icon: '⚡', text: 'Reply in ~5 mins' },
                    { icon: '✅', text: 'No obligation' },
                  ].map((b) => (
                    <div key={b.text} className="flex items-center gap-2 p-2.5 bg-white/5 border border-white/10 rounded-xl">
                      <span className="text-base">{b.icon}</span>
                      <span className="text-gray-300 text-xs font-semibold">{b.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#20c05c] transition-all hover:shadow-xl hover:shadow-green-500/25 hover:-translate-y-0.5"
                  >
                    <WhatsAppIcon />
                    Get My Exact Quote on WhatsApp
                    <ChevronRight size={16} />
                  </a>
                  <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-800 border border-gray-700 text-gray-300 font-semibold rounded-2xl hover:bg-gray-700 transition-all cursor-pointer"
                  >
                    <RefreshCw size={15} />
                    Start Over
                  </button>
                </div>

                {/* Or request a callback (no WhatsApp needed) */}
                <div className="mt-5 pt-5 border-t border-white/10">
                  {cbSent ? (
                    <div className="flex items-center gap-2.5 text-emerald-400">
                      <CheckCircle2 size={18} className="shrink-0" />
                      <p className="text-sm font-semibold">Request received — we'll reach out to you shortly. Thank you!</p>
                    </div>
                  ) : !showCallback ? (
                    <button
                      onClick={() => setShowCallback(true)}
                      className="text-gray-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                    >
                      Prefer not to chat now?{' '}
                      <span className="text-brand-lighter font-semibold underline underline-offset-2">Request a callback →</span>
                    </button>
                  ) : (
                    <div>
                      <p className="text-white text-sm font-semibold mb-3">Leave your details and we'll reach out:</p>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={cbName}
                          onChange={(e) => setCbName(e.target.value)}
                          placeholder="Your name"
                          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand transition-all"
                        />
                        <div className="relative">
                          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input
                            type="tel"
                            value={cbPhone}
                            onChange={(e) => setCbPhone(e.target.value)}
                            placeholder="WhatsApp / phone number"
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand transition-all"
                          />
                        </div>
                      </div>
                      {cbError && <p className="text-red-400 text-xs mt-2">{cbError}</p>}
                      <button
                        onClick={handleCallback}
                        disabled={cbSending}
                        className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-60 cursor-pointer text-sm"
                      >
                        {cbSending ? <Loader2 size={15} className="animate-spin" /> : null}
                        {cbSending ? 'Sending…' : 'Send Repair Request'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!device && (
            <p className="text-gray-600 text-sm text-center pt-2">
              👆 Select your device above to get started
            </p>
          )}
        </motion.div>

        <p className="text-center text-gray-600 text-xs mt-5">
          🏪 Walk-in available at No 6 Otigba, Last Floor, Shop 4, Computer Village, Ikeja, Lagos · Mon–Fri 9AM–8PM · Sat 10AM–7PM · Sun 2PM–5PM
        </p>
      </div>
    </section>
  );
}
