import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Heart } from 'lucide-react';
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

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className="group h-full bg-white rounded-none border-2 border-border overflow-hidden shadow-soft hover:shadow-elevation transition-all duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
    >
      {/* Image Section with Enhanced Hover */}
      <Link
        to={`/products/${product.id}`}
        className="block relative overflow-hidden aspect-[3/4] bg-surface-secondary"
      >
        <img
          src={product.images[imgIdx]}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          onMouseEnter={() => product.images[1] && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
        />

        {/* Overlay Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="badge badge-primary"
            >
              ✨ Mới
            </motion.span>
          )}
          {discount > 0 && (
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="badge badge-error"
            >
              -{discount}%
            </motion.span>
          )}
        </div>

        {/* Quick Action Buttons - Enhanced */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              setLiked(!liked);
            }}
            className="w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-all duration-200 border border-white/30"
            title={liked ? 'Bỏ yêu thích' : 'Yêu thích'}
          >
            <Heart size={18} className={`transition-all ${liked ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleQuickAdd}
            className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-elevation transition-all duration-200"
            title="Thêm vào giỏ"
          >
            <ShoppingBag size={18} strokeWidth={2} />
          </motion.button>
        </div>
      </Link>

      {/* Info Section - Premium Styling */}
      <div className="p-5 lg:p-6 flex flex-col h-auto justify-between min-h-[240px]">
        {/* Category & Rating */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-wide opacity-70">
            {product.category}
          </span>
          <div className="flex items-center gap-1.5 bg-primary-50 px-2.5 py-1.5 rounded-full">
            <Star size={12} className="fill-primary text-primary" />
            <span className="text-xs font-bold text-primary">{product.rating}</span>
          </div>
        </div>

        {/* Product Name */}
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-bold text-xs text-foreground leading-snug font-display hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          Chất lượng cao cấp, thiết kế tối giản
        </p>

        {/* Color Dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            {product.colors.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border-2 border-white ring-1 ring-border shadow-sm cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={product.colorNames?.[i] || `Color ${i + 1}`}
              />
            ))}
            {product.colors.length > 4 && (
              <div className="text-xs font-semibold text-muted-foreground px-1">
                +{product.colors.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-auto mt-auto">
          <span className="font-black text-lg text-primary tracking-tight">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through font-semibold">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

