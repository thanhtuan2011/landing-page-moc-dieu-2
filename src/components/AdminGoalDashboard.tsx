import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Download,
  Eye,
  FileSpreadsheet,
  MousePointerClick,
  Package,
  RefreshCw,
  ShoppingBag,
  Target,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { BRAND_CONFIG, formatVND } from '../data/config';
import { OrderRecord, OrderStatus, TrackingMetrics } from '../types';

interface AdminGoalDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminGoalDashboard: React.FC<AdminGoalDashboardProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState<TrackingMetrics | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'kpi' | 'orders' | 'integration'>('kpi');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [webhookUrlInput, setWebhookUrlInput] = useState('');
  const [webhookTestStatus, setWebhookTestStatus] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [metricsRes, ordersRes] = await Promise.all([
        fetch('/api/analytics/metrics'),
        fetch('/api/orders'),
      ]);

      const metricsData = await metricsRes.json();
      const ordersData = await ordersRes.json();

      if (metricsData.success) {
        setMetrics(metricsData.metrics);
      }
      if (ordersData.success) {
        setOrders(ordersData.orders || []);
      }
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDashboardData();
    }
  }, [isOpen]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setStatusUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh orders and metrics
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('Chưa có đơn hàng nào để xuất file CSV.');
      return;
    }

    const headers = [
      'Mã Đơn',
      'Thời Gian',
      'Khách Hàng',
      'Số Điện Thoại',
      'Email',
      'Địa Chỉ',
      'Số Lượng (Hộp)',
      'Tiền Hàng',
      'Phí Vận Chuyển',
      'Tổng Tiền',
      'Phương Thức',
      'Trạng Thái Đơn',
      'Nguồn',
      'Ghi Chú',
    ];

    const rows = orders.map((o) => [
      o.orderId,
      new Date(o.createdAt).toLocaleString('vi-VN'),
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      o.email ? `"${o.email}"` : '',
      `"${o.shippingAddress.replace(/"/g, '""')}"`,
      o.items.reduce((s, i) => s + i.quantity, 0),
      o.subtotal,
      o.shippingFee,
      o.total,
      o.paymentMethod === 'cod' ? 'COD' : 'Chuyển Khoản',
      o.orderStatus,
      o.source || 'direct',
      o.customerNote ? `"${o.customerNote.replace(/"/g, '""')}"` : '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `moc_dieu_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTestWebhook = async () => {
    setWebhookTestStatus('Đang gửi dữ liệu kiểm tra webhook...');
    try {
      const samplePayload = {
        test: true,
        timestamp: new Date().toISOString(),
        brand: 'Mộc Điều',
        note: 'Kiểm tra kết nối Google Sheets Webhook',
      };
      const res = await fetch(webhookUrlInput, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload),
        mode: 'no-cors',
      });
      setWebhookTestStatus('Đã gửi thành công tín hiệu thử nghiệm đến Webhook!');
    } catch (err: any) {
      setWebhookTestStatus(`Lỗi kết nối: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  const targetOrders = BRAND_CONFIG.goal.targetOrders;
  const successfulOrders = metrics?.successfulOrders || 0;
  const progressPercent = Math.min(100, Math.round((successfulOrders / targetOrders) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-[#2F5D7E]/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-[#2F5D7E] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-amber-300" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Bảng Quản Trị & Đo Lường Mục Tiêu 100 Đơn
              </h2>
              <p className="text-xs text-white/70">
                Mục tiêu nhóm: 100 đơn giao thành công trong 6 tháng · Mộc Điều
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Đóng bảng quản trị"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('kpi')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'kpi'
                ? 'border-[#2F5D7E] text-[#2F5D7E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Chỉ Số KPI & Funnel Chuyển Đổi
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#2F5D7E] text-[#2F5D7E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Quản Lý Đơn Hàng</span>
            <span className="bg-[#2F5D7E]/10 text-[#2F5D7E] px-1.5 py-0.5 rounded-full text-[10px]">
              {orders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('integration')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'integration'
                ? 'border-[#2F5D7E] text-[#2F5D7E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kết Nối Google Sheets
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: KPI & FUNNEL */}
          {activeTab === 'kpi' && (
            <div className="space-y-6">
              {/* Core Goal Milestone Progress */}
              <div className="p-5 bg-[#F7F3EA] rounded-xl border border-[#2F5D7E]/15 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#2F5D7E] uppercase tracking-wide">
                      Tiến Độ Mục Tiêu 100 Đơn Thành Công
                    </h3>
                    <p className="text-xs text-[#252525]/70">
                      Chỉ tính các đơn có trạng thái "giao thành công" (không tính đơn mới tạo hay đã hủy)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-[#2F5D7E] tabular-nums">
                      {successfulOrders} / {targetOrders}
                    </span>
                    <span className="text-xs font-semibold text-[#8A5A3B] ml-1">
                      ({progressPercent}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-[#2F5D7E] to-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] text-[#252525]/60">
                  <span>Khởi động: 0 đơn</span>
                  <span>Mục tiêu 6 tháng: 100 đơn</span>
                </div>
              </div>

              {/* Conversion Funnel Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <Eye className="w-4 h-4 text-[#2F5D7E]" />
                    <span>Lượt xem trang</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 tabular-nums">
                    {metrics?.pageViews ?? 0}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <MousePointerClick className="w-4 h-4 text-[#8A5A3B]" />
                    <span>Bấm nút CTA</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 tabular-nums">
                    {metrics?.ctaClicks ?? 0}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                    <span>Bắt đầu điền form</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 tabular-nums">
                    {metrics?.formStarts ?? 0}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Đơn tiếp nhận</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-700 tabular-nums">
                    {metrics?.totalOrders ?? 0}
                  </div>
                </div>
              </div>

              {/* Secondary Metrics: Conversion Rate & Status Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Conversion Rate Card */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Tỷ Lệ Chuyển Đổi (Conversion Rate)
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-600">Tỷ lệ đặt đơn (Tổng đơn / Lượt xem):</span>
                      <strong className="text-sm text-[#2F5D7E] tabular-nums">
                        {metrics?.conversionRate ?? 0}%
                      </strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-600">Tỷ lệ giao thành công (Đơn giao / Lượt xem):</span>
                      <strong className="text-sm text-emerald-700 tabular-nums">
                        {metrics?.successfulConversionRate ?? 0}%
                      </strong>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600">Tổng doanh thu dự kiến (không tính đơn hủy):</span>
                      <strong className="text-sm text-[#8A5A3B] tabular-nums">
                        {formatVND(metrics?.totalRevenue ?? 0)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Orders by Status Card */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Phân Bổ Trạng Thái Đơn Hàng
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-900">
                      <div className="text-[11px] text-blue-700">Mới tiếp nhận</div>
                      <div className="text-base font-bold tabular-nums">{metrics?.newOrders ?? 0}</div>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-900">
                      <div className="text-[11px] text-amber-700">Đã xác nhận</div>
                      <div className="text-base font-bold tabular-nums">{metrics?.confirmedOrders ?? 0}</div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-900">
                      <div className="text-[11px] text-purple-700">Đang giao</div>
                      <div className="text-base font-bold tabular-nums">{metrics?.deliveringOrders ?? 0}</div>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-900">
                      <div className="text-[11px] text-emerald-700">Giao thành công</div>
                      <div className="text-base font-bold tabular-nums">{metrics?.successfulOrders ?? 0}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* UTM Source breakdown */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Nguồn Khách Hàng (UTM Source)
                </h4>
                {metrics && Object.keys(metrics.sourceBreakdown).length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {Object.entries(metrics.sourceBreakdown).map(([src, count]) => (
                      <span
                        key={src}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium"
                      >
                        {src}: <strong className="tabular-nums">{count}</strong>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Chưa có dữ liệu nguồn truy cập.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Danh Sách Đơn Hàng ({orders.length})
                </h3>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất File CSV</span>
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 space-y-1">
                  <Package className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="text-sm font-medium">Chưa có đơn hàng nào</p>
                  <p className="text-xs">Đơn hàng mới từ form đặt hàng sẽ tự động xuất hiện tại đây.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Mã Đơn / Ngày</th>
                        <th className="p-3">Khách Hàng</th>
                        <th className="p-3">Địa Chỉ Giao</th>
                        <th className="p-3">Số Lượng</th>
                        <th className="p-3">Tổng Tiền</th>
                        <th className="p-3">Trạng Thái</th>
                        <th className="p-3 text-right">Cập Nhật Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((o) => (
                        <tr key={o.orderId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 whitespace-nowrap">
                            <strong className="text-[#2F5D7E] block">{o.orderId}</strong>
                            <span className="text-[10px] text-slate-400">
                              {new Date(o.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}{' '}
                              {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-900">{o.customerName}</div>
                            <div className="text-slate-500 tabular-nums">{o.phone}</div>
                          </td>
                          <td className="p-3 max-w-xs truncate" title={o.shippingAddress}>
                            {o.shippingAddress}
                          </td>
                          <td className="p-3 tabular-nums font-semibold">
                            {o.items.reduce((s, i) => s + i.quantity, 0)} hộp
                          </td>
                          <td className="p-3 tabular-nums font-bold text-[#8A5A3B] whitespace-nowrap">
                            {formatVND(o.total)}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                o.orderStatus === 'giao thành công'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : o.orderStatus === 'đang giao'
                                  ? 'bg-purple-100 text-purple-800'
                                  : o.orderStatus === 'đã xác nhận'
                                  ? 'bg-blue-100 text-blue-800'
                                  : o.orderStatus === 'đã hủy'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <select
                              value={o.orderStatus}
                              disabled={statusUpdatingId === o.orderId}
                              onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value as OrderStatus)}
                              className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:border-[#2F5D7E]"
                            >
                              <option value="mới tiếp nhận">mới tiếp nhận</option>
                              <option value="đã xác nhận">đã xác nhận</option>
                              <option value="đang giao">đang giao</option>
                              <option value="giao thành công">giao thành công</option>
                              <option value="đã hủy">đã hủy</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GOOGLE SHEETS INTEGRATION */}
          {activeTab === 'integration' && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                  <span>Cấu Hình Tự Động Đồng Bộ Google Sheets</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Để tự động chuyển đơn hàng mới vào Google Sheets ngay khi khách nhấn đặt hàng, bạn có thể triển khai một Google Apps Script Webhook và thêm biến môi trường <code>GOOGLE_SHEET_WEBHOOK_URL</code> vào hệ thống hoặc thử nghiệm gửi dữ liệu bên dưới.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  URL Google Apps Script Web App (Webhook URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={webhookUrlInput}
                    onChange={(e) => setWebhookUrlInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2F5D7E]"
                  />
                  <button
                    onClick={handleTestWebhook}
                    disabled={!webhookUrlInput}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#2F5D7E] hover:bg-[#254b66] disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Kiểm Tra Webhook
                  </button>
                </div>
                {webhookTestStatus && (
                  <p className="text-xs text-[#2F5D7E] font-medium pt-1">
                    {webhookTestStatus}
                  </p>
                )}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <strong>Gợi ý mã Google Apps Script mẫu:</strong>
                <pre className="p-2.5 bg-white border border-amber-200/80 rounded-md overflow-x-auto text-[11px] font-mono text-slate-800">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.orderId,
    data.createdAt,
    data.customerName,
    data.phone,
    data.shippingAddress,
    data.subtotal,
    data.shippingFee,
    data.total,
    data.orderStatus,
    data.source
  ]);
  return ContentService.createTextOutput(JSON.stringify({result: "success"})).setMimeType(ContentService.MimeType.JSON);
}`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#2F5D7E] hover:bg-[#254b66] rounded-lg transition-colors cursor-pointer"
          >
            Đóng Bảng Quản Trị
          </button>
        </div>
      </div>
    </div>
  );
};
