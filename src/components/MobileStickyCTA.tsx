import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatVND } from '../data/config';
import { ProductItem } from '../types';

interface MobileStickyCTAProps {
  selectedProduct: ProductItem;
  onCtaClick: () => void;
}

export const MobileStickyCTA: React.FC<MobileStickyCTAProps> = ({ selectedProduct, onCtaClick }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide sticky bar when order form is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const formElement = document.getElementById('dat-hang');
    if (formElement) {
      observer.observe(formElement);
    }

    return () => {
      if (formElement) observer.unobserve(formElement);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-[#2F5D7E]/15 px-4 py-2.5 shadow-lg transition-transform duration-200">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-[#252525]/70 uppercase font-bold truncate">
            {selectedProduct.name}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-[#8A5A3B] tabular-nums">
              {formatVND(selectedProduct.price)}
            </span>
            <span className="text-[11px] text-[#252525]/45 line-through tabular-nums">
              {formatVND(selectedProduct.originalPrice)}
            </span>
          </div>
        </div>

        <a
          href="#dat-hang"
          onClick={onCtaClick}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#2F5D7E] hover:bg-[#254b66] active:scale-[0.98] rounded-xl shadow-md transition-all whitespace-nowrap shrink-0"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Đặt Mua Ngay</span>
        </a>
      </div>
    </div>
  );
};
