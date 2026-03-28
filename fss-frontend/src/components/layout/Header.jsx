import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Search, User, Menu, X, Camera, ChevronDown,
  LogOut, Settings, Package
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

const navLinks = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Sản phẩm', path: '/products' },
  { label: 'Tìm kiếm ảnh', path: '/visual-search' },
  { label: 'Blog', path: '/blog' },
  { label: 'Liên hệ', path: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items, openCart } = useCartStore();

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-slate-100/90 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-slate-900/[0.06]' : 'bg-white'}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >

        <div className={`layout-page flex items-center justify-between gap-4 min-h-[72px] lg:min-h-[80px] ${scrolled ? 'py-3' : 'py-5'}`}>
            {/* Logo only — lớn, sát thanh trên */}
            <Link
              to="/"
              className="flex items-center shrink-0 group"
              id="header-logo"
              title="FSS — Trang chủ"
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center bg-white overflow-hidden transition-colors">
                <img
                  src="/logo.png"
                  alt="FSS"
                  className="w-[60px] h-[60px] lg:w-[76px] lg:h-[76px] object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden lg:flex items-center gap-10" id="main-nav">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative py-2 text-[13px] font-semibold tracking-[0.15em] uppercase transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                      }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Desktop Search Pill */}
              <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-[#F1F5F9] rounded-xl px-4 py-3.5 w-80 hover:bg-[#E2E8F0] transition-colors focus-within:ring-2 ring-primary/10">
                <button type="submit" className="text-muted-foreground hover:text-primary mr-3">
                  <Search size={16} />
                </button>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] w-full text-foreground placeholder:text-muted-foreground font-medium pl-1"
                />
                <div className="w-px h-4 bg-[#E2E8F0] mx-3"></div>
                <Link to="/visual-search" className="text-muted-foreground hover:text-primary shrink-0" title="Tìm kiếm bằng hình ảnh">
                  <Camera size={16} />
                </Link>
              </form>

              <div className="flex items-center gap-2">
                {/* Cart */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={openCart}
                  className="relative p-2 rounded-xl text-tertiary hover:text-primary hover:bg-[#F1F5F9] transition-colors"
                  title="Giỏ hàng"
                >
                  <ShoppingBag size={22} strokeWidth={1.5} />
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0 -right-1 bg-primary text-white text-[11px] font-bold min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1 shadow-sm border-2 border-white"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </motion.button>

                {/* User */}
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 rounded-full text-[#374151] hover:text-primary hover:bg-slate-100 transition-colors"
                  >
                    <User size={22} strokeWidth={1.5} />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-black/5 border border-border py-1.5 z-50 overflow-hidden"
                      >
                        {isAuthenticated ? (
                          <>
                            <div className="px-4 py-3 border-b border-border bg-surface-secondary">
                              <p className="font-semibold text-sm text-foreground">{user.name}</p>
                              <p className="text-xs text-muted">{user.email}</p>
                            </div>
                            {user.role === 'admin' ? (
                              <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-accent-soft hover:text-primary transition-colors">
                                <Settings size={16} /> Quản trị viên
                              </Link>
                            ) : (
                              <>
                                <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-accent-soft hover:text-primary transition-colors">
                                  <User size={16} /> Hồ sơ cá nhân
                                </Link>
                                <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-accent-soft hover:text-primary transition-colors">
                                  <Package size={16} /> Đơn hàng của tôi
                                </Link>
                              </>
                            )}
                            <div className="border-t border-border mt-1 pt-1">
                              <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                                <LogOut size={16} /> Đăng xuất
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="p-2 space-y-1">
                            <Link to="/login" className="block text-center w-full py-2.5 text-sm font-semibold text-primary bg-accent-soft rounded-xl hover:bg-accent-soft-hover transition-colors">
                              Đăng nhập
                            </Link>
                            <Link to="/register" className="block text-center w-full py-2.5 text-sm font-semibold text-[#374151] border border-border rounded-xl hover:border-primary hover:text-primary transition-colors">
                              Đăng ký
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile menu toggle */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden p-2 rounded-full text-[#374151] hover:bg-slate-100 transition-colors"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </motion.button>
              </div>
            </div>
        </div>

        {/* Mobile menu drop-down */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-border bg-white overflow-hidden shadow-xl"
            >
              <nav className="layout-page py-4 flex flex-col gap-2">
                <form onSubmit={handleSearch} className="flex items-center bg-slate-100 rounded-xl px-4 py-2 mb-2">
                  <Search size={16} className="text-muted-foreground mr-2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full text-foreground"
                  />
                </form>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-4 py-3 text-sm font-bold tracking-wide uppercase text-[#374151] hover:text-primary hover:bg-surface-secondary rounded-xl transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer: thanh 3px + logo + padding */}
      <div className="h-[104px] lg:h-[132px]" />
    </>
  );
}
