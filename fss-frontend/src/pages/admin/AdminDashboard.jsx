import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight, BarChart3, Star } from 'lucide-react';
import { stats, orders, products, revenueData, formatPrice, orderStatusMap } from '../../data/mockData';

const statCards = [
  { label: 'Tổng doanh thu', value: formatPrice(stats.totalRevenue), icon: TrendingUp, change: '+18%', color: 'from-primary to-secondary' },
  { label: 'Tổng đơn hàng', value: stats.totalOrders.toLocaleString(), icon: ShoppingBag, change: '+12%', color: 'from-[#0D47A1] to-[#1565C0]' },
  { label: 'Khách hàng', value: stats.totalCustomers.toLocaleString(), icon: Users, change: '+8%', color: 'from-[#1B5E20] to-[#2E7D32]' },
  { label: 'Sản phẩm', value: stats.totalProducts.toLocaleString(), icon: Package, change: '+45', color: 'from-[#4A148C] to-[#6A1B9A]' },
];

const maxRevenue = Math.max(...revenueData.map((r) => r.revenue));

export default function AdminDashboard() {
  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-sm text-muted mt-0.5">Tổng quan hệ thống Fashion Shopping Sense</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, change, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-gradient-to-br ${color} text-white rounded-2xl p-5`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon size={20} />
              </div>
              <span className="text-xs font-semibold flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                <ArrowUpRight size={11} /> {change}
              </span>
            </div>
            <p className="text-2xl font-black leading-none mb-1">{value}</p>
            <p className="text-white/80 text-sm">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-foreground flex items-center gap-2"><BarChart3 size={16} className="text-primary" /> Doanh thu 2025</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Theo tháng (triệu đồng)</p>
            </div>
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-2 h-40">
            {revenueData.map((d) => {
              const heightPct = (d.revenue / maxRevenue) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
                    className="w-full bg-gradient-to-t from-primary to-primary-lighter rounded-t-lg min-h-[4px] relative group"
                    title={formatPrice(d.revenue)}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {(d.revenue / 1e6).toFixed(0)}M
                    </div>
                  </motion.div>
                  <span className="text-[10px] text-muted-foreground">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star size={15} className="text-amber-400 fill-amber-400" /> Sản phẩm bán chạy
          </h2>
          <div className="space-y-3">
            {products
              .sort((a, b) => b.sold - a.sold)
              .slice(0, 5)
              .map((p, i) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                  <img src={p.images[0]} alt={p.name} className="w-9 h-10 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sold} đã bán</p>
                  </div>
                  <span className="text-xs font-bold text-primary">{formatPrice(p.price)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Đơn hàng gần đây</h2>
          <a href="/admin/orders" className="text-xs text-primary hover:underline font-medium">Xem tất cả →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Tổng tiền', 'Trạng thái', ''].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                const status = orderStatusMap[order.status];
                return (
                  <tr key={order.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="py-3 pr-4 font-mono text-xs text-primary font-semibold">{order.id}</td>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-foreground text-xs">{order.customer.name}</p>
                      <p className="text-muted-foreground text-[11px]">{order.customer.phone}</p>
                    </td>
                    <td className="py-3 pr-4 text-xs text-[#374151]">{order.items.length} sản phẩm</td>
                    <td className="py-3 pr-4 font-bold text-xs text-primary">{formatPrice(order.total)}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="py-3">
                      <button className="text-xs text-primary hover:underline">Chi tiết</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
