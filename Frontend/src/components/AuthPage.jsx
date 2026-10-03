import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Bus, Lock, Mail, ArrowRight, User, X, Radio, Sparkles, MapPin } from 'lucide-react';
import { useTransit } from '../context/TransitContext.jsx';
import { GoogleLogin } from '@react-oauth/google';

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, googleLogin } = useTransit();
  const [mounted, setMounted] = useState(false);

  const isLogin = mode === 'login';
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [livePill, setLivePill] = useState(0);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setRememberMe(false);
    setError("");
  }, [mode]);

  // Rotate the live-ETA pill every 3 seconds
  useEffect(() => {
    const t = setInterval(() => setLivePill((p) => (p + 1) % 3), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(()=>{
     setMounted(true);
  },[]);

  const handleClose = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    if (!isLogin) {
      if (!name.trim()) return setError("Please enter your full name.");
      if (password !== confirmPassword) return setError("Passwords do not match.");
      if (password.length < 6) return setError("Password must be at least 6 characters.");
    }

    setSubmitting(true);
    try {
      if (isLogin) await login({ email, password });
      else await signup({ name, email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

 const handleGoogleSuccess = async (credentialResponse) => {
  setError("");
  setSubmitting(true);
  try {
    // Pass the mode as the intent: 'login' or 'signup'
    await googleLogin(credentialResponse.credential, isLogin ? 'login' : 'signup');
    navigate(from, { replace: true });
  } catch (err) {
    setError(err.message || "Google authentication failed.");
  } finally {
    setSubmitting(false);
  }
 };

  const handleGoogleError = () => {
    setError(isLogin ? "Google sign-in failed." : "Google sign-up failed.");
  };

  const liveEtas = [
    { line: '42A',  mins: 2 },
    { line: '10B',  mins: 5 },
    { line: 'EXP4', mins: 7 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex relative overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════
          LEFT PANEL — Brand panel with infinite bus loop
          ═══════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex lg:w-1/2 relative">

        {/* Single soft yellow bloom behind the illustration */}
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-xl h-xl bg-[#F5B700]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-14 w-full">

          {/* ─── TOP: Brand ─── */}
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-11 h-11 rounded-xl bg-[#F5B700] flex items-center justify-center transition-shadow group-hover:shadow-[0_0_30px_rgba(245,183,0,0.5)]">
              <Bus className="w-6 h-6 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight leading-none">
                Transit<span className="text-[#F5B700]">Pulse</span>
              </div>
              <div className="text-[10px] text-gray-500 tracking-[0.18em] font-medium uppercase mt-1">
                Real-time Transit Intelligence
              </div>
            </div>
          </Link>

          {/* ─── MIDDLE: Headline + Loop + Live ETA ─── */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">

            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight leading-[1.15] mb-4">
              Track every bus, plan every stop,
              <br />
              <span className="text-[#F5B700]">arrive on time.</span>
            </h1>

            <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-md">
              AI-powered arrival predictions and live GPS for your daily commute.
            </p>

            {/* ── Infinite route loop with realistic bus ── */}
            <div className="relative w-full mb-6">
              <svg viewBox="0 0 480 200" className="w-full h-auto" fill="none">
                <defs>
                  {/* Bus body gradient */}
                  <linearGradient id="busBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5C518" />
                    <stop offset="100%" stopColor="#E0A800" />
                  </linearGradient>

                  {/* Window tint */}
                  <linearGradient id="busWindow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a2433" />
                    <stop offset="100%" stopColor="#0f1620" />
                  </linearGradient>
                </defs>

                {/* ── The infinite route loop (rounded rectangle circuit) ── */}
                <path
                  id="route-loop"
                  d="M 60 170
                     L 420 170
                     Q 460 170 460 130
                     L 460 70
                     Q 460 30 420 30
                     L 60 30
                     Q 20 30 20 70
                     L 20 130
                     Q 20 170 60 170 Z"
                  stroke="#F5B700"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="6 8"
                  opacity="0.5"
                  fill="none"
                />

                {/* Solid core line, draws itself once on mount */}
                <use
                  href="#route-loop"
                  stroke="#F5B700"
                  strokeWidth="2.5"
                  strokeDasharray="1200"
                  strokeDashoffset="1200"
                  opacity="0.9"
                  className="route-loop-trace"
                />

                {/* ── Stations around the loop ── */}
                {[
                  { x: 60,  y: 170, label: 'Central'    },
                  { x: 180, y: 170, label: 'Midtown'    },
                  { x: 320, y: 170, label: 'Market'     },
                  { x: 460, y: 130, label: ''           },
                  { x: 460, y: 30,  label: ''           },
                  { x: 320, y: 30,  label: 'Tech Park'  },
                  { x: 180, y: 30,  label: 'University' },
                  { x: 60,  y: 30,  label: 'Stadium'    },
                ].map((s, i) => (
                  <g key={i}>
                    <circle cx={s.x} cy={s.y} r="5" fill="#0a0d14" stroke="#F5B700" strokeWidth="2" />
                    <circle cx={s.x} cy={s.y} r="1.8" fill="#F5B700" />
                    {s.label && (
                      <text
                        x={s.x}
                        y={s.y < 100 ? s.y - 12 : s.y + 20}
                        fill="#6b7280"
                        fontSize="9"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="ui-sans-serif, system-ui"
                      >
                        {s.label}
                      </text>
                    )}
                  </g>
                ))}

                {/* ── REALISTIC BUS travelling around the loop ── */}
                <g>
                  <g transform="translate(-32, -22)">
                    {/* Shadow */}
                    <ellipse cx="32" cy="42" rx="30" ry="3" fill="#000" opacity="0.35" />

                    {/* Body */}
                    <rect x="0" y="10" width="64" height="28" rx="6" fill="url(#busBody)" />
                    <rect x="2" y="10" width="60" height="4" rx="2" fill="#FFD947" opacity="0.8" />

                    {/* Windows */}
                    <rect x="6"  y="16" width="14" height="10" rx="2" fill="url(#busWindow)" />
                    <rect x="24" y="16" width="14" height="10" rx="2" fill="url(#busWindow)" />
                    <rect x="42" y="16" width="14" height="10" rx="2" fill="url(#busWindow)" />

                    {/* Windshield */}
                    <rect x="58" y="17" width="4" height="9" rx="1" fill="#0f1620" />

                    {/* Door line */}
                    <line x1="22" y1="12" x2="22" y2="35" stroke="#B8860B" strokeWidth="1" opacity="0.5" />

                    {/* Headlight */}
                    <circle cx="62" cy="32" r="2" fill="#FFFDE7" />
                    <circle cx="62" cy="32" r="4" fill="#FFFDE7" opacity="0.3" />

                    {/* Taillight */}
                    <circle cx="2" cy="32" r="1.5" fill="#EF4444" />

                    {/* Wheels */}
                    <circle cx="14" cy="40" r="5" fill="#0f1620" />
                    <circle cx="14" cy="40" r="2" fill="#94a3b8" />
                    <circle cx="50" cy="40" r="5" fill="#0f1620" />
                    <circle cx="50" cy="40" r="2" fill="#94a3b8" />
                  </g>

                  {/* SVG-native motion along the loop — seamless infinite */}
                  <animateMotion
                    dur="14s"
                    repeatCount="indefinite"
                    rotate="0"
                    path="M 60 170
                          L 420 170
                          Q 460 170 460 130
                          L 460 70
                          Q 460 30 420 30
                          L 60 30
                          Q 20 30 20 70
                          L 20 130
                          Q 20 170 60 170 Z"
                  />
                </g>
              </svg>
            </div>

            {/* Live ETA pills — rotate every 3s */}

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111622] border border-gray-800/80 text-[11px] text-gray-300 font-medium">
                <Radio className="w-3 h-3 text-emerald-400" />
                Live GPS Tracking
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111622] border border-gray-800/80 text-[11px] text-gray-300 font-medium">
                <Sparkles className="w-3 h-3 text-[#F5B700]" />
                AI Arrival Alerts
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111622] border border-gray-800/80 text-[11px] text-gray-300 font-medium">
                <MapPin className="w-3 h-3 text-cyan-400" />
                Saved Routes
              </div>
            </div>
          </div>

          {/* ─── BOTTOM: Stats + Legal ─── */}
          <div className="pt-6">
            <div className="flex items-center justify-between text-[10px] text-gray-600">
              <span>© {new Date().getFullYear()} TransitPulse</span>
              <div className="flex items-center gap-4">
                <a href="#privacy" className="hover:text-gray-400 transition-colors">Privacy</a>
                <a href="#terms" className="hover:text-gray-400 transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════
          RIGHT PANEL — Auth form
          ═══════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 py-8 relative">

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          title="Continue without signing in"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-9 h-9 rounded-full bg-[#111622] border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-full max-w-md relative z-10">

          {/* Mobile brand header */}
          <div className="lg:hidden flex flex-col items-center text-center mb-8">
            <Link to="/" className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#F5B700] flex items-center justify-center">
                <Bus className="w-6 h-6 text-black" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight">
                Transit<span className="text-[#F5B700]">Pulse</span>
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-[#111622] rounded-2xl border border-gray-800 p-6 sm:p-8 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-2xl font-extrabold tracking-tight">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-xs text-gray-400 mt-1.5">
                {isLogin
                  ? "Sign in to access your saved commutes, live alerts, and travel logs."
                  : "Sign up to start saving routes, alerts, and trips."}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                <div>{error}</div>
                {/* Show a link to the other page when there's an account-state mismatch */}
                {error.includes('No account found') && (
                  <Link
                    to="/register"
                    className="inline-block mt-2 text-[#F5B700] font-bold hover:underline"
                  >
                    Create an account →
                  </Link>
                )}
                {error.includes('already exists') && (
                  <Link
                    to="/login"
                    className="inline-block mt-2 text-[#F5B700] font-bold hover:underline"
                  >
                    Sign in instead →
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              {!isLogin && (
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
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}

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
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                    Password
                  </label>
                  {isLogin && (
                    <a href="#forgot" className="text-[11px] text-gray-400 hover:text-white transition-colors">
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative flex items-center border border-gray-700 rounded-xl px-3.5 py-2.5 bg-[#161c28] focus-within:border-[#F5B700] transition-colors">
                  <Lock className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm text-white focus:outline-hidden bg-transparent font-medium"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center border border-gray-700 rounded-xl px-3.5 py-2.5 bg-[#161c28] focus-within:border-[#F5B700] transition-colors">
                    <Lock className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs sm:text-sm text-white focus:outline-hidden bg-transparent font-medium"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              {isLogin && (
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
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#F5B700] hover:bg-[#e2a800] disabled:opacity-60 disabled:cursor-not-allowed text-gray-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{submitting ? "Please wait…" : isLogin ? "Sign In" : "Create Account"}</span>
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-gray-800">
              <div className="flex justify-center">
                {mounted && (<GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text={isLogin ? "signin_with" : "signup_with"}
                />) }
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <Link to="/register" className="text-[#F5B700] font-bold hover:underline">
                  Create Commuter Account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-[#F5B700] font-bold hover:underline">
                  Sign In
                </Link>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}