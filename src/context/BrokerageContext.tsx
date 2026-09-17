import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserAccount, 
  FundingTransaction, 
  AuditLog, 
  UserPosition,
  PopularInvestor,
  UserTier,
  KycStatus,
  AccountStatus,
  EmailMessage,
  KycSubmissionPayload
} from '../types';
import { POPULAR_INVESTORS } from '../data/mockData';

interface BrokerageContextType {
  users: UserAccount[];
  currentUser: UserAccount;
  setCurrentUserId: (id: string) => void;
  transactions: FundingTransaction[];
  auditLogs: AuditLog[];
  positions: UserPosition[];
  emails: EmailMessage[];
  
  // User Management & Setup
  createUser: (userData: Omit<UserAccount, 'id' | 'joinedDate' | 'lastIp'>) => UserAccount;
  updateUser: (id: string, updates: Partial<UserAccount>) => void;
  setUserStatus: (id: string, status: AccountStatus, reason?: string) => void;
  toggleTradingPermission: (id: string, permission: 'allowTrading' | 'allowShorting' | 'allowCrypto') => void;
  updateUserTier: (id: string, tier: UserTier) => void;
  updateUserLeverage: (id: string, leverage: number) => void;
  
  // KYC & Compliance
  approveKyc: (id: string, promotedTier?: UserTier) => void;
  rejectKyc: (id: string, reason: string) => void;
  requestKycResubmit: (id: string, note: string) => void;
  updateAmlRisk: (id: string, risk: 'Low' | 'Medium' | 'High') => void;
  submitKycApplication: (payload: KycSubmissionPayload) => void;
  
  // Funding & Cashier
  approveFunding: (txId: string) => void;
  rejectFunding: (txId: string, reason: string) => void;
  manualBalanceAdjustment: (
    userId: string, 
    amount: number, 
    type: 'Admin Credit' | 'Admin Debit' | 'Bonus', 
    note: string
  ) => void;
  submitDeposit: (amount: number, method: FundingTransaction['method']) => void;
  submitWithdrawal: (amount: number, method: FundingTransaction['method'], destination: string) => boolean;
  
  // Emailing & Communication System
  sendEmail: (email: Omit<EmailMessage, 'id' | 'date' | 'read'>) => EmailMessage;
  markEmailAsRead: (emailId: string) => void;
  deleteEmail: (emailId: string) => void;

  // Positions
  closePosition: (posId: string) => void;
  openPosition: (symbol: string, name: string, type: 'BUY' | 'SELL', units: string, price: number, category: string) => void;

  // Copy Trading / Traders
  popularInvestors: PopularInvestor[];
  addTrader: (trader: Omit<PopularInvestor, 'id'>) => PopularInvestor;
  removeTrader: (id: string | number) => void;
  updateTrader: (id: string | number, updates: Partial<PopularInvestor>) => void;
}

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'USR-891',
    name: 'Alex Mercer',
    email: 'alex.m@gmail.com',
    password: 'trader123',
    phone: '+44 7700 900142',
    country: 'United Kingdom',
    tier: 'Tier 2 - Verified Pro',
    currency: 'USD',
    realBalance: 104850.25,
    virtualBalance: 100000.00,
    kycStatus: 'Approved',
    kycDocType: 'Passport',
    kycDocNumber: 'GB-94821039',
    kycSubmittedDate: '2026-08-14 10:20',
    kycExpiryDate: '2032-05-11',
    facialMatchScore: 99.2,
    amlRisk: 'Low',
    pepWatchlistHit: false,
    status: 'Active',
    role: 'Trader',
    leverage: 100,
    allowTrading: true,
    allowShorting: true,
    allowCrypto: true,
    maxPositionLimit: 250000,
    joinedDate: '2026-07-10',
    lastIp: '185.122.4.92 (London, UK)',
    accountManager: 'David Sterling'
  },
  {
    id: 'USR-892',
    name: 'Sarah Jenkins',
    email: 'sjenkins@techcorp.io',
    password: 'vip123',
    phone: '+1 415 555 0198',
    country: 'United States',
    tier: 'Tier 3 - VIP Institutional',
    currency: 'USD',
    realBalance: 423000.00,
    virtualBalance: 250000.00,
    kycStatus: 'Approved',
    kycDocType: 'National ID',
    kycDocNumber: 'US-ID-992014',
    kycSubmittedDate: '2026-06-22 14:40',
    kycExpiryDate: '2030-10-18',
    facialMatchScore: 98.6,
    amlRisk: 'Low',
    pepWatchlistHit: false,
    status: 'Active',
    role: 'Pro Investor',
    leverage: 400,
    allowTrading: true,
    allowShorting: true,
    allowCrypto: true,
    maxPositionLimit: 1000000,
    joinedDate: '2026-05-15',
    lastIp: '64.104.22.10 (San Francisco, US)',
    accountManager: 'Victoria Sterling (VIP Desk)'
  },
  {
    id: 'USR-893',
    name: 'Liam Chen',
    email: 'liam.chen@outlook.com',
    password: 'trader123',
    phone: '+65 6789 0123',
    country: 'Singapore',
    tier: 'Tier 1 - Standard',
    currency: 'USD',
    realBalance: 15820.00,
    virtualBalance: 50000.00,
    kycStatus: 'Pending',
    kycDocType: 'Drivers License',
    kycDocNumber: 'SG-DL-882910',
    kycSubmittedDate: '2026-09-09 14:15',
    kycExpiryDate: '2029-01-30',
    facialMatchScore: 97.4,
    amlRisk: 'Low',
    pepWatchlistHit: false,
    status: 'Active',
    role: 'Trader',
    leverage: 30,
    allowTrading: true,
    allowShorting: false,
    allowCrypto: true,
    maxPositionLimit: 50000,
    joinedDate: '2026-09-08',
    lastIp: '118.189.34.12 (Singapore)',
    accountManager: 'Michael Wong'
  },
  {
    id: 'USR-894',
    name: 'Elena Rostov',
    email: 'e.rostov@proton.me',
    password: 'trader123',
    phone: '+49 151 2345678',
    country: 'Germany',
    tier: 'Tier 1 - Standard',
    currency: 'EUR',
    realBalance: 8450.00,
    virtualBalance: 10000.00,
    kycStatus: 'Under Review',
    kycDocType: 'Proof of Address',
    kycDocNumber: 'DE-POA-98124',
    kycSubmittedDate: '2026-09-08 09:30',
    facialMatchScore: 94.1,
    amlRisk: 'Medium',
    pepWatchlistHit: false,
    status: 'Trading Frozen',
    role: 'Trader',
    leverage: 30,
    allowTrading: false,
    allowShorting: false,
    allowCrypto: false,
    maxPositionLimit: 25000,
    joinedDate: '2026-09-07',
    lastIp: '194.12.88.5 (Berlin, Germany)',
    accountManager: 'David Sterling',
    kycNotes: 'Proof of residence utility bill older than 90 days. Awaiting refreshed copy.'
  },
  {
    id: 'USR-895',
    name: 'Tariq Al-Mansoor',
    email: 't.mansoor@gulfcap.ae',
    password: 'vip123',
    phone: '+971 4 888 9012',
    country: 'United Arab Emirates',
    tier: 'Tier 3 - VIP Institutional',
    currency: 'USD',
    realBalance: 850000.00,
    virtualBalance: 500000.00,
    kycStatus: 'Approved',
    kycDocType: 'Passport',
    kycDocNumber: 'AE-P-440192',
    kycSubmittedDate: '2026-04-10 11:00',
    kycExpiryDate: '2031-12-04',
    facialMatchScore: 99.8,
    amlRisk: 'Low',
    pepWatchlistHit: false,
    status: 'Active',
    role: 'VIP Client',
    leverage: 400,
    allowTrading: true,
    allowShorting: true,
    allowCrypto: true,
    maxPositionLimit: 2500000,
    joinedDate: '2026-04-01',
    lastIp: '86.96.229.1 (Dubai, UAE)',
    accountManager: 'Victoria Sterling (VIP Desk)'
  }
];

const INITIAL_TRANSACTIONS: FundingTransaction[] = [
  {
    id: 'TX-901',
    userId: 'USR-893',
    userName: 'Liam Chen',
    type: 'Deposit',
    amount: 25000,
    method: 'Bank Wire',
    status: 'Pending Approval',
    reference: 'WIRE-SG-99214',
    date: '2026-09-10 11:20',
    adminNote: 'Incoming SWIFT MT103 from DBS Bank Singapore. Client requested tier upgrade.'
  },
  {
    id: 'TX-902',
    userId: 'USR-892',
    userName: 'Sarah Jenkins',
    type: 'Deposit',
    amount: 50000,
    method: 'Crypto (USDT/BTC)',
    status: 'Pending Approval',
    reference: 'TX-USDT-0x89fa41c9',
    date: '2026-09-10 12:45',
    adminNote: 'USDT ERC20 on-chain deposit confirmed 24 blocks. Awaiting AML sanction scan.'
  },
  {
    id: 'TX-903',
    userId: 'USR-894',
    userName: 'Elena Rostov',
    type: 'Withdrawal',
    amount: 5000,
    method: 'SEPA Wire',
    status: 'Pending Approval',
    reference: 'WD-SEPA-81092',
    date: '2026-09-10 13:02',
    destination: 'IBAN: DE89 3704 0044 0532 0130 00 (Deutsche Bank)',
    adminNote: 'User trading is frozen; withdrawal requested to original source of funds.'
  },
  {
    id: 'TX-904',
    userId: 'USR-891',
    userName: 'Alex Mercer',
    type: 'Deposit',
    amount: 10000,
    method: 'Faster Payments',
    status: 'Approved / Settled',
    reference: 'FPS-UK-28471',
    date: '2026-09-09 16:30',
    adminNote: 'Auto-cleared through Modulr UK clearing rails.'
  },
  {
    id: 'TX-905',
    userId: 'USR-891',
    userName: 'Alex Mercer',
    type: 'Withdrawal',
    amount: 5000,
    method: 'Bank Wire',
    status: 'Approved / Settled',
    reference: 'WD-BARC-1948',
    date: '2026-09-08 10:14',
    destination: 'Barclays Bank UK Sort 20-00-00 Acc 84729103',
    adminNote: 'Cleared & authorized by David Sterling.'
  },
  {
    id: 'TX-906',
    userId: 'USR-895',
    userName: 'Tariq Al-Mansoor',
    type: 'Deposit',
    amount: 250000,
    method: 'Bank Wire',
    status: 'Approved / Settled',
    reference: 'WIRE-ENBD-7718',
    date: '2026-09-05 15:10',
    adminNote: 'Emirates NBD wire cleared. Tier 3 Institutional VIP credit.'
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-101',
    timestamp: '2026-09-10 13:28:40',
    adminUser: 'SuperAdmin (system)',
    action: 'Compliance Report',
    details: 'MiFID II RTS 28 Best Execution quarterly audit successfully compiled.',
    type: 'COMPLIANCE'
  },
  {
    id: 'LOG-102',
    timestamp: '2026-09-10 13:15:02',
    adminUser: 'Compliance Officer (J. Miller)',
    action: 'KYC Document Review',
    targetUser: 'USR-893 (Liam Chen)',
    details: 'Drivers license document queued for biometric and MRZ validation.',
    type: 'KYC'
  },
  {
    id: 'LOG-103',
    timestamp: '2026-09-10 12:48:15',
    adminUser: 'Treasury Desk (R. Thorne)',
    action: 'Crypto Deposit Flag',
    targetUser: 'USR-892 (Sarah Jenkins)',
    details: 'Crypto deposit $50,000.00 USDT received on cold address, awaiting 2-eye authorization.',
    type: 'FUNDING'
  },
  {
    id: 'LOG-104',
    timestamp: '2026-09-10 09:30:11',
    adminUser: 'Risk Officer (D. Sterling)',
    action: 'Account Restriction',
    targetUser: 'USR-894 (Elena Rostov)',
    details: 'Account status switched to Trading Frozen due to expired proof of address.',
    type: 'USER_MGMT'
  }
];

const INITIAL_POSITIONS: UserPosition[] = [
  {
    id: 'pos-1',
    userId: 'USR-891',
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    type: 'BUY',
    units: '45.8',
    entryPrice: 195.40,
    currentPrice: 218.15,
    profit: 1042.25,
    profitPercent: 11.64,
    category: 'stocks',
    openDate: '2026-09-02'
  },
  {
    id: 'pos-2',
    userId: 'USR-891',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'BUY',
    units: '0.42',
    entryPrice: 88200.00,
    currentPrice: 91420.00,
    profit: 1352.40,
    profitPercent: 3.65,
    category: 'crypto',
    openDate: '2026-09-04'
  },
  {
    id: 'pos-3',
    userId: 'USR-891',
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    type: 'BUY',
    units: '30.0',
    entryPrice: 535.00,
    currentPrice: 546.80,
    profit: 354.00,
    profitPercent: 2.20,
    category: 'etfs',
    openDate: '2026-09-08'
  }
];

const INITIAL_EMAILS: EmailMessage[] = [
  {
    id: 'EML-101',
    from: 'TradeShark Compliance Desk <compliance@tradeshark.co.uk>',
    to: 'alex.m@gmail.com',
    userId: 'USR-891',
    userName: 'Alex Mercer',
    subject: 'Verification Certified: Your Account is Now Tier 2 Verified Pro',
    body: 'Dear Alex Mercer,\n\nWe are pleased to inform you that your government-issued identity documents (Passport #GB-94821039) and proof of address have been fully verified under UK FCA / CySEC regulatory standards.\n\nYour account has been elevated to Tier 2 - Verified Pro. Your allocated leverage is now 1:100 with full trading permissions on global equities, forex, indices, and crypto CFDs.\n\nThank you for choosing TradeShark Ltd.\n\nSincerely,\nCompliance & Risk Operations\nTradeShark Ltd, London',
    category: 'KYC',
    priority: 'High',
    date: '2026-09-09 09:15',
    read: false,
    direction: 'outbound'
  },
  {
    id: 'EML-102',
    from: 'TradeShark Treasury Desk <treasury@tradeshark.co.uk>',
    to: 'alex.m@gmail.com',
    userId: 'USR-891',
    userName: 'Alex Mercer',
    subject: 'Deposit Clearance Receipt: $10,000.00 via Faster Payments',
    body: 'Dear Alex Mercer,\n\nWe confirm receipt and successful clearing of your incoming deposit of $10,000.00 USD via UK Faster Payments (Reference: FPS-UK-28471).\n\nFunds have been credited to your segregated client money account and are immediately available for trading and margin allocations.\n\nBest regards,\nTreasury & Cashier Services\nTradeShark Ltd',
    category: 'FUNDING',
    priority: 'Normal',
    date: '2026-09-09 16:32',
    read: true,
    direction: 'outbound'
  },
  {
    id: 'EML-103',
    from: 'Chief Market Strategist <research@tradeshark.co.uk>',
    to: 'All Clients',
    userId: 'ALL',
    userName: 'All Clients',
    subject: 'Market Advisory: Central Bank Policy Meeting & Weekend Crypto Spreads',
    body: 'Institutional Client Notice:\n\nIn anticipation of upcoming central bank interest rate decisions this Thursday at 14:00 GMT, increased market volatility and spread widening may occur across FX majors (GBP/USD, EUR/USD) and US Index futures.\n\nPlease review your active open positions, margin utilization, and stop-loss orders. The TradeShark institutional trading desk remains operational 24/7.\n\nChief Market Strategist\nTradeShark Research & Analytics',
    category: 'MARKET_ALERT',
    priority: 'High',
    date: '2026-09-10 08:00',
    read: false,
    direction: 'outbound'
  },
  {
    id: 'EML-104',
    from: 'Elena Rostov <e.rostov@proton.me>',
    to: 'TradeShark Support <support@tradeshark.co.uk>',
    userId: 'USR-894',
    userName: 'Elena Rostov',
    subject: 'Inquiry: Re-uploading my updated Berlin residence registration',
    body: 'Hello Compliance Team,\n\nI noticed my trading was set to frozen due to my utility bill being slightly over 90 days. I have obtained my official German Bürgeramt registration certificate from last week. I would like to know if I can upload this directly through the portal KYC verification tab.\n\nThank you,\nElena Rostov',
    category: 'KYC',
    priority: 'Normal',
    date: '2026-09-10 10:12',
    read: false,
    direction: 'inbound'
  }
];

const BrokerageContext = createContext<BrokerageContextType | undefined>(undefined);

export const BrokerageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('USR-891');
  const [transactions, setTransactions] = useState<FundingTransaction[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [positions, setPositions] = useState<UserPosition[]>(INITIAL_POSITIONS);
  const [emails, setEmails] = useState<EmailMessage[]>(INITIAL_EMAILS);
  const [popularInvestors, setPopularInvestors] = useState<PopularInvestor[]>(POPULAR_INVESTORS as PopularInvestor[]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const addAuditLog = (action: string, details: string, type: AuditLog['type'], targetUser?: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      adminUser: 'SuperAdmin (Desk 01)',
      action,
      details,
      type,
      targetUser
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 1. Create User
  const createUser = (userData: Omit<UserAccount, 'id' | 'joinedDate' | 'lastIp'>): UserAccount => {
    const newId = `USR-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 10);
    const newUser: UserAccount = {
      ...userData,
      id: newId,
      joinedDate: nowStr,
      lastIp: '192.168.1.1 (Admin Provisioned)'
    };

    setUsers(prev => [newUser, ...prev]);

    addAuditLog(
      'User Provisioning', 
      `Created new account for ${newUser.name} (${newUser.email}) with ${newUser.tier}, Leverage 1:${newUser.leverage}, Balance $${newUser.realBalance.toLocaleString()}`, 
      'USER_MGMT', 
      `${newUser.id} (${newUser.name})`
    );

    // If initial deposit credited, create funding record
    if (newUser.realBalance > 0) {
      const tx: FundingTransaction = {
        id: `TX-${Date.now()}`,
        userId: newUser.id,
        userName: newUser.name,
        type: 'Admin Credit',
        amount: newUser.realBalance,
        method: 'Internal Transfer',
        status: 'Approved / Settled',
        reference: `INIT-${newId}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        adminNote: 'Initial account funding upon administrative setup.'
      };
      setTransactions(prev => [tx, ...prev]);
    }

    return newUser;
  };

  // 2. Update User
  const updateUser = (id: string, updates: Partial<UserAccount>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const updated = { ...u, ...updates };
        return updated;
      }
      return u;
    }));

    addAuditLog(
      'Account Update', 
      `Modified attributes for account: ${Object.keys(updates).join(', ')}`, 
      'USER_MGMT', 
      id
    );
  };

  // 3. Set User Status (Active, Suspended, Trading Frozen, AML Flagged)
  const setUserStatus = (id: string, status: AccountStatus, reason?: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status };
      }
      return u;
    }));

    addAuditLog(
      'Status Change', 
      `Account state updated to [${status}]. ${reason ? `Reason: ${reason}` : ''}`, 
      'USER_MGMT', 
      id
    );
  };

  // 4. Toggle Trading Permissions
  const toggleTradingPermission = (id: string, permission: 'allowTrading' | 'allowShorting' | 'allowCrypto') => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextVal = !u[permission];
        addAuditLog(
          'Trading Permissions', 
          `Permission [${permission}] changed to ${nextVal ? 'ENABLED' : 'RESTRICTED'}`, 
          'USER_MGMT', 
          u.name
        );
        return { ...u, [permission]: nextVal };
      }
      return u;
    }));
  };

  // 5. Update Tier
  const updateUserTier = (id: string, tier: UserTier) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog('Tier Escalation', `Upgraded trader to ${tier}`, 'USER_MGMT', u.name);
        return { ...u, tier };
      }
      return u;
    }));
  };

  // 6. Update Leverage
  const updateUserLeverage = (id: string, leverage: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog('Margin & Leverage', `Adjusted maximum account leverage to 1:${leverage}`, 'USER_MGMT', u.name);
        return { ...u, leverage };
      }
      return u;
    }));
  };

  // 7. KYC Approvals
  const approveKyc = (id: string, promotedTier?: UserTier) => {
    let targetUser: UserAccount | undefined;
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextTier = promotedTier || (u.tier === 'Tier 1 - Standard' ? 'Tier 2 - Verified Pro' : u.tier);
        targetUser = u;
        addAuditLog(
          'KYC Certified', 
          `Document identity verified. KYC status set to APPROVED. Account tier promoted to ${nextTier}.`, 
          'KYC', 
          u.name
        );
        return { 
          ...u, 
          kycStatus: 'Approved',
          tier: nextTier,
          allowTrading: true,
          status: u.status === 'Trading Frozen' ? 'Active' : u.status
        };
      }
      return u;
    }));

    if (targetUser) {
      sendEmail({
        from: 'TradeShark Compliance Desk <compliance@tradeshark.co.uk>',
        to: targetUser.email,
        userId: targetUser.id,
        userName: targetUser.name,
        subject: `Regulatory Identity Certified: Welcome to ${promotedTier || 'Tier 2 - Verified Pro'}`,
        body: `Dear ${targetUser.name},\n\nCongratulations! Your regulatory identity documents and address verification have been officially certified under FCA / CySEC standards.\n\nYour account has been elevated to ${promotedTier || 'Tier 2 - Verified Pro'}. Full institutional trading execution and market access is now active.\n\nBest regards,\nTradeShark Compliance Operations\n100 Bishopsgate, London EC2N 4AG`,
        category: 'KYC',
        priority: 'High',
        direction: 'outbound'
      });
    }
  };

  const rejectKyc = (id: string, reason: string) => {
    let targetUser: UserAccount | undefined;
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        targetUser = u;
        addAuditLog(
          'KYC Rejected', 
          `Verification documents declined. Reason: ${reason}`, 
          'KYC', 
          u.name
        );
        return { ...u, kycStatus: 'Rejected', kycNotes: reason };
      }
      return u;
    }));

    if (targetUser) {
      sendEmail({
        from: 'TradeShark Compliance Desk <compliance@tradeshark.co.uk>',
        to: targetUser.email,
        userId: targetUser.id,
        userName: targetUser.name,
        subject: 'KYC Verification Notice: Application Declined',
        body: `Dear ${targetUser.name},\n\nOur compliance officer reviewed your submitted identification. We were unable to certify your documents due to the following reason:\n\n${reason}\n\nPlease check that your documents meet regulatory standards and contact compliance@tradeshark.co.uk if you believe this is an error.\n\nSincerely,\nTradeShark Compliance Desk`,
        category: 'KYC',
        priority: 'Urgent',
        direction: 'outbound'
      });
    }
  };

  const requestKycResubmit = (id: string, note: string) => {
    let targetUser: UserAccount | undefined;
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        targetUser = u;
        addAuditLog(
          'KYC Action Required', 
          `Requested resubmission from client: ${note}`, 
          'KYC', 
          u.name
        );
        return { ...u, kycStatus: 'Action Required', kycNotes: note };
      }
      return u;
    }));

    if (targetUser) {
      sendEmail({
        from: 'TradeShark Compliance Desk <compliance@tradeshark.co.uk>',
        to: targetUser.email,
        userId: targetUser.id,
        userName: targetUser.name,
        subject: 'Action Required: KYC Verification Update Needed',
        body: `Dear ${targetUser.name},\n\nWe require an updated or clearer document to complete your account certification:\n\nCompliance Note: ${note}\n\nPlease log in to your Client Portal and navigate to the KYC Verification Center to upload the revised file.\n\nThank you,\nTradeShark Compliance Desk`,
        category: 'KYC',
        priority: 'Urgent',
        direction: 'outbound'
      });
    }
  };

  const submitKycApplication = (payload: KycSubmissionPayload) => {
    setUsers(prev => prev.map(u => {
      if (u.id === payload.userId) {
        return {
          ...u,
          name: payload.fullName || u.name,
          dateOfBirth: payload.dateOfBirth,
          country: payload.nationality || u.country,
          streetAddress: payload.streetAddress,
          city: payload.city,
          postalCode: payload.postalCode,
          kycStatus: 'Pending',
          kycDocType: payload.docType,
          kycDocNumber: payload.docNumber,
          kycExpiryDate: payload.docExpiryDate,
          kycDocFrontName: payload.docFrontName,
          kycDocBackName: payload.docBackName,
          kycProofAddressName: payload.proofAddressName,
          kycSelfieVerified: payload.selfieTaken,
          facialMatchScore: 98.7,
          kycSubmittedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
          kycNotes: 'Fresh application documents uploaded via Client Portal'
        };
      }
      return u;
    }));

    addAuditLog(
      'KYC Application Submitted', 
      `Client uploaded ${payload.docType} (#${payload.docNumber}) and Proof of Residence for verification.`, 
      'KYC', 
      payload.fullName
    );

    sendEmail({
      from: 'TradeShark Compliance Desk <compliance@tradeshark.co.uk>',
      to: currentUser.email,
      userId: payload.userId,
      userName: payload.fullName,
      subject: 'KYC Documents Received & In Verification Queue',
      body: `Dear ${payload.fullName},\n\nThank you for submitting your verification details.\n\nDocuments Received:\n- Primary ID: ${payload.docType} (#${payload.docNumber})\n- Proof of Address: ${payload.proofAddressName}\n- Biometric Liveness: Certified\n\nOur compliance queue will review your file shortly. You will receive an immediate notification upon certification.\n\nTradeShark Compliance Operations`,
      category: 'KYC',
      priority: 'Normal',
      direction: 'outbound'
    });
  };

  const updateAmlRisk = (id: string, amlRisk: 'Low' | 'Medium' | 'High') => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog('AML Risk Rating', `Client AML profile adjusted to ${amlRisk} risk`, 'COMPLIANCE', u.name);
        return { ...u, amlRisk };
      }
      return u;
    }));
  };

  // 8. Funding Approvals
  const approveFunding = (txId: string) => {
    let resolvedTx: FundingTransaction | undefined;
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'Pending Approval') {
        resolvedTx = tx;
        // Apply balance changes
        if (tx.type === 'Deposit') {
          setUsers(uList => uList.map(u => {
            if (u.id === tx.userId) {
              return { ...u, realBalance: u.realBalance + tx.amount };
            }
            return u;
          }));
          addAuditLog(
            'Deposit Cleared', 
            `Approved deposit of $${tx.amount.toLocaleString()} via ${tx.method} for ${tx.userName}. Funds credited to balance.`, 
            'FUNDING', 
            tx.userName
          );
        } else if (tx.type === 'Withdrawal') {
          // If withdrawal, funds are officially released and settled
          addAuditLog(
            'Withdrawal Authorized', 
            `Released wire disbursement of $${tx.amount.toLocaleString()} to destination [${tx.destination || tx.method}] for ${tx.userName}.`, 
            'FUNDING', 
            tx.userName
          );
        }
        return { ...tx, status: 'Approved / Settled' };
      }
      return tx;
    }));

    if (resolvedTx) {
      const tx = resolvedTx;
      const targetUser = users.find(u => u.id === tx.userId);
      if (targetUser) {
        sendEmail({
          from: 'TradeShark Treasury Desk <treasury@tradeshark.co.uk>',
          to: targetUser.email,
          userId: targetUser.id,
          userName: targetUser.name,
          subject: tx.type === 'Deposit' 
            ? `Funds Credited: Deposit of $${tx.amount.toLocaleString()} Settled`
            : `Withdrawal Dispatched: $${tx.amount.toLocaleString()} Released`,
          body: tx.type === 'Deposit'
            ? `Dear ${targetUser.name},\n\nWe confirm that your deposit of $${tx.amount.toLocaleString()} via ${tx.method} has cleared and has been credited to your live balance.\n\nReference: ${tx.reference}\n\nHappy trading,\nTradeShark Treasury Operations`
            : `Dear ${targetUser.name},\n\nYour withdrawal of $${tx.amount.toLocaleString()} via ${tx.method} has been authorized and dispatched to your destination account:\n${tx.destination || tx.method}\n\nReference: ${tx.reference}\n\nTradeShark Cashier Desk`,
          category: 'FUNDING',
          priority: 'Normal',
          direction: 'outbound'
        });
      }
    }
  };

  const rejectFunding = (txId: string, reason: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'Pending Approval') {
        // If a withdrawal was rejected, return reserved balance back to user
        if (tx.type === 'Withdrawal') {
          setUsers(uList => uList.map(u => {
            if (u.id === tx.userId) {
              return { ...u, realBalance: u.realBalance + tx.amount };
            }
            return u;
          }));
        }

        addAuditLog(
          'Funding Rejected', 
          `Declined ${tx.type} request of $${tx.amount.toLocaleString()}. Reason: ${reason}`, 
          'FUNDING', 
          tx.userName
        );

        return { ...tx, status: 'Rejected', adminNote: reason };
      }
      return tx;
    }));
  };

  // 9. Manual Balance Adjustments (Admin Direct Credit/Debit/Bonus)
  const manualBalanceAdjustment = (
    userId: string, 
    amount: number, 
    type: 'Admin Credit' | 'Admin Debit' | 'Bonus', 
    note: string
  ) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const delta = type === 'Admin Debit' ? -amount : amount;
    const newBalance = Math.max(0, user.realBalance + delta);

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, realBalance: newBalance };
      }
      return u;
    }));

    const tx: FundingTransaction = {
      id: `TX-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      type,
      amount,
      method: 'Internal Transfer',
      status: 'Approved / Settled',
      reference: `ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminNote: note
    };

    setTransactions(prev => [tx, ...prev]);

    addAuditLog(
      `Balance ${type}`, 
      `Applied ${type} of $${amount.toLocaleString()} to ${user.name}. Previous: $${user.realBalance.toLocaleString()}, New: $${newBalance.toLocaleString()}. Reason: ${note}`, 
      'FUNDING', 
      user.name
    );
  };

  // 10. User Side: Submit Deposit
  const submitDeposit = (amount: number, method: FundingTransaction['method']) => {
    const tx: FundingTransaction = {
      id: `TX-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'Deposit',
      amount,
      method,
      status: 'Pending Approval', // Awaiting Admin Approval!
      reference: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminNote: 'User initiated online deposit request. Awaiting compliance and funds clearance.'
    };

    setTransactions(prev => [tx, ...prev]);
    addAuditLog(
      'Deposit Submitted', 
      `Client requested deposit of $${amount.toLocaleString()} via ${method}. Added to admin approval queue.`, 
      'FUNDING', 
      currentUser.name
    );
  };

  // 11. User Side: Submit Withdrawal
  const submitWithdrawal = (amount: number, method: FundingTransaction['method'], destination: string): boolean => {
    if (amount > currentUser.realBalance) {
      return false;
    }

    // Deduct immediately into escrow
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, realBalance: u.realBalance - amount };
      }
      return u;
    }));

    const tx: FundingTransaction = {
      id: `TX-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'Withdrawal',
      amount,
      method,
      status: 'Pending Approval', // Awaiting Admin Approval!
      reference: `WD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      destination,
      adminNote: 'Client requested withdrawal. Escrow balance reserved.'
    };

    setTransactions(prev => [tx, ...prev]);
    addAuditLog(
      'Withdrawal Requested', 
      `Client submitted withdrawal of $${amount.toLocaleString()} to ${destination}. Funds locked in escrow pending admin release.`, 
      'FUNDING', 
      currentUser.name
    );

    return true;
  };

  // 12. Positions
  const closePosition = (posId: string) => {
    const pos = positions.find(p => p.id === posId);
    if (!pos) return;

    setPositions(prev => prev.filter(p => p.id !== posId));
    setUsers(prev => prev.map(u => {
      if (u.id === pos.userId) {
        return { ...u, realBalance: u.realBalance + pos.profit };
      }
      return u;
    }));

    addAuditLog(
      'Position Closed', 
      `Closed ${pos.units} ${pos.symbol} at $${pos.currentPrice}. Realized P&L: $${pos.profit.toFixed(2)}.`, 
      'MARKET', 
      pos.userId
    );
  };

  const openPosition = (symbol: string, name: string, type: 'BUY' | 'SELL', units: string, price: number, category: string) => {
    const newPos: UserPosition = {
      id: `pos-${Date.now()}`,
      userId: currentUser.id,
      symbol,
      name,
      type,
      units,
      entryPrice: price,
      currentPrice: price,
      profit: 0,
      profitPercent: 0,
      category,
      openDate: new Date().toISOString().substring(0, 10)
    };
    setPositions(prev => [newPos, ...prev]);
  };

  // 13. Trader Management (Copy Trading)
  const addTrader = (traderData: Omit<PopularInvestor, 'id'>): PopularInvestor => {
    const newTrader: PopularInvestor = {
      ...traderData,
      id: `TRADER-${Date.now()}`
    };
    setPopularInvestors(prev => [newTrader, ...prev]);
    addAuditLog(
      'Trader Added',
      `Added new Pro Investor: ${newTrader.name} (${newTrader.handle}) with ${newTrader.return24M}% 24M return`,
      'MARKET'
    );
    return newTrader;
  };

  const removeTrader = (id: string | number) => {
    const trader = popularInvestors.find(t => t.id === id);
    setPopularInvestors(prev => prev.filter(t => t.id !== id));
    if (trader) {
      addAuditLog(
        'Trader Removed',
        `Removed Pro Investor: ${trader.name} (${trader.handle}) from CopyTrader program`,
        'MARKET'
      );
    }
  };

  const updateTrader = (id: string | number, updates: Partial<PopularInvestor>) => {
    setPopularInvestors(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  // 14. Emailing System
  const sendEmail = (emailData: Omit<EmailMessage, 'id' | 'date' | 'read'>): EmailMessage => {
    const newEmail: EmailMessage = {
      ...emailData,
      id: `EML-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };

    setEmails(prev => [newEmail, ...prev]);
    addAuditLog(
      'Email Sent',
      `Sent [${newEmail.category}] dispatch to ${newEmail.to} ("${newEmail.subject}")`,
      'COMPLIANCE',
      newEmail.userName || newEmail.to
    );
    return newEmail;
  };

  const markEmailAsRead = (emailId: string) => {
    setEmails(prev => prev.map(e => e.id === emailId ? { ...e, read: true } : e));
  };

  const deleteEmail = (emailId: string) => {
    setEmails(prev => prev.filter(e => e.id !== emailId));
  };

  return (
    <BrokerageContext.Provider value={{
      users,
      currentUser,
      setCurrentUserId,
      transactions,
      auditLogs,
      positions,
      emails,
      createUser,
      updateUser,
      setUserStatus,
      toggleTradingPermission,
      updateUserTier,
      updateUserLeverage,
      approveKyc,
      rejectKyc,
      requestKycResubmit,
      updateAmlRisk,
      submitKycApplication,
      approveFunding,
      rejectFunding,
      manualBalanceAdjustment,
      submitDeposit,
      submitWithdrawal,
      sendEmail,
      markEmailAsRead,
      deleteEmail,
      closePosition,
      openPosition,
      popularInvestors,
      addTrader,
      removeTrader,
      updateTrader
    }}>
      {children}
    </BrokerageContext.Provider>
  );
};

export const useBrokerage = (): BrokerageContextType => {
  const context = useContext(BrokerageContext);
  if (!context) {
    throw new Error('useBrokerage must be used within a BrokerageProvider');
  }
  return context;
};
