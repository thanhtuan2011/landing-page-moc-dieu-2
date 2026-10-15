import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// File paths for persistence
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Catalog of 5 official products for server-side authoritative pricing
const PRODUCT_CATALOG: Record<string, { id: string; name: string; spec: string; unitPrice: number }> = {
  'hop-qua-moc-dieu-vi-moc-an-yen': {
    id: 'hop-qua-moc-dieu-vi-moc-an-yen',
    name: 'Hộp Quà Mộc Điều - Vị Mộc An Yên',
    spec: '2 hũ x 400g (Tổng 800g)',
    unitPrice: 360000,
  },
  'hop-qua-moc-dieu-sum-vay-nhu-y': {
    id: 'hop-qua-moc-dieu-sum-vay-nhu-y',
    name: 'Hộp Quà Mộc Điều - Sum Vầy Như Ý',
    spec: '4 hũ x 200g (Tổng 800g - 4 Vị)',
    unitPrice: 520000,
  },
  'hop-qua-moc-dieu-khang-thinh': {
    id: 'hop-qua-moc-dieu-khang-thinh',
    name: 'Hộp Quà Gỗ Mộc Điều - Khang Thịnh',
    spec: '3 hũ x 300g (Tổng 900g hạt cồ đại)',
    unitPrice: 650000,
  },
  'set-qua-moc-dieu-vi-moc-thanh-tao': {
    id: 'set-qua-moc-dieu-vi-moc-thanh-tao',
    name: 'Set Quà Mộc Điều - Vị Mộc Thanh Tao',
    spec: '1 hũ 500g + 1 hộp Trà Cổ Thụ 100g',
    unitPrice: 460000,
  },
  'hop-qua-moc-dieu-tet-doan-vien': {
    id: 'hop-qua-moc-dieu-tet-doan-vien',
    name: 'Hộp Quà Mộc Điều - Tết Đoàn Viên Special Edition',
    spec: '3 hũ x 400g (Tổng 1.2kg + Thiệp chúc)',
    unitPrice: 790000,
  },
};

const SHIPPING_RULES = {
  freeShippingThreshold: 500000,
  standardShippingFee: 30000,
};

// Helpers for data reading and writing
function readOrders(): any[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading orders file:', err);
  }
  return [];
}

function writeOrders(orders: any[]): void {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing orders file:', err);
  }
}

function readAnalytics(): {
  pageViews: number;
  ctaClicks: number;
  formStarts: number;
  sourceBreakdown: Record<string, number>;
} {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const data = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading analytics file:', err);
  }
  return {
    pageViews: 0,
    ctaClicks: 0,
    formStarts: 0,
    sourceBreakdown: {},
  };
}

function writeAnalytics(analytics: any): void {
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing analytics file:', err);
  }
}

// Generate unique order ID: MD-YYYYMMDD-XXXX
function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MD-${year}${month}${day}-${randomChars}`;
}

// Vietnamese phone validation
function isValidVietnamesePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s.-]/g, '');
  return /^(0[3|5|7|8|9])[0-9]{8}$/.test(cleaned);
}

// ==========================================
// API ROUTES
// ==========================================

// Track user interactions
app.post('/api/analytics/event', (req, res) => {
  const { type, source = 'direct' } = req.body;
  const analytics = readAnalytics();

  if (type === 'pageview') {
    analytics.pageViews = (analytics.pageViews || 0) + 1;
    analytics.sourceBreakdown[source] = (analytics.sourceBreakdown[source] || 0) + 1;
  } else if (type === 'cta_click') {
    analytics.ctaClicks = (analytics.ctaClicks || 0) + 1;
  } else if (type === 'form_start') {
    analytics.formStarts = (analytics.formStarts || 0) + 1;
  }

  writeAnalytics(analytics);
  res.json({ success: true });
});

// Create Order (with full server-side validation & pricing enforcement)
app.post('/api/orders', async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      shippingAddress,
      productId = 'hop-qua-moc-dieu-vi-moc-an-yen',
      quantity,
      customerNote,
      paymentMethod = 'cod',
      source = 'direct',
      campaign,
      utmParams,
    } = req.body;

    // 1. Mandatory field checks
    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return res.status(400).json({ error: 'Họ và tên người nhận là bắt buộc' });
    }

    if (!phone || typeof phone !== 'string' || !isValidVietnamesePhone(phone)) {
      return res.status(400).json({ error: 'Số điện thoại không đúng định dạng Việt Nam (10 chữ số, ví dụ 0982345678)' });
    }

    if (!shippingAddress || typeof shippingAddress !== 'string' || !shippingAddress.trim()) {
      return res.status(400).json({ error: 'Địa chỉ giao hàng chi tiết là bắt buộc' });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Số lượng sản phẩm phải lớn hơn 0' });
    }

    // 2. Server-side authoritative product lookup & calculation
    const selectedProduct = PRODUCT_CATALOG[productId] || PRODUCT_CATALOG['hop-qua-moc-dieu-vi-moc-an-yen'];
    const unitPrice = selectedProduct.unitPrice;
    const subtotal = unitPrice * qty;
    const shippingFee = subtotal >= SHIPPING_RULES.freeShippingThreshold ? 0 : SHIPPING_RULES.standardShippingFee;
    const total = subtotal + shippingFee;

    const orderId = generateOrderId();
    const createdAt = new Date().toISOString();

    const newOrder = {
      orderId,
      createdAt,
      customerName: customerName.trim(),
      phone: phone.trim().replace(/[\s.-]/g, ''),
      email: email ? email.trim() : undefined,
      shippingAddress: shippingAddress.trim(),
      items: [
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          spec: selectedProduct.spec,
          unitPrice,
          quantity: qty,
          totalPrice: subtotal,
        },
      ],
      subtotal,
      shippingFee,
      total,
      customerNote: customerNote ? customerNote.trim() : undefined,
      paymentMethod,
      paymentStatus: 'chưa thanh toán',
      orderStatus: 'mới tiếp nhận',
      source: source || 'direct',
      campaign: campaign || undefined,
      utmParams: utmParams || undefined,
    };

    // 3. Persist order
    const orders = readOrders();
    orders.unshift(newOrder); // newest first
    writeOrders(orders);

    // 4. Asynchronous Google Sheets Webhook sync (if configured)
    const googleSheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (googleSheetUrl) {
      fetch(googleSheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      }).catch((webhookErr) => {
        console.warn('Google Sheets Webhook notification failed:', webhookErr);
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      order: newOrder,
    });
  } catch (err: any) {
    console.error('Error creating order:', err);
    return res.status(500).json({ error: 'Lỗi máy chủ khi tiếp nhận đơn hàng. Vui lòng thử lại.' });
  }
});

// Get orders list (internal)
app.get('/api/orders', (req, res) => {
  const orders = readOrders();
  res.json({ success: true, count: orders.length, orders });
});

// Update order status (internal)
app.patch('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, paymentStatus } = req.body;

  const orders = readOrders();
  const orderIndex = orders.findIndex((o) => o.orderId === orderId);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
  }

  if (orderStatus) {
    orders[orderIndex].orderStatus = orderStatus;
  }
  if (paymentStatus) {
    orders[orderIndex].paymentStatus = paymentStatus;
  }

  orders[orderIndex].updatedAt = new Date().toISOString();
  writeOrders(orders);

  return res.json({ success: true, order: orders[orderIndex] });
});

// Get aggregated KPIs and metrics towards the 100-order goal
app.get('/api/analytics/metrics', (req, res) => {
  const analytics = readAnalytics();
  const orders = readOrders();

  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.orderStatus === 'mới tiếp nhận').length;
  const confirmedOrders = orders.filter((o) => o.orderStatus === 'đã xác nhận').length;
  const deliveringOrders = orders.filter((o) => o.orderStatus === 'đang giao').length;
  const successfulOrders = orders.filter((o) => o.orderStatus === 'giao thành công').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'đã hủy').length;

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'đã hủy')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pageViews = analytics.pageViews || 0;
  const conversionRate = pageViews > 0 ? Number(((totalOrders / pageViews) * 100).toFixed(2)) : 0;
  const successfulConversionRate = pageViews > 0 ? Number(((successfulOrders / pageViews) * 100).toFixed(2)) : 0;

  // Aggregate sources from orders as well
  const sourceBreakdown = { ...analytics.sourceBreakdown };
  orders.forEach((o) => {
    const src = o.source || 'direct';
    sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
  });

  res.json({
    success: true,
    metrics: {
      pageViews,
      ctaClicks: analytics.ctaClicks || 0,
      formStarts: analytics.formStarts || 0,
      totalOrders,
      newOrders,
      confirmedOrders,
      deliveringOrders,
      successfulOrders,
      cancelledOrders,
      totalRevenue,
      conversionRate,
      successfulConversionRate,
      sourceBreakdown,
      targetGoal: 100,
    },
    googleSheetConfigured: Boolean(process.env.GOOGLE_SHEET_WEBHOOK_URL),
  });
});

// ==========================================
// VITE DEV SERVER / STATIC SERVING SETUP
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mộc Điều Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
