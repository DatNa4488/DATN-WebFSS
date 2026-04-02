import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../../data/mockData';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const { addItem, openCart } = useCartStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

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
      className="group h-full bg-white rounded-md shadow-soft hover:shadow-elevation transition-all duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
    >
      {/* Image Section with Enhanced Hover */}
      <Link
        to={`/products/${product.id}`}
        className="block relative overflow-hidden rounded-sm aspect-[3/4] bg-surface-secondary"
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
          {!isAdmin && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleQuickAdd}
            className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-elevation transition-all duration-200"
            title="Thêm vào giỏ"
          >
            <ShoppingBag size={18} strokeWidth={2} />
          </motion.button>
          )}
        </div>
      </Link>

      {/* Info Section - Premium Styling */}
      <div className="p-2 lg:p-3 flex flex-col h-auto justify-between min-h-[150px]">
        {/* Category & Rating */}
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-wide opacity-70">
            {product.category}
          </span>
          <div className="flex items-center gap-1 bg-primary-50 px-2 py-1 rounded-full">
            <Star size={11} className="fill-primary text-primary" />
            <span className="text-xs font-bold text-primary">{product.rating}</span>
          </div>
        </div>

        {/* Product Name */}
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-bold text-xs text-foreground leading-tight font-display hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-tight line-clamp-2 my-0.5">
          Chất lượng cao cấp, thiết kế tối giản
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
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

