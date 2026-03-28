import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Sparkles, Tag, X, Check } from 'lucide-react';
import { products as initialProducts, categories, formatPrice } from '../../data/mockData';

const emptyForm = { name: '', price: '', originalPrice: '', category: 'ao-thun', description: '', stock: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setProducts((prev) => prev.map((p) => p.id === editId ? { ...p, ...form, price: Number(form.price) } : p));
      setEditId(null);
    } else {
      const newProduct = {
        ...emptyForm, ...form,
        id: Date.now(),
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || Number(form.price),
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#00168d'],
        colorNames: ['Navy'],
        rating: 0, reviewCount: 0, sold: 0,
        tags: [], discount: 0, isNew: true, isBestSeller: false,
        stock: Number(form.stock) || 0,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, price: p.price, originalPrice: p.originalPrice, category: p.category, description: p.description, stock: p.stock });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const handleAutoTag = (id) => {
    const tags = ['casual', 'trendy', 'summer', 'bestseller', 'ai-tagged'];
    const randomTags = tags.sort(() => Math.random() - 0.5).slice(0, 3);
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, tags: randomTags } : p));
    alert(`✨ AI đã tự động gắn tag: ${randomTags.join(', ')}`);
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">Quản lý sản phẩm</h1>
          <p className="text-sm text-muted">{filtered.length} / {products.length} sản phẩm</p>
        </div>
        <button
          id="add-product-btn"
          onClick={() => { setShowForm(true); setForm(emptyForm); setEditId(null); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-secondary transition-colors text-sm shadow"
        >
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          id="admin-product-search"
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-foreground">{editId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-[#F5F5F5]"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Tên sản phẩm *</label>
                <input name="name" required value={form.name} onChange={handleChange} placeholder="VD: Áo Thun Basic Navy" className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Giá bán (₫) *</label>
                  <input name="price" type="number" required value={form.price} onChange={handleChange} placeholder="250000" className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Giá gốc (₫)</label>
                  <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} placeholder="350000" className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Danh mục</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-white focus:outline-none focus:border-primary transition-all">
                    {categories.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Tồn kho</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="100" className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Mô tả sản phẩm</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary resize-none transition-all" placeholder="Mô tả chi tiết..." />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-border text-[#374151] rounded-xl text-sm font-medium hover:border-primary transition-colors">Hủy</button>
                <button type="submit" id="save-product-btn" className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-1.5">
                  <Check size={15} /> {editId ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-secondary border-b border-border">
              <tr>
                {['Sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Đã bán', 'Tags', 'Thao tác'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <motion.tr key={p.id} layout className="hover:bg-surface-secondary transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover rounded-lg" />
                      <div>
                        <p className="font-semibold text-xs text-foreground line-clamp-1">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">ID: {p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-accent-soft text-primary px-2 py-0.5 rounded-full font-medium">
                      {categories.find(c => c.id === p.category)?.name || p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-bold text-primary">{formatPrice(p.price)}</p>
                    {p.discount > 0 && <p className="text-[11px] text-muted-foreground line-through">{formatPrice(p.originalPrice)}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${p.stock < 10 ? 'text-red-500' : 'text-[#374151]'}`}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#374151] font-medium">{p.sold.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] bg-slate-100 text-muted px-1.5 py-0.5 rounded">#{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAutoTag(p.id)}
                        title="AI Auto-tag"
                        className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500 transition-colors"
                      >
                        <Sparkles size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 rounded-lg hover:bg-accent-soft text-primary transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg bg-red-500 text-white text-[11px]"><Check size={13} /></button>
                          <button onClick={() => setDeleteConfirm(null)} className="p-1.5 rounded-lg bg-[#F5F5F5] text-[#374151] text-[11px]"><X size={13} /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
