import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign, 
  X, 
  Check, 
  Sliders, 
  ArrowUpRight, 
  Copy as CopyIcon, 
  ExternalLink,
  PlusCircle,
  Eye
} from 'lucide-react';
import { useBrokerage } from '../../context/BrokerageContext';
import { PopularInvestor } from '../../types';

export interface CopiedTraderItem {
  id: string;
  traderId: string | number;
  name: string;
  handle: string;
  avatarUrl: string;
  role: string;
  allocated: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
  riskScore: number;
  status: 'Active' | 'Paused';
  stopLossPercent: number;
  startDate: string;
}

interface UserCopyTradingTabProps {
  onNotify: (msg: string) => void;
  copiedList?: CopiedTraderItem[];
  setCopiedList?: React.Dispatch<React.SetStateAction<CopiedTraderItem[]>>;
}

export const UserCopyTradingTab: React.FC<UserCopyTradingTabProps> = ({ 
  onNotify,
  copiedList: externalCopiedList,
  setCopiedList: externalSetCopiedList
}) => {
  const { popularInvestors, currentUser } = useBrokerage();

  // Active copies list initialized with realistic rich profiles from popular investors
  const [internalCopiedList, setInternalCopiedList] = useState<CopiedTraderItem[]>(() => {
    const defaultCopied: CopiedTraderItem[] = [];
    if (popularInvestors.length > 0) {
      const inv0 = popularInvestors[0];
      defaultCopied.push({
        id: `copy-${inv0.id}-1`,
        traderId: inv0.id,
        name: inv0.name,
        handle: inv0.handle,
        avatarUrl: inv0.avatarUrl,
        role: inv0.role,
        allocated: 4500,
        currentValue: 5642.10,
        profit: 1142.10,
        profitPercent: 25.38,
        riskScore: inv0.riskScore,
        status: 'Active',
        stopLossPercent: 15,
        startDate: '2026-08-10'
      });
    }
    if (popularInvestors.length > 2) {
      const inv2 = popularInvestors[2];
      defaultCopied.push({
        id: `copy-${inv2.id}-2`,
        traderId: inv2.id,
        name: inv2.name,
        handle: inv2.handle,
        avatarUrl: inv2.avatarUrl,
        role: inv2.role,
        allocated: 3000,
        currentValue: 3492.00,
        profit: 492.00,
        profitPercent: 16.40,
        riskScore: inv2.riskScore,
        status: 'Active',
        stopLossPercent: 20,
        startDate: '2026-08-25'
      });
    }
    return defaultCopied;
  });

  const copiedList = externalCopiedList ?? internalCopiedList;
  const setCopiedList = externalSetCopiedList ?? setInternalCopiedList;

  const [activeSubTab, setActiveSubTab] = useState<'active' | 'discover'>('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'>('ALL');

  // Copy modal state
  const [selectedTraderToCopy, setSelectedTraderToCopy] = useState<PopularInvestor | null>(null);
  const [copyAmount, setCopyAmount] = useState('2000');
  const [stopLoss, setStopLoss] = useState(15);
  const [copyExistingTrades, setCopyExistingTrades] = useState(true);

  // Filtered pro investors
  const filteredInvestors = popularInvestors.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.topHoldings.some(h => h.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (riskFilter === 'LOW') return inv.riskScore <= 3;
    if (riskFilter === 'MEDIUM') return inv.riskScore > 3 && inv.riskScore <= 5;
    if (riskFilter === 'HIGH') return inv.riskScore > 5;
    return true;
  });

  const totalAllocated = copiedList.reduce((acc, c) => acc + c.allocated, 0);
  const totalValue = copiedList.reduce((acc, c) => acc + c.currentValue, 0);
  const totalProfit = totalValue - totalAllocated;
  const overallReturnPercent = totalAllocated > 0 ? ((totalProfit / totalAllocated) * 100).toFixed(2) : '0.00';

  const handleStartCopy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTraderToCopy) return;

    const amountNum = parseFloat(copyAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      onNotify('Please enter a valid copy investment amount.');
      return;
    }

    if (amountNum > currentUser.realBalance) {
      onNotify(`Insufficient account balance ($${currentUser.realBalance.toLocaleString()}). Please deposit funds first.`);
      return;
    }

    // Check if already copying
    const existing = copiedList.find(c => c.traderId === selectedTraderToCopy.id);
    if (existing) {
      // Increase allocation
      setCopiedList(prev => prev.map(c => c.traderId === selectedTraderToCopy.id ? {
        ...c,
        allocated: c.allocated + amountNum,
        currentValue: c.currentValue + amountNum
      } : c));
      onNotify(`Allocated additional $${amountNum.toLocaleString()} to ${selectedTraderToCopy.name}!`);
    } else {
      // New copy
      const newItem: CopiedTraderItem = {
        id: `copy-${selectedTraderToCopy.id}-${Date.now()}`,
        traderId: selectedTraderToCopy.id,
        name: selectedTraderToCopy.name,
        handle: selectedTraderToCopy.handle,
        avatarUrl: selectedTraderToCopy.avatarUrl,
        role: selectedTraderToCopy.role,
        allocated: amountNum,
        currentValue: amountNum,
        profit: 0,
        profitPercent: 0,
        riskScore: selectedTraderToCopy.riskScore,
        status: 'Active',
        stopLossPercent: stopLoss,
        startDate: new Date().toISOString().substring(0, 10)
      };
      setCopiedList(prev => [newItem, ...prev]);
      onNotify(`Successfully started copying ${selectedTraderToCopy.name} with $${amountNum.toLocaleString()}!`);
    }

    setSelectedTraderToCopy(null);
    setActiveSubTab('active');
  };

  const handleStopCopy = (id: string, traderName: string) => {
    if (window.confirm(`Stop copying ${traderName}? Any mirrored open positions will be closed at market and funds returned to your balance.`)) {
      setCopiedList(prev => prev.filter(c => c.id !== id));
      onNotify(`Stopped copying ${traderName}. Funds reconciled.`);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#6dff8a]/20 text-[#6dff8a] text-[10px] font-bold tracking-wide">
              COPYTRADER™ SYSTEM
            </span>
            <span className="text-xs text-white/40">• Real-Time Execution Mirroring</span>
          </div>
          <h3 className="text-xl font-bold text-white">Mirror Top Performing Pro Traders</h3>
          <p className="text-xs text-[#a3a89e] mt-0.5">
            Automatically replicate the portfolios and live trade execution of certified market professionals with zero management fees.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('discover')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'discover'
                ? 'bg-[#6dff8a] text-[#15170f] shadow-[0_0_15px_rgba(109,255,138,0.25)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Discover Pro Traders ({popularInvestors.length})
          </button>
          <button
            onClick={() => setActiveSubTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'active'
                ? 'bg-[#6dff8a] text-[#15170f] shadow-[0_0_15px_rgba(109,255,138,0.25)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            My Active Copies ({copiedList.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: DISCOVER TRADERS */}
      {activeSubTab === 'discover' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search trader, handle, asset (e.g. BTC, NVDA)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#6dff8a]"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
              <span className="text-white/40 text-[11px] mr-1">Risk Filter:</span>
              {(['ALL', 'LOW', 'MEDIUM', 'HIGH'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setRiskFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-medium text-[11px] border transition-all cursor-pointer ${
                    riskFilter === f
                      ? 'border-[#6dff8a] bg-[#6dff8a]/10 text-[#6dff8a]'
                      : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Pro Traders with Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInvestors.map((investor) => {
              const isAlreadyCopied = copiedList.some(c => c.traderId === investor.id);

              return (
                <div 
                  key={investor.id}
                  className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#6dff8a]/40 transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden shadow-lg"
                >
                  <div className="space-y-3.5">
                    {/* Header with Photo & Verification */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={investor.avatarUrl} 
                            alt={investor.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 shadow-lg group-hover:border-[#6dff8a]/70 transition-all"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                            }}
                          />
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#6dff8a] border-2 border-[#15170f] flex items-center justify-center shadow">
                            <Check className="w-2.5 h-2.5 text-[#15170f] stroke-[3]" />
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-white text-sm group-hover:text-[#6dff8a] transition-colors">
                            {investor.name}
                          </h4>
                          <span className="text-xs text-white/50 block font-mono">{investor.handle}</span>
                          <span className="text-[10px] text-[#6dff8a] font-medium">{investor.role}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full bg-[#6dff8a]/20 text-[#6dff8a] text-xs font-bold font-mono block shadow-sm">
                          +{investor.return24M}%
                        </span>
                        <span className="text-[9px] text-white/40 block mt-0.5 font-medium">24M Return</span>
                      </div>
                    </div>

                    {/* Bio snippet */}
                    <p className="text-xs text-white/70 line-clamp-2 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                      {investor.bio}
                    </p>

                    {/* Risk & Copiers Metrics */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-white/40 text-[10px]">Risk Score:</span>
                        <span className={`font-bold font-mono px-2 py-0.5 rounded text-[10px] ${
                          investor.riskScore <= 3 
                            ? 'bg-[#6dff8a]/20 text-[#6dff8a]' 
                            : investor.riskScore <= 5 
                              ? 'bg-yellow-400/20 text-yellow-300' 
                              : 'bg-red-400/20 text-red-300'
                        }`}>
                          {investor.riskScore} / 10
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/40 text-[10px]">Copiers:</span>
                        <span className="font-bold text-white font-mono text-[10px]">
                          {investor.copiers.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Top Holdings Tags */}
                    <div>
                      <span className="text-[10px] text-white/40 font-semibold block mb-1.5 uppercase tracking-wider">Top Portfolios</span>
                      <div className="flex flex-wrap gap-1.5">
                        {investor.topHoldings.map((ticker, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/80 font-mono text-[10px]"
                          >
                            {ticker}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Copy Action Button */}
                  <div className="border-t border-white/5 pt-3">
                    {isAlreadyCopied ? (
                      <button
                        onClick={() => setSelectedTraderToCopy(investor)}
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#6dff8a]/20 text-white hover:text-[#6dff8a] font-bold text-xs border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#6dff8a]" />
                        Active Mirror • Add Allocation
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedTraderToCopy(investor)}
                        className="w-full py-2.5 rounded-xl bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-xs shadow-[0_0_15px_rgba(109,255,138,0.2)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CopyIcon className="w-3.5 h-3.5" />
                        Copy This Trader
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ACTIVE COPIES */}
      {activeSubTab === 'active' && (
        <div className="space-y-5">
          {/* Aggregate Portfolio Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[11px] text-white/40 font-medium">CAPITAL ALLOCATED</span>
              <div className="text-2xl font-bold text-white font-mono">${totalAllocated.toLocaleString()}</div>
              <span className="text-[10px] text-white/50">{copiedList.length} traders active</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[11px] text-white/40 font-medium">CURRENT EQUITY</span>
              <div className="text-2xl font-bold text-white font-mono">${totalValue.toLocaleString()}</div>
              <span className="text-[10px] text-cyan-400">Live mark-to-market</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[11px] text-white/40 font-medium">TOTAL PROFIT / LOSS</span>
              <div className="text-2xl font-bold text-[#6dff8a] font-mono">+${totalProfit.toFixed(2)}</div>
              <span className="text-[10px] text-[#6dff8a]">+{overallReturnPercent}% net gain</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[11px] text-white/40 font-medium">COPY PROTECTION</span>
              <div className="text-2xl font-bold text-yellow-400 font-mono">15% Max DD</div>
              <span className="text-[10px] text-white/50">Stop loss enabled</span>
            </div>
          </div>

          {copiedList.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
              <Users className="w-12 h-12 text-white/20 mx-auto" />
              <h4 className="text-base font-bold text-white">No Active Copied Traders</h4>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                You are not currently mirroring any Pro Traders. Discover verified investors and start copying with one click.
              </p>
              <button
                onClick={() => setActiveSubTab('discover')}
                className="px-5 py-2.5 rounded-xl bg-[#6dff8a] text-[#15170f] font-bold text-xs cursor-pointer shadow-[0_0_15px_rgba(109,255,138,0.25)]"
              >
                Explore Pro Traders
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {copiedList.map((inv) => (
                <div key={inv.id} className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={inv.avatarUrl} 
                        alt={inv.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-[#6dff8a]/50 shadow"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm">{inv.name}</h4>
                        <span className="text-xs text-white/50 block font-mono">{inv.handle}</span>
                        <span className="text-[10px] text-[#6dff8a] font-medium">{inv.role}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#6dff8a]/20 text-[#6dff8a] text-[10px] font-bold tracking-wide">
                        ● LIVE MIRROR
                      </span>
                      <span className="text-[10px] text-white/40 block mt-1">Since {inv.startDate}</span>
                    </div>
                  </div>

                  {/* Financial metrics */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 text-xs border border-white/5">
                    <div>
                      <span className="text-white/40 block text-[10px]">Allocated:</span>
                      <span className="font-bold text-white font-mono">${inv.allocated.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px]">Current Equity:</span>
                      <span className="font-bold text-white font-mono">${inv.currentValue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px]">Mirror P&amp;L:</span>
                      <span className="font-bold text-[#6dff8a] font-mono">
                        +{inv.profitPercent}% (+${inv.profit.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-white/60 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#6dff8a]" />
                      Stop Copy if equity drops below <strong>{inv.stopLossPercent}%</strong>
                    </span>
                    <button
                      onClick={() => handleStopCopy(inv.id, inv.name)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 text-xs font-bold transition-all border border-white/10 cursor-pointer"
                    >
                      Stop Copying
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: CONFIGURE COPY TRADER */}
      {selectedTraderToCopy && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#171a10] border border-[#6dff8a]/40 rounded-3xl p-6 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedTraderToCopy.avatarUrl} 
                  alt={selectedTraderToCopy.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-[#6dff8a] shadow"
                />
                <div>
                  <h3 className="text-base font-bold text-white">Copy {selectedTraderToCopy.name}</h3>
                  <p className="text-xs text-white/50">{selectedTraderToCopy.handle} • {selectedTraderToCopy.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTraderToCopy(null)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Performance highlight */}
            <div className="p-3.5 rounded-2xl bg-[#6dff8a]/10 border border-[#6dff8a]/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-white/60 block text-[11px]">Historical 24M Compounding:</span>
                <span className="text-base font-bold text-[#6dff8a] font-mono">+{selectedTraderToCopy.return24M}%</span>
              </div>
              <div className="text-right">
                <span className="text-white/60 block text-[11px]">Risk Grade:</span>
                <span className="text-sm font-bold text-white font-mono">{selectedTraderToCopy.riskScore} / 10</span>
              </div>
            </div>

            <form onSubmit={handleStartCopy} className="space-y-4">
              {/* Allocation amount */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-white/70 block font-medium">Investment Amount ($USD)</label>
                  <span className="text-white/40">
                    Available: <strong className="text-white font-mono">${currentUser.realBalance.toLocaleString()}</strong>
                  </span>
                </div>

                <div className="relative">
                  <DollarSign className="w-4 h-4 text-[#6dff8a] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    required
                    min="100"
                    step="50"
                    value={copyAmount}
                    onChange={(e) => setCopyAmount(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl pl-9 pr-4 py-3 text-white font-bold text-base focus:outline-none focus:border-[#6dff8a]"
                  />
                </div>

                {/* Quick amount chips */}
                <div className="flex gap-2 pt-1">
                  {['500', '1000', '2500', '5000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCopyAmount(amt)}
                      className="flex-1 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 border border-white/5 cursor-pointer"
                    >
                      ${amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCopyAmount(Math.floor(currentUser.realBalance).toString())}
                    className="px-3 py-1 rounded-lg bg-[#6dff8a]/10 hover:bg-[#6dff8a]/20 text-xs font-semibold text-[#6dff8a] border border-[#6dff8a]/30 cursor-pointer"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Stop loss protection */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70 font-medium">Stop Copying Protection</span>
                  <span className="text-yellow-400 font-bold font-mono">Stop at -{stopLoss}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(parseInt(e.target.value, 10))}
                  className="w-full accent-[#6dff8a] cursor-pointer"
                />
                <p className="text-[10px] text-white/40">
                  If total mirrored equity falls by {stopLoss}%, copy trades will instantly halt to protect capital.
                </p>
              </div>

              {/* Copy existing trades checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={copyExistingTrades}
                  onChange={(e) => setCopyExistingTrades(e.target.checked)}
                  className="mt-0.5 accent-[#6dff8a] cursor-pointer"
                />
                <div className="text-xs">
                  <strong className="text-white block font-medium">Copy Open Trades Immediately</strong>
                  <span className="text-white/50 text-[11px]">
                    Opens proportional positions currently held by {selectedTraderToCopy.name} at prevailing market prices.
                  </span>
                </div>
              </label>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedTraderToCopy(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-xs shadow-[0_0_20px_rgba(109,255,138,0.25)] transition-all cursor-pointer"
                >
                  Confirm &amp; Start Copying (${parseFloat(copyAmount || '0').toLocaleString()})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
