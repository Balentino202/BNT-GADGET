import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Laptop, Tablet, Watch, ChevronRight, RefreshCw } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/products';

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

type PriceEntry = { min: number; max: number; note?: string };

const priceTable: Record<DeviceKey, Record<IssueKey, PriceEntry>> = {
  iphone: {
    screen:   { min: 15000,  max: 80000,  note: 'Varies by model (iPhone 11–17)' },
    battery:  { min: 12000,  max: 28000,  note: 'OEM-grade replacement' },
    charging: { min: 10000,  max: 20000  },
    camera:   { min: 20000,  max: 65000,  note: 'Front or rear' },
    water:    { min: 15000,  max: 55000,  note: 'Diagnosis required' },
    software: { min: 5000,   max: 15000,  note: 'Unlock / restore / update' },
    other:    { min: 5000,   max: 50000,  note: 'Diagnosis required' },
  },
  android: {
    screen:   { min: 8000,   max: 50000  },
    battery:  { min: 7000,   max: 20000  },
    charging: { min: 5000,   max: 15000  },
    camera:   { min: 10000,  max: 40000  },
    water:    { min: 10000,  max: 45000,  note: 'Diagnosis required' },
    software: { min: 3000,   max: 12000  },
    other:    { min: 4000,   max: 40000,  note: 'Diagnosis required' },
  },
  macbook: {
    screen:   { min: 50000,  max: 220000, note: 'Varies by model & year' },
    battery:  { min: 35000,  max: 90000  },
    charging: { min: 15000,  max: 40000  },
    camera:   { min: 20000,  max: 55000  },
    water:    { min: 30000,  max: 180000, note: 'Diagnosis required' },
    software: { min: 10000,  max: 30000  },
    other:    { min: 10000,  max: 100000, note: 'Diagnosis required' },
  },
  ipad: {
    screen:   { min: 20000,  max: 85000  },
    battery:  { min: 20000,  max: 50000  },
    charging: { min: 10000,  max: 28000  },
    camera:   { min: 15000,  max: 45000  },
    water:    { min: 20000,  max: 70000,  note: 'Diagnosis required' },
    software: { min: 5000,   max: 18000  },
    other:    { min: 5000,   max: 50000,  note: 'Diagnosis required' },
  },
  watch: {
    screen:   { min: 15000,  max: 65000  },
    battery:  { min: 15000,  max: 40000  },
    charging: { min: 8000,   max: 22000  },
    camera:   { min: 0,      max: 0,      note: 'Smartwatches have no camera' },
    water:    { min: 20000,  max: 55000,  note: 'Diagnosis required' },
    software: { min: 5000,   max: 18000  },
    other:    { min: 5000,   max: 40000,  note: 'Diagnosis required' },
  },
};

const fmt = (n: number) => '₦' + n.toLocaleString();

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function RepairEstimator() {
  const [device, setDevice] = useState<DeviceKey | null>(null);
  const [issue, setIssue] = useState<IssueKey | null>(null);

  const result = device && issue ? priceTable[device][issue] : null;

  const waMessage = device && issue
    ? `Hi BNT, I need a repair estimate for my ${devices.find(d => d.key === device)?.label} — issue: ${issues.find(i => i.key === issue)?.label}. Can you help?`
    : '';

  const reset = () => { setDevice(null); setIssue(null); };

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
            Repair Cost Estimator
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            How Much Will
            <br />
            My Repair <span className="text-brand">Cost?</span>
          </h2>
          <p className="text-gray-400 text-base max-w-lg mx-auto">
            Pick your device and the issue — get an instant price estimate in seconds. Free diagnosis at our store.
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
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="bg-gradient-to-br from-brand/20 to-brand-light/10 border border-brand/30 rounded-2xl p-6 sm:p-8"
              >
                <p className="text-brand-lighter text-xs font-bold uppercase tracking-widest mb-2">
                  Estimated Cost
                </p>

                {result.min === 0 ? (
                  <p className="text-white font-bold text-xl mb-2">{result.note}</p>
                ) : (
                  <>
                    <p className="text-white font-black text-4xl sm:text-5xl mb-1">
                      {fmt(result.min)}{' '}
                      <span className="text-gray-400 font-bold text-2xl">–</span>{' '}
                      {fmt(result.max)}
                    </p>
                    {result.note && (
                      <p className="text-gray-400 text-sm mt-1">* {result.note}</p>
                    )}
                  </>
                )}

                <div className="mt-5 p-3 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-gray-400 text-xs leading-relaxed">
                    ⚠️ This is an estimate only. Final price depends on exact model, parts availability and damage extent.
                    <strong className="text-white"> Free diagnosis at our Ikeja store.</strong>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#20c05c] transition-all hover:shadow-xl hover:shadow-green-500/25 hover:-translate-y-0.5"
                  >
                    <WhatsAppIcon />
                    Book This Repair on WhatsApp
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
          🏪 Walk-in available at No 8 Otigba Computer Village, Ikeja, Lagos · Mon–Sat 8AM–8PM
        </p>
      </div>
    </section>
  );
}
