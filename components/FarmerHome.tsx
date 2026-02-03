
import React from 'react';
import { 
  Sprout, Bug, CloudSun, BookOpen, 
  ShieldCheck, Search, ChevronRight, TrendingDown, 
  TrendingUp, LayoutGrid, Calendar, Info
} from 'lucide-react';

interface FarmerHomeProps {
  onNavigate: (tab: any) => void;
  farmName: string;
}

const FarmerHome: React.FC<FarmerHomeProps> = ({ onNavigate, farmName }) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
      {/* Top Hero Section */}
      <div className="bg-gradient-to-b from-green-600 to-green-500 pt-12 pb-20 px-6 rounded-b-[3rem] relative shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Sprout className="text-white" size={32} />
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">AgroMap</h1>
          </div>
          <div className="relative">
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-green-600 flex items-center justify-center text-[8px] font-bold text-white">6</div>
             <Info className="text-white" size={28} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="absolute -bottom-8 left-6 right-6">
          <div className="bg-white rounded-full shadow-xl flex items-center px-6 py-4 border border-slate-100">
            <input 
              type="text" 
              placeholder="Nhập từ khóa tìm kiếm vùng trồng..." 
              className="flex-1 bg-transparent outline-none text-slate-600 font-medium"
            />
            <Search className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="mt-16 px-6 grid grid-cols-3 gap-y-10 gap-x-4">
        {[
          { label: 'Đăng ký', icon: <PlusSquareIcon />, color: 'bg-green-100 text-green-700', tab: 'register' },
          { label: 'Sâu bệnh hại', icon: <Bug size={28} />, color: 'bg-orange-100 text-orange-700' },
          { label: 'Thời tiết nông vụ', icon: <CloudSun size={28} />, color: 'bg-blue-100 text-blue-700' },
          { label: 'Hồ sơ', icon: <LayoutGrid size={28} />, color: 'bg-emerald-100 text-emerald-700', tab: 'list' },
          { label: 'Hỗ trợ Nông nghiệp', icon: <BookOpen size={28} />, color: 'bg-purple-100 text-purple-700' },
          { label: 'Phòng trừ sinh học', icon: <ShieldCheck size={28} />, color: 'bg-teal-100 text-teal-700' },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => item.tab && onNavigate(item.tab)}
            className="flex flex-col items-center gap-3 transition-transform active:scale-90"
          >
            <div className={`${item.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-md`}>
              {item.icon}
            </div>
            <span className="text-[11px] font-bold text-slate-700 text-center leading-tight uppercase tracking-tighter h-8 flex items-center">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Market Prices Section */}
      <div className="mt-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">Giá cả thị trường</h2>
          <button className="text-green-700 font-bold text-sm flex items-center">
            Tất cả <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md">Trong nước</button>
          <button className="bg-white text-slate-400 px-6 py-2 rounded-xl font-bold text-sm border border-slate-100">Quốc tế</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <PriceCard 
            title="Hồ tiêu" 
            price="151.000 vnđ" 
            change="-500" 
            trend="down" 
            sub="Tiêu đen xô" 
            loc="Hồ Chí Minh" 
            img="https://cdn-icons-png.flaticon.com/512/3211/3211110.png"
          />
          <PriceCard 
            title="Sầu riêng" 
            price="40.000 vnđ" 
            change="+1.200" 
            trend="up" 
            sub="Ri6" 
            loc="Thạnh Phú" 
            img="https://cdn-icons-png.flaticon.com/512/3211/3211024.png"
          />
        </div>
      </div>

      {/* Featured Banner */}
      <div className="mt-10 px-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-400 rounded-[2rem] p-8 relative overflow-hidden shadow-lg group">
          <div className="relative z-10 text-white">
            <h3 className="text-2xl font-black mb-2 italic">Xem gì hôm nay?</h3>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} />
              <span className="font-bold">{new Date().toLocaleDateString('vi-VN')}</span>
            </div>
            <button className="bg-white text-green-700 px-6 py-2 rounded-full font-black text-xs uppercase shadow-lg group-hover:px-8 transition-all">Tìm hiểu thêm</button>
          </div>
          {/* Decorative megaphone icon placeholder style */}
          <div className="absolute -right-4 -bottom-4 opacity-20 transform -rotate-12 group-hover:scale-110 transition-transform">
             <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center">
                <TrendingUp size={80} className="text-green-800" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlusSquareIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
);

const PriceCard: React.FC<{title: string, price: string, change: string, trend: 'up' | 'down', sub: string, loc: string, img: string}> = ({
  title, price, change, trend, sub, loc, img
}) => (
  <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50">
    <div className="flex items-center gap-3 mb-4">
      <img src={img} className="w-8 h-8 object-contain" alt={title} />
      <span className="font-black text-slate-900 uppercase tracking-tighter">{title}</span>
    </div>
    <div className="space-y-1">
      <p className="text-lg font-black text-slate-900">{price}</p>
      <div className="flex items-center justify-between">
        <div className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp size={12} className="mr-1"/> : <TrendingDown size={12} className="mr-1"/>}
          {change}
        </div>
        <span className="text-[10px] text-slate-300">|</span>
      </div>
    </div>
    <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-end">
      <div className="text-[10px] font-bold text-slate-400">
        <p>{sub}</p>
        <p className="text-orange-500">{loc}</p>
      </div>
    </div>
  </div>
);

export default FarmerHome;
