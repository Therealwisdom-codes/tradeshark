import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  FileText, 
  Camera, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Check, 
  Sparkles, 
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Lock
} from 'lucide-react';
import { useBrokerage } from '../../context/BrokerageContext';
import { UserAccount, KycSubmissionPayload } from '../../types';

interface UserKycTabProps {
  currentUser: UserAccount;
  onNotify: (msg: string) => void;
}

export const UserKycTab: React.FC<UserKycTabProps> = ({ currentUser, onNotify }) => {
  const { submitKycApplication } = useBrokerage();

  // Wizard Step: 1 = Personal Details, 2 = ID Doc, 3 = Proof of Address, 4 = Biometric Selfie
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(currentUser.dateOfBirth || '1988-05-14');
  const [nationality, setNationality] = useState(currentUser.country || 'United Kingdom');
  const [streetAddress, setStreetAddress] = useState(currentUser.streetAddress || '42 Kensington Church Street');
  const [city, setCity] = useState(currentUser.city || 'London');
  const [postalCode, setPostalCode] = useState(currentUser.postalCode || 'W8 4DB');

  const [docType, setDocType] = useState<KycSubmissionPayload['docType']>(
    (currentUser.kycDocType as any) || 'Passport'
  );
  const [docNumber, setDocNumber] = useState(currentUser.kycDocNumber || 'GB-94821039');
  const [docExpiryDate, setDocExpiryDate] = useState('2032-11-20');
  const [docFrontName, setDocFrontName] = useState(currentUser.kycDocFrontName || 'passport_photo_page.jpg');
  const [docBackName, setDocBackName] = useState(currentUser.kycDocBackName || 'passport_mrz_page.jpg');

  const [proofAddressName, setProofAddressName] = useState(
    currentUser.kycProofAddressName || 'barclays_bank_statement_aug2026.pdf'
  );

  // Biometric scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [selfieTaken, setSelfieTaken] = useState(currentUser.kycSelfieVerified || false);

  const handleStartBiometricScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSelfieTaken(true);
      onNotify('Biometric liveness verification completed (98.8% match)!');
    }, 2200);
  };

  const handleSubmitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfieTaken) {
      onNotify('Please complete the biometric face scan in Step 4 before submitting');
      setStep(4);
      return;
    }

    submitKycApplication({
      userId: currentUser.id,
      fullName,
      dateOfBirth,
      nationality,
      streetAddress,
      city,
      postalCode,
      docType,
      docNumber,
      docExpiryDate,
      docFrontName,
      docBackName,
      proofAddressName,
      selfieTaken: true
    });

    onNotify('KYC verification package submitted! Compliance review initiated.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Current Verification Status */}
      <div className={`p-5 rounded-3xl border ${
        currentUser.kycStatus === 'Approved'
          ? 'bg-[#182614] border-[#6dff8a]/40 text-white'
          : currentUser.kycStatus === 'Action Required'
          ? 'bg-red-950/40 border-red-500/40 text-white'
          : currentUser.kycStatus === 'Pending' || currentUser.kycStatus === 'Under Review'
          ? 'bg-yellow-950/30 border-yellow-400/40 text-white'
          : 'bg-white/[0.02] border-white/10 text-white'
      } flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            currentUser.kycStatus === 'Approved'
              ? 'bg-[#6dff8a]/20 text-[#6dff8a]'
              : currentUser.kycStatus === 'Action Required'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-yellow-400/20 text-yellow-400'
          }`}>
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold">
                {currentUser.kycStatus === 'Approved' 
                  ? 'FCA Tier 2 - Verified Pro Certified' 
                  : currentUser.kycStatus === 'Action Required'
                  ? 'Compliance Action Required: Document Resubmission'
                  : currentUser.kycStatus === 'Pending' || currentUser.kycStatus === 'Under Review'
                  ? 'KYC Verification In Progress'
                  : 'Identity Verification Incomplete'}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentUser.kycStatus === 'Approved' 
                  ? 'bg-[#6dff8a] text-[#15170f]' 
                  : currentUser.kycStatus === 'Action Required'
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-yellow-400 text-black'
              }`}>
                {currentUser.kycStatus}
              </span>
            </div>

            <p className="text-xs text-white/70 mt-1">
              {currentUser.kycStatus === 'Approved'
                ? `Account certified on ${currentUser.kycSubmittedDate || '2026-09-09'} under UK FCA Client Money & AML Rules. Max leverage: 1:${currentUser.leverage}.`
                : currentUser.kycStatus === 'Action Required'
                ? `Compliance Note: ${currentUser.kycNotes || 'Please upload an updated proof of residence dated within 90 days.'}`
                : currentUser.kycStatus === 'Pending' || currentUser.kycStatus === 'Under Review'
                ? 'Your submitted identity artifacts are queued in our compliance desk. Review turnaround is typically within 15 minutes.'
                : 'Complete regulatory identity verification to unlock live market trading and high-volume deposits.'}
            </p>
          </div>
        </div>

        {currentUser.kycStatus === 'Approved' && (
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#6dff8a] block">CERTIFICATE ID</span>
            <span className="font-mono font-bold text-xs text-white">TS-FCA-2026-89104</span>
          </div>
        )}
      </div>

      {/* KYC WIZARD CARD */}
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            {[
              { num: 1, label: 'Personal Details' },
              { num: 2, label: 'Identity Document' },
              { num: 3, label: 'Proof of Address' },
              { num: 4, label: 'Biometric Face Scan' }
            ].map((s) => {
              const isActive = step === s.num;
              const isPast = step > s.num || (currentUser.kycStatus === 'Approved' && s.num <= 4);
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(s.num as any)}
                  className={`flex items-center gap-2 py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#6dff8a] text-[#15170f]'
                      : isPast
                      ? 'bg-[#6dff8a]/20 text-[#6dff8a]'
                      : 'bg-white/5 text-white/50 hover:text-white'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive ? 'bg-[#15170f] text-[#6dff8a]' : isPast ? 'bg-[#6dff8a] text-[#15170f]' : 'bg-white/20 text-white'
                  }`}>
                    {isPast ? '✓' : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-white/40 hidden md:inline">
            Step {step} of 4
          </span>
        </div>

        {/* STEP 1: PERSONAL DETAILS */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h4 className="text-sm font-bold text-white">Step 1: Legal Profile &amp; Residential Address</h4>
              <p className="text-xs text-white/50">Details must match the official documents you submit.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-white/70 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6dff8a]"
                  required
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6dff8a]"
                  required
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1">Nationality / Country of Tax Residence</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6dff8a]"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-white/70 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6dff8a]"
                  required
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1">City &amp; Postal Code</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6dff8a]"
                    required
                  />
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postcode"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6dff8a]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6dff8a] text-[#15170f] font-bold text-xs hover:bg-[#5ce077]"
              >
                <span>Continue to Document Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: IDENTITY DOCUMENT */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h4 className="text-sm font-bold text-white">Step 2: Government-Issued Identity Document</h4>
              <p className="text-xs text-white/50">Upload a valid, unexpired government identification document.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-white/70 block mb-1">Document Category</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6dff8a]"
                >
                  <option value="Passport">International Passport</option>
                  <option value="National ID">National Identity Card</option>
                  <option value="Drivers License">Driver's License</option>
                </select>
              </div>

              <div>
                <label className="text-white/70 block mb-1">Document Number</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6dff8a] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={docExpiryDate}
                  onChange={(e) => setDocExpiryDate(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6dff8a]"
                  required
                />
              </div>
            </div>

            {/* Document Upload Dropzones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Front Page */}
              <div className="p-4 rounded-2xl bg-black/40 border-2 border-dashed border-white/20 hover:border-[#6dff8a]/50 text-center space-y-2 transition-colors">
                <Upload className="w-6 h-6 text-[#6dff8a] mx-auto" />
                <div className="text-xs font-bold text-white">Upload Front Photo / Scanned Page</div>
                <p className="text-[11px] text-white/50">PNG, JPG, or PDF up to 10MB</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-white text-[11px] font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6dff8a]" />
                  <span>{docFrontName}</span>
                </div>
              </div>

              {/* Back Page */}
              <div className="p-4 rounded-2xl bg-black/40 border-2 border-dashed border-white/20 hover:border-[#6dff8a]/50 text-center space-y-2 transition-colors">
                <Upload className="w-6 h-6 text-[#6dff8a] mx-auto" />
                <div className="text-xs font-bold text-white">Upload Back Page / MRZ Signature Strip</div>
                <p className="text-[11px] text-white/50">Required for ID cards and Driving Licenses</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-white text-[11px] font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6dff8a]" />
                  <span>{docBackName}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6dff8a] text-[#15170f] font-bold text-xs hover:bg-[#5ce077]"
              >
                <span>Continue to Proof of Address</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROOF OF RESIDENCE */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h4 className="text-sm font-bold text-white">Step 3: Proof of Residential Address</h4>
              <p className="text-xs text-white/50">Must be dated within the last 90 days with your full name and address clearly visible.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
                <span className="font-bold text-white block">Accepted Documents:</span>
                <ul className="space-y-1 text-white/70 list-disc list-inside text-[11px]">
                  <li>Bank Account or Credit Card Statement</li>
                  <li>Utility Bill (Water, Gas, Electricity, Fiber)</li>
                  <li>Council Tax Bill / Municipal Assessment</li>
                  <li>Government Agency Correspondence</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border-2 border-dashed border-white/20 hover:border-[#6dff8a]/50 text-center space-y-2 transition-colors flex flex-col items-center justify-center">
                <Upload className="w-6 h-6 text-[#6dff8a]" />
                <div className="text-xs font-bold text-white">Upload Proof of Address Document</div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-white text-[11px] font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6dff8a]" />
                  <span>{proofAddressName}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6dff8a] text-[#15170f] font-bold text-xs hover:bg-[#5ce077]"
              >
                <span>Continue to Biometric Liveness Scan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: BIOMETRIC LIVENESS VERIFICATION */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h4 className="text-sm font-bold text-white">Step 4: Biometric Liveness Verification</h4>
              <p className="text-xs text-white/50">Anti-spoof facial scan to confirm that you are the legitimate document owner.</p>
            </div>

            <div className="max-w-md mx-auto p-6 rounded-3xl bg-black/50 border border-white/15 text-center space-y-4">
              {/* Visual Webcam Frame */}
              <div className="relative aspect-[4/3] rounded-2xl bg-[#0e110a] border-2 border-[#6dff8a]/40 flex flex-col items-center justify-center overflow-hidden">
                {isScanning && (
                  <div className="absolute inset-0 bg-[#6dff8a]/10 z-10 flex items-center justify-center">
                    <div className="w-full h-1 bg-[#6dff8a] shadow-[0_0_15px_#6dff8a] absolute animate-bounce" />
                    <span className="text-xs font-mono font-bold text-[#6dff8a] bg-black/70 px-3 py-1 rounded-full">
                      Scanning Facial Geometry...
                    </span>
                  </div>
                )}

                {/* Face Silhouette Oval */}
                <div className="w-28 h-36 rounded-[50%] border-2 border-dashed border-[#6dff8a]/70 flex items-center justify-center relative">
                  <div className="w-16 h-20 rounded-[50%] bg-[#6dff8a]/10 flex items-center justify-center text-white font-bold">
                    <User className="w-8 h-8 text-[#6dff8a]" />
                  </div>
                </div>

                <div className="mt-3 text-[11px] font-mono text-white/60">
                  {selfieTaken ? (
                    <span className="text-[#6dff8a] font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Liveness Passed • Match 98.8%
                    </span>
                  ) : (
                    'Position your face inside the frame'
                  )}
                </div>
              </div>

              {!selfieTaken ? (
                <button
                  type="button"
                  disabled={isScanning}
                  onClick={handleStartBiometricScan}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#6dff8a] text-[#15170f] font-bold text-xs hover:bg-[#5ce077] disabled:opacity-50 transition-all shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isScanning ? 'Verifying Liveness...' : 'Start Facial Verification'}</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-[#6dff8a]/15 border border-[#6dff8a]/30 text-xs text-[#6dff8a] font-semibold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Biometric check certified. Ready to submit package.</span>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSubmitKyc}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#6dff8a] text-[#15170f] font-bold text-xs hover:bg-[#5ce077] shadow-[0_0_25px_rgba(109,255,138,0.3)] transition-all transform hover:scale-105 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Verification Package</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
