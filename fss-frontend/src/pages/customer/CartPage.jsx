import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { formatPrice } from '../../data/mockData';

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= 500000 ? 0 : 35000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center page-enter pb-20">
        <div className="text-center max-w-md px-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-white border border-slate-200 shadow-sm rounded-md flex items-center justify-center mx-auto mb-8"
          >
            <ShoppingCart size={40} className="text-primary opacity-20" />
          </motion.div>
          <h2 className="text-2xl font-black text-primary font-display uppercase tracking-wider mb-4">Túi hàng trống</h2>
          <p className="text-tertiary text-sm mb-10 font-medium">Hãy dành chút thời gian để khám phá những thiết kế mới nhất và thêm sản phẩm yêu thích vào giỏ hàng của bạn.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white font-bold text-[13px] uppercase tracking-widest rounded-md hover:bg-secondary transition-all"
          >
             Mua sắm ngay <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary pb-40 page-enter">
      <div className="layout-page py-20 lg:py-32">
        
        <div className="flex flex-col lg:flex-row items-end justify-between gap-6 mb-12">
           <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-2">Shopping Experience</p>
              <h1 className="text-4xl font-extrabold text-primary font-display uppercase tracking-wider">Giỏ hàng của bạn</h1>
           </div>
           <button onClick={clearCart} className="text-[11px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-md transition-all">
             <Trash2 size={14} /> Xóa tất cả sản phẩm
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ITEMS LIST - 8 cols */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
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
                        <div className="flex items-center border border-slate-200 bg-white rounded-md overflow-hidden">
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
                          className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-md p-6 flex items-center justify-between">
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
            <div className="bg-primary text-white rounded-md p-10 sticky top-32 shadow-2xl shadow-primary/20">
               <h2 className="text-xl font-bold font-display uppercase tracking-widest mb-10 border-b border-white/20 pb-6">Đơn hàng</h2>

               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <span className="text-[12px] font-bold uppercase tracking-widest opacity-60">Tạm tính</span>
                     <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-6 border-b border-white/10">
                     <span className="text-[12px] font-bold uppercase tracking-widest opacity-60">Vận chuyển</span>
                     <span className={`text-[12px] font-bold uppercase tracking-widest ${shipping === 0 ? 'text-green-400' : ''}`}>
                       {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                     </span>
                  </div>
                  
                  {shipping > 0 && (
                    <div className="p-4 bg-white/10 border border-white/10 rounded-md">
                       <p className="text-[11px] font-bold leading-relaxed">
                         Mua thêm {formatPrice(500000 - subtotal)} để nhận ưu đãi MIỄN PHÍ VẬN CHUYỂN
                       </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-4">
                     <span className="text-[13px] font-black uppercase tracking-[0.2em]">Tổng tiền</span>
                     <span className="text-2xl font-black">{formatPrice(total)}</span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/checkout')}
                    className="w-full py-5 bg-white text-primary font-black text-[14px] uppercase tracking-widest rounded-md hover:bg-gray-100 transition-all shadow-xl shadow-black/20"
                  >
                    Thanh toán đơn hàng
                  </motion.button>
               </div>
               
               {/* Promotion Input */}
               <div className="mt-10 pt-10 border-t border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-4 text-center">Bạn có mã ưu đãi?</p>
                  <div className="flex gap-2">
                     <input 
                       type="text" 
                       placeholder="CODE..."
                       className="flex-1 bg-white/10 border border-white/20 rounded-md px-4 py-2 text-xs font-bold focus:outline-none focus:border-white transition-all"
                     />
                     <button className="px-6 py-2 bg-white/20 text-white text-[11px] font-bold uppercase rounded-md hover:bg-white/30">Áp dụng</button>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
