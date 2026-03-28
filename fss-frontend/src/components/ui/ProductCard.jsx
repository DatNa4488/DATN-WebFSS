import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Eye, Heart, Plus } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../../data/mockData';
import useCartStore from '../../store/cartStore';

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const { addItem, openCart } = useCartStore();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    addItem(product, product.sizes[0], product.colorNames[0]);
    openCart();
  };

  return (
    <motion.div
      className="group bg-transparent transition-all duration-500"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Image Section */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-[3/4] rounded-sm bg-slate-50 ring-1 ring-slate-100 shadow-sm mb-5">
        <img
          src={product.images[imgIdx]}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
          onMouseEnter={() => product.images[1] && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
        />

        {/* Floating Badges */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-primary text-white text-[9px] font-black px-2.5 py-1 uppercase tracking-widest shadow-lg">NEW IN</span>
          )}
        </div>

        {/* Quick Actions - Floating */}
        <div className="absolute top-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors"
          >
            <Heart size={16} className={liked ? 'fill-current' : ''} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleQuickAdd}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors"
          >
            <ShoppingBag size={16} />
          </motion.button>
        </div>
      </Link>

      {/* Info Section - Clean & Typographic */}
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-4">
           <Link to={`/products/${product.id}`} className="flex-1">
             <h3 className="font-black text-[14px] text-primary leading-tight font-display hover:underline underline-offset-4 decoration-1 uppercase tracking-tight line-clamp-1">
               {product.name}
             </h3>
           </Link>
           <div className="flex items-center gap-1 text-[10px] font-black text-amber-500">
             <Star size={10} className="fill-current" />
             <span>{product.rating}</span>
           </div>
        </div>

        <p className="text-[11px] text-muted-foreground font-medium line-clamp-1 opacity-70">
          Thiết kế được tinh chỉnh theo phong cách Heritage hiện đại.
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-black text-primary text-[15px] tracking-tight">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-muted-foreground line-through font-bold">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          
          <div className="flex -space-x-1.5">
             {product.colors && product.colors.slice(0, 3).map((color, i) => (
                <div 
                   key={i} 
                   className="w-3.5 h-3.5 rounded-full border-2 border-white ring-1 ring-slate-100 shadow-sm" 
                   style={{ backgroundColor: color }}
                />
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

