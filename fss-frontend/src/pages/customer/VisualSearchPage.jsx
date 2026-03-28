import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Search, Loader2, Sparkles, ArrowRight, Image, Cpu, ShoppingBag } from 'lucide-react';
import { products } from '../../data/mockData';
import ProductCard from '../../components/ui/ProductCard';

export default function VisualSearchPage() {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResults(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSearch = async () => {
    if (!preview) return;
    setSearching(true);
    // Giả lập gọi AI backend
    await new Promise((r) => setTimeout(r, 2000));
    // Trả về 4 sản phẩm ngẫu nhiên
    const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 4);
    setResults(shuffled);
    setSearching(false);
  };

  const resetSearch = () => {
    setPreview(null);
    setResults(null);
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-surface-secondary page-enter">
      <div className="layout-page py-20 lg:py-28">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-soft text-primary rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles size={14} />
            AI Powered Visual Search
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground tracking-tight">Tìm kiếm bằng hình ảnh</h1>
          <div className="flex justify-center">
            <p className="text-muted mt-5 max-w-2xl leading-relaxed text-[16px] text-center opacity-80">
              Trải nghiệm tính năng AI hỗ trợ tìm kiếm sản phẩm. Tải lên một bức ảnh thời trang bất kỳ, hệ thống sẽ phân tích và tìm ra sản phẩm có kiểu dáng tương đồng nhất trong kho hàng.
            </p>
          </div>
        </div>

        {/* Upload area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl overflow-hidden"
        >
          <div className="flex justify-center items-center py-4">
            {!preview ? (
              <div
                id="visual-search-drop-zone"
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}
                className={`border-2 border-dashed rounded-2xl aspect-square w-full max-w-md flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragging
                    ? 'border-primary bg-accent-soft'
                    : 'border-[#D1D5DB] hover:border-primary hover:bg-accent-soft'
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <motion.div
                  animate={{ y: dragging ? -6 : 0 }}
                  className="w-16 h-16 bg-accent-soft rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  {dragging ? <Upload size={28} className="text-primary" /> : <Image size={28} className="text-primary" />}
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {dragging ? 'Thả ảnh vào đây!' : 'Kéo thả hoặc nhấn để chọn ảnh'}
                </h3>
                <p className="text-sm text-muted-foreground">Hỗ trợ JPG, PNG, WEBP · Tối đa 10MB</p>
  
                {/* Tips */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {['Áo thun', 'Quần jean', 'Váy', 'Áo khoác', 'Phụ kiện'].map((tip) => (
                    <span key={tip} className="px-3 py-1 bg-[#F5F5F5] text-xs text-muted rounded-full">
                      {tip}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full space-y-6">
                {/* Preview */}
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-52 h-64 object-cover rounded-2xl border border-border"
                    />
                    <button
                      onClick={resetSearch}
                      className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      <X size={14} className="text-muted" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Ảnh đã tải lên</h3>
                      <p className="text-sm text-muted">AI sẽ phân tích màu sắc, kiểu dáng và loại sản phẩm để tìm kết quả phù hợp nhất.</p>
                    </div>
                    <div className="bg-accent-soft rounded-xl p-4 space-y-2 text-sm text-primary">
                      <p className="font-medium">🔍 Quy trình xử lý AI:</p>
                      <p>1. Resize ảnh → 224×224px</p>
                      <p>2. Trích xuất đặc trưng bằng ResNet50</p>
                      <p>3. Tính Cosine Similarity với ChromaDB</p>
                      <p>4. Trả về Top-K sản phẩm tương đồng</p>
                    </div>
                    <motion.button
                      id="visual-search-btn"
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSearch}
                      disabled={searching}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition-colors disabled:opacity-60"
                    >
                      {searching ? (
                        <><Loader2 size={16} className="animate-spin" /> Đang phân tích...</>
                      ) : (
                        <><Search size={16} /> Tìm kiếm ngay</>
                      )}
                    </motion.button>
                  </div>
                </div>
  
                {/* Results */}
                <AnimatePresence>
                  {results && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-t border-border pt-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <Sparkles size={16} className="text-primary" />
                          Sản phẩm tương đồng ({results.length} kết quả)
                        </h3>
                        <Link to="/products" className="text-sm text-primary flex items-center gap-1 hover:underline">
                          Xem tất cả <ArrowRight size={14} />
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {results.map((p) => (
                          <ProductCard key={p.id} product={p} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-32 lg:mt-40 grid grid-cols-1 sm:grid-cols-3 gap-8 pb-32"
        >
          {[
            { 
              icon: <Camera size={24} strokeWidth={2} />, 
              title: 'Tải ảnh lên', 
              desc: 'Chọn ảnh sản phẩm từ máy tính hoặc điện thoại.', 
              step: '01',
              gradient: 'from-blue-500 to-indigo-600',
            },
            { 
              icon: <Cpu size={24} strokeWidth={2} />, 
              title: 'AI phân tích', 
              desc: 'Hệ thống tự động tìm kiếm thông minh.', 
              step: '02',
              gradient: 'from-purple-500 to-pink-600',
            },
            { 
              icon: <ShoppingBag size={24} strokeWidth={2} />, 
              title: 'Nhận kết quả', 
              desc: 'Khám phá sản phẩm tương đồng từ kho.', 
              step: '03',
              gradient: 'from-orange-400 to-red-500',
            },
          ].map(({ icon, title, desc, step, gradient }, i) => (
            <motion.div 
              key={title} 
              whileHover={{ y: -6 }}
              className="group bg-white rounded-[2rem] p-8 border border-slate-100 flex flex-col items-center text-center shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden"
            >
              {/* background watermark number */}
              <div className="absolute -bottom-4 -right-2 text-[70px] font-black text-slate-50 group-hover:text-slate-100/60 transition-all duration-700 pointer-events-none select-none">
                {step}
              </div>
              
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative group-hover:scale-105 transition-transform duration-500 z-10">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl opacity-10 blur-xl`}></div>
                <div className={`w-full h-full bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                   {icon}
                </div>
              </div>
              
              <h4 className="font-black text-[15px] text-primary uppercase tracking-wider mb-3 z-10">{step}. {title}</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[200px] font-medium z-10">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
