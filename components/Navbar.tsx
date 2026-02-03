
import React from 'react';
import { UserRole, User } from '../types';
import { Map, LayoutDashboard, User as UserIcon, Search, Sprout, LogOut, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onSearch: (query: string) => void;
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleChange, onSearch, user, onLogout }) => {
  return (
    <nav className="bg-white border-b-4 border-black px-8 py-6 flex items-center justify-between z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-black text-white p-3 rounded-2xl shadow-xl">
          <Sprout size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-black leading-none tracking-tighter uppercase">AgroMap VN</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Cơ sở dữ liệu Nông nghiệp Việt Nam</p>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-12 hidden lg:block">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black" size={24} />
          <input 
            type="text" 
            placeholder="Tìm kiếm vùng trồng, nông sản, mã PUC..."
            className="w-full bg-slate-100 border-2 border-slate-300 rounded-3xl py-4 pl-14 pr-6 outline-none focus:border-black focus:bg-white transition-all text-black font-bold text-lg"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            {user?.role === UserRole.ADMIN && <ShieldAlert size={18} className="text-red-700" />}
            <span className="text-xl font-black text-black leading-none">
              {user?.role === UserRole.FARMER ? (user as any).farmName : (user as any).fullName}
            </span>
          </div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">
            {user?.role === UserRole.FARMER ? 'Hệ thống Nông hộ' : `Công vụ - ${(user as any).assignedArea}`}
          </p>
        </div>

        <button 
          onClick={onLogout}
          className="group flex items-center gap-3 bg-white border-2 border-black px-6 py-3 rounded-2xl hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <LogOut size={24} className="text-black group-hover:text-white" />
          <span className="font-black text-black group-hover:text-white uppercase text-sm">Đăng xuất</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
