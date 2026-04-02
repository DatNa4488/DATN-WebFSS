import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  LogOut, ChevronRight, Bell
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Sản phẩm', path: '/admin/products' },
  { icon: ShoppingCart, label: 'Đơn hàng', path: '/admin/orders' },
  { icon: Users, label: 'Tài khoản', path: '/admin/accounts' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col fixed top-0 left-0 h-full z-40">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
              <img src="/logo.png" alt="FSS" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <p className="text-[10px] text-white/60 uppercase tracking-widest">Admin Panel</p>
              <p className="font-bold text-sm">FSS</p>
            </div>
          </Link>
        </div>

        {/* Admin info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full object-cover border-2 border-white/30" />
            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-white/60">Quản trị viên</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {adminNavItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                id={`admin-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            onClick={handleLogout}
            id="admin-logout-btn"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-base font-semibold font-display text-foreground">
              {adminNavItems.find((n) => location.pathname === n.path || (n.path !== '/admin' && location.pathname.startsWith(n.path)))?.label ?? 'Admin Panel'}
            </h1>
            <p className="text-xs text-muted">Fashion Shopping Sense</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-[#F5F5F5] text-muted transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link to="/" className="text-xs px-3 py-1.5 bg-accent-soft text-primary rounded-lg font-medium hover:bg-accent-soft-hover transition-colors">
              ← Về trang chủ
            </Link>
          </div>
        </header>

        {/* Page content */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
