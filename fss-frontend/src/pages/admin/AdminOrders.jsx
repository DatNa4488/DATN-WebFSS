import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { orders as initialOrders, formatPrice, orderStatusMap } from '../../data/mockData';

const statusOptions = ['all', 'pending', 'confirmed', 'packing', 'shipping', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id, newStatus) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">Quản lý đơn hàng</h1>
        <p className="text-sm text-muted">{filtered.length} đơn hàng</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc tên khách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statusOptions.map((s) => {
            const status = orderStatusMap[s];
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  filterStatus === s ? 'bg-primary text-white' : 'bg-white border border-border text-[#374151] hover:border-primary'
                }`}
              >
                {s === 'all' ? 'Tất cả' : status?.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filtered.map((order) => {
          const status = orderStatusMap[order.status];
          return (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-border p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary text-sm">{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')} · {order.paymentMethod}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      id={`status-select-${order.id}`}
                      className="pl-3 pr-8 py-2 text-xs border border-border rounded-lg bg-white focus:outline-none focus:border-primary appearance-none cursor-pointer font-medium"
                    >
                      {statusOptions.filter(s => s !== 'all').map((s) => (
                        <option key={s} value={s}>{orderStatusMap[s]?.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div className="bg-surface-secondary rounded-xl p-3 mb-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <div><p className="text-muted-foreground">Khách hàng</p><p className="font-medium text-foreground">{order.customer.name}</p></div>
                  <div><p className="text-muted-foreground">Số điện thoại</p><p className="font-medium">{order.customer.phone}</p></div>
                  <div><p className="text-muted-foreground">Địa chỉ</p><p className="font-medium line-clamp-1">{order.address}</p></div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-8 h-9 bg-[#F5F5F5] rounded-lg" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">Size {item.size} · {item.color} · ×{item.qty}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-primary">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                <p className="text-xs text-muted">{order.items.reduce((s, i) => s + i.qty, 0)} sản phẩm</p>
                <p className="font-black text-sm text-primary">{formatPrice(order.total)}</p>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted text-sm">Không tìm thấy đơn hàng nào.</div>
        )}
      </div>
    </div>
  );
}
