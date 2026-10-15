import React, { useState } from 'react';
import { Check, CheckCircle2, Copy, MessageCircle, PhoneCall, QrCode, X } from 'lucide-react';
import { BRAND_CONFIG, formatVND } from '../data/config';
import { OrderRecord } from '../types';

interface OrderConfirmationModalProps {
  order: OrderRecord;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ order, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#2F5D7E]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with success badge */}
        <div className="bg-[#2F5D7E] text-white px-6 py-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-300" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-sans">
            Đặt Hàng Thành Công!
          </h3>
          <p className="text-xs sm:text-sm text-white/80 mt-1">
            Cảm ơn quý khách đã tin chọn hộp quà hạt điều Mộc Điều
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Order ID banner */}
          <div className="bg-[#F7F3EA] p-4 rounded-xl border border-[#2F5D7E]/15 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#252525]/70 block">Mã đơn hàng của bạn:</span>
              <strong className="text-lg font-mono font-bold text-[#2F5D7E] tracking-wider">
                {order.orderId}
              </strong>
            </div>
            <button
              onClick={handleCopyOrderId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2F5D7E] bg-white border border-[#2F5D7E]/20 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép mã</span>
                </>
              )}
            </button>
          </div>

          {/* Status & Next step notification */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-800 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>Trạng thái đơn hàng: {order.orderStatus}</span>
            </div>
            <p>
              Nhân viên chăm sóc khách hàng của Mộc Điều sẽ gọi điện xác nhận đơn tới số <strong>{order.phone}</strong> trước khi tiến hành đóng gói và giao hàng.
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-[#2F5D7E] uppercase tracking-wide text-xs">
              Chi tiết giao hàng & sản phẩm
            </h4>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-200/80">
              <div className="flex justify-between">
                <span className="text-[#252525]/70">Người nhận:</span>
                <span className="font-semibold text-[#252525]">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#252525]/70">Số điện thoại:</span>
                <span className="font-semibold text-[#252525]">{order.phone}</span>
              </div>
              {order.email && (
                <div className="flex justify-between">
                  <span className="text-[#252525]/70">Email:</span>
                  <span className="text-[#252525]">{order.email}</span>
                </div>
              )}
              <div className="flex justify-between items-start gap-4">
                <span className="text-[#252525]/70 shrink-0">Địa chỉ:</span>
                <span className="font-medium text-[#252525] text-right">{order.shippingAddress}</span>
              </div>
              {order.customerNote && (
                <div className="flex justify-between items-start gap-4 pt-1 border-t border-slate-200">
                  <span className="text-[#252525]/70 shrink-0">Ghi chú:</span>
                  <span className="italic text-[#252525] text-right">{order.customerNote}</span>
                </div>
              )}
            </div>

            {/* Itemized pricing */}
            <div className="border border-[#2F5D7E]/10 rounded-xl p-4 space-y-2 bg-[#F7F3EA]/40">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span>{item.productName} ({item.spec}) x {item.quantity}</span>
                  <span className="font-semibold tabular-nums">{formatVND(item.totalPrice)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center text-xs">
                <span>Phí vận chuyển:</span>
                <span className={`font-semibold tabular-nums ${order.shippingFee === 0 ? 'text-emerald-700' : 'text-[#8A5A3B]'}`}>
                  {order.shippingFee === 0 ? '0đ (Miễn phí)' : formatVND(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#2F5D7E]/10 text-sm font-bold text-[#2F5D7E]">
                <span>Tổng thanh toán:</span>
                <span className="text-base text-[#8A5A3B] tabular-nums">{formatVND(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Banking Instructions (If Banking Chosen) */}
          {order.paymentMethod === 'banking' && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-2 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <QrCode className="w-4 h-4" />
                <span>Thông tin chuyển khoản ngân hàng:</span>
              </div>
              <p>Ngân hàng: <strong>Vietcombank</strong> (Ngân hàng TMCP Ngoại thương Việt Nam)</p>
              <p>Số tài khoản: <strong>1028.988.888</strong></p>
              <p>Chủ tài khoản: <strong>MOC DIEU CASHEW CO</strong></p>
              <p>Số tiền: <strong>{formatVND(order.total)}</strong></p>
              <p>Nội dung chuyển khoản: <strong>{order.orderId}</strong></p>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${BRAND_CONFIG.hotline.replace(/\./g, '')}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-[#2F5D7E] bg-[#2F5D7E]/10 hover:bg-[#2F5D7E]/20 rounded-xl transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hotline {BRAND_CONFIG.hotline}</span>
            </a>

            <button
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 text-xs sm:text-sm font-bold text-white bg-[#2F5D7E] hover:bg-[#254b66] rounded-xl shadow-md transition-all cursor-pointer"
            >
              Hoàn Tất & Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
