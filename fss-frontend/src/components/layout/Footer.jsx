import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

const InstagramIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const FacebookIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const YoutubeIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
);

const footerLinks = {
  'Sản phẩm': [
    { label: 'Áo thun', path: '/products?category=ao-thun' },
    { label: 'Áo sơ mi', path: '/products?category=ao-so-mi' },
    { label: 'Quần jean', path: '/products?category=quan-jean' },
    { label: 'Váy & Đầm', path: '/products?category=vay' },
    { label: 'Áo khoác', path: '/products?category=ao-khoac' },
  ],
  'Hỗ trợ': [
    { label: 'Hướng dẫn mua hàng', path: '/help/guide' },
    { label: 'Chính sách đổi trả', path: '/help/return-policy' },
    { label: 'Tra cứu đơn hàng', path: '/orders' },
    { label: 'FAQs', path: '/help/faq' },
  ],
  'Về FSS': [
    { label: 'Giới thiệu', path: '/about' },
    { label: 'Blog thời trang', path: '/blog' },
    { label: 'Liên hệ', path: '/contact' },
    { label: 'Tuyển dụng', path: '/careers' },
  ],
};

const socials = [
  { icon: InstagramIcon, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
  { icon: FacebookIcon, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
  { icon: YoutubeIcon, href: '#', label: 'Youtube', color: 'hover:text-red-400' },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-24 lg:mt-32">
      <div className="layout-page py-20 lg:py-32">
        {/* Newsletter Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-16">
          <div>
            <h3 className="text-[22px] font-bold font-display tracking-wide mb-1.5">Mua ngay nhận ưu đãi</h3>
            <p className="text-white/70 text-[13px] font-medium">Nhận ngay 10% giảm giá cho đơn hàng đầu tiên!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-white/20">
                <img src="/logo.png" alt="FSS" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase font-bold">Fashion Shopping</p>
                <p className="text-[22px] font-bold tracking-tight leading-none mt-0.5">Sense</p>
              </div>
            </Link>
            <p className="text-white/60 text-[13px] leading-relaxed max-w-sm mb-6 mt-2">
              Nền tảng mua sắm thời trang thông minh — kết hợp AI tìm kiếm sản phẩm tương đồng để mang đến trải nghiệm mua sắm tốt nhất.
            </p>
            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-[13px] text-white/70">
                <Phone size={16} className="text-white/40 shrink-0" />
                <span className="font-medium">0858317285</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-white/70">
                <Mail size={16} className="text-white/40 shrink-0" />
                <span className="font-medium">ndat45489@gmail.com</span>
              </div>
              <div className="flex items-start gap-3 text-[13px] text-white/70">
                <MapPin size={16} className="text-white/40 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed max-w-[250px]">Đại học thủy lợi, Tây Sơn, Hà Nội</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="lg:pl-8">
              <h4 className="font-bold text-[13px] tracking-widest uppercase text-white mb-6">{section}</h4>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-[13px] text-white/50 hover:text-white transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="layout-page py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-[11px] tracking-widest uppercase font-semibold">
            © 2026 FASHION SHOPPING SENSE
          </p>
          <div className="flex items-center gap-5">
            {socials.map(({ icon: Icon, href, label, color }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={`text-white/40 ${color} transition-all hover:scale-110`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
