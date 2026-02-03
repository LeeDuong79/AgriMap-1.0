
import React, { useState, useMemo } from 'react';
import { FarmProduct, ProductStatus, AdminUser, AdminLevel, AuditLog, CertType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  CheckCircle2, XCircle, Clock, TrendingUp, Users, Sprout, 
  ShieldAlert, ClipboardCheck, History, BarChart3, 
  Map as MapIcon, ChevronRight, Search, Filter, AlertTriangle, UserCheck,
  Award, FileText, Image as ImageIcon, Download, FileSpreadsheet, MapPin,
  Layers, Activity, ShieldCheck
} from 'lucide-react';

interface AdminDashboardProps {
  products: FarmProduct[];
  onUpdateStatus: (id: string, status: ProductStatus, note?: string) => void;
  admin: AdminUser;
}

const MOCK_LOGS: AuditLog[] = [
  {
    id: 'l1',
    timestamp: '2024-03-20 14:30:22',
    adminName: 'Nguyễn Văn Quản Lý',
    adminId: 'GOV-889',
    action: 'Duyệt hồ sơ',
    targetId: '1',
    targetName: 'Bưởi Da Xanh Bến Tre',
    details: 'Hồ sơ đầy đủ, chứng chỉ VietGAP còn hiệu lực.'
  },
  {
    id: 'l2',
    timestamp: '2024-03-20 10:15:45',
    adminName: 'Trần Thị Kiểm Duyệt',
    adminId: 'GOV-123',
    action: 'Từ chối',
    targetId: '2',
    targetName: 'Sầu riêng Ri6 Vĩnh Long',
    details: 'Chứng chỉ GlobalGAP đã hết hạn, yêu cầu cập nhật.'
  }
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onUpdateStatus, admin }) => {
  const [activeTab, setActiveTab] = useState<'verification' | 'analytics' | 'logs'>('verification');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'farmers' | 'certs' | 'reports'>('farmers');
  const [selectedProduct, setSelectedProduct] = useState<FarmProduct | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [verificationNote, setVerificationNote] = useState('');
  const [showFullImage, setShowFullImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [reportFilter, setReportFilter] = useState({
    province: 'Tất cả',
    category: 'Tất cả',
    standard: 'Tất cả',
    time: 'Năm 2024'
  });

  const stats = useMemo(() => ({
    totalProducts: products.length,
    totalArea: products.reduce((acc, p) => acc + (p.area || 0), 0).toFixed(1),
    approvedCount: products.filter(p => p.status === ProductStatus.APPROVED).length,
    pendingCount: products.filter(p => p.status === ProductStatus.PENDING).length,
    totalYield: products.reduce((acc, p) => acc + (p.expectedYield || 0), 0),
    totalCerts: products.reduce((acc, p) => acc + p.certificates.length, 0),
  }), [products]);

  const categoryData = useMemo(() => {
    const categories = Array.from(new Set(products.map(p => p.category)));
    return categories.map(cat => ({
      name: cat,
      value: products.filter(p => p.category === cat).length,
      area: products.filter(p => p.category === cat).reduce((acc, p) => acc + p.area, 0)
    }));
  }, [products]);

  const COLORS = ['#000000', '#15803d', '#16a34a', '#333333', '#4ade80'];

  const handleAction = (status: ProductStatus) => {
    if (!selectedProduct) return;
    const note = status === ProductStatus.REJECTED ? rejectionReason : verificationNote;
    onUpdateStatus(selectedProduct.id, status, note);
    setSelectedProduct(null);
    setRejectionReason('');
    setVerificationNote('');
  };

  const filteredFarmers = products.filter(p => 
    p.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.regionCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 bg-slate-50 min-h-screen font-sans">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-black pb-6 bg-white p-8 rounded-t-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-black text-white p-2 rounded-lg">
              <ShieldAlert size={24} />
            </div>
            <h2 className="text-sm font-black text-black uppercase tracking-widest">Hệ thống quản lý Nhà nước về Nông nghiệp</h2>
          </div>
          <h1 className="text-4xl font-black text-black tracking-tight uppercase">TRUNG TÂM ĐIỀU HÀNH SỐ</h1>
          <p className="text-lg text-slate-800 font-bold mt-1 uppercase">Cơ quan: {admin.unit} | {admin.level} - {admin.assignedArea}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-md border-2 border-black flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-slate-500 uppercase">Cán bộ đang trực</p>
              <p className="text-lg font-black text-black leading-none">{admin.fullName}</p>
            </div>
            <UserCheck className="text-green-700" size={32} />
          </div>
        </div>
      </header>

      <div className="flex bg-white p-2 rounded-2xl shadow-sm border-2 border-slate-300 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('verification')}
          className={`flex-1 py-4 px-6 rounded-xl text-lg font-black flex items-center justify-center gap-3 transition-all whitespace-nowrap ${activeTab === 'verification' ? 'bg-black text-white shadow-xl' : 'text-black hover:bg-slate-100'}`}
        >
          <ClipboardCheck size={24} /> DUYỆT HỒ SƠ ({stats.pendingCount})
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-4 px-6 rounded-xl text-lg font-black flex items-center justify-center gap-3 transition-all whitespace-nowrap ${activeTab === 'analytics' ? 'bg-black text-white shadow-xl' : 'text-black hover:bg-slate-100'}`}
        >
          <BarChart3 size={24} /> QUẢN LÝ DỮ LIỆU
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-4 px-6 rounded-xl text-lg font-black flex items-center justify-center gap-3 transition-all whitespace-nowrap ${activeTab === 'logs' ? 'bg-black text-white shadow-xl' : 'text-black hover:bg-slate-100'}`}
        >
          <History size={24} /> NHẬT KÝ HỆ THỐNG
        </button>
      </div>

      {activeTab === 'verification' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-4 space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-white p-4 rounded-2xl border-2 border-slate-300 mb-4 sticky top-0 z-10 shadow-sm">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={20} />
                <input 
                  placeholder="Mã PUC hoặc tên nhà vườn..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl outline-none border-2 border-transparent focus:border-black text-black font-bold" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {products.filter(p => p.status === ProductStatus.PENDING).map(p => (
              <button 
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className={`w-full p-6 bg-white rounded-2xl border-2 transition-all text-left flex items-center justify-between group ${selectedProduct?.id === p.id ? 'border-black shadow-lg translate-x-2' : 'border-slate-200 hover:border-slate-400'}`}
              >
                <div>
                  <h4 className="text-lg font-black text-black mb-1 group-hover:text-green-800">{p.name}</h4>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">{p.farmerName}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] px-2 py-1 bg-slate-200 text-black rounded font-black uppercase">{p.category}</span>
                    <span className="text-[10px] px-2 py-1 bg-green-100 text-green-900 rounded font-black uppercase">{p.certificates[0]?.type || 'N/A'}</span>
                  </div>
                </div>
                <ChevronRight className="text-slate-400 group-hover:text-black transition-colors" />
              </button>
            ))}
          </div>

          <div className="lg:col-span-8">
            {selectedProduct ? (
              <div className="bg-white rounded-[2.5rem] border-2 border-black shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="bg-black text-white p-8 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">HỒ SƠ MÃ SỐ: {selectedProduct.id}</h3>
                    <p className="text-slate-400 text-sm font-bold uppercase mt-1">Gửi lúc: {new Date(selectedProduct.updatedAt).toLocaleString('vi-VN')}</p>
                  </div>
                  <div className="bg-orange-500 px-6 py-2 rounded-full text-sm font-black text-black shadow-lg animate-pulse uppercase">CHỜ XÁC MINH</div>
                </div>
                <div className="p-10 space-y-12 overflow-y-auto max-h-[600px] custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <section>
                        <h4 className="text-sm font-black text-slate-500 uppercase mb-4 flex items-center gap-2 tracking-widest">
                          <Sprout size={18} className="text-green-700" /> 1. THÔNG TIN SẢN XUẤT
                        </h4>
                        <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-200 space-y-5">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Tên nông sản / Vùng trồng</p>
                            <p className="text-xl font-black text-black">{selectedProduct.name}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase">Diện tích</p>
                              <p className="text-lg font-black text-black">{selectedProduct.area} ha</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase">Sản lượng dự kiến</p>
                              <p className="text-lg font-black text-black">{selectedProduct.expectedYield} tấn</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase italic">Mã số vùng trồng đăng ký (PUC)</p>
                            <p className="text-2xl font-black text-green-800 font-mono border-b-2 border-green-200 pb-2">{selectedProduct.regionCode}</p>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h4 className="text-sm font-black text-slate-500 uppercase mb-4 flex items-center gap-2 tracking-widest">
                          <MapIcon size={18} className="text-blue-700" /> 2. TỌA ĐỘ VỆ TINH (GPS)
                        </h4>
                        <div className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-200 aspect-video flex flex-col items-center justify-center text-center relative overflow-hidden group">
                           <img 
                            src={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/pin-s-l+ff0000(${selectedProduct.location.lng},${selectedProduct.location.lat})/${selectedProduct.location.lng},${selectedProduct.location.lat},16,0/600x400?access_token=mock`} 
                            className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all"
                            alt="Satellite View"
                           />
                          <div className="relative z-10">
                            <MapIcon size={32} className="mx-auto mb-2 text-black" />
                            <p className="text-sm font-black text-black uppercase tracking-widest">ĐỐI CHIẾU THỰC ĐỊA</p>
                            <p className="text-[11px] font-bold text-slate-800 bg-white/80 px-2 py-1 rounded mt-2">{selectedProduct.location.lat}, {selectedProduct.location.lng}</p>
                            <button className="mt-4 text-xs font-black text-blue-700 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all uppercase">Mở Bản đồ VN2000</button>
                          </div>
                        </div>
                      </section>
                    </div>

                    <div className="space-y-8">
                      <section>
                        <h4 className="text-sm font-black text-slate-500 uppercase mb-4 flex items-center gap-2 tracking-widest">
                          <ImageIcon size={18} className="text-orange-600" /> 3. CHỨNG CHỈ & MINH CHỨNG
                        </h4>
                        <div className="space-y-4">
                          {selectedProduct.certificates.length > 0 ? selectedProduct.certificates.map((c, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border-2 border-slate-200 flex items-center justify-between hover:border-black transition-all shadow-sm">
                              <div className="flex items-center gap-4">
                                <div className="bg-green-100 p-2.5 rounded-xl text-green-800">
                                  <Award size={24} />
                                </div>
                                <div>
                                  <p className="text-lg font-black text-black leading-tight">{c.type}</p>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase">Hết hạn: {c.expiryDate}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setShowFullImage(c.proofUrl)}
                                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg hover:bg-black transition-all shadow-md"
                              >
                                XEM GIẤY TỜ
                              </button>
                            </div>
                          )) : (
                            <div className="bg-slate-100 p-8 rounded-2xl border-2 border-dashed border-slate-300 text-center">
                              <FileText size={32} className="mx-auto text-slate-400 mb-2" />
                              <p className="text-sm font-bold text-slate-500">Chưa tải lên chứng chỉ.</p>
                            </div>
                          )}
                        </div>
                      </section>

                      <section className="bg-yellow-50 p-8 rounded-[2rem] border-2 border-yellow-200 shadow-inner">
                        <h4 className="text-sm font-black text-yellow-900 uppercase mb-6 flex items-center gap-2">
                          <ClipboardCheck size={20} /> QUYẾT ĐỊNH CỦA CÁN BỘ
                        </h4>
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="block text-xs font-black text-black uppercase tracking-tighter">Ghi chú hậu kiểm (Log lưu vết)</label>
                            <textarea 
                              className="w-full p-4 border-2 border-slate-400 rounded-2xl outline-none focus:border-black text-black font-bold text-sm bg-white" 
                              placeholder="Nhập kết quả kiểm tra thực tế..."
                              rows={3}
                              value={verificationNote}
                              onChange={e => setVerificationNote(e.target.value)}
                            />
                          </div>
                          
                          <div className="flex gap-4">
                            <button 
                              onClick={() => handleAction(ProductStatus.APPROVED)}
                              className="flex-1 bg-green-700 hover:bg-green-800 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1 transition-all border-b-4 border-green-900"
                            >
                              <CheckCircle2 size={24} /> DUYỆT CẤP MÃ
                            </button>
                            <button 
                              onClick={() => handleAction(ProductStatus.REJECTED)}
                              className="flex-1 bg-red-700 hover:bg-red-800 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1 transition-all border-b-4 border-red-900"
                            >
                              <XCircle size={24} /> TỪ CHỐI
                            </button>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[600px] border-4 border-dashed border-slate-300 rounded-[4rem] flex flex-col items-center justify-center text-slate-400 p-12 text-center bg-white/50">
                <ShieldAlert size={80} className="mb-6 opacity-10" />
                <h3 className="text-2xl font-black text-slate-500 uppercase tracking-widest">TRUNG TÂM XỬ LÝ HỒ SƠ</h3>
                <p className="text-lg font-bold max-w-sm mt-4 text-slate-400 leading-relaxed italic uppercase">Chọn hồ sơ từ danh sách bên trái để đối soát dữ liệu và cấp mã vùng trồng (PUC).</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-[2rem] border-2 border-black shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 text-slate-500 mb-2">
                   <Users size={20} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Tổng số Nhà vườn</span>
                </div>
                <p className="text-3xl font-black text-black">{stats.totalProducts}</p>
                <div className="mt-3 text-[10px] font-bold text-green-700 uppercase flex items-center gap-1">
                   <Activity size={12} /> Cập nhật trực tuyến
                </div>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border-2 border-black shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 text-slate-500 mb-2">
                   <Layers size={20} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Tổng diện tích (HA)</span>
                </div>
                <p className="text-3xl font-black text-black">{stats.totalArea}</p>
                <div className="mt-3 text-[10px] font-bold text-blue-700 uppercase flex items-center gap-1">
                   <MapIcon size={12} /> Đã ghim tọa độ
                </div>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border-2 border-black shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 text-slate-500 mb-2">
                   <Award size={20} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Chứng nhận số</span>
                </div>
                <p className="text-3xl font-black text-black">{stats.totalCerts}</p>
                <div className="mt-3 text-[10px] font-bold text-orange-700 uppercase flex items-center gap-1">
                   <ShieldCheck size={12} /> Hợp chuẩn VietGAP/OCOP
                </div>
             </div>
             <div className="bg-black text-white p-6 rounded-[2rem] shadow-xl flex flex-col justify-between border-2 border-black">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                   <TrendingUp size={20} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Sản lượng kỳ vọng</span>
                </div>
                <p className="text-3xl font-black">{stats.totalYield} <span className="text-lg">TẤN</span></p>
                <div className="mt-3 text-[10px] font-bold text-green-400 uppercase">Tiềm năng xuất khẩu</div>
             </div>
          </div>

          <div className="flex gap-4 border-b-2 border-slate-200 pb-4 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setAnalyticsSubTab('farmers')}
              className={`px-8 py-3 rounded-2xl font-black uppercase text-sm flex items-center gap-2 transition-all shrink-0 ${analyticsSubTab === 'farmers' ? 'bg-black text-white shadow-lg' : 'bg-white text-slate-500 border-2 border-slate-200'}`}
            >
              <Users size={20} /> 1. QUẢN LÝ NHÀ VƯỜN
            </button>
            <button 
              onClick={() => setAnalyticsSubTab('certs')}
              className={`px-8 py-3 rounded-2xl font-black uppercase text-sm flex items-center gap-2 transition-all shrink-0 ${analyticsSubTab === 'certs' ? 'bg-black text-white shadow-xl' : 'bg-white text-slate-500 border-2 border-slate-200'}`}
            >
              <Award size={20} /> 2. QUẢN LÝ CHỨNG NHẬN
            </button>
            <button 
              onClick={() => setAnalyticsSubTab('reports')}
              className={`px-8 py-3 rounded-2xl font-black uppercase text-sm flex items-center gap-2 transition-all shrink-0 ${analyticsSubTab === 'reports' ? 'bg-black text-white shadow-xl' : 'bg-white text-slate-500 border-2 border-slate-200'}`}
            >
              <TrendingUp size={20} /> 3. BÁO CÁO & THỐNG KÊ
            </button>
          </div>

          {analyticsSubTab === 'farmers' && (
            <div className="bg-white rounded-[2.5rem] border-2 border-black shadow-xl overflow-hidden">
              <div className="p-8 bg-slate-50 flex items-center justify-between border-b-2 border-slate-200">
                <h3 className="text-xl font-black text-black uppercase tracking-widest">DANH SÁCH NHÀ VƯỜN HỆ THỐNG</h3>
                <div className="flex gap-4">
                   <div className="relative">
                      <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                      <input 
                        className="pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl font-bold outline-none focus:border-black w-64" 
                        placeholder="Tìm tên nhà vườn/mã PUC..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                   </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-200">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 min-w-[200px]">Nhà vườn & Sản phẩm</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Mã PUC Hệ thống</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Địa phương</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Diện tích</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Ngày xử lý</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFarmers.map((p) => (
                      <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                        <td className="px-8 py-6">
                           <p className="text-lg font-black text-black uppercase leading-none">{p.farmerName}</p>
                           <p className="text-[10px] font-bold text-green-700 mt-1 uppercase">Vùng trồng: {p.name}</p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex">
                             <span className="font-mono text-xs font-black bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 whitespace-nowrap inline-block text-black shadow-sm">
                               {p.regionCode}
                             </span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                              <MapPin size={14} className="text-red-600" /> {p.location.address}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <p className="text-lg font-black text-black">{p.area} <span className="text-[10px] text-slate-400">HA</span></p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                             <div className={`w-2.5 h-2.5 rounded-full ${
                               p.status === ProductStatus.APPROVED ? 'bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.5)]' : 
                               p.status === ProductStatus.PENDING ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-red-600'
                             }`} />
                             <span className="text-xs font-black text-black uppercase tracking-tighter whitespace-nowrap">{p.status}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <p className="text-sm font-bold text-slate-500 italic whitespace-nowrap">{p.verifiedAt ? new Date(p.verifiedAt).toLocaleDateString('vi-VN') : '---'}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {analyticsSubTab === 'certs' && (
            <div className="space-y-6">
              <div className="bg-orange-50 border-4 border-orange-200 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                 <div className="bg-orange-200 p-4 rounded-3xl">
                    <AlertTriangle size={32} className="text-orange-800" />
                 </div>
                 <div className="flex-1">
                    <h4 className="text-xl font-black text-orange-950 uppercase tracking-tighter">HỆ THỐNG QUẢN TRỊ CHỨNG NHẬN ĐIỆN TỬ</h4>
                    <p className="text-orange-900 font-bold italic">Dữ liệu chứng nhận được trích xuất trực tiếp từ hồ sơ đăng ký của nông dân. Hệ thống sẽ tự động hạ gỡ mã PUC trên bản đồ nếu chứng nhận quá hạn.</p>
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border-2 border-black shadow-xl overflow-hidden">
                 <div className="p-8 bg-black flex items-center justify-between">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">DANH SÁCH CHỨNG NHẬN SỐ</h3>
                    <div className="bg-green-600 px-4 py-2 rounded-xl text-[10px] font-black text-white animate-pulse">LIVE UPDATE</div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-slate-100 border-b-2 border-slate-200">
                             <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Nhà vườn & Mã PUC</th>
                             <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Loại chứng nhận</th>
                             <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Ngày cấp</th>
                             <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Hạn định kỳ</th>
                             <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Minh chứng</th>
                          </tr>
                       </thead>
                       <tbody>
                          {products.flatMap(p => p.certificates.map(c => ({...c, farmName: p.farmerName, regionCode: p.regionCode}))).map((item, idx) => (
                             <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                                <td className="px-8 py-6">
                                   <p className="text-sm font-black text-black uppercase">{item.farmName}</p>
                                   <p className="text-[10px] font-bold text-slate-400 font-mono">{item.regionCode}</p>
                                </td>
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-2">
                                      <Award size={16} className="text-orange-600" />
                                      <span className="text-sm font-black text-black uppercase tracking-tighter">{item.type}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <p className="text-sm font-bold text-slate-500">{new Date(item.issueDate).toLocaleDateString('vi-VN')}</p>
                                </td>
                                <td className="px-8 py-6">
                                   <p className={`text-sm font-black ${new Date(item.expiryDate) < new Date() ? 'text-red-600' : 'text-green-700'}`}>
                                      {new Date(item.expiryDate).toLocaleDateString('vi-VN')}
                                   </p>
                                </td>
                                <td className="px-8 py-6 text-right">
                                   <button 
                                      onClick={() => setShowFullImage(item.proofUrl)}
                                      className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg hover:bg-black"
                                   >
                                      Xác thực File
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            </div>
          )}

          {analyticsSubTab === 'reports' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-black p-10 rounded-[2.5rem] border-4 border-black shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-3">
                     <label className="text-[11px] font-black uppercase tracking-widest text-white/60">Theo tỉnh thành</label>
                     <select className="w-full p-4 bg-white/10 text-white rounded-2xl font-bold border-2 border-white/20 focus:border-white outline-none appearance-none transition-all" value={reportFilter.province} onChange={e => setReportFilter({...reportFilter, province: e.target.value})}>
                        <option className="bg-black text-white">Tất cả</option>
                        <option className="bg-black text-white">Bến Tre</option>
                        <option className="bg-black text-white">Vĩnh Long</option>
                        <option className="bg-black text-white">Tiền Giang</option>
                     </select>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[11px] font-black uppercase tracking-widest text-white/60">Theo nông sản</label>
                     <select className="w-full p-4 bg-white/10 text-white rounded-2xl font-bold border-2 border-white/20 focus:border-white outline-none appearance-none transition-all" value={reportFilter.category} onChange={e => setReportFilter({...reportFilter, category: e.target.value})}>
                        <option className="bg-black text-white">Tất cả</option>
                        <option className="bg-black text-white">Trái cây</option>
                        <option className="bg-black text-white">Lúa gạo</option>
                        <option className="bg-black text-white">Thủy sản</option>
                     </select>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[11px] font-black uppercase tracking-widest text-white/60">Theo tiêu chuẩn</label>
                     <select className="w-full p-4 bg-white/10 text-white rounded-2xl font-bold border-2 border-white/20 focus:border-white outline-none appearance-none transition-all" value={reportFilter.standard} onChange={e => setReportFilter({...reportFilter, standard: e.target.value})}>
                        <option className="bg-black text-white">Tất cả</option>
                        <option className="bg-black text-white">VietGAP</option>
                        <option className="bg-black text-white">OCOP</option>
                        <option className="bg-black text-white">Hữu cơ</option>
                     </select>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[11px] font-black uppercase tracking-widest text-white/60">Thời gian</label>
                     <select className="w-full p-4 bg-white/10 text-white rounded-2xl font-bold border-2 border-white/20 focus:border-white outline-none appearance-none transition-all" value={reportFilter.time} onChange={e => setReportFilter({...reportFilter, time: e.target.value})}>
                        <option className="bg-black text-white">Năm 2024</option>
                        <option className="bg-black text-white">Quý 1/2024</option>
                        <option className="bg-black text-white">Tháng 3/2024</option>
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-white p-10 rounded-[3.5rem] border-2 border-black shadow-xl">
                     <div className="flex items-center justify-between mb-8 border-b-2 border-slate-100 pb-4">
                        <h3 className="text-xl font-black text-black uppercase tracking-tighter italic">DIỆN TÍCH THEO NGÀNH HÀNG (HA)</h3>
                        <div className="flex gap-2">
                           <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all text-slate-600 shadow-sm"><Download size={20} /></button>
                        </div>
                     </div>
                     <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={categoryData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#000000', fontWeight: 'bold'}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#000000', fontWeight: 'bold'}} />
                              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '16px', border: '2px solid black', fontWeight: 'bold' }} />
                              <Bar dataKey="area" radius={[8, 8, 0, 0]}>
                                 {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                              </Bar>
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="bg-black text-white p-10 rounded-[3.5rem] shadow-2xl flex flex-col justify-between">
                     <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">KẾT XUẤT DỮ LIỆU</h3>
                        <p className="text-slate-400 font-bold mb-10 leading-relaxed uppercase tracking-widest text-xs">Toàn bộ dữ liệu vùng trồng từ nông hộ liên kết sẽ được kết xuất theo định dạng chuẩn của Bộ Nông nghiệp để phục vụ báo cáo định kỳ.</p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <button className="bg-white text-black p-6 rounded-3xl font-black flex flex-col items-center gap-4 hover:bg-slate-100 transition-all shadow-xl group">
                           <div className="p-4 bg-red-100 text-red-700 rounded-2xl group-hover:scale-110 transition-transform shadow-md">
                              <FileText size={32} />
                           </div>
                           <span className="uppercase text-sm">XUẤT PDF</span>
                        </button>
                        <button className="bg-green-600 text-white p-6 rounded-3xl font-black flex flex-col items-center gap-4 hover:bg-green-700 transition-all shadow-xl group">
                           <div className="p-4 bg-white/20 text-white rounded-2xl group-hover:scale-110 transition-transform shadow-md">
                              <FileSpreadsheet size={32} />
                           </div>
                           <span className="uppercase text-sm">XUẤT EXCEL</span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {showFullImage && (
        <div className="fixed inset-0 z-[5000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <button 
            onClick={() => setShowFullImage(null)}
            className="absolute top-8 right-8 text-white hover:text-red-500 transition-colors"
          >
            <XCircle size={48} />
          </button>
          <div className="max-w-4xl w-full bg-white p-4 rounded-3xl shadow-2xl animate-in zoom-in-90 border-4 border-black">
             <div className="flex items-center justify-between mb-4 border-b-2 border-slate-100 pb-2">
                <h4 className="text-xl font-black text-black uppercase">MINH CHỨNG CHỨNG CHỈ NÔNG NGHIỆP SỐ</h4>
                <span className="text-xs font-bold text-slate-500 italic uppercase">Log: AgroMap Gov Auth v2.5</span>
             </div>
             <img src={showFullImage} className="w-full h-auto max-h-[70vh] object-contain rounded-xl border-2 border-slate-100" alt="Full Cert" />
             <div className="mt-6 flex justify-end gap-4">
                <button onClick={() => setShowFullImage(null)} className="px-8 py-3 bg-black text-white font-black rounded-xl uppercase tracking-tighter shadow-lg">Đóng lại</button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-[3rem] border-2 border-black shadow-xl overflow-hidden animate-in fade-in duration-500">
          <div className="bg-black p-8 flex justify-between items-center">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">NHẬT KÝ HOẠT ĐỘNG (AUDIT LOG)</h3>
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl text-sm font-black border border-white/30 flex items-center gap-2 transition-all shadow-sm">
              <Filter size={18} /> TRUY XUẤT NÂNG CAO
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  <th className="px-8 py-6 text-sm font-black text-black uppercase tracking-widest">Thời điểm</th>
                  <th className="px-8 py-6 text-sm font-black text-black uppercase tracking-widest">Cán bộ thực hiện</th>
                  <th className="px-8 py-6 text-sm font-black text-black uppercase tracking-widest">Loại hành động</th>
                  <th className="px-8 py-6 text-sm font-black text-black uppercase tracking-widest">Đối tượng tác động</th>
                  <th className="px-8 py-6 text-sm font-black text-black uppercase tracking-widest">Chi tiết Log</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LOGS.map((log, idx) => (
                  <tr key={log.id} className={`border-b border-slate-200 hover:bg-slate-50 transition-all ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="px-8 py-6 text-sm font-bold text-black font-mono">{log.timestamp}</td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-black">{log.adminName}</p>
                      <p className="text-[10px] font-bold text-slate-500">{log.adminId}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase ${log.action === 'Duyệt hồ sơ' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-black">{log.targetName}</p>
                      <p className="text-[10px] font-bold text-slate-500">ID: {log.targetId}</p>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-800 italic leading-relaxed">"{log.details}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
