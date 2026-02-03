
import React, { useState } from 'react';
import { FarmerUser } from '../types';
import { User, Phone, Mail, Calendar, Users, LogOut, Save, ShieldCheck } from 'lucide-react';

interface FarmerProfileProps {
  user: FarmerUser;
  onLogout: () => void;
}

const FarmerProfile: React.FC<FarmerProfileProps> = ({ user, onLogout }) => {
  const [profileData, setProfileData] = useState({
    fullName: user.representative || '',
    email: `${user.id.toLowerCase()}@agromap.vn`,
    phone: user.phone || '',
    dob: '1990-01-01',
    gender: 'Nam'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert('Thông tin cá nhân đã được cập nhật thành công!');
  };

  return (
    <div className="p-6 pb-24 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center mt-6">
        <div className="relative inline-block">
          <div className="w-28 h-28 bg-black text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 shadow-2xl border-4 border-white">
            <User size={56} />
          </div>
          <div className="absolute bottom-4 right-0 bg-green-600 p-2 rounded-full border-2 border-white shadow-lg">
            <ShieldCheck size={16} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-black tracking-tighter uppercase mb-1">{user.farmName}</h1>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Mã số nông hộ: {user.id}</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border-4 border-black p-8 shadow-xl space-y-6">
        <div className="space-y-6">
          {/* Họ và Tên */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Họ và Tên
            </label>
            <input
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl font-bold text-black focus:border-black outline-none transition-all"
              placeholder="Nhập họ và tên..."
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Mail size={14} /> Email
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl font-bold text-black focus:border-black outline-none transition-all"
              placeholder="example@agromap.vn"
            />
          </div>

          {/* Số điện thoại */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Phone size={14} /> Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl font-bold text-black focus:border-black outline-none transition-all"
              placeholder="09xxx..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Ngày sinh */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Ngày sinh
              </label>
              <input
                type="date"
                name="dob"
                value={profileData.dob}
                onChange={handleChange}
                className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl font-bold text-black focus:border-black outline-none transition-all"
              />
            </div>

            {/* Giới tính */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Users size={14} /> Giới tính
              </label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleChange}
                className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl font-bold text-black focus:border-black outline-none transition-all appearance-none"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-green-700 text-white py-5 rounded-2xl font-black text-lg uppercase shadow-xl hover:bg-green-800 transition-all flex items-center justify-center gap-3 border-b-4 border-green-900 active:border-b-0 active:translate-y-1"
        >
          <Save size={24} /> LƯU THÔNG TIN
        </button>
      </div>

      <div className="space-y-4">
        <button
          onClick={onLogout}
          className="w-full bg-white border-4 border-black text-black py-5 rounded-2xl font-black text-lg uppercase flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          <LogOut size={24} className="text-red-600" /> ĐĂNG XUẤT
        </button>
        
        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Phiên bản ứng dụng v2.5.0 • AgroMap VN
        </p>
      </div>
    </div>
  );
};

export default FarmerProfile;
