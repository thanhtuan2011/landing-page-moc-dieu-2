import { ProductItem } from '../types';

export const BRAND_CONFIG = {
  name: 'Mộc Điều',
  slogan: 'Mộc vị tự nhiên – Trọn vị hạt điều.',
  heroHeadline: 'Trao món quà mộc mạc, gửi trọn sự quan tâm.',
  heroDescription: 'Khám phá bộ sưu tập hộp quà hạt điều Mộc Điều – lựa chọn quà tặng tinh tế từ nông sản Việt cho những dịp đặc biệt.',
  hotline: '0982.345.678',
  supportEmail: 'chamsoc@mocdieu.vn',
  address: 'Bình Phước, Việt Nam',
  operatingHours: '08:00 - 21:00 (Tất cả các ngày trong tuần)',
  shippingPolicy: {
    freeThreshold: 500000, // 500.000đ trở lên: miễn phí ship (0đ)
    standardFee: 30000,    // dưới 500.000đ: 30.000đ
    estimatedDeliveryDays: '2 - 4 ngày toàn quốc',
    inspectionAllowed: true, // Kiểm tra hàng trước khi thanh toán
  },
  goal: {
    targetOrders: 100,
    timeframeMonths: 6,
  }
};

export const MOC_DIEU_PRODUCTS: ProductItem[] = [
  {
    id: 'hop-qua-moc-dieu-vi-moc-an-yen',
    name: 'Hộp Quà Mộc Điều - Vị Mộc An Yên',
    subtitle: 'Phiên bản kinh điển – 2 hũ thủy tinh nắp gỗ sang trọng',
    spec: '2 hũ x 400g (Tổng 800g)',
    weightGrams: 800,
    originalPrice: 385000,
    price: 360000,
    inStock: true,
    images: {
      hero: '/src/assets/images/moc_dieu_gift_box_1792072052260.jpg',
      jars: '/src/assets/images/moc_dieu_cashew_jars_1792072053929.jpg',
      unboxing: '/src/assets/images/moc_dieu_gift_unboxing_1792072054930.jpg',
    },
    features: [
      '100% hạt điều Bình Phước loại A nguyên hạt đồng đều, vàng óng tự nhiên',
      'Rang mộc nguyên vị thanh khiết, giòn rụm bùi béo tự nhiên, không cholesterol',
      '2 hũ thủy tinh cao cấp (400g/hũ) kèm nắp gỗ tự nhiên kín khí chống ẩm',
      'Hộp quà cứng cáp mang sắc xanh Deep Blue nhã nhặn phối kraft tự nhiên',
      'Kèm thiệp trang trọng để ghi lời chúc trao gửi người thân, đối tác'
    ],
    description: 'Hộp Quà Mộc Điều - Vị Mộc An Yên kết hợp trọn vẹn nét đẹp mộc mạc của nông sản Việt cùng thiết kế quà tặng trang nhã. Từng hạt điều được tuyển chọn kỹ lưỡng, rang mộc giữ trọn hương vị ngọt bùi tự nhiên.',
    details: {
      ingredients: '100% Hạt điều tuyển chọn loại A nguyên hạt, muối khoáng tinh khiết (<0.5%)',
      origin: 'Bình Phước, Việt Nam',
      shelfLife: '12 tháng kể từ ngày sản xuất',
      packaging: 'Hộp quà cao cấp đựng 2 hũ thủy tinh nắp gỗ hút ẩm kín khí',
      storage: 'Bảo quản nơi khô ráo, thoáng mát, đậy kín nắp sau khi sử dụng'
    }
  },
  {
    id: 'hop-qua-moc-dieu-sum-vay-nhu-y',
    name: 'Hộp Quà Mộc Điều - Sum Vầy Như Ý',
    subtitle: 'Tuyển tập 4 vị đặc sản – Đa dạng phong vị sum họp',
    spec: '4 hũ x 200g (Tổng 800g - 4 Vị)',
    weightGrams: 800,
    originalPrice: 560000,
    price: 520000,
    inStock: true,
    images: {
      hero: '/src/assets/images/moc_dieu_gift_4flavors_1792073926623.jpg',
      jars: '/src/assets/images/moc_dieu_cashew_jars_1792072053929.jpg',
      unboxing: '/src/assets/images/moc_dieu_gift_unboxing_1792072054930.jpg',
    },
    features: [
      '4 hũ 4 vị: Rang Muối Biển, Rang Mộc Tự Nhiên, Phủ Mật Ong Rừng, Cay Tỏi Ớt',
      'Phù hợp cho cả gia đình, người già và trẻ nhỏ cùng thưởng thức',
      'Đóng gói trong hộp quà dập nổi vân hoa văn cổ điển cao cấp',
      'Đạt ngưỡng MIỄN PHÍ VẬN CHUYỂN toàn quốc'
    ],
    description: 'Hộp quà Sum Vầy Như Ý mang đến trải nghiệm vị giác phong phú với 4 hũ hạt điều 4 hương vị đặc trưng, tượng trưng cho bốn mùa sung túc và vẹn tròn.',
    details: {
      ingredients: 'Hạt điều loại A, mật ong hoa nhãn, muối biển, tỏi ớt tự nhiên',
      origin: 'Bình Phước, Việt Nam',
      shelfLife: '12 tháng kể từ ngày sản xuất',
      packaging: 'Hộp quà sang trọng 4 ngăn định hình',
      storage: 'Nơi khô ráo, tránh ánh nắng trực tiếp'
    }
  },
  {
    id: 'hop-qua-moc-dieu-khang-thinh',
    name: 'Hộp Quà Gỗ Mộc Điều - Khang Thịnh',
    subtitle: 'Chất liệu gỗ tự nhiên thủ công – Hạt cồ đại A+ thượng hạng',
    spec: '3 hũ x 300g (Tổng 900g hạt cồ đại)',
    weightGrams: 900,
    originalPrice: 690000,
    price: 650000,
    inStock: true,
    images: {
      hero: '/src/assets/images/moc_dieu_gift_wooden_box_1792073927837.jpg',
      jars: '/src/assets/images/moc_dieu_cashew_jars_1792072053929.jpg',
      unboxing: '/src/assets/images/moc_dieu_gift_unboxing_1792072054930.jpg',
    },
    features: [
      'Hộp gỗ thông tự nhiên chế tác mộc mạc, khóa cài kim loại cổ điển',
      'Hạt điều cồ đại size A+ tuyển chọn khắt khe 100 hạt như một',
      'Lót rơm giấy kraft mộc mạc thân thiện môi trường',
      'Món quà ngoại giao và tri ân đối tác đẳng cấp bậc nhất'
    ],
    description: 'Hộp Quà Gỗ Khang Thịnh là dòng sản phẩm thủ công cao cấp nhất của Mộc Điều, mang đậm nét văn hóa mộc mạc và sang trọng bền vững theo thời gian.',
    details: {
      ingredients: '100% Hạt điều cồ đại loại A+ Bình Phước rang mộc',
      origin: 'Bình Phước, Việt Nam',
      shelfLife: '12 tháng kể từ ngày sản xuất',
      packaging: 'Hộp gỗ tự nhiên cao cấp có khóa cài trang trọng',
      storage: 'Bảo quản nơi khô ráo, đậy kín nắp hũ'
    }
  },
  {
    id: 'set-qua-moc-dieu-vi-moc-thanh-tao',
    name: 'Set Quà Mộc Điều - Vị Mộc Thanh Tao',
    subtitle: 'Cặp đôi hoàn hảo: Hạt điều rang mộc & Trà Shan Tuyết cổ thụ',
    spec: '1 hũ 500g + 1 hộp Trà Cổ Thụ 100g',
    weightGrams: 600,
    originalPrice: 495000,
    price: 460000,
    inStock: true,
    images: {
      hero: '/src/assets/images/moc_dieu_gift_tea_pairing_1792073926843.jpg',
      jars: '/src/assets/images/moc_dieu_cashew_jars_1792072053929.jpg',
      unboxing: '/src/assets/images/moc_dieu_gift_unboxing_1792072054930.jpg',
    },
    features: [
      '1 hũ lớn 500g hạt điều rang mộc thơm giòn nguyên bản',
      '1 lon trà Shan Tuyết cổ thụ hữu cơ thượng hạng hái tay',
      'Vị ngọt bùi của hạt điều hòa quyện vị chát dịu hậu ngọt sâu của trà',
      'Thiết kế nhã nhặn, thiền vị, thích hợp tặng người yêu trà'
    ],
    description: 'Bộ quà Vị Mộc Thanh Tao mang đến thú vui thưởng thức tao nhã. Vị bùi béo tự nhiên của hạt điều Bình Phước kết hợp cùng chén trà thơm tạo nên những khoảnh khắc hàn huyên sâu lắng.',
    details: {
      ingredients: 'Hạt điều rang mộc Bình Phước (500g), Búp trà Shan Tuyết cổ thụ (100g)',
      origin: 'Bình Phước & Hà Giang, Việt Nam',
      shelfLife: '12 tháng',
      packaging: 'Hũ thủy tinh nắp gỗ + lon thiếc bảo quản trà',
      storage: 'Nơi khô ráo, tránh mùi lạ'
    }
  },
  {
    id: 'hop-qua-moc-dieu-tet-doan-vien',
    name: 'Hộp Quà Mộc Điều - Tết Đoàn Viên Special Edition',
    subtitle: 'Bộ quà lễ hội trọn vẹn – Thiết kế ép nhũ kim sang trọng',
    spec: '3 hũ x 400g (Tổng 1.2kg hạt điều + Thiệp mừng)',
    weightGrams: 1200,
    originalPrice: 850000,
    price: 790000,
    inStock: true,
    images: {
      hero: '/src/assets/images/moc_dieu_gift_unboxing_1792072054930.jpg',
      jars: '/src/assets/images/moc_dieu_cashew_jars_1792072053929.jpg',
      unboxing: '/src/assets/images/moc_dieu_gift_box_1792072052260.jpg',
    },
    features: [
      'Khối lượng lớn 1.2kg hạt điều loại A cho cả gia đình mùa sum họp',
      'Hộp quà xanh Deep Blue dập họa tiết hoa văn truyền thống tinh xảo',
      'Kèm thiệp chúc Tết may mắn và túi xách giấy cao cấp quai dù',
      'Miễn phí vận chuyển toàn quốc'
    ],
    description: 'Hộp Quà Tết Đoàn Viên là món quà sum vầy ý nghĩa nhất gửi trao cha mẹ, người thân và khách hàng trân quý trong dịp năm mới và các ngày hội lớn.',
    details: {
      ingredients: '100% Hạt điều loại A Bình Phước rang mộc & rang muối lụa',
      origin: 'Bình Phước, Việt Nam',
      shelfLife: '12 tháng',
      packaging: 'Hộp quà nắp nam châm cao cấp 3 hũ thủy tinh',
      storage: 'Bảo quản nơi khô ráo, thoáng mát'
    }
  }
];

// Default highlighted flagship product
export const MOC_DIEU_GIFT_BOX = MOC_DIEU_PRODUCTS[0];

export const FAQ_LIST = [
  {
    question: 'Hộp quà Mộc Điều gồm những gì?',
    answer: 'Tùy theo bộ quà quý khách lựa chọn (từ 1 đến 4 hũ), hộp quà Mộc Điều bao gồm: Hộp quà định hình cao cấp màu xanh Deep Blue hoặc Hộp Gỗ tự nhiên, các hũ thủy tinh nắp gỗ kín khí cao cấp chứa hạt điều tuyển chọn, kèm thiệp gửi trao tâm ý và túi xách quà tặng trang trọng.'
  },
  {
    question: 'Khối lượng mỗi hộp là bao nhiêu?',
    answer: 'Mộc Điều có các quy cách phù hợp cho từng nhu cầu: Hộp Vị Mộc An Yên (800g - 2 hũ x 400g), Hộp Sum Vầy Như Ý (800g - 4 hũ x 200g), Hộp Gỗ Khang Thịnh (900g - 3 hũ x 300g), Set Vị Mộc Thanh Tao (500g hạt điều + 100g trà cổ thụ), và Hộp Tết Đoàn Viên (1.2kg - 3 hũ x 400g).'
  },
  {
    question: 'Phí vận chuyển được tính như thế nào?',
    answer: 'Mộc Điều áp dụng chính sách vận chuyển minh bạch: Đơn hàng từ 500.000đ trở lên được MIỄN PHÍ VẬN CHUYỂN toàn quốc (0đ). Đơn hàng dưới 500.000đ có phí giao hàng tiêu chuẩn là 30.000đ. Đơn đặt từ 2 hộp Vị Mộc An Yên hoặc chọn các hộp quà từ 520.000đ sẽ tự động được miễn phí ship 100%.'
  },
  {
    question: 'Làm thế nào để đặt hàng?',
    answer: 'Bạn chỉ cần chọn sản phẩm mong muốn, điền Họ tên, Số điện thoại, Địa chỉ nhận hàng vào Form Đặt Hàng trực tiếp trên trang này và bấm "Xác Nhận Đặt Hàng". Hệ thống sẽ tạo mã đơn hàng ngay lập tức và nhân viên Mộc Điều sẽ gọi điện xác nhận đơn trước khi đóng gói gửi đi.'
  },
  {
    question: 'Làm thế nào để liên hệ khi cần hỗ trợ?',
    answer: `Quý khách có thể liên hệ trực tiếp qua Hotline: ${BRAND_CONFIG.hotline} (08:00 - 21:00 hàng ngày) hoặc gửi email đến ${BRAND_CONFIG.supportEmail}. Chúng tôi luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc và tư vấn đặt quà tặng số lượng lớn cho doanh nghiệp.`
  }
];

export function calculateShipping(subtotal: number): { shippingFee: number; total: number; isFreeShipping: boolean; amountNeededForFree: number } {
  const isFreeShipping = subtotal >= BRAND_CONFIG.shippingPolicy.freeThreshold;
  const shippingFee = isFreeShipping ? 0 : BRAND_CONFIG.shippingPolicy.standardFee;
  const total = subtotal + shippingFee;
  const amountNeededForFree = Math.max(0, BRAND_CONFIG.shippingPolicy.freeThreshold - subtotal);

  return {
    shippingFee,
    total,
    isFreeShipping,
    amountNeededForFree,
  };
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount).replace('₫', 'đ');
}
