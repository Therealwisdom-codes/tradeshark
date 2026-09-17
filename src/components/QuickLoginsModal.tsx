import React, { useState } from 'react';
import { 
  X, 
  Key, 
  ShieldCheck, 
  User, 
  Copy, 
  Check, 
  ArrowRight, 
  Lock, 
  Building2, 
  Wallet, 
  Scale, 
  ExternalLink 
} from 'lucide-react';
import { TradeSharkLogo } from './TradeSharkLogo';

interface QuickLoginsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectLoginUser: (email: string, password: string) => void;
  onDirectLoginAdmin: (username: string, password: string) => void;
  onOpenUserGate: () => void;
  onOpenAdminGate: () => void;
}

export const QuickLoginsModal: React.FC<QuickLoginsModalProps> = ({
  isOpen,
  onClose,
  onDirectLoginUser,
  onDirectLoginAdmin,
  onOpenUserGate,
  onOpenAdminGate
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'user'>('admin');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const ADMIN_ACCOUNTS = [
    {
      role: 'Super-Admin Desk',
      badge: 'Full Oversight',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: <Building2 className="w-4 h-4 text-red-400" />,
      username: 'admin',
      password: 'admin123',
      description: 'Complete administrative jurisdiction, balance adjustments, user tier controls, and trading suspensions.'
    },
    {
      role: 'Compliance & AML Officer',
      badge: 'Regulatory & Risk',
      badgeColor: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
      icon: <Scale className="w-4 h-4 text-yellow-400" />,
      username: 'compliance',
      password: 'compliance123',
      description: 'KYC identity approvals, PEP watchlist audits, sanctions screening, and transaction monitoring.'
    },
    {
      role: 'Treasury & Liquidity Desk',
      badge: 'Capital Operations',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      icon: <Wallet className="w-4 h-4 text-blue-400" />,
      username: 'treasury',
      password: 'treasury123',
      description: 'Deposit approvals, withdrawal disbursements, bank wire reconciliations, and omnibus ledger auditing.'
    }
  ];

  const USER_ACCOUNTS = [
    {
      name: 'Alex Mercer',
      tier: 'Tier 2 - Verified Pro',
      email: 'alex.m@gmail.com',
      password: 'trader123',
      balance: '$104,850.25',
      status: 'Active',
      kyc: 'Approved (Passport)',
      description: 'Pro trader with high leverage, active CFD positions in NVDA and BTC, approved Tier 2 status.'
    },
    {
      name: 'Sarah Jenkins',
      tier: 'Tier 3 - VIP Institutional',
      email: 'sjenkins@techcorp.io',
      password: 'vip123',
      balance: '$423,000.00',
      status: 'Active',
      kyc: 'Approved (ID Card)',
      description: 'VIP institutional account with 400x leverage, dedicated account manager, large tech equity portfolio.'
    },
    {
      name: 'Tariq Al-Mansoor',
      tier: 'Tier 3 - VIP Institutional',
      email: 't.mansoor@gulfcap.ae',
      password: 'vip123',
      balance: '$850,000.00',
      status: 'Active',
      kyc: 'Approved (Passport)',
      description: 'High net-worth Gulf capital account with custom position limits and diversified holdings.'
    },
    {
      name: 'Liam Chen',
      tier: 'Tier 1 - Standard',
      email: 'liam.chen@outlook.com',
      password: 'trader123',
      balance: '$15,820.00',
      status: 'Active',
      kyc: 'Pending Review',
      description: 'Standard account in Singapore with pending KYC review and retail leverage limits.'
    },
    {
      name: 'Elena Rostov',
      tier: 'Tier 1 - Standard',
      email: 'e.rostov@proton.me',
      password: 'trader123',
      balance: '€8,450.00',
      status: 'Trading Frozen',
      kyc: 'Under Review',
      description: 'Account with compliance hold due to utility bill expiry; showcases compliance notification workflows.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#14170e] border border-[#6dff8a]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#0e1109]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6dff8a]/15 border border-[#6dff8a]/30 flex items-center justify-center text-[#6dff8a]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">System Logins &amp; Access Keys</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#6dff8a]/20 text-[#6dff8a] font-mono font-bold">
                  All Credentials
                </span>
              </div>
              <p className="text-xs text-[#a3a89e]">
                Direct access credentials for testing Back-Office Admin roles and Client Trading accounts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/5"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-black/40 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('admin')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'admin'
                ? 'border-[#6dff8a] text-[#6dff8a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Admin &amp; Institutional Desks (3)</span>
          </button>

          <button
            onClick={() => setActiveTab('user')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'user'
                ? 'border-[#6dff8a] text-[#6dff8a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Client &amp; Trader Accounts (5)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'admin' ? (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-white/70">
                  Select any staff desk below to copy credentials or auto-login directly into the Institutional Admin Portal.
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdminGate();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 border border-white/15"
                >
                  <span>Open Admin Gate</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {ADMIN_ACCOUNTS.map((acc, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-black/50 border border-white/10 hover:border-[#6dff8a]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-md">
                      <div className="flex items-center gap-2">
                        {acc.icon}
                        <span className="font-bold text-sm text-white">{acc.role}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-mono font-semibold ${acc.badgeColor}`}>
                          {acc.badge}
                        </span>
                      </div>
                      <p className="text-xs text-white/60">{acc.description}</p>
                      
                      {/* Credentials Display */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
                        <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                          <span className="text-white/40">User:</span>
                          <span className="text-[#6dff8a] font-bold">{acc.username}</span>
                          <button
                            onClick={() => handleCopy(acc.username, `user-${idx}`)}
                            className="text-white/40 hover:text-white p-0.5"
                            title="Copy username"
                          >
                            {copiedKey === `user-${idx}` ? <Check className="w-3 h-3 text-[#6dff8a]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                          <span className="text-white/40">Pass:</span>
                          <span className="text-white font-bold">{acc.password}</span>
                          <button
                            onClick={() => handleCopy(acc.password, `pass-${idx}`)}
                            className="text-white/40 hover:text-white p-0.5"
                            title="Copy password"
                          >
                            {copiedKey === `pass-${idx}` ? <Check className="w-3 h-3 text-[#6dff8a]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onDirectLoginAdmin(acc.username, acc.password);
                        onClose();
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(109,255,138,0.2)] transition-all cursor-pointer shrink-0"
                    >
                      <span>Auto-Login as {acc.username}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-white/70">
                  Select any registered trader account to auto-login into the Client WebTrader Terminal.
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenUserGate();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 border border-white/15"
                >
                  <span>Open Client Gate</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {USER_ACCOUNTS.map((acc, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-black/50 border border-white/10 hover:border-[#6dff8a]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-md">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white">{acc.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/10 font-semibold">
                          {acc.tier}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#6dff8a]/15 text-[#6dff8a] border border-[#6dff8a]/30 font-mono font-bold">
                          {acc.balance}
                        </span>
                      </div>
                      <p className="text-xs text-white/60">{acc.description}</p>
                      
                      {/* Credentials Display */}
                      <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-mono">
                        <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                          <span className="text-white/40">Email:</span>
                          <span className="text-[#6dff8a] font-bold">{acc.email}</span>
                          <button
                            onClick={() => handleCopy(acc.email, `user-mail-${idx}`)}
                            className="text-white/40 hover:text-white p-0.5"
                            title="Copy email"
                          >
                            {copiedKey === `user-mail-${idx}` ? <Check className="w-3 h-3 text-[#6dff8a]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                          <span className="text-white/40">Pass:</span>
                          <span className="text-white font-bold">{acc.password}</span>
                          <button
                            onClick={() => handleCopy(acc.password, `user-pass-${idx}`)}
                            className="text-white/40 hover:text-white p-0.5"
                            title="Copy password"
                          >
                            {copiedKey === `user-pass-${idx}` ? <Check className="w-3 h-3 text-[#6dff8a]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onDirectLoginUser(acc.email, acc.password);
                        onClose();
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(109,255,138,0.2)] transition-all cursor-pointer shrink-0"
                    >
                      <span>Auto-Login as {acc.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 border-t border-white/10 bg-[#0e1109] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div>
            You can also register a brand-new custom account anytime on the Client Gate or via "Start Investing".
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
