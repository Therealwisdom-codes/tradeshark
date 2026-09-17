import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Trash2, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  X, 
  Check, 
  AlertCircle,
  ExternalLink,
  Percent,
  Sliders
} from 'lucide-react';
import { useBrokerage } from '../../context/BrokerageContext';
import { PopularInvestor } from '../../types';

interface AdminTradersTabProps {
  onNotify: (msg: string) => void;
}

const AVATAR_PRESETS = [
  { label: 'Executive Male', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Executive Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { label: 'Senior Trader', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { label: 'FinTech Lead', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },
  { label: 'Quant Analyst', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Alpha Strategist', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' },
  { label: 'Crypto Macro Lead', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
  { label: 'Risk Specialist', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80' },
];

export const AdminTradersTab: React.FC<AdminTradersTabProps> = ({ onNotify }) => {
  const { popularInvestors, addTrader, removeTrader } = useBrokerage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0].url);
  const [role, setRole] = useState('Elite Pro Investor');
  const [bio, setBio] = useState('');
  const [return24M, setReturn24M] = useState('52.40');
  const [copiers, setCopiers] = useState('850');
  const [riskScore, setRiskScore] = useState(3);
  const [topHoldings, setTopHoldings] = useState('BTC, NVDA, AAPL, MSFT');

  const filteredTraders = popularInvestors.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgReturn = popularInvestors.length > 0 
    ? (popularInvestors.reduce((acc, t) => acc + t.return24M, 0) / popularInvestors.length).toFixed(1)
    : '0.0';

  const totalCopiers = popularInvestors.reduce((acc, t) => acc + t.copiers, 0);

  const handleAddTrader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onNotify('Trader name is required');
      return;
    }

    const cleanHandle = handle.startsWith('@') ? handle.trim() : `@${handle.trim().toLowerCase().replace(/\s+/g, '_')}`;
    const holdingsArray = topHoldings
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    const newTrader = addTrader({
      name: name.trim(),
      handle: cleanHandle,
      avatarUrl: avatarUrl.trim() || AVATAR_PRESETS[0].url,
      role: role.trim() || 'Pro Investor',
      bio: bio.trim() || 'Institutional strategy focused on disciplined risk-adjusted compounding.',
      return24M: parseFloat(return24M) || 35.0,
      copiers: parseInt(copiers, 10) || 100,
      riskScore: Number(riskScore) || 3,
      topHoldings: holdingsArray.length > 0 ? holdingsArray : ['NVDA', 'BTC', 'MSFT']
    });

    onNotify(`Pro Trader ${newTrader.name} successfully added to CopyTrader directory!`);
    setIsAddModalOpen(false);
    // Reset
    setName('');
    setHandle('');
    setBio('');
  };

  const handleDeleteTrader = (id: string | number, traderName: string) => {
    if (window.confirm(`Are you sure you want to remove ${traderName} from the Pro Traders directory?`)) {
      removeTrader(id);
      onNotify(`Trader ${traderName} removed from CopyTrader program.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#6dff8a]" />
            Manage Pro Traders &amp; Copy Portfolio
          </h3>
          <p className="text-xs text-[#a3a89e]">
            Configure professional lead investors available for client copy trading with real-time portfolio mirroring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search trader, handle, asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#6dff8a] w-56"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-xs shadow-[0_0_15px_rgba(109,255,138,0.2)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Pro Trader
          </button>
        </div>
      </div>

      {/* Program Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-white/40 font-medium">ACTIVE PRO TRADERS</span>
          <div className="text-2xl font-bold text-white font-mono">{popularInvestors.length}</div>
          <span className="text-[10px] text-[#6dff8a]">Full audit tracking active</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-white/40 font-medium">AVG 24M RETURN</span>
          <div className="text-2xl font-bold text-[#6dff8a] font-mono">+{avgReturn}%</div>
          <span className="text-[10px] text-white/40">Across all strategies</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-white/40 font-medium">TOTAL COPIERS</span>
          <div className="text-2xl font-bold text-white font-mono">{totalCopiers.toLocaleString()}</div>
          <span className="text-[10px] text-cyan-400">Institutional &amp; Retail</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] text-white/40 font-medium">RISK CALIBRATION</span>
          <div className="text-2xl font-bold text-yellow-400 font-mono">1 - 7 / 10</div>
          <span className="text-[10px] text-white/40">Regulated factor models</span>
        </div>
      </div>

      {/* Traders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTraders.map((trader) => (
          <div 
            key={trader.id}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#6dff8a]/30 transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
          >
            <div className="space-y-3">
              {/* Header with picture & badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={trader.avatarUrl} 
                      alt={trader.name}
                      className="w-13 h-13 rounded-2xl object-cover border-2 border-white/10 shadow-md group-hover:border-[#6dff8a]/60 transition-colors"
                      onError={(e) => {
                        // Fallback image if broken
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#6dff8a] border-2 border-[#15170f] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-[#15170f] stroke-[3]" />
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-[#6dff8a] transition-colors">{trader.name}</h4>
                    <span className="text-xs text-white/50 block font-mono">{trader.handle}</span>
                    <span className="text-[10px] text-[#6dff8a] font-medium">{trader.role}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-[#6dff8a]/15 text-[#6dff8a] text-[11px] font-bold font-mono block">
                    +{trader.return24M}%
                  </span>
                  <span className="text-[9px] text-white/40 block mt-0.5">24M Return</span>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-white/70 line-clamp-2 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                {trader.bio}
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-[10px]">Risk Score:</span>
                  <span className={`font-bold font-mono px-1.5 py-0.5 rounded text-[10px] ${
                    trader.riskScore <= 3 
                      ? 'bg-[#6dff8a]/20 text-[#6dff8a]' 
                      : trader.riskScore <= 5 
                        ? 'bg-yellow-400/20 text-yellow-300' 
                        : 'bg-red-400/20 text-red-300'
                  }`}>
                    {trader.riskScore} / 10
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-[10px]">Copiers:</span>
                  <span className="font-bold text-white font-mono text-[10px]">{trader.copiers.toLocaleString()}</span>
                </div>
              </div>

              {/* Top Holdings */}
              <div>
                <span className="text-[10px] text-white/40 font-semibold block mb-1.5 uppercase tracking-wider">Top Holdings</span>
                <div className="flex flex-wrap gap-1.5">
                  {trader.topHoldings.map((ticker, idx) => (
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

            {/* Actions */}
            <div className="border-t border-white/5 pt-3 flex items-center justify-between">
              <span className="text-[10px] text-white/30 font-mono">ID: {trader.id}</span>
              <button
                onClick={() => handleDeleteTrader(trader.id, trader.name)}
                className="flex items-center gap-1 text-xs text-red-400/70 hover:text-red-300 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD TRADER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#171a10] border border-[#6dff8a]/30 rounded-3xl p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6dff8a]/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-[#6dff8a]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add New Pro Trader</h3>
                  <p className="text-xs text-white/50">Register lead investor profile to the CopyTrader network</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTrader} className="space-y-4">
              {/* Photo selection with quick presets */}
              <div className="space-y-2">
                <label className="text-xs text-white/70 block font-medium">Trader Profile Picture</label>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-black/40 border border-white/10">
                  <img 
                    src={avatarUrl} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#6dff8a] shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = AVATAR_PRESETS[0].url;
                    }}
                  />
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[11px] text-white/60 block">Select a curated portrait or enter custom image URL:</span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6dff8a]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                        avatarUrl === preset.url
                          ? 'border-[#6dff8a] bg-[#6dff8a]/20 text-[#6dff8a]'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Handle */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-white/70 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Vance"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!handle) {
                        setHandle(`@${e.target.value.toLowerCase().replace(/\s+/g, '_')}`);
                      }
                    }}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6dff8a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70 block">Handle / Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. @lvance_quant"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6dff8a]"
                  />
                </div>
              </div>

              {/* Professional Title & Return */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-white/70 block">Professional Role / Strategy</label>
                  <input
                    type="text"
                    placeholder="e.g. Multi-Asset Macro Lead"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6dff8a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70 block">24-Month Return (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 52.4"
                    value={return24M}
                    onChange={(e) => setReturn24M(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-[#6dff8a] font-bold font-mono focus:outline-none focus:border-[#6dff8a]"
                  />
                </div>
              </div>

              {/* Copiers & Risk Score */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-white/70 block">Active Copiers Count</label>
                  <input
                    type="number"
                    placeholder="e.g. 950"
                    value={copiers}
                    onChange={(e) => setCopiers(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#6dff8a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70 block">
                    Risk Score: <strong className="text-white">{riskScore} / 10</strong>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={riskScore}
                    onChange={(e) => setRiskScore(parseInt(e.target.value, 10))}
                    className="w-full accent-[#6dff8a] cursor-pointer mt-2"
                  />
                </div>
              </div>

              {/* Top Holdings */}
              <div className="space-y-1">
                <label className="text-xs text-white/70 block">Top Holdings (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. NVDA, BTC, ETH, AAPL, AMZN"
                  value={topHoldings}
                  onChange={(e) => setTopHoldings(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#6dff8a]"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-xs text-white/70 block">Biography &amp; Philosophy</label>
                <textarea
                  rows={3}
                  placeholder="Describe investment methodology, factor weighting, and risk management parameters..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6dff8a] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-xs shadow-[0_0_20px_rgba(109,255,138,0.25)] transition-all cursor-pointer"
                >
                  Publish Pro Trader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
