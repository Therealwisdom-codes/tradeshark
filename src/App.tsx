/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { PricingSection } from './components/PricingSection';
import { ProductRange } from './components/ProductRange';
import { PopularInvestors } from './components/PopularInvestors';
import { AiProducts } from './components/AiProducts';
import { TrustSafety } from './components/TrustSafety';
import { SponsorshipStrip } from './components/SponsorshipStrip';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';

// Modals
import { SearchModal } from './components/SearchModal';
import { TradeModal } from './components/TradeModal';
import { CopyModal } from './components/CopyModal';
import { AuthModal } from './components/AuthModal';
import { AiChatDrawer } from './components/AiChatDrawer';
import { UserDashboardModal } from './components/UserDashboardModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { QuickLoginsModal } from './components/QuickLoginsModal';

import { Instrument, PopularInvestor } from './types';
import { INSTRUMENTS } from './data/mockData';
import { MessageSquare, ArrowUp, ArrowRight, Key } from 'lucide-react';
import { useBrokerage } from './context/BrokerageContext';

export default function App() {
  const { currentUser, setCurrentUserId, transactions, users, createUser } = useBrokerage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isQuickLoginsOpen, setIsQuickLoginsOpen] = useState(false);
  const [tradeInstrument, setTradeInstrument] = useState<Instrument | null>(null);
  const [copyInvestor, setCopyInvestor] = useState<PopularInvestor | null>(null);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'signup'
  });
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showMobileStickyCta, setShowMobileStickyCta] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state with URL hash & path for separate shareable links (#admin, /admin, #user, /user)
  useEffect(() => {
    const handleRouteSync = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash.startsWith('#admin') || path.startsWith('/admin')) {
        setIsAdminPortalOpen(true);
        setIsUserDashboardOpen(false);
      } else if (
        hash.startsWith('#login') ||
        hash.startsWith('#user') || 
        hash.startsWith('#dashboard') || 
        hash.startsWith('#portal') ||
        path.startsWith('/login') || 
        path.startsWith('/user') || 
        path.startsWith('/dashboard') ||
        path.startsWith('/portal')
      ) {
        setIsUserDashboardOpen(true);
        setIsAdminPortalOpen(false);
      } else {
        setIsUserDashboardOpen(false);
        setIsAdminPortalOpen(false);
      }
    };

    handleRouteSync();
    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
  }, []);

  const handleOpenUserDashboard = () => {
    window.location.hash = 'user';
    setIsUserDashboardOpen(true);
    setIsAdminPortalOpen(false);
  };

  const handleOpenAdminPortal = () => {
    window.location.hash = 'admin';
    setIsAdminPortalOpen(true);
    setIsUserDashboardOpen(false);
  };

  const handleDirectLoginUser = (email: string) => {
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      const now = Date.now();
      const session = {
        userId: matched.id,
        name: matched.name,
        email: matched.email,
        loginTime: now,
        expiresAt: now + 24 * 60 * 60 * 1000,
        sessionType: '24h'
      };
      localStorage.setItem('tradeshark_user_session', JSON.stringify(session));
      sessionStorage.removeItem('tradeshark_user_session');
      setCurrentUserId(matched.id);
      setNotification(`Logged in as ${matched.name} (${matched.tier})`);
      setTimeout(() => setNotification(null), 3500);
      handleOpenUserDashboard();
    }
  };

  const handleDirectLoginAdmin = (username: string) => {
    const roleMap: Record<string, { role: string; name: string }> = {
      admin: { role: 'Super-Admin', name: 'Administrator' },
      compliance: { role: 'Compliance Officer', name: 'Compliance Desk' },
      treasury: { role: 'Treasury Desk', name: 'Treasury Operator' }
    };
    const info = roleMap[username.toLowerCase()] || { role: 'Super-Admin', name: 'Administrator' };
    const now = Date.now();
    const session = {
      username: username.toLowerCase(),
      role: info.role,
      name: info.name,
      loginTime: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
      sessionType: '24h',
      token: `ts_adm_${Math.random().toString(36).substring(2)}${Date.now()}`
    };
    localStorage.setItem('tradeshark_admin_session', JSON.stringify(session));
    sessionStorage.removeItem('tradeshark_admin_session');
    setNotification(`Logged in as ${info.role} (${username})`);
    setTimeout(() => setNotification(null), 3500);
    handleOpenAdminPortal();
  };

  const handleCloseUserDashboard = () => {
    setIsUserDashboardOpen(false);
    if (
      window.location.hash.includes('user') || 
      window.location.hash.includes('login') ||
      window.location.hash.includes('dashboard') ||
      window.location.hash.includes('portal') ||
      window.location.pathname.includes('/user') ||
      window.location.pathname.includes('/login') ||
      window.location.pathname.includes('/dashboard') ||
      window.location.pathname.includes('/portal')
    ) {
      history.replaceState(null, '', '/');
    }
  };

  const handleCloseAdminPortal = () => {
    setIsAdminPortalOpen(false);
    if (window.location.hash.includes('admin') || window.location.pathname.includes('/admin')) {
      history.replaceState(null, '', '/');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      setShowMobileStickyCta(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenTradeForSymbol = (symbol: string) => {
    const found = INSTRUMENTS.find(i => i.symbol.toLowerCase() === symbol.toLowerCase()) || INSTRUMENTS[0];
    setIsAiChatOpen(false);
    setTradeInstrument(found);
  };

  const handleUserAuthSuccess = (authUser: { name: string; email: string }) => {
    const existing = users.find(u => u.email.toLowerCase() === authUser.email.toLowerCase());
    if (existing) {
      setCurrentUserId(existing.id);
    } else {
      const created = createUser({
        name: authUser.name,
        email: authUser.email,
        phone: '+44 7700 900111',
        country: 'United Kingdom',
        tier: 'Tier 1 - Standard',
        currency: 'USD',
        realBalance: 5000,
        virtualBalance: 100000,
        kycStatus: 'Pending',
        kycDocType: 'Passport',
        kycDocNumber: 'GB-PENDING',
        kycSubmittedDate: new Date().toISOString().substring(0, 10),
        amlRisk: 'Low',
        pepWatchlistHit: false,
        status: 'Active',
        role: 'Trader',
        leverage: 30,
        allowTrading: true,
        allowShorting: true,
        allowCrypto: true,
        maxPositionLimit: 50000,
        accountManager: 'David Sterling'
      });
      setCurrentUserId(created.id);
    }
    setNotification(`Signed in as ${authUser.name}`);
    setTimeout(() => setNotification(null), 3500);
    setIsUserDashboardOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#15170f] text-[#f4f4f0] flex flex-col selection:bg-[#6dff8a] selection:text-[#15170f]">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 bg-[#1e2715] border border-[#6dff8a]/40 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6dff8a] animate-pulse" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Main Navigation Header (Clean Public Front-End with NO login buttons) */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onOpenUserDashboard={handleOpenUserDashboard}
        currentUser={currentUser}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero 
          onStartInvesting={() => setAuthModal({ isOpen: true, mode: 'signup' })} 
          onSelectInstrumentSymbol={handleOpenTradeForSymbol}
        />

        {/* 2. Trust Bar */}
        <TrustBar />

        {/* 3. Pricing Reassurance */}
        <PricingSection 
          onLearnMore={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        />

        {/* 4. Product Range Screener */}
        <ProductRange
          onSelectInstrument={(inst) => setTradeInstrument(inst)}
          onStartInvesting={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        />

        {/* 5. Popular Investors / CopyTrader™ */}
        <PopularInvestors
          onCopyInvestor={(inv) => setCopyInvestor(inv)}
          onExploreAll={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        />

        {/* 6. AI Products */}
        <AiProducts
          onOpenAiChat={() => setIsAiChatOpen(true)}
        />

        {/* 7. Trust & Safety Compliance */}
        <TrustSafety />

        {/* 8. Sponsorship Strip */}
        <SponsorshipStrip />

        {/* 9. Final Call to Action */}
        <FinalCta
          onSignUp={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating AI Assistant Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 rounded-full bg-[#1b1e15] border border-white/15 text-white/80 hover:text-white hover:border-[#6dff8a] shadow-xl transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        <button
          id="floating-shark-ai-btn"
          onClick={() => setIsAiChatOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#6dff8a] text-[#15170f] font-bold shadow-[0_0_25px_rgba(109,255,138,0.4)] hover:bg-[#5ce077] transition-all transform hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15170f] opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#15170f]"></span>
          </span>
          <span className="text-xs sm:text-sm font-bold">Ask Shark AI</span>
        </button>
      </div>

      {/* Mobile Sticky CTA Bar */}
      {showMobileStickyCta && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-30 p-3 bg-[#15170f]/95 border-t border-white/10 backdrop-blur-md animate-slideUp">
          <button
            onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
            className="w-full py-3.5 rounded-full bg-[#6dff8a] text-[#15170f] font-bold text-sm shadow-[0_0_20px_rgba(109,255,138,0.3)] flex items-center justify-center gap-2"
          >
            <span>Start Investing with TradeShark Ltd</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectInstrument={(inst) => setTradeInstrument(inst)}
      />

      <TradeModal
        instrument={tradeInstrument}
        onClose={() => setTradeInstrument(null)}
      />

      <CopyModal
        investor={copyInvestor}
        onClose={() => setCopyInvestor(null)}
      />

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onSuccess={handleUserAuthSuccess}
      />

      <AiChatDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onOpenTrade={handleOpenTradeForSymbol}
      />

      {/* User Dashboard & Client Portal */}
      <UserDashboardModal
        isOpen={isUserDashboardOpen}
        onClose={handleCloseUserDashboard}
        user={currentUser}
        onOpenTrade={handleOpenTradeForSymbol}
        onOpenAdminPortal={handleOpenAdminPortal}
      />

      {/* Administrative Console */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={handleCloseAdminPortal}
        onSwitchToUserDashboard={handleOpenUserDashboard}
      />

      {/* Direct Logins & Access Credentials Directory Modal */}
      <QuickLoginsModal
        isOpen={isQuickLoginsOpen}
        onClose={() => setIsQuickLoginsOpen(false)}
        onDirectLoginUser={handleDirectLoginUser}
        onDirectLoginAdmin={handleDirectLoginAdmin}
        onOpenUserGate={handleOpenUserDashboard}
        onOpenAdminGate={handleOpenAdminPortal}
      />

    </div>
  );
}

