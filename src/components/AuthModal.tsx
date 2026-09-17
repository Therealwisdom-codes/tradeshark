import React, { useState } from 'react';
import { X, CheckCircle2, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { TradeSharkLogo } from './TradeSharkLogo';
import { useBrokerage } from '../context/BrokerageContext';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  mode: initialMode, 
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const { users, createUser, setCurrentUserId } = useBrokerage();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const searchEmail = email.trim().toLowerCase();

      if (mode === 'login') {
        // Look up in data system
        const foundUser = users.find(u => 
          u.email.toLowerCase() === searchEmail || 
          u.name.toLowerCase() === searchEmail ||
          u.id.toLowerCase() === searchEmail
        );

        if (!foundUser) {
          setIsLoading(false);
          setErrorMessage('Account details not found in the TradeShark data system. Please check your email or create a trading account.');
          return;
        }

        if (foundUser.password && foundUser.password !== password) {
          setIsLoading(false);
          setErrorMessage('Incorrect password. Please verify your credentials and try again.');
          return;
        }

        if (foundUser.status === 'Suspended') {
          setIsLoading(false);
          setErrorMessage('This account is currently suspended by compliance.');
          return;
        }

        const now = Date.now();
        const expiresAt = rememberMe ? now + 24 * 60 * 60 * 1000 : now + 8 * 60 * 60 * 1000;
        const session = {
          userId: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          loginTime: now,
          expiresAt,
          sessionType: rememberMe ? '24h' : 'tab'
        };

        if (rememberMe) {
          localStorage.setItem('tradeshark_user_session', JSON.stringify(session));
          sessionStorage.removeItem('tradeshark_user_session');
        } else {
          sessionStorage.setItem('tradeshark_user_session', JSON.stringify(session));
          localStorage.removeItem('tradeshark_user_session');
        }

        setCurrentUserId(foundUser.id);
        setIsLoading(false);
        setSubmitted(true);
        setTimeout(() => {
          onSuccess({ name: foundUser.name, email: foundUser.email });
          onClose();
        }, 600);

      } else {
        // Sign up
        if (users.some(u => u.email.toLowerCase() === searchEmail)) {
          setIsLoading(false);
          setErrorMessage('An account with this email address already exists. Please log in instead.');
          return;
        }

        const newUser = createUser({
          name: fullName.trim() || 'New Trader',
          email: searchEmail,
          password,
          phone: '+44 20 7946 0912',
          country: 'United Kingdom',
          tier: 'Tier 1 - Standard',
          currency: 'USD',
          realBalance: 5000,
          virtualBalance: 100000,
          kycStatus: 'Pending',
          kycDocType: 'Passport',
          kycDocNumber: `REG-${Math.floor(100000 + Math.random() * 900000)}`,
          kycSubmittedDate: new Date().toISOString().substring(0, 16).replace('T', ' '),
          amlRisk: 'Low',
          pepWatchlistHit: false,
          status: 'Active',
          role: 'Trader',
          leverage: 30,
          allowTrading: true,
          allowShorting: false,
          allowCrypto: true,
          maxPositionLimit: 50000,
          accountManager: 'David Sterling'
        });

        const now = Date.now();
        const session = {
          userId: newUser.id,
          name: newUser.name,
          email: newUser.email,
          loginTime: now,
          expiresAt: now + 24 * 60 * 60 * 1000,
          sessionType: '24h'
        };

        localStorage.setItem('tradeshark_user_session', JSON.stringify(session));
        setCurrentUserId(newUser.id);
        setIsLoading(false);
        setSubmitted(true);
        setTimeout(() => {
          onSuccess({ name: newUser.name, email: newUser.email });
          onClose();
        }, 600);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl bg-[#14170e] border border-[#6dff8a]/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white transition-colors border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Rich Financial Trading Visual Banner */}
        <div className="relative md:w-5/12 hidden sm:flex flex-col justify-between p-7 bg-[#0d1008] border-b md:border-b-0 md:border-r border-white/10 overflow-hidden shrink-0">
          <img
            src="/images/user-login.jpg"
            alt="TradeShark Financial Markets"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10130a] via-[#10130a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#14170e]" />

          {/* Top Brand Pill */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-[#6dff8a]/40 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#6dff8a] animate-pulse" />
              <span className="text-[11px] font-semibold text-white tracking-wide">Next-Gen Multi-Asset Broker</span>
            </div>
          </div>

          {/* Bottom Live Market Trust Metrics */}
          <div className="relative z-10 space-y-3 pt-24">
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Execution Speed</span>
                <span className="text-[#6dff8a] font-mono font-bold">&lt; 1.2ms</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Global Client Assets</span>
                <span className="text-white font-mono font-bold">$842M+</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Tier-1 Regulatory Escrow</span>
                <span className="text-yellow-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>FCA / CySEC</span>
                </span>
              </div>
            </div>

            <p className="text-[11px] text-white/50 leading-relaxed">
              Trade over 5,000 global stocks, forex pairs, indices, and crypto with institutional zero-spread matching.
            </p>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="flex-1 p-6 sm:p-8 md:p-9 flex flex-col justify-center bg-[#14170e]">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#6dff8a]/20 text-[#6dff8a] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {mode === 'signup' ? 'Welcome to TradeShark Ltd!' : 'Welcome Back!'}
              </h3>
              <p className="text-sm text-[#a3a89e]">
                Redirecting you to your TradeShark verified multi-asset dashboard...
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Header */}
              <div className="space-y-1.5">
                <TradeSharkLogo size="sm" showLtd={true} className="mb-2" />
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {mode === 'signup' ? 'Create your TradeShark account' : 'Log in to TradeShark'}
                </h3>
                <p className="text-xs text-[#a3a89e]">
                  {mode === 'signup' 
                    ? 'Join 40M+ investors trading stocks, crypto, and ETFs.' 
                    : 'Access your portfolio, live watchlists, and CopyTrader™.'}
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-xs text-white/70">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6dff8a]"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs text-white/70">
                    {mode === 'signup' ? 'Email Address' : 'Email Address or Client ID'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6dff8a]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white focus:outline-none focus:border-[#6dff8a]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (
                  <label className="flex items-center gap-2 text-xs text-white/60 hover:text-white/80 cursor-pointer pt-0.5 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-black/40 border-white/20 text-[#6dff8a] focus:ring-0 cursor-pointer"
                    />
                    <span>Remember session (24h)</span>
                  </label>
                )}

                {mode === 'signup' && (
                  <label className="flex items-start gap-2 text-[11px] text-[#a3a89e] cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      required
                      className="accent-[#6dff8a] w-3.5 h-3.5 mt-0.5"
                    />
                    <span>
                      I confirm I have read and agree to the <strong>TradeShark Ltd Terms of Service</strong> and Risk Disclosures.
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(109,255,138,0.2)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'signup' ? 'Create Account' : 'Log In to Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Toggle login / signup */}
              <div className="text-center text-xs text-[#a3a89e] pt-1">
                {mode === 'signup' ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-[#6dff8a] font-semibold hover:underline"
                    >
                      Log in
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-[#6dff8a] font-semibold hover:underline"
                    >
                      Start Investing
                    </button>
                  </span>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
