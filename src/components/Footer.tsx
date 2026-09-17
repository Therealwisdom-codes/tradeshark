import React from 'react';
import { TradeSharkLogo } from './TradeSharkLogo';
import { FOOTER_NAV_COLUMNS } from '../data/mockData';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface FooterProps {
  onOpenUserDashboard?: () => void;
  onOpenAdminPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenUserDashboard,
  onOpenAdminPortal
}) => {
  return (
    <footer className="bg-[#0f110a] text-white/80 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Brand & Socials Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          <div className="lg:col-span-5 space-y-5">
            <TradeSharkLogo size="lg" showLtd={true} />
            <p className="text-sm text-[#a3a89e] leading-relaxed max-w-sm">
              A premier global financial intelligence and multi-asset trading platform empowering over 40 million users across 75 countries.
            </p>

            {/* Social Icons */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60 block">
                Connect with TradeShark
              </span>
              <div className="flex items-center gap-3">
                {[
                  { icon: <Facebook className="w-4 h-4" />, href: '#facebook', label: 'Facebook' },
                  { icon: <Instagram className="w-4 h-4" />, href: '#instagram', label: 'Instagram' },
                  { icon: <Linkedin className="w-4 h-4" />, href: '#linkedin', label: 'LinkedIn' },
                  { icon: <Twitter className="w-4 h-4" />, href: '#x', label: 'X (Twitter)' },
                  { icon: <Youtube className="w-4 h-4" />, href: '#youtube', label: 'YouTube' }
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#6dff8a] text-white hover:text-[#15170f] flex items-center justify-center transition-all border border-white/10"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* App Store Download Badges */}
          <div className="lg:col-span-7 flex flex-col lg:items-end justify-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Download the TradeShark Mobile App
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#app-store"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <div className="text-xl">🍎</div>
                <div className="text-left">
                  <div className="text-[10px] text-white/60 leading-none">Download on the</div>
                  <div className="text-xs font-bold text-white leading-none mt-1">Apple App Store</div>
                </div>
              </a>

              <a
                href="#google-play"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <div className="text-xl">🤖</div>
                <div className="text-left">
                  <div className="text-[10px] text-white/60 leading-none">GET IT ON</div>
                  <div className="text-xs font-bold text-white leading-none mt-1">Google Play</div>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Navigation Grid (6 columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 text-xs">
          {FOOTER_NAV_COLUMNS.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                {col.title}
              </h4>
              <ul className="space-y-2 text-[#a3a89e]">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a 
                      href={link.href} 
                      className="hover:text-[#6dff8a] transition-colors block py-0.5"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


        {/* Regulatory Disclosures and Risk Warnings */}
        <div className="pt-10 border-t border-white/10 space-y-5 text-[11px] text-[#868c80] leading-relaxed">
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <ShieldAlert className="w-5 h-5 text-[#6dff8a] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p>
                <strong>High Risk Investment Warning:</strong> CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <strong>51% of retail investor accounts lose money</strong> when trading CFDs with this provider. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
              </p>
              <p>
                Cryptoasset investing is highly volatile and unregulated in some jurisdictions. No consumer protection. Tax on profits may apply. Past performance is not an indication of future results. Trading history presented is less than 5 complete years and may not suffice as basis for investment decisions.
              </p>
            </div>
          </div>

          <p>
            TradeShark Ltd (Company No. 08291840) is authorized and regulated by the Financial Conduct Authority (FCA) under firm reference number 583261. TradeShark (Europe) Ltd is authorized and regulated by the Cyprus Securities and Exchange Commission (CySEC) under license number 109/10. TradeShark AUS Capital Pty Ltd is regulated by the Australian Securities and Investments Commission (ASIC) AFSL 491139.
          </p>

          <p>
            CopyTrader™ is an investment management service provided by TradeShark Ltd. The value of your investments may go up or down. Your capital is at risk.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5 text-[11px] text-white/40">
            <div>
              &copy; 2026 TradeShark Ltd. All rights reserved. Registered office: 25 Bank Street, Canary Wharf, London, E14 5JP, United Kingdom.
            </div>
            <div className="flex items-center gap-4">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Notice</a>
              <span>•</span>
              <a href="#cookies" className="hover:text-white transition-colors">Cookie Policy</a>
              <span>•</span>
              <a href="#terms" className="hover:text-white transition-colors">Client Agreement</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
