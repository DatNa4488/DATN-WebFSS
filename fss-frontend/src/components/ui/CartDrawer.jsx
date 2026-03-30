import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import { formatPrice } from '../../data/mockData';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty } = useCartStore();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 500000 ? 0 : 35000;
  const total = subtotal + shipping;

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
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[70] flex flex-col shadow-elevation"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-border bg-surface-secondary">
              <div className="flex items-center gap-3">
                <div>
                  <span className="font-bold text-foreground block text-sm">Giỏ hàng</span>
                  {items.length > 0 && (
                    <span className="text-xs text-muted-foreground">{items.reduce((s, i) => s + i.qty, 0)} sản phẩm</span>
                  )}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeCart}
                id="close-cart-btn"
                className="p-2 rounded-none hover:bg-white text-muted-foreground transition-colors"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col space-y-3">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
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
                          className="w-16 h-20 object-cover rounded-none border border-border"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product.id}`} onClick={closeCart} className="text-sm font-semibold text-foreground hover:text-primary line-clamp-1">
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.size} · {item.color}</p>
                        <p className="text-sm font-bold text-primary mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border rounded-none overflow-hidden">
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
              <div className="border-t border-border px-5 py-5 space-y-4 bg-surface-secondary/50">
                <div className="space-y-2.5 pb-3 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Tạm tính:</span>
                    <span className="font-bold text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Vận chuyển:</span>
                    <span className={`font-bold ${shipping === 0 ? 'text-success' : 'text-foreground'}`}>
                      {shipping === 0 ? '✓ Miễn phí' : formatPrice(shipping)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white rounded-none p-3 border border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Tổng cộng:</span>
                    <span className="text-xl font-black text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-none text-center font-medium border border-amber-200">
                    Mua thêm {formatPrice(500000 - subtotal)} để miễn phí ship!
                  </p>
                )}
                
                <Link
                  to="/checkout"
                  id="drawer-checkout-btn"
                  onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white font-bold rounded-none hover:bg-primary-700 transition-all shadow-soft hover:shadow-lg active:scale-95"
                >
                  Thanh toán ngay <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
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
