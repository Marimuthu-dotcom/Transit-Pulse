import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bus, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useTransit } from '../context/TransitContext.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useTransit();
  const [name, setName] = useState("Alex Mercer");
  const [email, setEmail] = useState("alex.mercer@transitpulse.io");
  const [phone, setPhone] = useState("+1 (555) 382-9021");
  const [password, setPassword] = useState("password123");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ name, email, phone });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F5B700]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
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
            Create an account to track transit routes and report crowds in real time.
          </p>
        </div>

        <div className="bg-[#111622] rounded-2xl border border-gray-800 p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center border border-gray-700 rounded-xl px-3.5 py-2.5 bg-[#161c28] focus-within:border-[#F5B700] transition-colors">
                <User className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full text-xs sm:text-sm text-white focus:outline-hidden bg-transparent font-medium"
                  required
                />
              </div>
            </div>

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
                  placeholder="alex@transitpulse.io"
                  className="w-full text-xs sm:text-sm text-white focus:outline-hidden bg-transparent font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Phone Number
              </label>
              <div className="relative flex items-center border border-gray-700 rounded-xl px-3.5 py-2.5 bg-[#161c28] focus-within:border-[#F5B700] transition-colors">
                <Phone className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full text-xs sm:text-sm text-white focus:outline-hidden bg-transparent font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Create Password
              </label>
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

            <div className="flex items-center gap-2 pt-1 text-xs">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-[#F5B700] focus:ring-0 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-gray-300 cursor-pointer">
                I agree to the <span className="text-[#F5B700] underline">TransitPulse Terms</span> and Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="text-[#F5B700] font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
