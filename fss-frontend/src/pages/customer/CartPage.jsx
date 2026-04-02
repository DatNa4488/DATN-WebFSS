import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { formatPrice } from '../../data/mockData';
import useAuthStore from '../../store/authStore';

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= 500000 ? 0 : 35000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-surface-secondary flex items-center justify-center page-enter pb-20 pt-24">
        <div className="text-center max-w-md px-6 py-12 bg-white border border-border rounded-sm shadow-soft">
 
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-black text-foreground font-display mb-3 tracking-tight">Giỏ hàng trống</h2>
            <p className="text-base text-muted-foreground mb-10 leading-relaxed font-medium">
              Hãy khám phá những bộ sưu tập thời trang mới nhất và thêm sản phẩm yêu thích vào giỏ hàng của bạn.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-primary to-primary-700 text-white font-bold text-sm uppercase tracking-wider rounded-sm hover:shadow-elevation transition-all shadow-soft group"
            >
              Khám phá sản phẩm
              <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary pb-40 page-enter">
      <div className="bg-gradient-to-b from-primary-50 to-white border-b border-border mb-12">
        <div className="layout-page py-20 lg:py-28">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">🛍️ Giỏ hàng của bạn</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground font-display mb-2 tracking-tight">
                {items.length} {items.length === 1 ? 'sản phẩm' : 'sản phẩm'}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-medium">Kiểm tra lại các sản phẩm trước khi thanh toán</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCart}
              className="w-fit px-6 py-3 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 uppercase tracking-wider rounded-sm transition-all border border-red-200 flex items-center gap-2 justify-center lg:justify-start"
            >
              <Trash2 size={16} /> Xóa tất cả
            </motion.button>
          </div>
        </div>
      </div>

      <div className="layout-page pb-12 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ITEMS LIST - 8 cols */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-slate-200 rounded-sm shadow-none overflow-hidden">
               <div className="grid grid-cols-12 px-8 py-4 border-b border-[#F1F5F9] text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  <div className="col-span-6">Sản phẩm</div>
                  <div className="col-span-2 text-center">Số lượng</div>
                  <div className="col-span-3 text-right">Tổng cộng</div>
                  <div className="col-span-1"></div>
               </div>
               <AnimatePresence>
                 {items.map((item) => (
                   <motion.div
                     key={item.key}
                     layout
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="grid grid-cols-12 items-center px-8 py-8 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]/50 transition-colors"
                   >
                     {/* Product Details */}
                     <div className="col-span-6 flex gap-6">
                      <Link to={`/products/${item.product.id}`} className="shrink-0 w-20 h-28 bg-[#F8FAFC] border border-slate-200 rounded-sm overflow-hidden">
                         <img
                           src={item.product.images[0]}
                           alt={item.product.name}
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                         />
                       </Link>
                       <div className="flex flex-col justify-center gap-1">
                         <Link to={`/products/${item.product.id}`} className="text-sm font-bold text-primary hover:underline decoration-1 underline-offset-4">
                           {item.product.name}
                         </Link>
                         <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                           <span>Size: {item.size}</span>
                           <span className="w-1 h-1 bg-[#E2E8F0] rounded-full"></span>
                           <span>Màu: {item.color}</span>
                         </div>
                         <p className="text-xs font-bold text-primary mt-1">{formatPrice(item.price)}</p>
                       </div>
                     </div>

                     {/* Qty Controls */}
                     <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border border-slate-200 bg-white rounded-sm overflow-hidden">
                           <button 
                             onClick={() => updateQty(item.key, item.qty - 1)}
                             className="w-10 h-10 flex items-center justify-center text-primary hover:bg-[#F1F5F9] transition-colors"
                           >
                             <Minus size={12} />
                           </button>
                           <span className="w-8 text-center text-xs font-bold text-primary">{item.qty}</span>
                           <button 
                             onClick={() => updateQty(item.key, item.qty + 1)}
                             className="w-10 h-10 flex items-center justify-center text-primary hover:bg-[#F1F5F9] transition-colors"
                           >
                             <Plus size={12} />
                           </button>
                        </div>
                     </div>

                     {/* Subtotal Item */}
                     <div className="col-span-3 text-right">
                        <span className="text-sm font-black text-primary tracking-tight">{formatPrice(item.price * item.qty)}</span>
                     </div>

                     {/* Remove Action */}
                     <div className="col-span-1 text-right">
                        <button 
                          onClick={() => removeItem(item.key)}
                          className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-sm transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-sm p-6 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-tertiary">
                     <ShieldCheck size={18} />
                     <span className="text-[11px] font-bold uppercase tracking-widest transition-all">An tâm mua sắm</span>
                  </div>
                  <div className="flex items-center gap-2 text-tertiary">
                     <Truck size={18} />
                     <span className="text-[11px] font-bold uppercase tracking-widest transition-all">Giao hàng tận nơi</span>
                  </div>
               </div>
               <Link to="/products" className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] border-b-2 border-primary pb-1 hover:opacity-70 transition-all">
                 Tiếp tục chọn lựa →
               </Link>
            </div>
          </div>

          {/* SUMMARY - 4 cols */}
          <div className="lg:col-span-4">
            <div className="bg-primary text-white rounded-sm p-10 sticky top-32 shadow-2xl shadow-primary/20">
               <h2 className="text-xl font-bold font-display uppercase tracking-widest mb-10 border-b border-white/20 pb-6">Đơn hàng</h2>

               <div className="space-y-8">
                  {/* Summary Box */}
                  <div className="bg-white border border-border rounded-sm overflow-hidden shadow-none">
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 p-6 border-b border-border">
                      <h3 className="text-lg font-bold text-foreground">Chi tiết đơn hàng</h3>
                    </div>
                    
                    <div className="p-6 space-y-5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-muted-foreground">Tạm tính</span>
                        <span className="font-bold text-lg text-foreground">{formatPrice(subtotal)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-5 border-b border-border">
                        <span className="text-sm font-semibold text-muted-foreground">Vận chuyển</span>
                        <span className={`text-sm font-bold ${shipping === 0 ? 'text-green-500' : 'text-foreground'}`}>
                          {shipping === 0 ? '🎉 Miễn phí' : formatPrice(shipping)}
                        </span>
                      </div>
                      
                      {shipping > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-warning-light border border-warning-light rounded-sm text-center"
                        >
                          <p className="text-xs font-semibold text-warning leading-relaxed">
                            ⚡ Mua thêm {formatPrice(500000 - subtotal)} → Miễn phí vận chuyển
                          </p>
                        </motion.div>
                      )}

                      <div className="flex justify-between items-center py-5 border-t-2 border-primary/20">
                        <span className="text-base font-black text-foreground uppercase tracking-tight">Tổng cộng</span>
                        <span className="text-3xl font-black bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-transparent">{formatPrice(total)}</span>
                      </div>

                      {/* Nút Thanh toán - Ẩn với admin */}
                      {!isAdmin && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/checkout')}
                        className="w-full py-6 bg-gradient-to-r from-primary to-primary-700 text-white font-bold text-sm uppercase tracking-wider rounded-sm hover:shadow-elevation transition-all shadow-soft flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={18} />
                        Tiến hành thanh toán
                      </motion.button>
                      )}

                      <Link
                        to="/products"
                        className="block w-full py-4 border-2 border-border text-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-surface-secondary transition-all text-center"
                      >
                        Tiếp tục mua sắm
                      </Link>
                    </div>
                  </div>
                  
                  {/* Promotion Input */}
                  <div className="bg-white border border-border rounded-sm p-6 shadow-none">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4 text-center">🎟️ Có mã ưu đãi?</p>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="Nhập mã ưu đãi của bạn..."
                        className="flex-1 bg-surface-secondary border border-border rounded-sm px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                      />
                      <button className="px-6 py-3 bg-primary text-white text-sm font-bold uppercase rounded-sm hover:bg-primary-700 transition-all shadow-soft whitespace-nowrap">Áp dụng</button>
                    </div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
