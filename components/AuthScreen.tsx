
import React, { useState, useEffect, useRef } from 'react';
import { UserRole, AdminLevel, User, FarmerUser, AdminUser } from '../types';
import { 
  ShieldCheck, User as UserIcon, MapPin, Phone, Lock, 
  Mail, Landmark, CheckCircle2, ChevronRight, Fingerprint,
  Building2, Camera, MapIcon, KeyRound, ArrowLeft
} from 'lucide-react';
import L from 'leaflet';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'CHOICE' | 'AUTH' | 'OTP'>('CHOICE');
  const [activeBranch, setActiveBranch] = useState<UserRole.FARMER | UserRole.ADMIN | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  
  // Farmer State
  const [farmerData, setFarmerData] = useState({
    farmName: '',
    rep: '',
    cccd: '',
    phone: '',
    province: 'Bến Tre',
    district: '',
    commune: '',
    location: null as { lat: number, lng: number } | null
  });

  // Admin State
  const [adminData, setAdminData] = useState({
    email: '',
    password: '',
    otp: ''
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize Map for Farmer Location Pinning
  useEffect(() => {
    if (isRegister && activeBranch === UserRole.FARMER && mapContainerRef.current && !mapRef.current) {
      setTimeout(() => {
        if (!mapContainerRef.current) return;
        mapRef.current = L.map(mapContainerRef.current).setView([10.2435, 106.3756], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
        
        mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          setFarmerData(prev => ({ ...prev, location: { lat, lng } }));
          if (markerRef.current) {
            markerRef.current.setLatLng(e.latlng);
          } else {
            markerRef.current = L.marker(e.latlng).addTo(mapRef.current!);
          }
        });
      }, 100);
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isRegister, activeBranch]);

  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerData.location) return;
    const user: FarmerUser = {
      id: 'F-' + Date.now(),
      role: UserRole.FARMER,
      farmName: farmerData.farmName,
      representative: farmerData.rep,
      cccd: farmerData.cccd,
      phone: farmerData.phone,
      address: { province: farmerData.province, district: farmerData.district, commune: farmerData.commune, detail: '' },
      location: farmerData.location
    };
    onLogin(user);
  };

  const handleAdminLogin = () => {
    if (step === 'AUTH') {
      setStep('OTP');
    } else {
      const user: AdminUser = {
        id: 'A-01',
        role: UserRole.ADMIN,
        fullName: 'Nguyễn Văn Quản Lý',
        adminId: 'GOV-889',
        position: 'Cán bộ điều hành cấp cao',
        unit: 'Bộ Nông nghiệp',
        level: AdminLevel.CENTRAL,
        assignedArea: 'Toàn quốc',
        username: 'admin.gov',
        email: 'admin@mard.gov.vn',
        phone: '0912345678',
        status: 'ACTIVE'
      };
      onLogin(user);
    }
  };

  if (step === 'CHOICE') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="mb-12 text-center">
          <div className="bg-black text-white p-4 rounded-3xl w-fit mx-auto mb-6 shadow-2xl">
            <Landmark size={48} />
          </div>
          <h1 className="text-5xl font-black text-black tracking-tighter uppercase mb-2">AgroMap VN</h1>
          <p className="text-xl font-bold text-slate-600 uppercase tracking-widest">Hệ thống số hóa Nông nghiệp Quốc gia</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Farmer Choice */}
          <button 
            onClick={() => { setActiveBranch(UserRole.FARMER); setStep('AUTH'); }}
            className="group relative bg-white border-4 border-black p-10 rounded-[3rem] hover:bg-green-50 transition-all text-left shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            <div className="bg-green-700 text-white p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <UserIcon size={40} />
            </div>
            <h3 className="text-3xl font-black text-black mb-4 uppercase">Tôi là Nông dân</h3>
            <p className="text-lg font-bold text-slate-700 leading-relaxed mb-6">Đăng ký vùng trồng, cập nhật sản lượng và kết nối thị trường tiêu thụ.</p>
            <div className="flex items-center gap-2 font-black text-black group-hover:gap-4 transition-all">
              TRUY CẬP HỆ THỐNG <ChevronRight />
            </div>
          </button>

          {/* Admin Choice */}
          <button 
            onClick={() => { setActiveBranch(UserRole.ADMIN); setStep('AUTH'); }}
            className="group relative bg-white border-4 border-black p-10 rounded-[3rem] hover:bg-slate-50 transition-all text-left shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            <div className="bg-black text-white p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={40} />
            </div>
            <h3 className="text-3xl font-black text-black mb-4 uppercase">Cán bộ Nhà nước</h3>
            <p className="text-lg font-bold text-slate-700 leading-relaxed mb-6">Quản lý thực địa, phê duyệt mã số vùng trồng và điều hành dữ liệu số.</p>
            <div className="flex items-center gap-2 font-black text-black group-hover:gap-4 transition-all">
              CỔNG ĐIỀU HÀNH <ChevronRight />
            </div>
          </button>
        </div>

        <p className="mt-16 text-sm font-black text-slate-400 uppercase tracking-widest">Bản quyền © 2024 Bộ Nông nghiệp và Phát triển Nông thôn</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-black flex flex-col md:flex-row">
        
        {/* Sidebar Status */}
        <div className={`md:w-1/3 p-12 text-white flex flex-col justify-between ${activeBranch === UserRole.FARMER ? 'bg-green-800' : 'bg-black'}`}>
          <div>
            <button onClick={() => setStep('CHOICE')} className="flex items-center gap-2 text-white/80 hover:text-white font-black mb-10 transition-all">
              <ArrowLeft size={20} /> QUAY LẠI
            </button>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              {activeBranch === UserRole.FARMER ? <UserIcon size={32} /> : <ShieldCheck size={32} />}
            </div>
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tighter">
              {activeBranch === UserRole.FARMER ? 'Khu vực Nông dân' : 'Cổng Công vụ'}
            </h2>
            <p className="text-lg font-bold text-white/70 leading-relaxed">
              {activeBranch === UserRole.FARMER 
                ? "Bắt đầu số hóa sản xuất để nhận các hỗ trợ từ Chính phủ."
                : "Vui lòng sử dụng tài khoản .gov.vn được cấp để đăng nhập."}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/20">
             <Fingerprint size={24} />
             <span className="text-xs font-black uppercase tracking-widest">Dữ liệu được mã hóa SSL/TLS 1.3</span>
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 p-12 overflow-y-auto max-h-[90vh] custom-scrollbar">
          {activeBranch === UserRole.FARMER ? (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black text-black tracking-tighter uppercase">{isRegister ? 'Đăng ký Nông hộ' : 'Đăng nhập'}</h2>
                <button onClick={() => setIsRegister(!isRegister)} className="text-green-800 font-black border-b-2 border-green-800 uppercase text-sm">
                  {isRegister ? 'Đã có tài khoản?' : 'Tạo tài khoản mới'}
                </button>
              </div>

              {isRegister ? (
                <form onSubmit={handleFarmerSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-black uppercase">Tên nhà vườn / HTX *</label>
                      <input required className="w-full bg-slate-50 border-2 border-slate-300 p-4 rounded-2xl font-bold focus:border-black outline-none" placeholder="HTX Bến Tre..." value={farmerData.farmName} onChange={e => setFarmerData({...farmerData, farmName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-black uppercase">Người đại diện *</label>
                      <input required className="w-full bg-slate-50 border-2 border-slate-300 p-4 rounded-2xl font-bold focus:border-black outline-none" placeholder="Nguyễn Văn A" value={farmerData.rep} onChange={e => setFarmerData({...farmerData, rep: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-black uppercase">Số điện thoại *</label>
                      <input required className="w-full bg-slate-50 border-2 border-slate-300 p-4 rounded-2xl font-bold focus:border-black outline-none" placeholder="09xxx..." value={farmerData.phone} onChange={e => setFarmerData({...farmerData, phone: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-black uppercase">Số CCCD (Bảo mật) *</label>
                      <input required type="password" placeholder="••••••••••••" className="w-full bg-slate-50 border-2 border-slate-300 p-4 rounded-2xl font-bold focus:border-black outline-none" value={farmerData.cccd} onChange={e => setFarmerData({...farmerData, cccd: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-black text-black uppercase flex items-center gap-2">
                      <MapPin size={18} className="text-red-700" /> Ghim tọa độ vườn (Bắt buộc) *
                    </label>
                    <div ref={mapContainerRef} className="h-48 w-full rounded-2xl border-4 border-black bg-slate-100 overflow-hidden relative shadow-inner">
                      {!farmerData.location && (
                        <div className="absolute inset-0 z-[1000] bg-black/60 flex flex-col items-center justify-center text-white p-6 text-center">
                          <MapPin className="animate-bounce mb-3" size={32} />
                          <span className="text-lg font-black leading-tight uppercase">Nhấn lên bản đồ để xác định vị trí vườn</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    disabled={!farmerData.location}
                    className={`w-full py-5 rounded-2xl text-white font-black text-xl flex items-center justify-center gap-3 transition-all ${farmerData.location ? 'bg-green-700 hover:bg-green-800 shadow-xl' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                  >
                    XÁC NHẬN ĐĂNG KÝ <CheckCircle2 size={24} />
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-black uppercase">Số điện thoại / Tên đăng nhập</label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
                       <input className="w-full bg-slate-50 border-2 border-slate-300 p-4 pl-12 rounded-2xl font-bold focus:border-black outline-none" placeholder="Nhập số điện thoại..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-black uppercase">Mật khẩu</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
                       <input type="password" className="w-full bg-slate-50 border-2 border-slate-300 p-4 pl-12 rounded-2xl font-bold focus:border-black outline-none" placeholder="••••••••" />
                    </div>
                  </div>
                  <button onClick={() => onLogin({id: 'f1', role: UserRole.FARMER} as any)} className="w-full py-5 bg-green-700 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-green-800 transition-all">
                    ĐĂNG NHẬP NGAY
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-4xl font-black text-black tracking-tighter uppercase mb-10">
                {step === 'OTP' ? 'Xác thực OTP' : 'Đăng nhập Công vụ'}
              </h2>

              {step === 'OTP' ? (
                <div className="space-y-8">
                  <div className="bg-slate-100 p-6 rounded-2xl border-2 border-slate-200">
                    <p className="text-lg font-bold text-slate-800 leading-relaxed mb-4">Mã OTP đã được gửi về số điện thoại đuôi <span className="font-black text-black">***889</span> của Cán bộ.</p>
                    <div className="flex gap-3">
                      {[1,2,3,4,5,6].map(i => (
                        <input key={i} maxLength={1} className="w-full h-16 bg-white border-4 border-black rounded-xl text-center text-3xl font-black outline-none focus:bg-slate-50" />
                      ))}
                    </div>
                  </div>
                  <button onClick={handleAdminLogin} className="w-full py-5 bg-black text-white font-black text-xl rounded-2xl shadow-xl hover:bg-slate-900 transition-all">
                    XÁC NHẬN TRUY CẬP
                  </button>
                  <p className="text-center font-bold text-slate-500">Chưa nhận được mã? <button className="text-black font-black underline">Gửi lại sau 30s</button></p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-black uppercase">Email Công vụ (.gov.vn) *</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
                       <input className="w-full bg-slate-50 border-2 border-slate-300 p-4 pl-12 rounded-2xl font-bold focus:border-black outline-none" placeholder="admin@mard.gov.vn" value={adminData.email} onChange={e => setAdminData({...adminData, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-black uppercase">Mật khẩu *</label>
                    <div className="relative">
                       <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
                       <input type="password" className="w-full bg-slate-50 border-2 border-slate-300 p-4 pl-12 rounded-2xl font-bold focus:border-black outline-none" placeholder="••••••••" value={adminData.password} onChange={e => setAdminData({...adminData, password: e.target.value})} />
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 flex gap-4">
                     <ShieldCheck className="text-yellow-700 shrink-0" size={28} />
                     <p className="text-sm font-bold text-yellow-900 leading-tight">Hệ thống yêu cầu xác thực 2 lớp (2FA). Sau khi nhập mật khẩu, vui lòng kiểm tra thiết bị di động đã đăng ký.</p>
                  </div>
                  <button onClick={handleAdminLogin} className="w-full py-5 bg-black text-white font-black text-xl rounded-2xl shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
                    TIẾP TỤC <ChevronRight />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
