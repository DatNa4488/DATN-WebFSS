import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { products, categories, formatPrice } from '../../data/mockData';
import ProductCard from '../../components/ui/ProductCard';

/* Khung chung với header/footer — luôn có lề hai bên */
const containerClass = 'layout-page';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const heroProduct = products[0];

  const filteredProducts = activeCategory === 'all'
    ? products.slice(0, 8)
    : products.filter((p) => p.category === activeCategory).slice(0, 8);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="page-enter bg-surface-secondary min-h-screen pb-20">

      {/* ===== HERO — gọn, contained, glass card ===== */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 overflow-hidden">
        <div className={containerClass}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="z-10 w-full min-w-0 max-w-xl lg:max-w-none"
            >
              <div className="flex flex-col items-start mb-4">
                 <span className="text-label mb-2">FASHION SHOPPING SENSE</span>
                 <h1 className="text-3xl sm:text-4xl lg:text-[2.35rem] xl:text-[2.65rem] text-headline">
                   <span className="block">SỰ HIỆN ĐẠI.</span>
                   <span className="block text-primary">TINH TẾ.</span>
                 </h1>
              </div>
              <p className="text-sm sm:text-[15px] text-muted mt-4 max-w-lg leading-relaxed">
                Khám phá bộ sưu tập mang phong cách tối giản, tập trung vào chất liệu cao cấp và những đường cắt may hoàn hảo.
              </p>
              <div className="mt-7">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white text-[13px] font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-secondary transition-all"
                >
                  Khám phá ngay <ArrowRight size={18} strokeWidth={2.5} />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="relative w-full min-w-0"
            >
              <div className="relative w-full rounded-[1.35rem] overflow-hidden shadow-xl shadow-slate-900/15 ring-1 ring-black/[0.06]">
                <img
                  src={heroProduct.images[0]}
                  alt={heroProduct.name}
                  className="w-full h-[min(400px,50vh)] sm:h-[420px] lg:h-[440px] object-cover object-top"
                />
                <Link
                  to={`/products/${heroProduct.id}`}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm border border-white/70 shadow-md flex items-center justify-center text-primary hover:bg-white transition-colors"
                  aria-label="Xem sản phẩm"
                >
                  <ChevronRight size={22} strokeWidth={2} />
                </Link>
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-slate-900/60 backdrop-blur-md border-t border-white/10">
                  <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-3 py-1 rounded-full bg-white text-primary shadow-sm">
                    Best Seller
                  </span>
                  <h3 className="font-display font-bold text-white text-base sm:text-lg leading-snug">
                    {heroProduct.name}
                  </h3>
                  <p className="text-white font-bold text-[15px] mt-1">{formatPrice(heroProduct.price)}</p>
                  <Link
                    to={`/products/${heroProduct.id}`}
                    className="mt-3 flex w-full items-center justify-center py-2.5 rounded-full bg-white text-foreground text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES — không cho bg tràn full viewport ===== */}
      <section className="py-20 lg:py-28">
        <div className={containerClass}>
          <div className="rounded-2xl border border-border bg-white px-4 py-6 sm:px-6 sm:py-7 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <h2 className="text-lg md:text-xl font-bold font-display text-foreground tracking-tight">Sản phẩm nổi bật</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'bg-slate-100 text-muted border border-transparent hover:border-primary/40'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT GRID ===== */}
      <section className="py-20 lg:py-32">
        <div className={containerClass}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary text-sm font-bold rounded-full hover:bg-primary hover:text-white transition-all group"
            >
              Xem tất cả sản phẩm <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}
