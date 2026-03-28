import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, CreditCard, Banknote, Smartphone, MapPin, User, Phone, Mail, ChevronRight } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import { formatPrice } from '../../data/mockData';

const steps = ['Địa chỉ', 'Thanh toán', 'Xác nhận'];

const paymentMethods = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: Banknote },
  { id: 'banking', label: 'Chuyển khoản ngân hàng', icon: CreditCard },
  { id: 'momo', label: 'Ví MoMo', icon: Smartphone },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: 'TP.HCM', district: '', note: '' });
  const [payMethod, setPayMethod] = useState('cod');
  const [placed, setPlaced] = useState(false);
  const [orderId] = useState(`FSS-${Date.now()}`);

  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 500000 ? 0 : 35000;
  const total = subtotal + shipping;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handlePlaceOrder = () => {
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center page-enter">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 text-center max-w-md mx-4 border border-border shadow-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 size={40} className="text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Đặt hàng thành công! 🎉</h2>
          <p className="text-muted mb-1 text-sm">Mã đơn hàng của bạn:</p>
          <p className="font-mono font-bold text-primary text-lg mb-4">{orderId}</p>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            Cảm ơn bạn đã mua sắm tại FSS! Đơn hàng sẽ được xử lý và giao trong 2-3 ngày làm việc.
          </p>
          <div className="flex flex-col gap-2.5">
            <button onClick={() => navigate('/orders')} className="py-3 bg-primary text-white font-semibold rounded-2xl hover:bg-secondary transition-colors">
              Xem đơn hàng của tôi
            </button>
            <button onClick={() => navigate('/')} className="py-3 border border-border text-[#374151] font-medium rounded-2xl hover:border-primary transition-colors">
              Về trang chủ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary page-enter">
      <div className="layout-page py-10">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-6">Thanh toán</h1>

        {/* Progress steps */}
        <div className="flex items-center mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary text-white' : 'bg-[#E5E7EB] text-muted-foreground'
                }`}>
                  {i < step ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className={`text-sm font-medium ${i === step ? 'text-primary' : 'text-muted-foreground'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-px mx-3 ${i < step ? 'bg-green-500' : 'bg-[#E5E7EB]'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Step 0 — Address */}
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-2xl border border-border p-6 space-y-4">
                  <h2 className="font-semibold text-foreground flex items-center gap-2"><MapPin size={16} className="text-primary" /> Địa chỉ giao hàng</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Họ và tên', name: 'name', col: 2, icon: User, placeholder: 'Nguyễn Văn A' },
                      { label: 'Email', name: 'email', icon: Mail, placeholder: 'example@email.com' },
                      { label: 'Số điện thoại', name: 'phone', icon: Phone, placeholder: '0901 234 567' },
                    ].map(({ label, name, col, icon: Icon, placeholder }) => (
                      <div key={name} className={col === 2 ? 'col-span-2' : ''}>
                        <label className="block text-xs font-semibold text-[#374151] mb-3 uppercase tracking-wider">{label}</label>
                        <div className="relative">
                          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            name={name}
                            value={form[name]}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className="w-full pl-10 pr-4 py-3.5 border border-border rounded-xl text-[15px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-secondary transition-all"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-[#374151] mb-3 uppercase tracking-wider">Địa chỉ chi tiết</label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Số nhà, tên đường, phường/xã..."
                        className="w-full px-4 py-3.5 border border-border rounded-xl text-[15px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-secondary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-3 uppercase tracking-wider">Quận/Huyện</label>
                      <input
                        type="text"
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        placeholder="Quận 1"
                        className="w-full px-4 py-3.5 border border-border rounded-xl text-[15px] focus:outline-none focus:border-primary bg-surface-secondary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-3 uppercase tracking-wider">Thành phố</label>
                      <select
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 border border-border rounded-xl text-[15px] bg-surface-secondary focus:outline-none focus:border-primary transition-all"
                      >
                        {['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-[#374151] mb-3 uppercase tracking-wider">Ghi chú đơn hàng (tùy chọn)</label>
                      <textarea
                        name="note"
                        value={form.note}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Ghi chú cho người giao hàng..."
                        className="w-full px-4 py-3.5 border border-border rounded-xl text-[15px] focus:outline-none focus:border-primary bg-surface-secondary resize-none transition-all"
                      />
                    </div>
                  </div>
                  <button
                    id="next-to-payment-btn"
                    onClick={() => setStep(1)}
                    disabled={!form.name || !form.phone || !form.address}
                    className="w-full py-3 bg-primary text-white font-semibold rounded-2xl hover:bg-secondary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    Tiếp theo <ChevronRight size={16} />
                  </button>
                </motion.div>
              )}

              {/* Step 1 — Payment */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-2xl border border-border p-6 space-y-5">
                  <h2 className="font-semibold text-foreground flex items-center gap-2"><CreditCard size={16} className="text-primary" /> Phương thức thanh toán</h2>
                  <div className="space-y-3">
                    {paymentMethods.map(({ id, label, icon: Icon }) => (
                      <label key={id} className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all ${payMethod === id ? 'border-primary bg-accent-soft' : 'border-border hover:border-primary/40'}`}>
                        <input type="radio" name="payment" value={id} checked={payMethod === id} onChange={() => setPayMethod(id)} className="accent-primary" />
                        <Icon size={18} className={payMethod === id ? 'text-primary' : 'text-muted'} />
                        <span className="text-sm font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="flex-1 py-3 border border-border text-[#374151] font-medium rounded-2xl hover:border-primary transition-colors">← Quay lại</button>
                    <button id="next-to-confirm-btn" onClick={() => setStep(2)} className="flex-1 py-3 bg-primary text-white font-semibold rounded-2xl hover:bg-secondary transition-colors">Tiếp theo →</button>
                  </div>
                </motion.div>
              )}

              {/* Step 2 — Confirm */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-2xl border border-border p-6 space-y-5">
                  <h2 className="font-semibold text-foreground">Xác nhận đơn hàng</h2>
                  {/* Address summary */}
                  <div className="bg-surface-secondary rounded-xl p-4 text-sm space-y-1">
                    <p className="font-medium text-foreground">{form.name} · {form.phone}</p>
                    <p className="text-muted">{form.address}, {form.district}, {form.city}</p>
                    <p className="text-muted">Thanh toán: <span className="font-medium text-[#374151]">{paymentMethods.find(p => p.id === payMethod)?.label}</span></p>
                  </div>
                  {/* Items */}
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <img src={item.product.images[0]} className="w-12 h-14 object-cover rounded-lg" />
                        <div className="flex-1 text-sm">
                          <p className="font-medium line-clamp-1">{item.product.name}</p>
                          <p className="text-muted text-xs">{item.size} · {item.color} · ×{item.qty}</p>
                        </div>
                        <span className="font-semibold text-sm text-primary">{formatPrice(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 py-3 border border-border text-[#374151] font-medium rounded-2xl hover:border-primary transition-colors">← Quay lại</button>
                    <button id="place-order-btn" onClick={handlePlaceOrder} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-secondary transition-colors shadow-lg">
                      Đặt hàng ({formatPrice(total)})
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
              <h3 className="font-semibold text-sm text-foreground mb-3">Đơn hàng ({items.reduce((s, i) => s + i.qty, 0)} sản phẩm)</h3>
              <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.key} className="flex items-center gap-2 text-xs">
                    <img src={item.product.images[0]} className="w-9 h-10 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-muted-foreground">{item.size} ×{item.qty}</p>
                    </div>
                    <span className="font-semibold text-primary shrink-0">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Vận chuyển</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
