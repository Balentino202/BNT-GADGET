import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const KEY = 'bnt_cookie_ok';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem(KEY)) setVisible(true);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    localStorage.setItem(KEY, '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-[160px] left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-brand/20 border border-brand/30 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Cookie size={16} className="text-brand-lighter" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm mb-1">We use cookies 🍪</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  We use cookies to improve your experience on our website. By continuing to browse, you agree to our use of cookies.
                </p>
              </div>
              <button
                onClick={accept}
                className="text-gray-500 hover:text-gray-300 transition-colors shrink-0 mt-0.5"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={accept}
                className="flex-1 py-2 bg-brand text-white text-xs font-bold rounded-xl hover:bg-brand-dark transition-colors cursor-pointer"
              >
                Accept All
              </button>
              <button
                onClick={accept}
                className="flex-1 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-semibold rounded-xl hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Necessary Only
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
