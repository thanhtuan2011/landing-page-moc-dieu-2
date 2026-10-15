import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, Loader2, Minus, Plus, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { BRAND_CONFIG, MOC_DIEU_PRODUCTS, calculateShipping, formatVND } from '../data/config';
import { OrderPayload, OrderRecord, ProductItem } from '../types';

interface OrderFormSectionProps {
  selectedProduct: ProductItem;
  onSelectProduct: (product: ProductItem) => void;
  onOrderSuccess: (order: OrderRecord) => void;
  onFormFocus: () => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export const OrderFormSection: React.FC<OrderFormSectionProps> = ({
  selectedProduct,
  onSelectProduct,
  onOrderSuccess,
  onFormFocus,
  quantity,
  setQuantity,
}) => {
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'banking'>('cod');

  // Form states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasStartedFilling, setHasStartedFilling] = useState(false);

  // Calculate pricing & shipping based on selected product and quantity
  const subtotal = selectedProduct.price * quantity;
  const { shippingFee, total, isFreeShipping, amountNeededForFree } = calculateShipping(subtotal);

  // Track form_start event once
  const handleFieldFocus = () => {
    onFormFocus();
    if (!hasStartedFilling) {
      setHasStartedFilling(true);
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'form_start' }),
      }).catch(() => {});
    }
  };

  // Vietnamese phone format regex check
  const validatePhone = (p: string) => {
    const cleaned = p.replace(/[\s.-]/g, '');
    return /^(0[3|5|7|8|9])[0-9]{8}$/.test(cleaned);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate fields
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Vui lòng nhập họ và tên người nhận hàng';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại nhận hàng';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (cần đủ 10 số bắt đầu bằng 03, 05, 07, 08, 09)';
    }

    if (!shippingAddress.trim()) {
      newErrors.shippingAddress = 'Vui lòng nhập địa chỉ giao hàng chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành)';
    }

    if (quantity <= 0) {
      newErrors.quantity = 'Số lượng hộp quà phải từ 1 trở lên';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // Clear validation errors
    setErrors({});
    setIsSubmitting(true);

    // Parse URL params for UTM tracking
    const searchParams = new URLSearchParams(window.location.search);
    const utm_source = searchParams.get('utm_source') || undefined;
    const utm_medium = searchParams.get('utm_medium') || undefined;
    const utm_campaign = searchParams.get('utm_campaign') || undefined;
    const source = utm_source || (document.referrer.includes('facebook') ? 'facebook' : document.referrer.includes('tiktok') ? 'tiktok' : 'direct');

    const payload: OrderPayload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      shippingAddress: shippingAddress.trim(),
      productId: selectedProduct.id,
      quantity,
      customerNote: customerNote.trim() || undefined,
      paymentMethod,
      source,
      campaign: utm_campaign,
      utmParams: {
        utm_source,
        utm_medium,
        utm_campaign,
      },
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại thông tin.');
      }

      // Backend confirmed order created
      onOrderSuccess(data.order);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setServerError(err.message || 'Hệ thống đang bận. Vui lòng thử lại sau ít phút hoặc liên hệ hotline để được phục vụ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="dat-hang" className="py-14 md:py-20 bg-[#F7F3EA] border-b border-[#2F5D7E]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#8A5A3B] mb-2">
            Đặt Hàng Trực Tiếp
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2F5D7E] tracking-tight">
            Thông Tin Giao Hàng & Thanh Toán
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#252525]/75">
            Điền thông tin bên dưới để đặt hộp quà Mộc Điều. Mộc Điều sẽ gọi điện xác nhận trước khi gửi hàng.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#2F5D7E]/15 shadow-md p-6 sm:p-8 space-y-8">
          {/* Server Error Message */}
          {serverError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Lỗi gửi đơn: </strong>
                <span>{serverError}</span>
              </div>
            </div>
          )}

          {/* Product Selector in Form */}
          <div className="p-4 sm:p-5 bg-[#F7F3EA]/70 rounded-xl border border-[#2F5D7E]/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[#2F5D7E] uppercase tracking-wider">
                1. Chọn Hộp Quà Đặt Mua
              </h3>
              <span className="text-xs text-[#252525]/70">
                Có thể chọn 1 trong 5 phiên bản quà tặng
              </span>
            </div>

            {/* Product Switcher Dropdown */}
            <div>
              <select
                value={selectedProduct.id}
                onChange={(e) => {
                  const p = MOC_DIEU_PRODUCTS.find((item) => item.id === e.target.value);
                  if (p) onSelectProduct(p);
                }}
                className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-lg border border-[#2F5D7E]/30 bg-white text-[#252525] focus:outline-none focus:border-[#2F5D7E] shadow-xs cursor-pointer"
              >
                {MOC_DIEU_PRODUCTS.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} ({prod.spec}) — {formatVND(prod.price)}
                  </option>
                ))}
              </select>
            </div>

            {/* Currently Selected Product Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProduct.images.hero}
                  alt={selectedProduct.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#2F5D7E]/15 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-[#252525] text-sm sm:text-base">
                    {selectedProduct.name}
                  </h4>
                  <div className="text-xs text-[#252525]/70 mt-0.5">
                    {selectedProduct.spec}
                  </div>
                  <div className="text-sm font-extrabold text-[#8A5A3B] mt-1 tabular-nums">
                    {formatVND(selectedProduct.price)} / hộp
                  </div>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-semibold text-[#252525]/70">Số lượng:</span>
                <div className="flex items-center border border-[#2F5D7E]/25 rounded-lg bg-white overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || isSubmitting}
                    className="p-2 text-[#2F5D7E] hover:bg-[#F7F3EA] disabled:opacity-40 transition-colors"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    id="field-quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1) setQuantity(val);
                    }}
                    onFocus={handleFieldFocus}
                    className="w-12 text-center text-sm font-bold text-[#252525] focus:outline-none tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={isSubmitting}
                    className="p-2 text-[#2F5D7E] hover:bg-[#F7F3EA] transition-colors"
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Shipping Threshold Hint */}
            <div className={`p-3 rounded-lg text-xs font-medium flex items-center justify-between ${
              isFreeShipping
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 shrink-0" />
                <span>
                  {isFreeShipping ? (
                    <>
                      <strong>Miễn phí vận chuyển:</strong> Đơn hàng đã đạt từ 500.000đ (Phí ship: 0đ).
                    </>
                  ) : (
                    <>
                      Đơn hàng hiện tại: {formatVND(subtotal)}. Mua thêm <strong>{formatVND(amountNeededForFree)}</strong> để được <strong>MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC</strong>!
                    </>
                  )}
                </span>
              </div>
              {!isFreeShipping && (
                <button
                  type="button"
                  onClick={() => setQuantity(2)}
                  className="text-xs font-bold text-[#2F5D7E] underline hover:text-[#254b66] whitespace-nowrap ml-2 cursor-pointer"
                >
                  Chọn 2 hộp (Freeship)
                </button>
              )}
            </div>
          </div>

          {/* Customer Information Fields */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#2F5D7E] uppercase tracking-wider">
              2. Thông tin người nhận
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer Name */}
              <div>
                <label htmlFor="field-customerName" className="block text-xs font-bold text-[#252525] mb-1">
                  Họ và tên người nhận <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="field-customerName"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
                  }}
                  onFocus={handleFieldFocus}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none transition-colors ${
                    errors.customerName
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#2F5D7E]/25 focus:border-[#2F5D7E] focus:ring-1 focus:ring-[#2F5D7E]'
                  }`}
                />
                {errors.customerName && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errors.customerName}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="field-phone" className="block text-xs font-bold text-[#252525] mb-1">
                  Số điện thoại nhận hàng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="field-phone"
                  placeholder="Ví dụ: 0982345678"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  onFocus={handleFieldFocus}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none transition-colors ${
                    errors.phone
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-[#2F5D7E]/25 focus:border-[#2F5D7E] focus:ring-1 focus:ring-[#2F5D7E]'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label htmlFor="field-email" className="block text-xs font-medium text-[#252525] mb-1">
                Email nhận hóa đơn & mã đơn (không bắt buộc)
              </label>
              <input
                type="email"
                id="field-email"
                placeholder="Ví dụ: nguyenvana@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleFieldFocus}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#2F5D7E]/25 bg-white focus:outline-none focus:border-[#2F5D7E] focus:ring-1 focus:ring-[#2F5D7E] transition-colors"
              />
            </div>

            {/* Shipping Address */}
            <div>
              <label htmlFor="field-shippingAddress" className="block text-xs font-bold text-[#252525] mb-1">
                Địa chỉ giao hàng chi tiết <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="field-shippingAddress"
                rows={2}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                value={shippingAddress}
                onChange={(e) => {
                  setShippingAddress(e.target.value);
                  if (errors.shippingAddress) setErrors((prev) => ({ ...prev, shippingAddress: '' }));
                }}
                onFocus={handleFieldFocus}
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none transition-colors ${
                  errors.shippingAddress
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-[#2F5D7E]/25 focus:border-[#2F5D7E] focus:ring-1 focus:ring-[#2F5D7E]'
                }`}
              />
              {errors.shippingAddress && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.shippingAddress}</p>
              )}
            </div>

            {/* Customer Note (Optional) */}
            <div>
              <label htmlFor="field-customerNote" className="block text-xs font-medium text-[#252525] mb-1">
                Ghi chú đơn hàng (viết thiệp chúc mừng, giao giờ hành chính, gọi trước khi giao)
              </label>
              <input
                type="text"
                id="field-customerNote"
                placeholder="Ghi chú thêm cho Mộc Điều..."
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                onFocus={handleFieldFocus}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#2F5D7E]/25 bg-white focus:outline-none focus:border-[#2F5D7E] focus:ring-1 focus:ring-[#2F5D7E] transition-colors"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#2F5D7E] uppercase tracking-wider">
              3. Phương thức thanh toán
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#2F5D7E] bg-[#2F5D7E]/5 ring-1 ring-[#2F5D7E]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-0.5 text-[#2F5D7E] focus:ring-[#2F5D7E]"
                />
                <div>
                  <div className="text-sm font-bold text-[#252525]">Thanh toán khi nhận hàng (COD)</div>
                  <div className="text-xs text-[#252525]/70 mt-0.5">
                    Đồng kiểm kiểm tra hàng trước, hài lòng mới trả tiền mặt.
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'banking'
                    ? 'border-[#2F5D7E] bg-[#2F5D7E]/5 ring-1 ring-[#2F5D7E]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="banking"
                  checked={paymentMethod === 'banking'}
                  onChange={() => setPaymentMethod('banking')}
                  className="mt-0.5 text-[#2F5D7E] focus:ring-[#2F5D7E]"
                />
                <div>
                  <div className="text-sm font-bold text-[#252525]">Chuyển khoản VietQR</div>
                  <div className="text-xs text-[#252525]/70 mt-0.5">
                    Quét mã QR ngân hàng tiện lợi sau khi tạo đơn hàng.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary & Total */}
          <div className="border-t border-[#2F5D7E]/15 pt-5 space-y-3">
            <h3 className="text-sm font-bold text-[#2F5D7E] uppercase tracking-wider">
              4. Tóm tắt đơn hàng
            </h3>

            <div className="bg-[#F7F3EA] rounded-xl p-4 space-y-2 text-sm text-[#252525]">
              <div className="flex justify-between items-center">
                <span>{selectedProduct.name} ({quantity} hộp x {formatVND(selectedProduct.price)}):</span>
                <span className="font-semibold tabular-nums">{formatVND(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Phí vận chuyển toàn quốc:</span>
                <span className={`font-semibold tabular-nums ${isFreeShipping ? 'text-emerald-700' : 'text-[#8A5A3B]'}`}>
                  {isFreeShipping ? '0đ (Miễn phí)' : formatVND(shippingFee)}
                </span>
              </div>

              <div className="border-t border-[#2F5D7E]/10 pt-2 flex justify-between items-center text-base font-extrabold text-[#2F5D7E]">
                <span>Tổng thanh toán:</span>
                <span className="text-xl sm:text-2xl text-[#8A5A3B] tabular-nums">
                  {formatVND(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base sm:text-lg font-bold text-white bg-[#2F5D7E] hover:bg-[#254b66] active:scale-[0.99] rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang xử lý đơn hàng...</span>
                </>
              ) : (
                <>
                  <span>Xác Nhận Đặt Hàng</span>
                  <span className="text-sm font-normal opacity-90">({formatVND(total)})</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-[#252525]/60 mt-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bảo mật thông tin khách hàng · Không cần thanh toán trước nếu chọn COD</span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
