import React, { useState } from 'react';
import {
  Check,
  Eye,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import { MOC_DIEU_PRODUCTS, formatVND } from '../data/config';
import { ProductItem } from '../types';

interface GiftProductSectionProps {
  selectedProduct: ProductItem;
  onSelectProduct: (product: ProductItem) => void;
}

export const GiftProductSection: React.FC<GiftProductSectionProps> = ({
  selectedProduct,
  onSelectProduct,
}) => {
  const [modalProduct, setModalProduct] = useState<ProductItem | null>(null);
  const [modalActiveImageKey, setModalActiveImageKey] = useState<'hero' | 'jars' | 'unboxing'>('hero');

  // Per-card active photo angles map: productId -> 'hero' | 'jars' | 'unboxing'
  const [cardImageMap, setCardImageMap] = useState<Record<string, 'hero' | 'jars' | 'unboxing'>>({});

  const setCardImage = (productId: string, key: 'hero' | 'jars' | 'unboxing') => {
    setCardImageMap((prev) => ({ ...prev, [productId]: key }));
  };

  const handleSelectAndScroll = (prod: ProductItem) => {
    onSelectProduct(prod);
    const formElement = document.getElementById('dat-hang');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openQuickView = (prod: ProductItem) => {
    setModalProduct(prod);
    setModalActiveImageKey('hero');
  };

  const flagshipProduct = MOC_DIEU_PRODUCTS[0]; // Vị Mộc An Yên (Best-seller)
  const remainingProducts = MOC_DIEU_PRODUCTS.slice(1); // 4 other gift sets

  return (
    <section id="san-pham" className="py-10 md:py-16 bg-white border-b border-[#2F5D7E]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Refined Brand Collection Kicker */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#2F5D7E]/10 pb-5 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#8A5A3B] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tuyển Tập Hộp Quà Mộc Điều 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2F5D7E] tracking-tight">
              Hộp Quà Hạt Điều Tự Nhiên
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#252525]/75">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Miễn phí vận chuyển toàn quốc cho đơn từ 500.000đ</span>
          </div>
        </div>

        {/* FLAGSHIP HERO PRODUCT: Vị Mộc An Yên (Featured 2-Column Split) */}
        <div className="bg-[#F7F3EA]/70 rounded-3xl border border-[#2F5D7E]/15 p-6 sm:p-8 lg:p-10 shadow-sm transition-all hover:shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-white border border-[#2F5D7E]/10 shadow-sm group">
                <img
                  src={flagshipProduct.images[cardImageMap[flagshipProduct.id] || 'hero']}
                  alt={flagshipProduct.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-3.5 left-3.5 bg-[#2F5D7E] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                  Phiên Bản Bán Chạy Nhất
                </div>

                <button
                  onClick={() => openQuickView(flagshipProduct)}
                  className="absolute bottom-3.5 right-3.5 bg-white/90 hover:bg-white text-[#2F5D7E] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm backdrop-blur-sm transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Phóng to</span>
                </button>
              </div>

              {/* Angle Switcher */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'hero' as const, label: 'Toàn cảnh hộp quà' },
                  { key: 'jars' as const, label: 'Cận cảnh hũ thủy tinh' },
                  { key: 'unboxing' as const, label: 'Mở hộp & thiệp chúc' },
                ].map((angle) => {
                  const currentAngle = cardImageMap[flagshipProduct.id] || 'hero';
                  return (
                    <button
                      key={angle.key}
                      onClick={() => setCardImage(flagshipProduct.id, angle.key)}
                      className={`py-2 px-2.5 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                        currentAngle === angle.key
                          ? 'border-[#2F5D7E] bg-white text-[#2F5D7E] font-bold shadow-xs'
                          : 'border-transparent bg-white/60 text-[#252525]/70 hover:bg-white'
                      }`}
                    >
                      {angle.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Information Column */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-xs font-bold text-[#8A5A3B] uppercase tracking-wider">
                  Quy cách: {flagshipProduct.spec}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F5D7E] mt-1 leading-tight">
                  {flagshipProduct.name}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#252525]/80 leading-relaxed">
                  {flagshipProduct.description}
                </p>
              </div>

              {/* Price & Savings */}
              <div className="p-4 bg-white rounded-2xl border border-[#2F5D7E]/10 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#8A5A3B] tabular-nums">
                    {formatVND(flagshipProduct.price)}
                  </span>
                  <span className="text-sm text-[#252525]/45 line-through tabular-nums">
                    {formatVND(flagshipProduct.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-white bg-[#2F5D7E] px-2 py-0.5 rounded">
                    Tiết kiệm {formatVND(flagshipProduct.originalPrice - flagshipProduct.price)}
                  </span>
                </div>
                <div className="text-xs text-[#252525]/70 flex items-center gap-1.5 pt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Sẵn sàng giao hàng toàn quốc · Mua 2 hộp miễn phí vận chuyển</span>
                </div>
              </div>

              {/* Highlights */}
              <ul className="space-y-2 text-xs sm:text-sm text-[#252525]/85">
                {flagshipProduct.features.slice(0, 3).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5 p-0.5 rounded-full bg-[#2F5D7E]/10 text-[#2F5D7E] shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleSelectAndScroll(flagshipProduct)}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-sm sm:text-base font-bold rounded-xl shadow-md transition-all cursor-pointer ${
                    selectedProduct.id === flagshipProduct.id
                      ? 'bg-emerald-700 text-white shadow-lg'
                      : 'bg-[#2F5D7E] text-white hover:bg-[#254b66] active:scale-[0.98]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {selectedProduct.id === flagshipProduct.id
                      ? `Đang chọn hộp này (${formatVND(flagshipProduct.price)})`
                      : `Chọn Hộp Quà Này (${formatVND(flagshipProduct.price)})`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 BOUTIQUE PRODUCT CARDS (Refined 2x2 or 4-col responsive grid) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-[#2F5D7E]">
              Các Phiên Bản Quà Tặng Khác
            </h3>
            <span className="text-xs text-[#252525]/60 font-medium">
              Tuyển chọn đa dạng hương vị & chất liệu cao cấp
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {remainingProducts.map((prod) => {
              const isSelected = selectedProduct.id === prod.id;
              const isFreeship = prod.price >= 500000;
              const activeAngle = cardImageMap[prod.id] || 'hero';

              return (
                <div
                  key={prod.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-lg ${
                    isSelected
                      ? 'border-[#2F5D7E] ring-2 ring-[#2F5D7E]/30 shadow-md'
                      : 'border-[#2F5D7E]/15 hover:border-[#2F5D7E]/40'
                  }`}
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F3EA]/50 group">
                    <img
                      src={prod.images[activeAngle]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    {/* Badge Overlay */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {isFreeship && (
                        <span className="bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded shadow-xs">
                          Freeship
                        </span>
                      )}
                      <span className="bg-[#2F5D7E] text-white text-[10px] font-medium px-1.5 py-0.5 rounded shadow-xs">
                        Tiết kiệm {formatVND(prod.originalPrice - prod.price)}
                      </span>
                    </div>

                    {/* Quick View Button */}
                    <button
                      onClick={() => openQuickView(prod)}
                      className="absolute bottom-2.5 right-2.5 bg-white/90 hover:bg-white text-[#2F5D7E] p-1.5 rounded-lg shadow-sm transition-all opacity-85 hover:opacity-100 cursor-pointer"
                      title="Xem ảnh chi tiết"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Multi-angle Mini Buttons */}
                  <div className="px-3 pt-2 pb-1 flex gap-1 justify-center bg-slate-50 border-b border-slate-100">
                    {[
                      { key: 'hero' as const, label: 'Hộp quà' },
                      { key: 'jars' as const, label: 'Hũ hạt' },
                      { key: 'unboxing' as const, label: 'Mở hộp' },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setCardImage(prod.id, btn.key)}
                        className={`text-[10px] px-2 py-0.5 rounded transition-colors cursor-pointer ${
                          activeAngle === btn.key
                            ? 'bg-[#2F5D7E] text-white font-bold'
                            : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-[10px] font-bold text-[#8A5A3B] uppercase tracking-wider mb-1">
                        {prod.spec}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-[#2F5D7E] leading-snug">
                        {prod.name}
                      </h4>

                      <p className="mt-1 text-xs text-[#252525]/70 line-clamp-2 leading-relaxed">
                        {prod.subtitle}
                      </p>
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-2 border-t border-[#2F5D7E]/10 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div className="text-lg font-extrabold text-[#8A5A3B] tabular-nums">
                          {formatVND(prod.price)}
                        </div>
                        <div className="text-xs text-[#252525]/45 line-through tabular-nums">
                          {formatVND(prod.originalPrice)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectAndScroll(prod)}
                        className={`w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-[#2F5D7E] text-white hover:bg-[#254b66] shadow-xs active:scale-[0.98]'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{isSelected ? 'Đang chọn hộp này' : 'Chọn hộp này'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#2F5D7E]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 bg-[#2F5D7E] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-200 uppercase tracking-widest font-bold">
                  Chi Tiết Sản Phẩm
                </span>
                <h3 className="text-base sm:text-lg font-bold">{modalProduct.name}</h3>
              </div>
              <button
                onClick={() => setModalProduct(null)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#F7F3EA]">
                <img
                  src={modalProduct.images[modalActiveImageKey]}
                  alt={modalProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'hero' as const, label: 'Toàn cảnh' },
                  { key: 'jars' as const, label: 'Hũ hạt điều' },
                  { key: 'unboxing' as const, label: 'Mở hộp quà' },
                ].map((mThumb) => (
                  <button
                    key={mThumb.key}
                    onClick={() => setModalActiveImageKey(mThumb.key)}
                    className={`p-2 text-xs rounded-xl border text-center font-medium transition-all cursor-pointer ${
                      modalActiveImageKey === mThumb.key
                        ? 'border-[#2F5D7E] bg-[#2F5D7E]/5 text-[#2F5D7E] font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {mThumb.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-[#F7F3EA] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#8A5A3B] uppercase block">
                      {modalProduct.spec}
                    </span>
                    <span className="text-xl font-extrabold text-[#8A5A3B] tabular-nums">
                      {formatVND(modalProduct.price)}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md font-semibold">
                    {modalProduct.price >= 500000 ? 'Miễn phí vận chuyển' : 'Ship tiêu chuẩn 30k'}
                  </span>
                </div>

                <p className="text-[#252525]/80 leading-relaxed text-xs">
                  {modalProduct.description}
                </p>

                <div className="border-t border-slate-200 pt-2 space-y-1.5 text-xs">
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-slate-700">Thành phần:</span>
                    <span className="col-span-2 text-slate-600">{modalProduct.details.ingredients}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-slate-700">Nguồn gốc:</span>
                    <span className="col-span-2 text-slate-600">{modalProduct.details.origin}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-slate-700">Hạn sử dụng:</span>
                    <span className="col-span-2 text-slate-600">{modalProduct.details.shelfLife}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setModalProduct(null);
                    handleSelectAndScroll(modalProduct);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#2F5D7E] hover:bg-[#254b66] rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Chọn Hộp Quà Này ({formatVND(modalProduct.price)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
