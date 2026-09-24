import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bus, Lock, Mail, ArrowRight, Check } from 'lucide-react';
import { useTransit } from '../context/TransitContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useTransit();
  const [email, setEmail] = useState("alex.mercer@transitpulse.io");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    login({ email, name: email.split('@')[0].replace('.', ' ') });
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    login({ email: "alex.mercer@transitpulse.io", name: "Alex Mercer" });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F5B700]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#F5B700] flex items-center justify-center text-gray-950 font-black shadow-lg">
              <Bus className="w-6 h-6 text-gray-950" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
              Transit<span className="text-[#F5B700]">Pulse</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-gray-400">
            Sign in to access your saved commutes, live alerts, and travel logs.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111622] rounded-2xl border border-gray-800 p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center border border-gray-700 rounded-xl px-3.5 py-2.5 bg-[#161c28] focus-within:border-[#F5B700] transition-colors">
                <Mail className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="commuter@transitpulse.io"
                  className="w-full text-xs sm:text-sm text-white focus:outline-hidden bg-transparent font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                <a href="#forgot" className="text-[11px] text-gray-400 hover:text-white transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative flex items-center border border-gray-700 rounded-xl px-3.5 py-2.5 bg-[#161c28] focus-within:border-[#F5B700] transition-colors">
                <Lock className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm text-white focus:outline-hidden bg-transparent font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-1 text-xs">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-[#F5B700] focus:ring-0 cursor-pointer"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo 1-Click login */}
          <div className="mt-5 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Demo 1-Click Login (Alex Mercer)
            </button>
          </div>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#F5B700] font-bold hover:underline">
            Create Commuter Account
          </Link>
        </p>
      </div>
    </div>
  );
}
