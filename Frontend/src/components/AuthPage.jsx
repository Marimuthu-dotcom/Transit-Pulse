import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bus, Lock, Mail, ArrowRight, User } from 'lucide-react';
import { useTransit } from '../context/TransitContext.jsx';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const { login } = useTransit();

  const isLogin = mode === 'login';

  // All inputs start empty — no defaults, no autofill data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");   // signup only
  const [name, setName] = useState("");                         // signup only
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // When mode flips (login ↔ signup), reset fields and errors
  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setRememberMe(false);
    setError("");
  }, [mode]);

  // ---------- Form submit (email/password) ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    if (!isLogin) {
      // Sign-up–specific checks
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      // TODO: replace with real backend call when available
      login({ email, name });
      navigate('/dashboard');
      return;
    }

    // Login flow
    login({ email, name: email.split('@')[0].replace('.', ' ') });
    navigate('/dashboard');
  };

  // ---------- Google success ----------
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      // Same handling for both modes right now.
      // Later, split: signup creates the user, login verifies existence.
      login({
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Google auth error:', err);
      setError("Could not complete Google authentication. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setError(
      isLogin
        ? "Google sign-in failed. Please try again."
        : "Google sign-up failed. Please try again."
    );
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F5B700]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
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
            {isLogin
              ? "Sign in to access your saved commutes, live alerts, and travel logs."
              : "Create your account to start saving routes, alerts, and trips."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111622] rounded-2xl border border-gray-800 p-6 sm:p-8 shadow-2xl">
          {/* Mode header */}
          <div className="mb-5">
            <h2 className="text-lg font-extrabold tracking-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {isLogin
                ? "Use your email and password, or continue with Google."
                : "Sign up with your email and password, or continue with Google."}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Name (signup only) */}
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

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password (signup only) */}
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

            {/* Remember me (login only) */}
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isLogin ? "Sign In" : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Google */}
          <div className="mt-5 pt-4 border-t border-gray-800">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                shape="pill"
                size="large"
                text={isLogin ? "signin_with" : "signup_with"}
              />
            </div>
          </div>
        </div>

        {/* Toggle between login and signup */}
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
    </div>
  );
}