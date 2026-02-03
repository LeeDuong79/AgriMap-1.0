
import React, { useState, useRef } from 'react';
import { FarmProduct, ProductStatus, CertType } from '../types';
import { CATEGORIES } from '../constants';
import { 
  ShieldCheck, Calendar, Info, AlertTriangle, CheckCircle2, 
  X, UploadCloud, Sprout, Search, ChevronRight, MapPin,
  ClipboardList, PlusSquare
} from 'lucide-react';

interface FarmerPortalProps {
  onAdd: (product: FarmProduct) => void;
  existingProducts: FarmProduct[];
  activeView: 'register' | 'my-farms';
}

const FarmerPortal: React.FC<FarmerPortalProps> = ({ onAdd, existingProducts, activeView }) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    category: CATEGORIES[0],
    area: 0,
    yield: 0,
    description: '',
    contact: '',
    regionCode: '',
    address: 'Vĩnh Long, Việt Nam',
    harvestMonths: [] as number[],
    certs: [] as { type: CertType, proofUrl: string, expiryDate: string }[],
  });

  const [images, setImages] = useState({ orchard: '', product: '', warehouse: '' });

  const handleFileChange = (certType: CertType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => {
          const existing = prev.certs.find(c => c.type === certType);
          if (existing) {
            return {
              ...prev,
              certs: prev.certs.map(c => c.type === certType ? { ...c, proofUrl: base64String } : c)
            };
          } else {
            return {
              ...prev,
              certs: [...prev.certs, { type: certType, proofUrl: base64String, expiryDate: '2026-12-31' }]
            };
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCert = (certType: CertType) => {
    setFormData(prev => ({
      ...prev,
      certs: prev.certs.filter(c => c.type !== certType)
    }));
  };

  const toggleMonth = (m: number) => {
    setFormData(prev => ({
      ...prev,
      harvestMonths: prev.harvestMonths.includes(m) 
        ? prev.harvestMonths.filter(item => item !== m) 
        : [...prev.harvestMonths, m].sort((a,b) => a-b)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.regionCode || formData.harvestMonths.length === 0) {
      alert("Vui lòng điền đầy đủ thông tin (*) để tiếp tục.");
      return;
    }
    const newProduct: FarmProduct = {
      id: Math.random().toString(36).substr(2, 9),
      farmerId: 'f_current',
      farmerName: 'HTX Nông Nghiệp Xanh',
      name: formData.name,
      variety: formData.variety,
      category: formData.category,
      area: formData.area,
      expectedYield: formData.yield,
      description: formData.description,
      harvestMonths: formData.harvestMonths,
      images: { 
        orchard: [images.orchard || 'https://picsum.photos/600/400'], 
        product: [images.product || 'https://picsum.photos/600/400'], 
        warehouse: [images.warehouse || 'https://picsum.photos/600/400'] 
      },
      certificates: formData.certs.map(c => ({ 
        type: c.type, 
        proofUrl: c.proofUrl, 
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: c.expiryDate
      })),
      regionCode: formData.regionCode,
      location: { lat: 10.2, lng: 105.8, address: formData.address },
      status: ProductStatus.PENDING,
      contact: formData.contact,
      rating: 0,
      timeline: [],
      updatedAt: new Date().toISOString()
    };
    onAdd(newProduct);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-12 border-b-8 border-black pb-8">
        <div className="flex items-center gap-4 mb-2">
          {activeView === 'register' ? (
            <div className="bg-black text-white p-3 rounded-2xl shadow-lg">
              <PlusSquare size={32} />
            </div>
          ) : (
            <div className="bg-black text-white p-3 rounded-2xl shadow-lg">
              <ClipboardList size={32} />
            </div>
          )}
          <h1 className="text-5xl font-black text-black tracking-tighter uppercase">
            {activeView === 'register' ? 'Đăng ký Vùng trồng mới' : 'Hồ sơ của tôi'}
          </h1>
        </div>
        {activeView === 'register' && (
          <p className="text-xl text-slate-700 font-bold ml-16">
            Khởi tạo dữ liệu nông sản để nhận mã định danh PUC.
          </p>
        )}
      </div>

      {activeView === 'register' ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border-2 border-slate-200">
              <div className="flex items-center gap-3 mb-8 text-black font-black text-2xl border-b-4 border-green-700 pb-4">
                <Info size={28} className="text-green-700" />
                <span className="uppercase tracking-tighter">Thông tin Vùng trồng</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-base font-black text-black uppercase">Tên Nông sản & Vùng trồng *</label>
                  <input required className="w-full p-4 bg-white border-2 border-slate-400 rounded-2xl focus:border-green-600 outline-none text-black font-bold text-lg" placeholder="Ví dụ: Bưởi da xanh Châu Thành" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-base font-black text-black uppercase">Giống cây trồng</label>
                  <input className="w-full p-4 bg-white border-2 border-slate-400 rounded-2xl focus:border-green-600 outline-none text-black font-bold text-lg" placeholder="Ri6, Da xanh..." value={formData.variety} onChange={e => setFormData({...formData, variety: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-black text-black uppercase">Nhóm nông sản</label>
                  <select className="w-full p-4 bg-white border-2 border-slate-400 rounded-2xl focus:border-green-600 outline-none text-black font-bold text-lg appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-black text-black uppercase">Diện tích (ha) *</label>
                  <input required type="number" step="0.1" className="w-full p-4 bg-white border-2 border-slate-400 rounded-2xl focus:border-green-600 outline-none text-black font-bold text-lg" value={formData.area} onChange={e => setFormData({...formData, area: parseFloat(e.target.value)})} />
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-black text-black uppercase">Sản lượng dự kiến (tấn)</label>
                  <input type="number" className="w-full p-4 bg-white border-2 border-slate-400 rounded-2xl focus:border-green-600 outline-none text-black font-bold text-lg" value={formData.yield} onChange={e => setFormData({...formData, yield: parseFloat(e.target.value)})} />
                </div>
              </div>

              <div className="mt-12">
                <label className="block text-xl font-black text-black mb-6 flex items-center gap-3">
                  <Calendar size={24} className="text-green-700" />
                  THÁNG THU HOẠCH CHÍNH VỤ *
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {[...Array(12)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleMonth(i + 1)}
                      className={`py-4 rounded-xl text-lg font-black transition-all border-2 ${formData.harvestMonths.includes(i + 1) ? 'bg-green-700 text-white border-green-800 shadow-md scale-105' : 'bg-slate-50 text-black border-slate-300 hover:border-green-600'}`}
                    >
                      T{i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border-2 border-slate-200">
              <div className="flex items-center gap-3 mb-8 text-black font-black text-2xl border-b-4 border-green-700 pb-4">
                <ShieldCheck size={28} className="text-green-700" />
                <span className="uppercase tracking-tighter">Định danh & Minh chứng</span>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="block text-base font-black text-black uppercase tracking-tight">Mã số vùng trồng (PUC) *</label>
                  <input required className="w-full p-4 bg-green-50 border-2 border-green-800 rounded-2xl focus:ring-4 focus:ring-green-100 outline-none font-mono text-xl font-black text-green-900" placeholder="VN-BTE-01-02-123" value={formData.regionCode} onChange={e => setFormData({...formData, regionCode: e.target.value.toUpperCase()})} />
                  <p className="text-sm font-bold text-red-700 flex items-center gap-2 mt-2 italic">
                    <AlertTriangle size={16} />
                    Dữ liệu này sẽ được hậu kiểm bởi cơ quan chuyên môn.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="block text-base font-black text-black uppercase tracking-tight">Tải lên ảnh chụp Chứng chỉ *</label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.values(CertType).map(cert => {
                      const certData = formData.certs.find(c => c.type === cert);
                      return (
                        <div key={cert} className="relative">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={el => { fileInputRefs.current[cert] = el; }}
                            onChange={(e) => handleFileChange(cert, e)}
                          />
                          
                          <div 
                            onClick={() => !certData && fileInputRefs.current[cert]?.click()}
                            className={`h-40 border-2 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center overflow-hidden relative group ${certData ? 'border-green-700 bg-white' : 'border-slate-300 bg-slate-50 hover:border-green-600 border-dashed'}`}
                          >
                            {certData ? (
                              <>
                                <img src={certData.proofUrl} alt={cert} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                                <div className="relative z-10 p-2">
                                  <div className="bg-green-700 text-white p-1.5 rounded-full mx-auto mb-2 w-fit">
                                    <CheckCircle2 size={24} />
                                  </div>
                                  <p className="text-lg font-black text-black leading-none">{cert}</p>
                                  <p className="text-[10px] font-black text-green-800 uppercase mt-1">Đã có minh chứng</p>
                                </div>
                                <button 
                                  type="button" 
                                  onClick={(e) => { e.stopPropagation(); removeCert(cert); }}
                                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg shadow-md z-20 hover:scale-110 transition-transform"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <div className="p-4 flex flex-col items-center">
                                <UploadCloud size={32} className="text-slate-400 mb-2 group-hover:text-green-700 transition-colors" />
                                <p className="text-base font-black text-black leading-tight">{cert}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Chưa chọn ảnh</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-6 rounded-3xl font-black text-2xl shadow-2xl transition-all transform hover:-translate-y-2 flex items-center justify-center gap-4 border-b-8 border-green-900 active:translate-y-0 active:border-b-0"
            >
              <CheckCircle2 size={32} />
              XÁC NHẬN & GỬI DUYỆT
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
           {existingProducts.length === 0 ? (
             <div className="bg-white border-8 border-dashed border-slate-200 rounded-[4rem] p-24 text-center">
                <Sprout size={80} className="mx-auto text-slate-200 mb-8" />
                <p className="text-3xl font-black text-slate-400 uppercase tracking-widest">Bạn chưa có hồ sơ nào</p>
                <p className="text-slate-400 font-bold mt-4">Vui lòng sử dụng tính năng "Đăng ký" từ trang chủ.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-6">
                {existingProducts.map(p => (
                  <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border-4 border-black flex flex-col md:flex-row items-center justify-between hover:shadow-2xl transition-all group">
                    <div className="flex items-center gap-10">
                      <div className="w-24 h-24 rounded-2xl border-4 border-black overflow-hidden shrink-0 shadow-md">
                        <img src={p.images.product[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-3xl font-black text-black uppercase tracking-tighter">{p.name}</h4>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border-2 ${
                            p.status === ProductStatus.APPROVED ? 'bg-green-500 text-white border-green-800 shadow-sm' : 'bg-orange-400 text-black border-orange-600 shadow-sm'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <MapPin size={16} /> {p.location.address} • {p.area} HA
                        </p>
                        <p className="text-xs font-black text-slate-400 mt-2 font-mono bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 inline-block">MÃ PUC: {p.regionCode}</p>
                      </div>
                    </div>
                    <button className="mt-6 md:mt-0 px-8 py-4 bg-black text-white rounded-xl font-black uppercase flex items-center gap-3 hover:bg-slate-800 transition-all shadow-[6px_6px_0px_0px_rgba(21,128,61,1)]">
                      XEM CHI TIẾT <ChevronRight />
                    </button>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default FarmerPortal;
