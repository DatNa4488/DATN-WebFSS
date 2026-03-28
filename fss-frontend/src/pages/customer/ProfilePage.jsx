import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Package, Star, Edit2, Save, LogOut, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { orders, formatPrice, orderStatusMap } from '../../data/mockData';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Hồ sơ');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: '0901234567', address: '123 Lê Lợi, Q1, TP.HCM' });

  const handleSave = () => {
    updateProfile({ name: form.name });
    setEditing(false);
  };

  const menuItems = [
    { id: 'Hồ sơ', label: 'Thông tin cá nhân', icon: User },
    { id: 'Đơn hàng', label: 'Lịch sử mua hàng', icon: Package },
    { id: 'Đánh giá', label: 'Nhận xét của tôi', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary pb-20 page-enter">
      <div className="layout-page py-10">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR: Sharp & Clean */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
              <div className="p-8 text-center border-b border-slate-200 bg-[#F1F5F9]/30">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white text-white shadow-lg">
                    <Camera size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-primary font-display">{user?.name}</h2>
                <p className="text-[12px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Premium Member</p>
              </div>
              
              <nav className="p-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-md text-sm font-bold transition-all ${
                      activeTab === item.id 
                        ? 'bg-primary text-white shadow-lg shadow-primary/10' 
                        : 'text-tertiary hover:bg-[#F1F5F9] hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.label}
                    </div>
                    <ChevronRight size={16} className={activeTab === item.id ? 'opacity-100' : 'opacity-30'} />
                  </button>
                ))}
                <div className="h-px bg-[#E2E8F0] my-2 mx-4" />
                <button 
                   onClick={logout}
                   className="w-full flex items-center gap-3 px-6 py-4 rounded-md text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT: Structured & Elegant */}
          <main className="flex-1">
             <div className="bg-white border border-slate-200 rounded-md shadow-sm min-h-[600px]">
                
                {/* Header of Content */}
                <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between">
                   <h2 className="text-lg font-bold text-primary uppercase tracking-wider">{activeTab}</h2>
                   {activeTab === 'Hồ sơ' && (
                     <button
                       onClick={() => editing ? handleSave() : setEditing(true)}
                       className="flex items-center gap-2 px-6 py-2 bg-primary text-white text-[12px] font-bold rounded-md hover:bg-secondary transition-all"
                     >
                       {editing ? <><Save size={14} /> Lưu thay đổi</> : <><Edit2 size={14} /> Chỉnh sửa</>}
                     </button>
                   )}
                </div>

                <div className="p-8">
                  {/* Hồ sơ Tab */}
                  {activeTab === 'Hồ sơ' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {[
                            { label: 'Họ và tên', name: 'name', icon: User, value: form.name },
                            { label: 'Địa chỉ Email', name: 'email', icon: Mail, value: user?.email, readOnly: true },
                            { label: 'Số điện thoại', name: 'phone', icon: Phone, value: form.phone },
                            { label: 'Địa chỉ mặc định', name: 'address', icon: MapPin, value: form.address },
                         ].map((field) => (
                           <div key={field.name} className="space-y-2">
                             <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{field.label}</label>
                             <div className="relative group">
                                <field.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input 
                                  type="text"
                                  value={field.name === 'email' ? user?.email : form[field.name]}
                                  onChange={(e) => !field.readOnly && setForm({...form, [field.name]: e.target.value})}
                                  readOnly={!editing || field.readOnly}
                                  className={`w-full pl-12 pr-4 py-4 border rounded-md text-[15px] font-medium transition-all ${
                                    editing && !field.readOnly 
                                      ? 'border-primary bg-white ring-4 ring-primary/5 shadow-sm' 
                                      : 'border-slate-200 bg-[#F8FAFC] opacity-70'
                                  }`}
                                />
                             </div>
                           </div>
                         ))}
                       </div>
                       
                       <div className="pt-6 border-t border-slate-200">
                          <h3 className="text-sm font-bold text-primary mb-4">Bảo mật tài khoản</h3>
                          <button className="text-[12px] font-bold text-primary houver:underline decoration-2 underline-offset-4">Đổi mật khẩu →</button>
                       </div>
                    </motion.div>
                  )}

                  {/* Đơn hàng Tab */}
                  {activeTab === 'Đơn hàng' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                       {orders.map((order) => {
                         const status = orderStatusMap[order.status];
                         return (
                           <div key={order.id} className="border border-slate-200 rounded-md p-6 hover:border-primary transition-colors group">
                              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                 <div>
                                   <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Mã đơn hàng</p>
                                   <p className="text-sm font-bold text-primary">{order.id}</p>
                                 </div>
                                 <div className="text-right">
                                   <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Ngày đặt</p>
                                   <p className="text-sm font-bold text-tertiary">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                 </div>
                                 <span className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${status.color.replace('bg-', 'bg-opacity-10 text-')}`}>{status.label}</span>
                              </div>
                              
                              <div className="space-y-4 mb-6">
                                 {order.items.map((item, i) => (
                                   <div key={i} className="flex items-center gap-4 py-2 border-b border-[#F1F5F9] last:border-0">
                                      <div className="w-12 h-16 bg-[#F8FAFC] border border-slate-200 rounded-sm shrink-0" />
                                      <div className="flex-1">
                                         <p className="text-sm font-bold text-primary">{item.name}</p>
                                         <p className="text-xs text-muted-foreground">Size: {item.size} | SL: {item.qty}</p>
                                      </div>
                                      <p className="text-sm font-bold text-primary">{formatPrice(item.price)}</p>
                                   </div>
                                 ))}
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
                                 <p className="text-sm font-bold text-primary">Tổng tiền: {formatPrice(order.total)}</p>
                                 <button className="text-[12px] font-bold text-tertiary border border-slate-200 px-4 py-2 rounded-md hover:border-primary hover:text-primary transition-all">
                                   Chi tiết đơn hàng
                                 </button>
                              </div>
                           </div>
                         );
                       })}
                    </motion.div>
                  )}

                  {/* Đánh giá Tab */}
                  {activeTab === 'Đánh giá' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                       <div className="w-20 h-20 bg-[#F1F5F9] rounded-md flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                          <Star size={40} />
                       </div>
                       <h3 className="text-lg font-bold text-primary mb-2">Chưa có đánh giá nào</h3>
                       <p className="text-sm text-tertiary mb-8">Chia sẻ trải nghiệm của bạn về sản phẩm để nhận ưu đãi từ FSS.</p>
                       <Link to="/products" className="px-8 py-3 bg-primary text-white text-[13px] font-bold rounded-md">Mua sắm ngay</Link>
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
