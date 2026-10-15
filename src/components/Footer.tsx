import React, { useState } from 'react';
import { MocDieuLogo } from './MocDieuLogo';
import { Mail, MapPin, Phone, ShieldCheck, Truck } from 'lucide-react';
import { BRAND_CONFIG, formatVND } from '../data/config';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  const openShippingModal = () => {
    setModalContent({
      title: 'Chính Sách Vận Chuyển Toàn Quốc',
      content: `Chính sách vận chuyển của Mộc Điều:
1. Đơn hàng từ 500.000đ trở lên: MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC (0đ).
2. Đơn hàng dưới 500.000đ: Phí vận chuyển tiêu chuẩn 30.000đ.
3. Thời gian giao hàng: 2 - 4 ngày làm việc trên toàn bộ 63 tỉnh thành.
4. Kiểm tra hàng (Đồng kiểm): Quý khách được quyền mở hộp kiểm tra đúng quy cách, hũ thủy tinh nguyên vẹn trước khi thanh toán cho đơn vị giao hàng.`
    });
  };

  const openPrivacyModal = () => {
    setModalContent({
      title: 'Chính Sách Quyền Riêng Tư',
      content: `Mộc Điều cam kết bảo vệ thông tin cá nhân của khách hàng:
1. Mục đích thu thập: Họ tên, số điện thoại, địa chỉ nhận hàng và email chỉ được sử dụng duy nhất cho mục đích xác nhận đơn hàng, giao nhận bưu phẩm và hỗ trợ sau bán hàng.
2. Bảo mật thông tin: Mộc Điều không bán, chia sẻ hoặc trao đổi thông tin khách hàng cho bất kỳ bên thứ ba nào ngoài đơn vị vận chuyển được ủy quyền để giao hàng.
3. Quyền của khách hàng: Quý khách có quyền yêu cầu tra cứu, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bất kỳ lúc nào bằng cách liên hệ Hotline: ${BRAND_CONFIG.hotline}.`
    });
  };

  const openTermsModal = () => {
    setModalContent({
      title: 'Điều Khoản Mua Hàng & Đổi Trả',
      content: `Điều khoản mua hàng tại Mộc Điều:
1. Quy cách sản phẩm: Hộp quà Mộc Điều sử dụng hũ thủy tinh nắp gỗ kín khí cao cấp, hạt điều nguyên hạt loại A tuyển chọn Bình Phước, đóng gói trong hộp quà định hình kèm thiệp.
2. Kiểm tra hàng (Đồng kiểm): Khách hàng được quyền mở hộp đồng kiểm tra số lượng và tính nguyên vẹn của sản phẩm trước khi thanh toán cho nhân viên giao hàng.
3. Chính sách đổi trả: Đổi mới 1:1 miễn phí trong vòng 7 ngày nếu sản phẩm bị hư hỏng do vận chuyển hoặc không đúng quy cách cam kết.
4. Phương thức thanh toán: Hỗ trợ tiền mặt khi nhận hàng (COD) hoặc chuyển khoản ngân hàng qua VietQR.`
    });
  };

  return (
    <footer className="bg-[#1b3447] text-white/90 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <MocDieuLogo size="md" light={true} />
            <p className="text-sm text-white/80 italic font-serif">
              “{BRAND_CONFIG.slogan}”
            </p>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              Thương hiệu quà tặng hạt điều tự nhiên cao cấp Việt Nam. Tuyển chọn 100% hạt điều Bình Phước loại A, giữ trọn sự mộc mạc và chân thành trong từng hộp quà.
            </p>
          </div>

          {/* Quick Links & Policies */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-widest">
              Thông Tin & Chính Sách
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <button
                  type="button"
                  onClick={openShippingModal}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Chính sách vận chuyển & Freeship</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openTermsModal}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Điều khoản mua hàng & Đổi trả
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openPrivacyModal}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Chính sách quyền riêng tư
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="text-amber-300 hover:text-amber-100 transition-colors cursor-pointer text-left font-semibold"
                >
                  Bảng quản trị: Theo dõi mục tiêu 100 đơn
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details from Config */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-widest">
              Liên Hệ Mộc Điều
            </h4>
            <div className="space-y-2.5 text-xs text-white/80">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white/60">Hotline đặt hàng & CSKH:</span>
                  <a href={`tel:${BRAND_CONFIG.hotline.replace(/\./g, '')}`} className="font-semibold text-white hover:underline">
                    {BRAND_CONFIG.hotline}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white/60">Email:</span>
                  <a href={`mailto:${BRAND_CONFIG.supportEmail}`} className="font-semibold text-white hover:underline">
                    {BRAND_CONFIG.supportEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white/60">Vùng nguyên liệu:</span>
                  <span>{BRAND_CONFIG.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} Mộc Điều. Mộc vị tự nhiên – Trọn vị hạt điều.
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cam kết hạt điều loại A nguyên chất</span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 text-[#252525] space-y-4">
            <h3 className="text-lg font-bold text-[#2F5D7E] font-serif">{modalContent.title}</h3>
            <div className="text-xs sm:text-sm text-[#252525]/85 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto">
              {modalContent.content}
            </div>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2F5D7E] hover:bg-[#254b66] rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
