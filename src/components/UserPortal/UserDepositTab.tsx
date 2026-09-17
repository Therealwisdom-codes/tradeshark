import React, { useState } from 'react';
import { 
  DollarSign, 
  Building, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  Upload, 
  Key, 
  QrCode, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  Clock, 
  FileText,
  CreditCard,
  Info
} from 'lucide-react';
import { useBrokerage } from '../../context/BrokerageContext';
import { FundingTransaction } from '../../types';

interface UserDepositTabProps {
  onNotify: (msg: string) => void;
  onSuccessSwitchToHistory?: () => void;
}

type DepositMethodType = 'crypto' | 'bank' | 'card';
type CryptoAsset = 'USDT_TRC20' | 'USDT_ERC20' | 'BTC' | 'ETH';

const CRYPTO_CONFIGS: Record<CryptoAsset, { name: string; network: string; address: string; minDeposit: string; confirmations: string }> = {
  USDT_TRC20: {
    name: 'Tether USD (TRC20)',
    network: 'Tron (TRC20)',
    address: 'TYDzsYUEpvnYmQk4zGP9s21ZwT32Kh4WwX',
    minDeposit: '50 USDT',
    confirmations: '12 Network Confirmations (~2 mins)'
  },
  USDT_ERC20: {
    name: 'Tether USD (ERC20)',
    network: 'Ethereum (ERC20)',
    address: '0x71C8364413ab5474c7B6F35B9B74b5a374662d04',
    minDeposit: '100 USDT',
    confirmations: '18 Network Confirmations (~5 mins)'
  },
  BTC: {
    name: 'Bitcoin (BTC)',
    network: 'Bitcoin Native (SegWit)',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    minDeposit: '0.001 BTC',
    confirmations: '2 Confirmations (~20 mins)'
  },
  ETH: {
    name: 'Ethereum (ETH)',
    network: 'Ethereum Mainnet',
    address: '0x71C8364413ab5474c7B6F35B9B74b5a374662d04',
    minDeposit: '0.02 ETH',
    confirmations: '15 Network Confirmations (~3 mins)'
  }
};

export const UserDepositTab: React.FC<UserDepositTabProps> = ({ onNotify, onSuccessSwitchToHistory }) => {
  const { currentUser, submitDeposit } = useBrokerage();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [method, setMethod] = useState<DepositMethodType>('crypto');
  const [amount, setAmount] = useState('2500');
  
  // Crypto Options
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset>('USDT_TRC20');
  
  // Auth & Proof verification states
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [txHash, setTxHash] = useState('');
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('849201');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTxId, setSubmittedTxId] = useState<string | null>(null);

  const bankReferenceCode = `TS-${currentUser.id}-DEP`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    onNotify(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFakeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFileName(e.target.files[0].name);
      onNotify(`Uploaded proof file: ${e.target.files[0].name}`);
    }
  };

  const handleProceedToVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 100) {
      onNotify('Minimum deposit is $100.');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const amountNum = parseFloat(amount);
    let fundingMethod: FundingTransaction['method'] = 'Crypto (USDT/BTC)';
    if (method === 'bank') fundingMethod = 'Bank Wire';
    else if (method === 'card') fundingMethod = 'Debit/Credit Card';

    setTimeout(() => {
      submitDeposit(amountNum, fundingMethod);
      const generatedId = `DEP-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedTxId(generatedId);
      setIsSubmitting(false);
      setStep(3);
      onNotify(`Deposit request of $${amountNum.toLocaleString()} registered with Treasury!`);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left py-2">
      {/* Step Indicator */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
            step >= 1 ? 'bg-[#6dff8a] text-[#15170f]' : 'bg-white/10 text-white/50'
          }`}>
            1
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Method &amp; Segregated Details</span>
            <span className="text-[10px] text-white/40">Select transfer rail &amp; destination</span>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-white/20" />

        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
            step >= 2 ? 'bg-[#6dff8a] text-[#15170f]' : 'bg-white/10 text-white/50'
          }`}>
            2
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Transfer Auth &amp; Proof</span>
            <span className="text-[10px] text-white/40">2FA &amp; reference verification</span>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-white/20" />

        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
            step === 3 ? 'bg-[#6dff8a] text-[#15170f]' : 'bg-white/10 text-white/50'
          }`}>
            3
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Treasury Sync</span>
            <span className="text-[10px] text-white/40">Approval &amp; Settlement</span>
          </div>
        </div>
      </div>

      {/* STEP 1: METHOD SELECTION & SEGREGATED DETAILS */}
      {step === 1 && (
        <div className="space-y-5">
          {/* Method Selector Tabs */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod('crypto')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                method === 'crypto'
                  ? 'border-[#6dff8a] bg-[#6dff8a]/10 shadow-[0_0_20px_rgba(109,255,138,0.15)]'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-[#6dff8a]/20 text-[#6dff8a] text-[10px] font-bold">
                  RECOMMENDED • FASTEST
                </span>
                <QrCode className="w-4 h-4 text-[#6dff8a]" />
              </div>
              <h4 className="font-bold text-white text-sm">Crypto Transfer</h4>
              <p className="text-[11px] text-white/50 mt-1">USDT (TRC20/ERC20), Bitcoin, Ethereum with instant address.</p>
            </button>

            <button
              type="button"
              onClick={() => setMethod('bank')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                method === 'bank'
                  ? 'border-[#6dff8a] bg-[#6dff8a]/10 shadow-[0_0_20px_rgba(109,255,138,0.15)]'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-400 text-[10px] font-bold">
                  TIER-1 BANKING
                </span>
                <Building className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="font-bold text-white text-sm">Bank Wire / Transfer</h4>
              <p className="text-[11px] text-white/50 mt-1">Direct wire, SEPA, &amp; Faster Payments to segregated escrow.</p>
            </button>
          </div>

          {/* Amount Input */}
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-white/70 font-medium">Planned Deposit Amount ($USD)</label>
              <span className="text-[11px] text-white/40">Minimum: $100 • Zero Broker Fees</span>
            </div>

            <div className="relative">
              <DollarSign className="w-5 h-5 text-[#6dff8a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="100"
                step="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-2xl pl-10 pr-4 py-3 text-white font-bold text-lg focus:outline-none focus:border-[#6dff8a]"
              />
            </div>

            <div className="flex gap-2 pt-1">
              {['500', '1000', '2500', '5000', '10000'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 border border-white/5 cursor-pointer"
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* CRYPTO TRANSFER DETAILS */}
          {method === 'crypto' && (
            <div className="p-6 rounded-3xl bg-black/40 border border-white/15 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#6dff8a]" />
                    Official Segregated Crypto Deposit Wallet
                  </h4>
                  <p className="text-xs text-white/50">Funds sent here are monitored by TradeShark automated settlement oracles.</p>
                </div>
              </div>

              {/* Coin selection */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['USDT_TRC20', 'USDT_ERC20', 'BTC', 'ETH'] as const).map((coin) => (
                  <button
                    key={coin}
                    type="button"
                    onClick={() => setSelectedCrypto(coin)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      selectedCrypto === coin
                        ? 'border-[#6dff8a] bg-[#6dff8a]/20 text-[#6dff8a]'
                        : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {CRYPTO_CONFIGS[coin].name}
                  </button>
                ))}
              </div>

              {/* QR and Address Display Card */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center gap-5">
                {/* Visual QR Code Display */}
                <div className="w-32 h-32 p-2 rounded-2xl bg-white flex flex-col items-center justify-center shadow-lg shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Visual Stylized QR Matrix */}
                    <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                    <rect x="10" y="10" width="25" height="25" fill="#15170f" />
                    <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="18" width="9" height="9" fill="#15170f" />

                    <rect x="65" y="10" width="25" height="25" fill="#15170f" />
                    <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="73" y="18" width="9" height="9" fill="#15170f" />

                    <rect x="10" y="65" width="25" height="25" fill="#15170f" />
                    <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="73" width="9" height="9" fill="#15170f" />

                    <rect x="42" y="12" width="6" height="6" fill="#15170f" />
                    <rect x="52" y="20" width="6" height="6" fill="#15170f" />
                    <rect x="40" y="38" width="20" height="20" fill="#15170f" />
                    <rect x="68" y="45" width="8" height="8" fill="#15170f" />
                    <rect x="42" y="68" width="7" height="7" fill="#15170f" />
                    <rect x="58" y="78" width="10" height="10" fill="#15170f" />
                    <rect x="78" y="68" width="12" height="12" fill="#15170f" />
                  </svg>
                  <span className="text-[8px] font-mono text-[#15170f] font-bold mt-1">SCAN ADDRESS</span>
                </div>

                {/* Details & Copy Box */}
                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <span className="text-[10px] text-white/40 block font-medium">NETWORK SPECIFICATION</span>
                    <span className="text-xs font-bold text-[#6dff8a] font-mono">
                      {CRYPTO_CONFIGS[selectedCrypto].network}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-white/40 block font-medium">DEPOSIT WALLET ADDRESS</span>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-white/15">
                      <code className="text-xs font-mono text-white break-all flex-1 select-all">
                        {CRYPTO_CONFIGS[selectedCrypto].address}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(CRYPTO_CONFIGS[selectedCrypto].address, 'Wallet Address')}
                        className="p-2 rounded-lg bg-white/10 hover:bg-[#6dff8a] hover:text-[#15170f] text-white transition-all cursor-pointer shrink-0"
                        title="Copy Address"
                      >
                        {copiedField === 'Wallet Address' ? <Check className="w-4 h-4 text-[#6dff8a]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
                    <span>Min: <strong className="text-white">{CRYPTO_CONFIGS[selectedCrypto].minDeposit}</strong></span>
                    <span>Speed: <strong className="text-white">{CRYPTO_CONFIGS[selectedCrypto].confirmations}</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 text-xs text-yellow-300/90 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Send only <strong>{CRYPTO_CONFIGS[selectedCrypto].name}</strong> over the <strong>{CRYPTO_CONFIGS[selectedCrypto].network}</strong> network. Sending assets to an incorrect address or rail may result in permanent forfeiture.
                </p>
              </div>
            </div>
          )}

          {/* BANK WIRE DETAILS */}
          {method === 'bank' && (
            <div className="p-6 rounded-3xl bg-black/40 border border-white/15 space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-cyan-400" />
                  Segregated Custodial Banking Coordinates
                </h4>
                <p className="text-xs text-white/50">FCA / CySEC compliant client segregated account details.</p>
              </div>

              {/* Dynamic reference warning */}
              <div className="p-3.5 rounded-2xl bg-[#6dff8a]/10 border border-[#6dff8a]/30 space-y-1">
                <span className="text-[10px] text-[#6dff8a] font-bold block uppercase tracking-wider">
                  ★ MANDATORY PAYMENT REFERENCE (MUST INCLUDE)
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold font-mono text-white tracking-widest">{bankReferenceCode}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankReferenceCode, 'Payment Reference')}
                    className="flex items-center gap-1 text-xs font-bold text-[#6dff8a] bg-[#6dff8a]/20 px-3 py-1 rounded-lg hover:bg-[#6dff8a] hover:text-[#15170f] transition-all cursor-pointer"
                  >
                    {copiedField === 'Payment Reference' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Code
                  </button>
                </div>
                <p className="text-[10px] text-white/50">
                  Include this code in the narrative/memo of your bank transfer for instant automated matching.
                </p>
              </div>

              {/* Table of bank coordinates */}
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Beneficiary Name', value: 'TradeShark Global Securities Ltd (Client Segregated)' },
                  { label: 'Bank Name', value: 'Barclays Bank PLC - Corporate Banking Desk' },
                  { label: 'Account Number / IBAN', value: 'GB29 BUKB 2000 0084 7291 03' },
                  { label: 'SWIFT / BIC', value: 'BUKBGB22' },
                  { label: 'Sort Code / Routing', value: '20-00-84' },
                  { label: 'Bank Address', value: '1 Churchill Place, Canary Wharf, London E14 5HP, UK' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 text-[11px]">{item.label}:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white font-medium text-right text-[11px]">{item.value}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.value, item.label)}
                        className="text-white/40 hover:text-[#6dff8a] p-1 transition-colors cursor-pointer"
                        title="Copy"
                      >
                        {copiedField === item.label ? <Check className="w-3.5 h-3.5 text-[#6dff8a]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action button to Step 2 */}
          <button
            type="button"
            onClick={handleProceedToVerification}
            className="w-full py-4 rounded-2xl bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-sm shadow-[0_0_20px_rgba(109,255,138,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            I Have Saved The Coordinates • Next Step (Transfer Auth)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: TRANSFER AUTHENTICATION & PROOF SUBMISSION */}
      {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="p-6 rounded-3xl bg-black/40 border border-white/15 space-y-5">
          <div className="border-b border-white/10 pb-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#6dff8a]" />
              Transfer Authorization &amp; Receipt Verification
            </h4>
            <p className="text-xs text-white/50">
              Provide your transfer tracking hash or payment receipt to authorize and expedite treasury credit.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
            <div>
              <span className="text-white/40 block text-[10px]">DEPOSIT AMOUNT:</span>
              <span className="text-base font-bold text-[#6dff8a] font-mono">${parseFloat(amount).toLocaleString()} USD</span>
            </div>
            <div className="text-right">
              <span className="text-white/40 block text-[10px]">SELECTED CHANNEL:</span>
              <span className="font-bold text-white">{method === 'crypto' ? CRYPTO_CONFIGS[selectedCrypto].name : 'Bank Wire'}</span>
            </div>
          </div>

          {/* TX Hash or Bank Reference Input */}
          <div className="space-y-1.5">
            <label className="text-xs text-white/70 block font-medium">
              {method === 'crypto' ? 'Transaction Hash / TXID *' : 'Bank Transfer Reference / Sender Name *'}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#6dff8a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder={method === 'crypto' ? 'e.g. 0x8f7a21bc9e44... or 64-character hash' : 'e.g. Barclays Ref #489201 or Alex Mercer'}
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-[#6dff8a]"
              />
            </div>
            <span className="text-[10px] text-white/40 block">Found in your wallet or online banking confirmation receipt.</span>
          </div>

          {/* Receipt upload box */}
          <div className="space-y-1.5">
            <label className="text-xs text-white/70 block font-medium">Proof of Transfer / Receipt (Optional)</label>
            <label className="border-2 border-dashed border-white/15 hover:border-[#6dff8a]/60 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/[0.01]">
              <Upload className="w-6 h-6 text-white/40 mb-1" />
              <span className="text-xs text-white/80 font-medium">
                {proofFileName ? proofFileName : 'Click to attach PDF / PNG / JPG receipt'}
              </span>
              <span className="text-[10px] text-white/40 mt-0.5">Maximum file size: 10MB</span>
              <input type="file" onChange={handleFakeFileUpload} className="hidden" accept="image/*,.pdf" />
            </label>
          </div>

          {/* 2FA Security Token */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs text-white/70 block font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#6dff8a]" />
                Security 2FA Confirmation Code
              </label>
              <span className="text-[10px] text-[#6dff8a]">Authenticated Session</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-36 bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-center text-white font-mono font-bold tracking-widest text-sm focus:outline-none focus:border-[#6dff8a]"
              />
              <span className="text-[11px] text-white/40">Enter 6-digit confirmation code</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold cursor-pointer"
            >
              Back to Details
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-xs shadow-[0_0_20px_rgba(109,255,138,0.25)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Synchronizing with Treasury...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Authorize Deposit &amp; Notify Admin Queue
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: SUBMITTED SUCCESS & TREASURY TIMELINE */}
      {step === 3 && (
        <div className="p-8 rounded-3xl bg-black/40 border border-[#6dff8a]/40 text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-[#6dff8a]/20 border border-[#6dff8a]/40 flex items-center justify-center mx-auto text-[#6dff8a] shadow-[0_0_30px_rgba(109,255,138,0.3)]">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#6dff8a]/15 text-[#6dff8a] text-[11px] font-bold tracking-wider">
              TRANSACTION BROADCAST RECORDED
            </span>
            <h3 className="text-2xl font-bold text-white">Deposit Submitted for Treasury Approval</h3>
            <p className="text-xs text-white/60 max-w-md mx-auto">
              Your transfer of <strong className="text-white font-mono">${parseFloat(amount).toLocaleString()} USD</strong> has been registered with reference <strong className="text-[#6dff8a] font-mono">{submittedTxId}</strong>.
            </p>
          </div>

          {/* Timeline */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 text-left max-w-md mx-auto text-xs font-mono">
            <div className="flex items-center gap-3 text-[#6dff8a]">
              <Check className="w-4 h-4 shrink-0" />
              <span>[1/4] Client Transfer Authorized ({method === 'crypto' ? 'Blockchain Broadcast' : 'Bank Wire'})</span>
            </div>
            <div className="flex items-center gap-3 text-[#6dff8a]">
              <Check className="w-4 h-4 shrink-0" />
              <span>[2/4] Compliance &amp; AML Risk Check: Passed (Low Risk)</span>
            </div>
            <div className="flex items-center gap-3 text-yellow-400 animate-pulse">
              <Clock className="w-4 h-4 shrink-0" />
              <span>[3/4] Admin Treasury Confirmation: Awaiting Review</span>
            </div>
            <div className="flex items-center gap-3 text-white/30">
              <Circle className="w-3.5 h-3.5 shrink-0" />
              <span>[4/4] Segregated Trading Balance Credited</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setTxHash('');
                setProofFileName(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Make Another Deposit
            </button>
            {onSuccessSwitchToHistory && (
              <button
                type="button"
                onClick={onSuccessSwitchToHistory}
                className="px-5 py-2.5 rounded-xl bg-[#6dff8a] text-[#15170f] font-bold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(109,255,138,0.25)]"
              >
                View in Funding History
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Circle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
  </svg>
);
