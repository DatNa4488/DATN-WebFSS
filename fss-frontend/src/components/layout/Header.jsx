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
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-soft border-border'
          : 'bg-white border-border'
          }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >

        <div className={`layout-page flex items-center justify-between gap-8 min-h-[72px] lg:min-h-[80px] ${scrolled ? 'py-2' : 'py-4'}`}>
          {/* Logo only — lớn, sát thanh trên */}
          <Link
            to="/"
            className="flex items-center shrink-0 group"
            id="header-logo"
            title="FSS — Trang chủ"
          >
            <div className="w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <img
                src="/logo.png"
                alt="FSS"
                className="w-full h-full object-contain"
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
                className="bg-transparent border-none outline-none text-[13px] w-full text-foreground placeholder:text-muted-foreground font-medium pl-2"
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
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className="absolute right-0 top-full mt-3 w-80 bg-white rounded-3xl shadow-2xl shadow-primary/10 border border-primary/5 py-2 z-50 overflow-hidden"
                    >
                      {isAuthenticated ? (
                        <>
                          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
                            <p className="font-bold text-sm text-foreground">{user.name}</p>
                            <p className="text-[11px] text-muted-foreground font-medium">{user.email}</p>
                          </div>
                          <div className="p-1.5">
                            {user.role === 'admin' ? (
                              <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                                <Settings size={17} /> Quản trị viên
                              </Link>
                            ) : (
                              <>
                                <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                                  <User size={17} /> Hồ sơ cá nhân
                                </Link>
                                <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                                  <Package size={17} /> Đơn hàng của tôi
                                </Link>
                              </>
                            )}
                            <div className="mt-1 pt-1 border-t border-slate-50">
                              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-[13px] font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                <LogOut size={17} /> Đăng xuất
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-6 flex flex-col items-center">
                          <p className="text-[13px] text-muted-foreground font-medium mb-6">Chào mừng đến với FSS!</p>
                          <div className="flex items-center gap-4 w-full">
                            <Link
                              to="/login"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex-[1.2] text-center py-5 text-[14px] font-black tracking-widest uppercase text-white bg-primary rounded-full hover:bg-secondary transition-all shadow-2xl shadow-primary/30"
                            >
                              Đăng nhập
                            </Link>
                            <Link
                              to="/register"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex-1 text-center py-5 text-[14px] font-black tracking-widest uppercase text-primary hover:text-secondary hover:bg-primary/5 rounded-full transition-all whitespace-nowrap"
                            >
                              Đăng ký
                            </Link>
                          </div>
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
