
import React, { useState } from 'react';
import { FarmProduct, ProductStatus } from '../types';
import { 
  Sprout, CheckCircle2, Clock, MapPin, 
  ClipboardCheck, Search, ChevronDown, 
  UserCheck, Building2, HelpCircle, 
  ArrowRight, FileText, Calendar, AlertCircle
} from 'lucide-react';

interface FarmerDashboardProps {
  products: FarmProduct[];
  onViewPortal: () => void;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ products, onViewPortal }) => {
  const [expandedId, setExpandedId] = useState<string | null>(products[0]?.id || null);

  // Hàm xác định trạng thái chức năng của từng bước dựa trên dữ liệu thực tế
  const getStepData = (product: FarmProduct) => {
    const isApproved = product.status === ProductStatus.APPROVED;
    const isPending = product.status === ProductStatus.PENDING;
    const isRejected = product.status === ProductStatus.REJECTED;
    const hasNote = !!product.verificationNote;

    return [
      {
        id: 1,
        title: 'Bước 1: Chờ xác minh',
        description: 'Hồ sơ đã được gửi thành công. Hệ thống đang đợi Cán bộ Huyện tiếp nhận và đối soát chứng từ sơ bộ.',
        status: (isPending || isApproved || hasNote) ? 'COMPLETED' : 'CURRENT',
        officer: 'Bộ phận Tiếp nhận - Phòng Nông nghiệp',
        date: new Date(product.updatedAt).toLocaleDateString('vi-VN')
      },
      {
        id: 2,
        title: 'Bước 2: Đang xử lý',
        description: 'Cán bộ đang tiến hành xác minh thực địa hoặc kiểm tra tính pháp lý của các chứng chỉ (VietGAP/OCOP).',
        status: isApproved ? 'COMPLETED' : (isPending && hasNote ? 'CURRENT' : (isPending ? 'WAITING' : 'WAITING')),
        officer: 'Đoàn kiểm tra liên ngành / Cán bộ kỹ thuật',
        date: hasNote ? 'Đang thực hiện' : 'Chờ xử lý'
      },
      {
        id: 3,
        title: 'Bước 3: Hoàn tất',
        description: 'Chúc mừng! Hồ sơ đã được duyệt. Vùng trồng của bạn đã chính thức hiển thị công khai trên bản đồ nông sản toàn quốc.',
        status: isApproved ? 'COMPLETED' : 'WAITING',
        officer: 'Sở NN&PTNT / Cục Trồng trọt',
        date: isApproved ? (product.verifiedAt ? new Date(product.verifiedAt).toLocaleDateString('vi-VN') : 'Vừa xong') : '---'
      }
    ];
  };

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
      {/* Header Gov Style */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-8 border-black pb-8">
        <div>
          <h1 className="text-6xl font-black text-black tracking-tighter uppercase mb-2">QUẢN LÝ HỒ SƠ</h1>
          <div className="flex items-center gap-3">
            <span className="bg-black text-white px-3 py-1 rounded-lg text-xs font-black uppercase">Chức năng trực tuyến</span>
            <p className="text-xl font-bold text-slate-600">Theo dõi tiến trình phê duyệt mã số vùng trồng (PUC) theo thời gian thực.</p>
          </div>
        </div>
        <button 
          onClick={onViewPortal}
          className="bg-green-700 text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3 border-4 border-black"
        >
          <Sprout size={28} /> ĐĂNG KÝ MỚI
        </button>
      </div>

      {/* Interactive Record Board */}
      <div className="space-y-10">
        <h3 className="text-3xl font-black text-black uppercase tracking-tighter flex items-center gap-4">
          <ClipboardCheck size={36} className="text-green-800" /> TIẾN TRÌNH XÁC MINH CHI TIẾT
        </h3>

        {products.length === 0 ? (
          <div className="bg-white border-8 border-dashed border-slate-200 rounded-[4rem] p-24 text-center">
            <FileText size={80} className="mx-auto text-slate-200 mb-8" />
            <p className="text-3xl font-black text-slate-400 uppercase tracking-widest">Hiện chưa có hồ sơ nào đang xử lý</p>
            <button onClick={onViewPortal} className="mt-8 text-black text-xl font-black underline hover:text-green-800 uppercase decoration-4 underline-offset-8">Nhấn vào đây để bắt đầu đăng ký</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className={`bg-white rounded-[3rem] border-4 border-black shadow-2xl transition-all overflow-hidden ${expandedId === product.id ? 'ring-[12px] ring-green-100' : ''}`}
              >
                {/* Header Profile - Click to Expand */}
                <button 
                  onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
                  className={`w-full p-10 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-slate-50 transition-colors text-left ${expandedId === product.id ? 'bg-slate-50' : ''}`}
                >
                  <div className="flex items-center gap-10">
                    <div className="w-28 h-28 rounded-[2rem] border-4 border-black overflow-hidden shrink-0 shadow-lg">
                      <img src={product.images.product[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <h4 className="text-4xl font-black text-black uppercase tracking-tighter">{product.name}</h4>
                        <div className={`px-6 py-2 rounded-2xl text-xs font-black uppercase border-4 border-black ${
                          product.status === ProductStatus.APPROVED ? 'bg-green-500 text-white' : 'bg-orange-400 text-black'
                        }`}>
                          {product.status}
                        </div>
                      </div>
                      <p className="text-lg font-bold text-slate-500 uppercase tracking-widest flex items-center gap-3">
                         <span className="bg-slate-200 px-3 py-1 rounded-lg text-black font-black">MÃ PUC: {product.regionCode}</span>
                         <span className="text-slate-300">|</span>
                         <span>Diện tích: {product.area} HA</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden lg:block">
                      <p className="text-xs font-black text-slate-400 uppercase mb-1">Cập nhật hệ thống</p>
                      <p className="text-xl font-black text-black uppercase">{new Date(product.updatedAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className={`p-4 rounded-full border-4 border-black transition-all duration-500 ${expandedId === product.id ? 'rotate-180 bg-black text-white' : 'bg-white text-black'}`}>
                      <ChevronDown size={32} />
                    </div>
                  </div>
                </button>

                {/* Workflow Tracking - Functional Content */}
                {expandedId === product.id && (
                  <div className="p-12 bg-white border-t-8 border-black animate-in slide-in-from-top-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                      {/* Vertical Progress Tracker */}
                      <div className="lg:col-span-8 space-y-16 relative">
                        {/* Connecting Visual Line */}
                        <div className="absolute left-[44px] top-6 bottom-6 w-2 bg-slate-100 z-0"></div>
                        
                        {getStepData(product).map((step) => (
                          <div key={step.id} className="relative z-10 flex gap-10 group">
                            {/* Step Indicator Ball */}
                            <div className={`w-24 h-24 rounded-full border-4 border-black flex items-center justify-center shrink-0 transition-all duration-500 ${
                              step.status === 'COMPLETED' ? 'bg-green-600 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' :
                              step.status === 'CURRENT' ? 'bg-white text-black animate-pulse shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' :
                              'bg-slate-100 text-slate-300 border-slate-200'
                            }`}>
                              {step.status === 'COMPLETED' ? <CheckCircle2 size={48} /> : 
                               step.status === 'CURRENT' ? <Search size={48} /> : 
                               <span className="text-3xl font-black">{step.id}</span>}
                            </div>

                            {/* Step Details */}
                            <div className="flex-1 pt-2">
                              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                <h5 className={`text-2xl font-black uppercase tracking-tighter ${step.status === 'WAITING' ? 'text-slate-300' : 'text-black'}`}>
                                  {step.title}
                                </h5>
                                <div className="flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-xl border-2 border-slate-200">
                                  <Calendar size={14} className="text-slate-500" />
                                  <span className="text-[10px] font-black text-slate-500 uppercase">{step.date}</span>
                                </div>
                              </div>
                              <p className={`text-lg font-bold leading-relaxed mb-6 ${step.status === 'WAITING' ? 'text-slate-300' : 'text-slate-600 italic'}`}>
                                "{step.description}"
                              </p>
                              
                              {step.status !== 'WAITING' && (
                                <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                   <div className="bg-white p-4 rounded-2xl border-2 border-black shadow-md">
                                      <Building2 size={24} className="text-black" />
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn vị thụ lý hồ sơ</p>
                                      <p className="text-lg font-black text-black uppercase">{step.officer}</p>
                                   </div>
                                   {step.status === 'CURRENT' && (
                                      <div className="sm:ml-auto flex items-center gap-2 text-xs font-black text-blue-800 bg-blue-100 px-4 py-2 rounded-xl border-2 border-blue-200 animate-bounce">
                                         <Clock size={16} /> ĐANG XỬ LÝ TRỰC TUYẾN
                                      </div>
                                   )}
                                   {step.status === 'COMPLETED' && (
                                      <div className="sm:ml-auto flex items-center gap-2 text-xs font-black text-green-800 bg-green-100 px-4 py-2 rounded-xl border-2 border-green-200">
                                         <CheckCircle2 size={16} /> ĐÃ XÁC THỰC
                                      </div>
                                   )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary Sidebar for Record */}
                      <div className="lg:col-span-4 space-y-8">
                        <div className="bg-yellow-50 p-8 rounded-[3rem] border-4 border-black shadow-xl">
                          <h5 className="text-xl font-black text-black uppercase mb-6 flex items-center gap-3">
                            <AlertCircle size={24} className="text-yellow-700" /> LƯU Ý HÀNH CHÍNH
                          </h5>
                          <ul className="space-y-6">
                            {[
                              'Giữ điện thoại hoạt động để Cán bộ Huyện liên hệ thực địa.',
                              'Xuất trình bản gốc VietGAP khi có yêu cầu đối soát.',
                              'Cập nhật sản lượng định kỳ để duy trì mã PUC.'
                            ].map((text, i) => (
                              <li key={i} className="flex gap-4 text-sm font-bold text-slate-800 leading-tight">
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                                {text}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-slate-900 text-white p-10 rounded-[3rem] border-4 border-black shadow-xl text-center">
                           <MapPin size={48} className="mx-auto mb-6 text-green-400" />
                           <h5 className="text-2xl font-black uppercase mb-2">Trạng thái Bản đồ</h5>
                           <p className="text-sm font-bold text-slate-400 italic mb-8">
                             {product.status === ProductStatus.APPROVED 
                               ? "Vùng trồng của bạn đang HIỂN THỊ công khai." 
                               : "Đang chờ phê duyệt để HIỂN THỊ lên bản đồ."}
                           </p>
                           <button className={`w-full py-5 rounded-2xl font-black text-sm uppercase transition-all border-4 ${
                             product.status === ProductStatus.APPROVED 
                               ? 'bg-green-600 text-white border-green-800 hover:bg-green-700' 
                               : 'bg-white/10 text-white/40 border-white/10 cursor-not-allowed'
                           }`}>
                             XEM TRÊN BẢN ĐỒ QUỐC GIA
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit History Log */}
      <div className="bg-black p-12 rounded-[4rem] shadow-2xl">
         <div className="flex items-center justify-between mb-10 border-b-2 border-white/20 pb-6">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
              <Calendar size={36} /> NHẬT KÝ HỆ THỐNG (LIVE LOGS)
            </h3>
            <span className="text-green-400 font-black flex items-center gap-2 animate-pulse">
               <div className="w-3 h-3 bg-green-400 rounded-full"></div> TRỰC TUYẾN
            </span>
         </div>
         <div className="space-y-6">
            {[
              { time: '14:20 - Hôm nay', event: 'Hệ thống GovAuth tự động tiếp nhận hồ sơ mã VN-BTE-PUC-001.', type: 'SYSTEM' },
              { time: '10:05 - Hôm qua', event: 'Phòng Nông nghiệp Huyện Châu Thành cập nhật trạng thái: ĐANG KIỂM TRA THỰC ĐỊA.', type: 'USER' },
              { time: '16:45 - 20/05/2024', event: 'Nông hộ hoàn tất đăng ký thông tin ban đầu.', type: 'USER' }
            ].map((log, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-3 h-3 rounded-full ${log.type === 'SYSTEM' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                  <p className="text-lg font-bold text-white/90 leading-tight">{log.event}</p>
                </div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-4 md:mt-0 bg-white/5 px-4 py-2 rounded-xl">{log.time}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
