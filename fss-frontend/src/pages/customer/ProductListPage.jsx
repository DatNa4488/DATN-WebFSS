import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Camera, ChevronDown } from 'lucide-react';
import { products, categories, formatPrice } from '../../data/mockData';
import ProductCard from '../../components/ui/ProductCard';

const sortOptions = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Giá tăng dần', value: 'price-asc' },
  { label: 'Giá giảm dần', value: 'price-desc' },
  { label: 'Bán chạy nhất', value: 'best-seller' },
  { label: 'Đánh giá cao', value: 'rating' },
];

const priceRanges = [
  { label: 'Tất cả', min: 0, max: Infinity },
  { label: 'Dưới 200K', min: 0, max: 200000 },
  { label: '200K - 500K', min: 200000, max: 500000 },
  { label: '500K - 1 triệu', min: 500000, max: 1000000 },
  { label: 'Trên 1 triệu', min: 1000000, max: Infinity },
];

const sizesAll = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '29', '30', '31', '32', '33', '34'];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const activeCategory = searchParams.get('category') || 'all';

  const setCategory = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') params.delete('category');
    else params.set('category', slug);
    setSearchParams(params);
  };

  const toggleSize = (s) =>
    setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    const range = priceRanges[priceRange];
    list = list.filter((p) => p.price >= range.min && p.price <= range.max);

    if (selectedSizes.length > 0) {
      list = list.filter((p) => selectedSizes.some((s) => p.sizes.includes(s)));
    }

    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'best-seller': list.sort((a, b) => b.sold - a.sold); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => b.id - a.id);
    }

    return list;
  }, [activeCategory, search, sortBy, priceRange, selectedSizes]);

  return (
    <div className="min-h-screen bg-surface-secondary page-enter">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="layout-page py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">Sản phẩm</h1>
              <p className="text-sm text-muted mt-0.5">
                {filtered.length} sản phẩm{activeCategory !== 'all' && ` trong "${categories.find(c => c.slug === activeCategory)?.name || activeCategory}"`}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="product-search"
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-secondary transition-all"
                />
              </div>
              {/* Sort */}
              <div className="relative">
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-3 pr-8 py-2 border border-border rounded-xl text-sm bg-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              {/* Filter toggle */}
              <button
                id="filter-btn"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  showFilters ? 'bg-primary text-white border-primary' : 'bg-white text-tertiary border-border hover:border-primary'
                }`}
              >
                <SlidersHorizontal size={14} /> Bộ lọc
              </button>
              <Link
                to="/visual-search"
                className="flex items-center gap-1.5 px-3 py-2 bg-accent-soft text-primary rounded-xl text-sm font-medium hover:bg-accent-soft-hover transition-colors"
              >
                <Camera size={14} /> Tìm ảnh
              </Link>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto mt-4 pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                  activeCategory === cat.slug
                    ? 'bg-primary text-white'
                    : 'bg-white text-tertiary border border-border hover:border-primary hover:text-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="layout-page py-12 lg:py-20 flex gap-6">
        {/* Sidebar Filters */}
        {showFilters && (
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-56 shrink-0"
          >
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-24 space-y-6">
              <h3 className="font-semibold text-foreground text-sm">Bộ lọc</h3>

              {/* Price */}
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Khoảng giá</p>
                {priceRanges.map((range, i) => (
                  <label key={i} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === i}
                      onChange={() => setPriceRange(i)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-tertiary">{range.label}</span>
                  </label>
                ))}
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">Size</p>
                  {selectedSizes.length > 0 && (
                    <button onClick={() => setSelectedSizes([])} className="text-xs text-primary hover:underline">Xóa</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sizesAll.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        selectedSizes.includes(s)
                          ? 'bg-primary text-white border-primary'
                          : 'border-border text-tertiary hover:border-primary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setPriceRange(0); setSelectedSizes([]); setSearch(''); }}
                className="w-full py-2 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </motion.aside>
        )}

        {/* Products */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-32 lg:py-48">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-lg font-semibold text-foreground mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-sm text-muted">Thử từ khóa khác hoặc <Link to="/visual-search" className="text-primary hover:underline">tìm kiếm bằng ảnh</Link></p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
