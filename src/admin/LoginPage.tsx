import { useState, type FormEvent } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Loader2, LogIn, Eye, EyeOff, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email) { setError('Enter your email address first, then click Reset Password.'); return; }
    setResetting(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? 'unknown';
      setError(`Reset failed (${code}). Make sure the email is correct.`);
    } finally {
      setResetting(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? 'unknown';
      console.error('Firebase Auth error:', code, err);
      setError(`Login failed (${code}). Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <img src="/img/favicon.png" alt="Logo" className="w-12 h-12 object-contain" />
          <div>
            <p className="font-black text-white text-xl">BNT-GET SERVICE</p>
            <p className="text-brand-lighter text-xs font-semibold tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <h1 className="text-white font-black text-2xl mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to manage your products & prices</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-all text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {resetSent && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-emerald-400 text-sm font-semibold">
                  ✅ Reset email sent to {email}
                </p>
                <p className="text-emerald-400/70 text-xs mt-1">
                  Check your inbox (and spam folder), click the link, set a new password, then come back and log in.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-gray-900 text-gray-600">forgot password?</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              disabled={resetting || resetSent}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-800 border border-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
              {resetting ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
              {resetting ? 'Sending…' : resetSent ? '✅ Email Sent' : 'Send Password Reset Email'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6">
          BNT-GET SERVICE · Admin Panel · Secured by Firebase Auth
        </p>
      </div>
    </div>
  );
}
