import React, { useState } from 'react';
import { PopularInvestor } from '../types';
import { X, CheckCircle2, Shield, Users, ArrowRight, DollarSign } from 'lucide-react';

interface CopyModalProps {
  investor: PopularInvestor | null;
  onClose: () => void;
}

export const CopyModal: React.FC<CopyModalProps> = ({ investor, onClose }) => {
  if (!investor) return null;

  const [amount, setAmount] = useState(500);
  const [stopLossPercent, setStopLossPercent] = useState(60);
  const [copyOpenTrades, setCopyOpenTrades] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const stopLossAmount = (amount * (stopLossPercent / 100)).toFixed(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#181b12] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-7 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#6dff8a]/20 text-[#6dff8a] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">CopyTrader™ Activated</h3>
            <p className="text-sm text-[#a3a89e]">
              You are now copying <strong>{investor.name}</strong> with <strong>${amount.toLocaleString()}</strong>. Real-time portfolio trades will replicate proportionally.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="w-full py-3 rounded-full bg-[#6dff8a] text-[#15170f] font-bold text-sm"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Investor Header */}
            <div className="flex items-center gap-3.5 pr-8">
              <img 
                src={investor.avatarUrl} 
                alt={investor.name} 
                className="w-12 h-12 rounded-2xl object-cover shrink-0 ring-2 ring-[#6dff8a]/40 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{investor.name}</h3>
                  <span className="text-[10px] text-[#6dff8a] bg-[#6dff8a]/10 px-2 py-0.5 rounded font-bold">
                    +{investor.return24M}%
                  </span>
                </div>
                <div className="text-xs text-[#a3a89e]">{investor.role}</div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs">
              <div>
                <span className="text-white/50 block">Active Copiers:</span>
                <span className="font-bold text-white">{investor.copiers.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-white/50 block">Risk Score:</span>
                <span className="font-bold text-[#6dff8a]">{investor.riskScore} / 10 Low-Medium</span>
              </div>
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#d4d6cf]">
                <span>Allocation Amount ($USD):</span>
                <span>Minimum $200</span>
              </div>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-[#6dff8a] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="200"
                  max="50000"
                  step="50"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-4 py-3 text-white font-heading font-bold text-base focus:outline-none focus:border-[#6dff8a]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                {[200, 500, 1000, 2500, 5000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(v)}
                    className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] text-white/80 font-medium border border-white/5"
                  >
                    ${v}
                  </button>
                ))}
              </div>
            </div>

            {/* Stop loss guard */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Stop Copying if value drops below:</span>
                <span className="font-bold text-white font-mono">${stopLossAmount} ({stopLossPercent}%)</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="5"
                value={stopLossPercent}
                onChange={(e) => setStopLossPercent(Number(e.target.value))}
                className="w-full accent-[#6dff8a] cursor-pointer"
              />
            </div>

            {/* Checkbox copy open trades */}
            <label className="flex items-center gap-3 text-xs text-[#d4d6cf] cursor-pointer">
              <input
                type="checkbox"
                checked={copyOpenTrades}
                onChange={(e) => setCopyOpenTrades(e.target.checked)}
                className="accent-[#6dff8a] w-4 h-4 rounded"
              />
              <span>Copy currently open trades at prevailing market prices</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(109,255,138,0.25)] transition-all transform hover:scale-[1.01]"
            >
              <span>Confirm &amp; Copy {investor.name.split(' ')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
