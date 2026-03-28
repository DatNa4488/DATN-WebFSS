import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import { formatPrice } from '../../data/mockData';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty } = useCartStore();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 500000 ? 0 : 35000;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-primary" />
                <span className="font-semibold text-foreground">Giỏ hàng</span>
                {items.length > 0 && (
                  <span className="bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.qty, 0)}
                  </span>
                )}
              </div>
              <button onClick={closeCart} id="close-cart-btn" className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag size={28} className="text-primary" />
                  </div>
                  <p className="font-semibold text-foreground mb-1">Giỏ hàng trống</p>
                  <p className="text-sm text-muted mb-4">Hãy thêm sản phẩm yêu thích!</p>
                  <Link to="/products" onClick={closeCart} className="text-sm text-primary font-semibold hover:underline">
                    Khám phá sản phẩm →
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      className="flex gap-3"
                    >
                      <Link to={`/products/${item.product.id}`} onClick={closeCart}>
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-20 object-cover rounded-xl border border-border"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product.id}`} onClick={closeCart} className="text-sm font-semibold text-foreground hover:text-primary line-clamp-1">
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.size} · {item.color}</p>
                        <p className="text-sm font-bold text-primary mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button onClick={() => updateQty(item.key, item.qty - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-[#F5F5F5] transition-colors">
                              <Minus size={11} />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold">{item.qty}</span>
                            <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-[#F5F5F5] transition-colors">
                              <Plus size={11} />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.key)} className="p-1 text-[#D1D5DB] hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-5 py-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Tạm tính:</span>
                  <span className="font-bold text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Vận chuyển:</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-center">
                    Mua thêm {formatPrice(500000 - subtotal)} để miễn phí ship!
                  </p>
                )}
                <Link
                  to="/checkout"
                  id="drawer-checkout-btn"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-bold rounded-2xl hover:bg-secondary transition-colors shadow-lg"
                >
                  Thanh toán {formatPrice(subtotal + shipping)} <ArrowRight size={16} />
                </Link>
                <Link to="/cart" onClick={closeCart} className="block text-center text-sm text-muted hover:text-primary transition-colors">
                  Xem giỏ hàng chi tiết
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
