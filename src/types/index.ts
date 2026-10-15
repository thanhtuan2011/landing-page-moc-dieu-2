export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  spec: string;
  weightGrams: number;
  originalPrice: number;
  price: number;
  inStock: boolean;
  images: {
    hero: string;
    jars: string;
    unboxing: string;
  };
  features: string[];
  description: string;
  details: {
    ingredients: string;
    origin: string;
    shelfLife: string;
    packaging: string;
    storage: string;
  };
}

export interface OrderItem {
  productId: string;
  productName: string;
  spec: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type PaymentMethod = 'cod' | 'banking';
export type PaymentStatus = 'chưa thanh toán' | 'đã thanh toán';
export type OrderStatus = 'mới tiếp nhận' | 'đã xác nhận' | 'đang giao' | 'giao thành công' | 'đã hủy';

export interface OrderPayload {
  customerName: string;
  phone: string;
  email?: string;
  shippingAddress: string;
  productId: string;
  quantity: number;
  customerNote?: string;
  paymentMethod: PaymentMethod;
  source?: string;
  campaign?: string;
  utmParams?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  customerNote?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  source: string;
  campaign?: string;
  utmParams?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}

export interface TrackingMetrics {
  pageViews: number;
  ctaClicks: number;
  formStarts: number;
  totalOrders: number;
  newOrders: number;
  confirmedOrders: number;
  deliveringOrders: number;
  successfulOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  conversionRate: number; // percentage (orders / pageViews * 100)
  successfulConversionRate: number; // percentage (successfulOrders / pageViews * 100)
  sourceBreakdown: Record<string, number>;
  targetGoal: number; // 100 orders
}
