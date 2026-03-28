import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, authError, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    clearError();
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Giả lập delay API call
    await new Promise((r) => setTimeout(r, 800));
    const result = login(formData.email, formData.password);
    setLoading(false);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : '/');
    }
  };

  const fillDemo = (role) => {
    clearError();
    if (role === 'admin') {
      setFormData({ email: 'admin@fss.vn', password: 'admin123' });
    } else {
      setFormData({ email: 'dat@example.com', password: '123456' });
    }
  };

  return (
    <div className="min-h-screen flex relative bg-white">
      {/* Back to Home Button - Minimalist */}
      <Link 
        to="/" 
        className="absolute top-10 left-10 z-50 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:opacity-100 transition-all group lg:text-white"
      >
        <div className="w-8 h-8 rounded-full border border-slate-100 lg:border-white/20 flex items-center justify-center group-hover:bg-slate-50 lg:group-hover:bg-white/10 transition-colors">
           <span className="text-lg">←</span>
        </div>
        QUAY LẠI
      </Link>

      {/* Left panel — decorative (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00168D] via-[#1E3B87] to-[#475569] relative overflow-hidden flex-col items-center justify-center p-12 text-white">
        {/* Animated circles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: `${(i + 1) * 120}px`,
              height: `${(i + 1) * 120}px`,
              top: '50%',
              left: '50%',
            }}
            animate={{ x: '-50%', y: '-50%', scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          />
        ))}

        {/* Logo + Content */}
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-28 h-28 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl overflow-hidden p-4">
            <img src="/logo.png" alt="FSS" className="w-full h-full object-contain hover:scale-110 transition-transform duration-500" />
          </div>
          <h1 className="text-5xl font-bold font-display mb-4 leading-tight">Fashion<br />Shopping Sense</h1>
          <p className="text-white/70 text-lg max-w-sm mx-auto leading-relaxed">
            Nền tảng mua sắm thời trang thông minh, tích hợp AI tìm kiếm sản phẩm tương đồng.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <div className="mb-12">
             <h2 className="text-[24px] text-headline leading-tight mb-2 uppercase">ĐĂNG NHẬP</h2>
             <p className="text-[13px] text-muted-foreground font-medium">Chào mừng bạn trở lại với gia đình FSS.</p>
          </div>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-10">
            {/* Email */}
            <div className="group">
              <label 
                htmlFor="login-email" 
                className="text-label opacity-60 group-focus-within:opacity-100 transition-opacity"
              >
                EMAIL
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-100 bg-transparent pt-3 pb-4 text-[15px] font-medium focus:outline-none focus:border-primary transition-all placeholder:text-slate-200 rounded-none"
              />
            </div>

            {/* Password */}
            <div className="group">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="login-password" 
                  className="text-label opacity-60 group-focus-within:opacity-100 transition-opacity"
                >
                  MẬT KHẨU
                </label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors mb-3">QUÊN MẬT KHẨU?</Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-b-2 border-slate-100 bg-transparent pt-3 pb-4 text-[15px] font-medium focus:outline-none focus:border-primary transition-all placeholder:text-slate-200 rounded-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-[11px] font-bold text-rose-500 bg-rose-50 p-3 rounded-sm border-l-2 border-rose-500">{authError}</p>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-sm hover:bg-secondary transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> ĐANG XỬ LÝ...</>
              ) : 'ĐĂNG NHẬP'}
            </motion.button>
          </form>

          {/* Demo Section - Clean & Minimalist */}
          <div className="mt-12 pt-8 border-t border-slate-50">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center mb-6">TRUY CẬP NHANH</p>
            <div className="flex gap-4">
               <button onClick={() => fillDemo('customer')} className="flex-1 py-3 text-[11px] font-bold text-primary border border-slate-100 rounded-sm hover:bg-slate-50 transition-all ">KHÁCH HÀNG</button>
               <button onClick={() => fillDemo('admin')} className="flex-1 py-3 text-[11px] font-bold text-white bg-slate-900 rounded-sm hover:bg-black transition-all">QUẢN TRỊ VIÊN</button>
            </div>
          </div>

          <p className="mt-12 text-center text-[12px] font-medium text-muted-foreground tracking-tight">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary font-black hover:underline underline-offset-4 decoration-1">Đăng ký ngay</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
