import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BRAND_CONFIG, MOC_DIEU_GIFT_BOX, formatVND } from '../data/config';

interface BottomCTASectionProps {
  onCtaClick: () => void;
}

export const BottomCTASection: React.FC<BottomCTASectionProps> = ({ onCtaClick }) => {
  return (
    <section className="py-16 md:py-20 bg-[#2F5D7E] text-white relative overflow-hidden">
      {/* Decorative subtle texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-amber-200 uppercase">
          <Sparkles className="w-4 h-4" />
          <span>{BRAND_CONFIG.slogan}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-sans text-balance">
          Gửi trao sự quan tâm cùng hộp quà Mộc Điều.
        </h2>

        <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto leading-relaxed">
          Hộp quà Vị Mộc An Yên (2 hũ x 400g) tuyển chọn thượng hạng – Món quà tinh tế từ thiên nhiên gửi trao người trân quý.
        </p>

        <div className="pt-2">
          <a
            href="#dat-hang"
            onClick={onCtaClick}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-[#2F5D7E] bg-white hover:bg-slate-100 active:scale-[0.98] rounded-xl shadow-xl transition-all"
          >
            <span>Đặt Hộp Quà Ngay</span>
            <span className="text-sm font-semibold text-[#8A5A3B]">({formatVND(MOC_DIEU_GIFT_BOX.price)})</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </a>
        </div>

        <p className="text-xs text-white/70">
          Miễn phí vận chuyển toàn quốc cho đơn từ 500.000đ · Kiểm tra hàng trước khi thanh toán
        </p>
      </div>
    </section>
  );
};
