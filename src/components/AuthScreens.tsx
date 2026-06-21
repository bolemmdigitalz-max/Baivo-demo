import React, { useState } from 'react';
import { apiFetch, setMockMode } from '../utils/api';
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail, User, ShieldCheck } from 'lucide-react';

interface AuthScreensProps {
  onAuthSuccess: (user: any) => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({ onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Username validation: lowercase letters/numbers/dots/underscores only
  const isValidUsername = (userStr: string) => {
    if (!userStr) return true; // allow empty while typing
    return /^[a-z0-9._]+$/.test(userStr);
  };

  // Password strength calculation
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: 'Enter password', color: 'bg-zinc-700' };
    if (pass.length < 6) return { score: 1, text: 'Too short (min 6 chars)', color: 'bg-red-500' };
    
    let score = 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score === 2) return { score: 2, text: 'Fair', color: 'bg-yellow-500' };
    if (score === 3) return { score: 3, text: 'Good', color: 'bg-blue-500' };
    return { score: 4, text: 'Strong', color: 'bg-emerald-500' };
  };

  const passStrength = calculatePasswordStrength(password);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    setIsLoading(false);

    if (res.success && res.data) {
      const { access_token, refresh_token, user } = res.data;
      if (access_token) localStorage.setItem('baivo_access_token', access_token);
      if (refresh_token) localStorage.setItem('baivo_refresh_token', refresh_token);
      if (user) localStorage.setItem('baivo_user', JSON.stringify(user));
      
      onAuthSuccess(user || { email });
    } else {
      // Show error message from response detail field (handled by apiFetch wrapper)
      setErrorMsg(res.error || 'Invalid credentials. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !email || !password || !fullName) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (!isValidUsername(username)) {
      setErrorMsg('Username must contain only lowercase letters, numbers, dots, or underscores.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, full_name: fullName })
    });

    setIsLoading(false);

    if (res.success && res.data) {
      const { access_token, refresh_token, user } = res.data;
      if (access_token) localStorage.setItem('baivo_access_token', access_token);
      if (refresh_token) localStorage.setItem('baivo_refresh_token', refresh_token);
      if (user) localStorage.setItem('baivo_user', JSON.stringify(user));
      
      onAuthSuccess(user || { username, email, full_name: fullName });
    } else {
      setErrorMsg(res.error || 'Registration failed. Please try again.');
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setToastMsg('Forgot password link clicked! (Reset functionality coming soon)');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleDemoLogin = async () => {
    // Force mock mode and auto login so reviewers have a seamless test path
    setMockMode(true);
    setEmail('demo@baivo.com');
    setPassword('password123');
    setIsLoading(true);
    setErrorMsg('');
    
    setTimeout(async () => {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'demo@baivo.com', password: 'password123' })
      });
      setIsLoading(false);
      if (res.success && res.data) {
        const { access_token, refresh_token, user } = res.data;
        if (access_token) localStorage.setItem('baivo_access_token', access_token);
        if (refresh_token) localStorage.setItem('baivo_refresh_token', refresh_token);
        if (user) localStorage.setItem('baivo_user', JSON.stringify(user));
        onAuthSuccess(user);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 selection:bg-pink-500 selection:text-white">
      {/* Toast notification */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 border border-pink-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce max-w-sm w-full">
          <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" />
          <p className="text-sm font-medium">{toastMsg}</p>
        </div>
      )}

      <div className="w-full max-w-md bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header matching Splash */}
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-extrabold tracking-wider text-white mb-1">
            BAIVO
          </h1>
          <p className="text-xs font-medium text-gray-400 tracking-wide">
            Your world. Your reels.
          </p>
          <h2 className="text-xl font-bold mt-6 text-zinc-200">
            {isLoginView ? 'Welcome back' : 'Create your account'}
          </h2>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/80 border border-red-800 text-red-200 rounded-2xl flex items-start gap-3 text-sm animate-fade-in relative z-10">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Authentication Error</p>
              <p className="text-xs text-red-300 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={isLoginView ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4 relative z-10">
          {!isLoginView && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="lowercase_letters.numbers"
                    required
                    disabled={isLoading}
                    className={`w-full bg-zinc-900 border ${
                      !isValidUsername(username) ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-pink-500'
                    } rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-colors`}
                  />
                </div>
                {!isValidUsername(username) ? (
                  <p className="mt-1.5 text-xs text-red-400 font-medium">
                    Only lowercase letters, numbers, dots, and underscores allowed.
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Unique username for your reels profile.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Display Name"
                    required
                    disabled={isLoading}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Password
              </label>
              {isLoginView && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-pink-400 hover:text-pink-300 transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLoginView ? '••••••••' : 'At least 6 characters'}
                required
                disabled={isLoading}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator for Register */}
            {!isLoginView && (
              <div className="mt-2 bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Password Strength:</span>
                  <span className={`font-semibold ${passStrength.score === 1 ? 'text-red-400' : passStrength.score === 2 ? 'text-yellow-400' : passStrength.score >= 3 ? 'text-emerald-400' : 'text-zinc-50.0'}`}>
                    {passStrength.text}
                  </span>
                </div>
                <div className="flex gap-1 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full flex-1 transition-colors duration-300 ${passStrength.score >= 1 ? passStrength.color : 'bg-zinc-800'}`}></div>
                  <div className={`h-full flex-1 transition-colors duration-300 ${passStrength.score >= 2 ? passStrength.color : 'bg-zinc-800'}`}></div>
                  <div className={`h-full flex-1 transition-colors duration-300 ${passStrength.score >= 3 ? passStrength.color : 'bg-zinc-800'}`}></div>
                  <div className={`h-full flex-1 transition-colors duration-300 ${passStrength.score >= 4 ? passStrength.color : 'bg-zinc-800'}`}></div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (!isLoginView && password.length < 6) || (!isLoginView && !isValidUsername(username))}
            className="w-full mt-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 transition-all"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin text-white" />}
            {isLoading ? (isLoginView ? 'Signing in...' : 'Creating account...') : (isLoginView ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        {/* Demo Fast Track Login */}
        {isLoginView && (
          <div className="mt-4 pt-4 border-t border-zinc-800/80 relative z-10">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-pink-400 font-medium py-3 px-4 rounded-xl border border-zinc-800 hover:border-pink-500/50 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-pink-400" />
              Quick Demo Login (Bypass / Mock)
            </button>
          </div>
        )}

        {/* Toggle View */}
        <div className="mt-6 text-center text-xs text-gray-400 relative z-10">
          {isLoginView ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginView(false);
                  setErrorMsg('');
                }}
                className="text-pink-400 font-bold hover:underline py-1"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginView(true);
                  setErrorMsg('');
                }}
                className="text-pink-400 font-bold hover:underline py-1"
              >
                Log In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
