import React from 'react';
import { MocDieuLogo } from './MocDieuLogo';
import { BarChart3, PhoneCall, ShoppingBag } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

interface HeaderProps {
  onOpenAdmin: () => void;
  onCtaClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, onCtaClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F7F3EA]/95 backdrop-blur-md border-b border-[#2F5D7E]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Wordmark & Image Logo */}
        <a href="#" className="flex items-center gap-2 shrink-0" aria-label="Mộc Điều">
          <MocDieuLogo size="md" />
        </a>

        {/* Brand Slogan (Subtle & Elegant) */}
        <div className="hidden lg:block text-xs font-medium text-[#8A5A3B] tracking-wide">
          “{BRAND_CONFIG.slogan}”
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            className="p-2 text-[#2F5D7E]/70 hover:text-[#2F5D7E] hover:bg-[#2F5D7E]/5 rounded-xl transition-colors"
            title="Báo cáo mục tiêu 100 đơn (Nội bộ Mộc Điều)"
            aria-label="Báo cáo mục tiêu"
          >
            <BarChart3 className="w-5 h-5" />
          </button>

          <a
            href={`tel:${BRAND_CONFIG.hotline.replace(/\./g, '')}`}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#8A5A3B] px-3.5 py-2 rounded-xl bg-[#8A5A3B]/5 hover:bg-[#8A5A3B]/10 transition-colors whitespace-nowrap shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{BRAND_CONFIG.hotline}</span>
          </a>

          <a
            href="#dat-hang"
            onClick={onCtaClick}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#2F5D7E] hover:bg-[#254b66] active:scale-[0.98] rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Đặt Hàng Ngay</span>
          </a>
        </div>
      </div>
    </header>
  );
};
