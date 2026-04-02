import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Package, Star, Edit2, Save, LogOut, ChevronRight, Heart, MapPinIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { orders, formatPrice, orderStatusMap } from '../../data/mockData';

export default function ProfilePage() {
  const { user, updateProfile, updateAvatar, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Hồ sơ');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: '0901234567', address: '123 Lê Lợi, Q1, TP.HCM' });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = () => {
    updateProfile({ name: form.name });
    setEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh (JPG, PNG, WEBP...)!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn! Vui lòng chọn ảnh dưới 5MB.');
      return;
    }
    setAvatarUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      updateAvatar(event.target.result);
      setAvatarUploading(false);
    };
    reader.readAsDataURL(file);
    // reset input để có thể chọn lại cùng file
    e.target.value = '';
  };

  const menuItems = [
    { id: 'Hồ sơ', label: 'Hồ sơ của tôi', icon: User },
    { id: 'Đơn hàng', label: 'Đơn hàng của tôi', icon: Package },
    { id: 'Địa chỉ', label: 'Số địa chỉ', icon: MapPin },
    { id: 'Yêu thích', label: 'Danh sách yêu thích', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary pb-20 page-enter">
      <div className="layout-page py-8">

        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT SIDEBAR: Modern & Premium */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white border border-slate-200 rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6 text-center border-b border-slate-100 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-full h-full rounded-sm object-cover border-3 border-white shadow-lg"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Đổi ảnh đại diện"
                    className={`absolute bottom-0 right-0 w-7 h-7 bg-gradient-to-br from-primary to-primary-700 rounded-sm flex items-center justify-center border-2 border-white text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 ${
                      avatarUploading ? 'opacity-60 cursor-wait animate-pulse' : ''
                    }`}
                    disabled={avatarUploading}
                  >
                    <Camera size={12} />
                  </button>
                </div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-transparent">{user?.name}</h2>
                <p className="text-[11px] text-primary/70 font-medium mt-0.5">Thành viên từ 2026</p>
                {avatarUploading && (
                  <p className="text-[10px] text-primary mt-1 animate-pulse">Đang cập nhật ảnh...</p>
                )}
              </div>

              <nav className="p-3">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-5 py-3 rounded-sm text-sm font-semibold transition-all duration-200 ${activeTab === item.id
                        ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-l-4 border-primary shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-sm transition-colors duration-200 ${activeTab === item.id ? 'bg-primary/20 text-primary' : 'bg-slate-100 text-slate-600'
                        }`}>
                        <item.icon size={16} />
                      </div>
                      {item.label}
                    </div>
                    <ChevronRight size={14} className={activeTab === item.id ? 'opacity-100' : 'opacity-30'} />
                  </motion.button>
                ))}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-3 mx-4" />
                <motion.button
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-5 py-3 rounded-sm text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut size={16} />
                  Đăng xuất
                </motion.button>
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT: Modern & Elegant */}
          <main className="flex-1">
            <div className="bg-white border border-slate-200 rounded-sm shadow-md min-h-[500px] hover:shadow-lg transition-shadow duration-300\">

              {/* Header of Content */}
              <div className="px-8 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-transparent flex items-center justify-between">
                <h2 className="text-base font-bold bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-transparent uppercase tracking-wide\">{activeTab}</h2>
                {activeTab === 'Hồ sơ' && (
                  <button
                    onClick={() => editing ? handleSave() : setEditing(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary to-primary-700 text-white text-[11px] font-semibold rounded-sm hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                  >
                    {editing ? <><Save size={14} /> Lưu thay đổi</> : <><Edit2 size={14} /> Chỉnh sửa</>}
                  </button>
                )}
              </div>

              <div className="p-6">
                {/* Hồ sơ Tab */}
                {activeTab === 'Hồ sơ' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: 'HỌ VÀ TÊN', name: 'name', icon: User, value: form.name },
                        { label: 'ĐỊA CHỈ EMAIL', name: 'email', icon: Mail, value: user?.email, readOnly: true },
                        { label: 'SỐ ĐIỆN THOẠI', name: 'phone', icon: Phone, value: form.phone },
                        { label: 'ĐỊA CHỈ MẶC ĐỊNH', name: 'address', icon: MapPin, value: form.address },
                      ].map((field) => (
                        <div key={field.name} className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{field.label}</label>
                          <div className="relative group">
                            <field.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                            <input
                              type="text"
                              value={field.name === 'email' ? user?.email : form[field.name]}
                              onChange={(e) => !field.readOnly && setForm({ ...form, [field.name]: e.target.value })}
                              readOnly={!editing || field.readOnly}
                              className={`w-full pl-12 pr-4 py-3 border rounded-sm text-[14px] font-medium transition-all duration-200 ${editing && !field.readOnly
                                  ? 'border-primary bg-white focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-sm'
                                  : 'border-slate-200 bg-[#F8FAFC] opacity-70 cursor-not-allowed'
                                }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <h3 className="text-xs font-bold text-primary mb-3 uppercase tracking-wide">Bảo mật tài khoản</h3>
                      <button className="text-[11px] font-bold bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-4 py-2 rounded-sm hover:from-primary/20 hover:to-primary/10 transition-all duration-200">
                        Đổi mật khẩu →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Đơn hàng Tab */}
                {activeTab === 'Đơn hàng' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {orders.map((order) => {
                      const status = orderStatusMap[order.status];
                      return (
                        <div key={order.id} className="border border-slate-200 rounded-sm p-5 hover:border-primary hover:shadow-md transition-all duration-200 group bg-gradient-to-br from-white to-slate-50">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div>
                              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Mã đơn hàng</p>
                              <p className="text-sm font-bold text-primary">{order.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Ngày đặt</p>
                              <p className="text-sm font-bold text-tertiary">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider ${status.color.replace('bg-', 'bg-opacity-10 text-')}`}>{status.label}</span>
                          </div>

                          <div className="space-y-3 mb-4">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-[#F1F5F9] last:border-0">
                                <div className="w-12 h-16 bg-[#F8FAFC] border border-slate-200 rounded-sm shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-primary">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">Size: {item.size} | SL: {item.qty}</p>
                                </div>
                                <p className="text-sm font-bold text-primary">{formatPrice(item.price)}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
                            <p className="text-sm font-bold text-primary">Tổng tiền: {formatPrice(order.total)}</p>
                            <button className="text-[11px] font-bold text-primary border border-slate-200 px-3 py-1.5 rounded-sm hover:border-primary hover:bg-primary/5 hover:shadow-sm transition-all duration-200">
                              Chi tiết đơn hàng
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {/* Địa chỉ Tab */}
                {activeTab === 'Địa chỉ' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-sm flex items-center justify-center mx-auto mb-4 text-primary/60">
                      <MapPin size={32} />
                    </div>
                    <h3 className="text-base font-bold bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-transparent mb-1">Quản lý địa chỉ</h3>
                    <p className="text-xs text-tertiary mb-4">Thêm hoặc chỉnh sửa địa chỉ giao hàng của bạn.</p>
                    <button className="px-5 py-2 bg-gradient-to-r from-primary to-primary-700 text-white text-[11px] font-semibold rounded-sm hover:shadow-lg hover:shadow-primary/30 transition-all duration-200">
                      + Thêm địa chỉ mới
                    </button>
                  </motion.div>
                )}

                {/* Yêu thích Tab */}
                {activeTab === 'Yêu thích' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-50 rounded-sm flex items-center justify-center mx-auto mb-4 text-rose-500/60">
                      <Heart size={32} />
                    </div>
                    <h3 className="text-base font-bold bg-gradient-to-r from-rose-600 to-rose-700 bg-clip-text text-transparent mb-1">Danh sách yêu thích</h3>
                    <p className="text-xs text-tertiary mb-4">Các sản phẩm bạn yêu thích sẽ hiển thị ở đây.</p>
                    <button className="px-5 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[11px] font-semibold rounded-sm hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-200">
                      Xem sản phẩm yêu thích
                    </button>
                  </motion.div>
                )}
              </div>

            </div>
          </main>

        </div>

      </div>
    </div>
  );
}
