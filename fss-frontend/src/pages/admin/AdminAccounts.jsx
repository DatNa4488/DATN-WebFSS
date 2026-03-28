import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserCog, Trash2, Shield, User, X, Check } from 'lucide-react';
import { users as initialUsers } from '../../data/mockData';

export default function AdminAccounts() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const toggleRole = (id) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: u.role === 'admin' ? 'customer' : 'admin' } : u));
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteConfirm(null);
  };

  const toggleStatus = (id) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u));
  };

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">Quản lý tài khoản</h1>
        <p className="text-sm text-muted">{filtered.length} tài khoản</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>
        {['all', 'customer', 'admin'].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRole(r)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterRole === r ? 'bg-primary text-white' : 'bg-white border border-border hover:border-primary text-[#374151]'
            }`}
          >
            {r === 'all' ? 'Tất cả' : r === 'admin' ? '⚡ Admin' : '👤 Khách hàng'}
          </button>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-secondary border-b border-border">
            <tr>
              {['Tài khoản', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Thao tác'].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-muted px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => (
              <motion.tr key={u.id} layout className="hover:bg-surface-secondary transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border-2 border-border" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {u.role === 'admin' ? <Shield size={11} /> : <User size={11} />}
                    {u.role === 'admin' ? 'Admin' : 'Khách hàng'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {u.status === 'active' ? '● Hoạt động' : '● Bị khóa'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleRole(u.id)}
                      title="Đổi vai trò"
                      className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500 transition-colors"
                    >
                      <UserCog size={15} />
                    </button>
                    <button
                      onClick={() => toggleStatus(u.id)}
                      title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        u.status === 'active' ? 'hover:bg-orange-50 text-orange-500' : 'hover:bg-green-50 text-green-500'
                      }`}
                    >
                      {u.status === 'active' ? '🔒' : '🔓'}
                    </button>
                    {deleteConfirm === u.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg bg-red-500 text-white"><Check size={13} /></button>
                        <button onClick={() => setDeleteConfirm(null)} className="p-1.5 rounded-lg bg-[#F5F5F5]"><X size={13} /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(u.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-sm text-muted">Không tìm thấy tài khoản nào.</div>
        )}
      </div>
    </div>
  );
}
