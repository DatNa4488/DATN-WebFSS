import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, Heart, Shield, Truck, RefreshCw, Sparkles, Check, ArrowRight } from 'lucide-react';
import { products, reviews as mockReviews, formatPrice } from '../../data/mockData';
import ProductCard from '../../components/ui/ProductCard';
import useCartStore from '../../store/cartStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id)) || products[0];
  const similar = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const productReviews = mockReviews.filter((r) => r.productId === product.id);

  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn size!');
      return;
    }
    addItem(product, selectedSize, product.colorNames[selectedColor], qty);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
    openCart();
  };

  const handleBuyNow = () => {
    if (!selectedSize) { alert('Vui lòng chọn size!'); return; }
    addItem(product, selectedSize, product.colorNames[selectedColor], qty);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-white pb-40 page-enter">
      <div className="layout-page py-16 lg:py-24">
        
        {/* Breadcrumb - Minimalist */}
        <nav className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-16 lg:mb-20">
          <Link to="/" className="hover:text-primary transition-colors">TRANG CHỦ</Link>
          <span className="opacity-40">/</span>
          <Link to="/products" className="hover:text-primary transition-colors">THỜI TRANG</Link>
          <span className="opacity-40">/</span>
          <span className="text-primary">{product.category.toUpperCase()}</span>
        </nav>

        {/* Main Product Section - No more frames */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
          
          {/* Left Side: Images */}
          <div className="lg:col-span-7">
            <div className="flex flex-col-reverse lg:flex-row gap-8">
              {/* Thumbnails Sidebar */}
              <div className="flex lg:flex-col gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`relative w-20 aspect-[3/4] rounded-sm overflow-hidden transition-all ${i === imgIdx ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              
              {/* Main large image */}
              <div className="flex-1 bg-slate-50 relative overflow-hidden group rounded-sm shadow-sm ring-1 ring-slate-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imgIdx}
                    src={product.images[imgIdx]}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-auto aspect-[4/5] lg:h-[750px] object-cover"
                  />
                </AnimatePresence>
                
                {product.isBestSeller && (
                   <div className="absolute top-6 left-6 z-10 py-1.5 px-4 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/5">
                      Signature Series
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Information */}
          <div className="lg:col-span-5 pt-4">
            <div className="space-y-12">
              
              {/* Header Info */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-2">BỘ SƯU TẬP 2026</p>
                <h1 className="text-4xl lg:text-[2.8rem] font-bold text-primary font-display leading-[1.1] tracking-tight">{product.name}</h1>
                <div className="flex items-center gap-4 pt-6">
                  <span className="text-2xl font-black text-primary tracking-tight">{formatPrice(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-[15px] font-bold text-muted-foreground line-through decoration-muted-foreground/40">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <div className="pt-2 text-[12px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-3">
                  <div className="flex text-amber-400">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={12} className={s <= Math.round(product.rating) ? 'fill-current' : 'text-slate-200'} />
                    ))}
                  </div>
                  <span>{product.rating} / 5</span>
                  <span className="h-3 w-px bg-slate-200"></span>
                  <span>{product.sold.toLocaleString()} lượt mua</span>
                </div>
              </div>

              {/* Selections */}
              <div className="space-y-10">
                {/* Size Selection - Clean horizontal underline/outline */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">CHỌN KÍCH CỠ</label>
                    <button className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-px">Hướng dẫn chọn size</button>
                  </div>
                  <div className="flex flex-wrap gap-5">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[56px] py-2 text-sm font-bold transition-all relative group ${
                          selectedSize === s
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-primary'
                        }`}
                      >
                        {s}
                        <div className={`absolute bottom-0 left-0 right-0 h-px bg-primary transition-transform duration-300 ${selectedSize === s ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className={`w-full py-5 rounded-md flex items-center justify-center gap-3 text-[13px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/10 ${
                      addedFeedback 
                        ? 'bg-green-600 text-white' 
                        : 'bg-primary text-white hover:bg-secondary'
                    }`}
                  >
                    {addedFeedback ? <><Check size={18} /> ĐÃ THÊM VÀO TÚI</> : <><ShoppingBag size={18} /> THÊM VÀO TÚI HÀNG</>}
                  </motion.button>
                  
                  <button 
                    onClick={handleBuyNow}
                    className="w-full py-5 bg-[#F1F5F9] text-tertiary font-black rounded-md text-[12px] uppercase tracking-[0.21em] hover:bg-[#E2E8F0] transition-all shadow-sm"
                  >
                    GIỮ HÀNG TẠI CỬA HÀNG
                  </button>
                </div>

                {/* Attributes Grid - CLEAN VERSION AS IN IMAGE 3 */}
                <div className="pt-6 grid grid-cols-2 gap-x-10 gap-y-8 border-t border-slate-100">
                    <div className="space-y-3">
                       <div className="flex items-center gap-3 text-primary">
                          <Check size={18} className="opacity-50" />
                          <span className="text-[11px] font-black uppercase tracking-widest">CHẤT LIỆU</span>
                       </div>
                       <p className="text-[12px] text-muted font-bold leading-relaxed">
                         100% Sợi Chiffon tự nhiên nguồn gốc thượng hạng.
                       </p>
                    </div>
                    <div className="space-y-3">
                       <div className="flex items-center gap-3 text-primary">
                          <Truck size={18} className="opacity-50" />
                          <span className="text-[11px] font-black uppercase tracking-widest">GIAO HÀNG</span>
                       </div>
                       <p className="text-[12px] text-muted font-bold leading-relaxed">
                         Miễn phí vận chuyển hỏa tốc toàn quốc.
                       </p>
                    </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <section className="mt-52 lg:mt-64">
           <div className="flex items-center justify-between mb-16 px-4 lg:px-0">
              <div className="space-y-2">
                 <h2 className="text-[32px] font-bold text-primary font-display tracking-tight">Gợi Ý Từ AI</h2>
                 <p className="text-[13px] text-muted-foreground font-medium">Sản phẩm được lựa chọn dựa trên phong cách riêng của bạn.</p>
              </div>
              <div className="flex items-center gap-4">
                 <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-primary hover:bg-slate-50 transition-all opacity-40">
                   <ArrowRight size={18} className="rotate-180" />
                 </button>
                 <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-primary hover:bg-slate-50 transition-all">
                   <ArrowRight size={18} />
                 </button>
              </div>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {similar.map((p) => (
                <div key={p.id} className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden rounded-sm bg-slate-50 relative mb-5 ring-1 ring-slate-100 shadow-sm">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {p.isNew && (
                      <span className="absolute bottom-4 left-4 py-1 px-3 bg-primary text-white text-[9px] font-black uppercase tracking-widest">NEW IN</span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-[13px] font-black text-primary uppercase tracking-wide group-hover:underline underline-offset-4">{p.name}</h4>
                    <p className="text-[11px] text-muted font-medium line-clamp-2 mb-2 leading-relaxed opacity-60">Thiết kế được phối theo phong cách riêng của bạn</p>
                    <p className="text-[14px] font-black text-primary">{formatPrice(p.price)}</p>
                  </div>
                </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
}
