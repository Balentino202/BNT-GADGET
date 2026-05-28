import { useState } from 'react';
import { X, Bell, Loader2, CheckCircle2 } from 'lucide-react';
import { joinWaitlist } from '../firebase/waitlist';

interface Props {
  productId: string;
  productName: string;
  onClose: () => void;
}

export default function NotifyMeModal({ productId, productName, onClose }: Props) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const cleaned = phone.trim();
    if (!cleaned) { setError('Please enter your WhatsApp number.'); return; }
    if (cleaned.length < 7) { setError('Enter a valid phone number.'); return; }
    setError('');
    setLoading(true);
    try {
      await joinWaitlist({ productId, productName, phone: cleaned });
      setDone(true);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? 'Failed to save. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-sm p-7">
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 bg-brand/15 border border-brand/20 rounded-2xl flex items-center justify-center">
            <Bell size={22} className="text-brand-lighter" />
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="text-center py-4">
            <CheckCircle2 size={44} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="text-white font-black text-lg mb-2">You're on the list!</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              We'll WhatsApp you as soon as <span className="text-white font-semibold">{productName}</span> is back in stock.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-brand text-white font-bold rounded-2xl hover:bg-brand-dark transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-white font-black text-lg mb-1">Notify Me When Available</h3>
            <p className="text-gray-400 text-sm mb-1">
              <span className="text-brand-lighter font-semibold">{productName}</span>
            </p>
            <p className="text-gray-500 text-xs mb-6 leading-relaxed">
              Drop your WhatsApp number and we'll message you the moment this is back in stock.
            </p>

            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Your WhatsApp Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g. 08012345678"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand transition-all mb-3"
            />

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand text-white font-bold rounded-2xl hover:bg-brand-dark transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Bell size={16} />}
              {loading ? 'Saving…' : 'Notify Me'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
