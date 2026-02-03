
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { FarmProduct, ProductStatus } from '../types';
import { 
  MapPin, Phone, Award, Navigation, Search, X, 
  Map as MapIcon, SlidersHorizontal, AlertCircle, 
  TrendingUp, Star, Share2, Bookmark, CheckCircle, 
  Info, ExternalLink, Calendar, ChevronRight, MessageSquare
} from 'lucide-react';

interface MapInterfaceProps {
  products: FarmProduct[];
  isFarmerView?: boolean;
  onSearch?: (query: string) => void;
  initialSearchQuery?: string;
}

const POPULAR_SUGGESTIONS = ['Bưởi Da Xanh', 'Sầu riêng Ri6', 'Xoài Cát Hòa Lộc', 'Lúa ST25', 'Vú sữa Lò Rèn'];

const MapInterface: React.FC<MapInterfaceProps> = ({ products, isFarmerView = false, onSearch, initialSearchQuery = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<FarmProduct | null>(null);
  const [localQuery, setLocalQuery] = useState(initialSearchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [10.2435, 106.3756],
        zoom: 10,
        zoomControl: false
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
    }
  }, []);

  // Handle Markers and Fly-to animations
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    
    const createIcon = (color = '#15803d') => L.divIcon({
      className: 'custom-icon',
      html: `<div style="background-color: ${color};" class="p-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:scale-125 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 2 9.5a7 7 0 0 1-7 7c-2 0-3-1-3-1"/><path d="M11 20s-1 1.5-3.5 1.5-4.5-1.5-4.5-5 4-5 4-5"/></svg>
            </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    const newMarkers: L.Marker[] = [];
    products.forEach(p => {
      const marker = L.marker([p.location.lat, p.location.lng], { icon: createIcon() })
        .addTo(mapRef.current!)
        .on('click', () => {
          setSelectedProduct(p);
          setIsSaved(false); 
          mapRef.current?.flyTo([p.location.lat, p.location.lng], 15, {
            duration: 1.5,
            easeLinearity: 0.25
          });
        });
      newMarkers.push(marker);
    });
    markersRef.current = newMarkers;

    // Fly-to logic when search changes
    if (localQuery.trim().length > 0) {
      if (products.length === 1) {
        // If only one product found, fly directly to it and select it
        const p = products[0];
        setSelectedProduct(p);
        mapRef.current.flyTo([p.location.lat, p.location.lng], 14, {
          duration: 2.0,
          easeLinearity: 0.2
        });
      } else if (products.length > 1) {
        // If multiple products, check for an exact name match to fly to
        const exactMatch = products.find(p => p.name.toLowerCase() === localQuery.toLowerCase());
        if (exactMatch) {
          setSelectedProduct(exactMatch);
          mapRef.current.flyTo([exactMatch.location.lat, exactMatch.location.lng], 14, {
            duration: 2.0,
            easeLinearity: 0.2
          });
        } else {
          // Otherwise fit all results in view
          const group = L.featureGroup(newMarkers);
          mapRef.current.fitBounds(group.getBounds().pad(0.3), { animate: true, duration: 1.5 });
        }
      }
    } else if (newMarkers.length > 0) {
      // General view fitting when no specific search
      const group = L.featureGroup(newMarkers);
      mapRef.current.fitBounds(group.getBounds().pad(0.1), { animate: true, duration: 1.0 });
    }
  }, [products]); // Remove localQuery from dependencies to avoid loop if products don't change

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch?.(localQuery);
    setShowSuggestions(false);
    (document.activeElement as HTMLElement)?.blur();
  };

  const handleSuggestionClick = (q: string) => {
    setLocalQuery(q);
    onSearch?.(q);
    setShowSuggestions(false);
    // The useEffect will handle the flyTo based on the new products list
  };

  const openInGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="relative w-full h-full font-sans overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* 1. Header Search Bar (Always top) */}
      <div className="absolute top-6 left-6 right-6 z-[2000] flex justify-center">
        <div className="w-full max-w-xl relative">
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white border-[4px] border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center p-1.5 transition-all focus-within:translate-x-1 focus-within:translate-y-1 focus-within:shadow-none"
          >
            <button type="submit" className="pl-4 pr-3 text-black hover:scale-110 active:scale-95 transition-transform">
              <Search size={28} strokeWidth={4} />
            </button>
            <div className="flex-1 px-2">
              <input 
                type="text" 
                value={localQuery}
                placeholder="Tìm nông sản, mã số PUC..."
                className="w-full py-3 bg-transparent text-xl font-black text-black outline-none placeholder:text-slate-400 uppercase tracking-tighter"
                onChange={(e) => setLocalQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>
            {localQuery && (
              <button type="button" onClick={() => { setLocalQuery(''); onSearch?.(''); setSelectedProduct(null); }} className="p-2 mr-1">
                <X size={20} strokeWidth={4} className="text-red-600" />
              </button>
            )}
            <button type="button" className="bg-black text-white p-3.5 rounded-2xl hover:bg-slate-800 transition-colors">
              <SlidersHorizontal size={22} strokeWidth={3} />
            </button>
          </form>

          {showSuggestions && !localQuery && (
            <div className="absolute top-full mt-4 left-0 right-0 bg-white border-4 border-black rounded-[2rem] shadow-2xl p-6 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-2 mb-4 text-green-700">
                <TrendingUp size={18} strokeWidth={3} />
                <h4 className="text-xs font-black uppercase tracking-widest">Gợi ý hôm nay</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => handleSuggestionClick(s)} className="px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-black text-black hover:border-black transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Side Panel / Place Details */}
      {selectedProduct && (
        <div className="absolute top-0 bottom-0 left-0 w-full md:w-[450px] bg-white border-r-4 border-black z-[3000] shadow-2xl animate-in slide-in-from-left duration-500 overflow-y-auto no-scrollbar">
          {/* Header Image */}
          <div className="relative h-72">
            <img src={selectedProduct.images.product[0]} className="w-full h-full object-cover" alt={selectedProduct.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 left-6 bg-white border-3 border-black p-3 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <X size={24} strokeWidth={4} />
            </button>
            
            <div className="absolute bottom-6 left-6 right-6">
               <div className="flex items-center gap-2 mb-1">
                 <span className="bg-green-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-white/20">
                    <CheckCircle size={10} /> Đã xác thực
                 </span>
               </div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-lg">{selectedProduct.name}</h2>
            </div>
          </div>

          {/* Place Body */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-black">{selectedProduct.rating || '4.8'}</span>
                <div className="flex text-orange-500">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" className="opacity-30" />
                </div>
                <span className="text-slate-400 font-bold ml-1">(120 đánh giá)</span>
              </div>
              <div className="flex gap-2">
                {selectedProduct.certificates.map(c => (
                  <span key={c.type} className="bg-orange-100 text-orange-700 p-2 rounded-lg border-2 border-orange-200 shadow-sm" title={c.type}>
                    <Award size={20} strokeWidth={3} />
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-10">
              <button 
                onClick={() => openInGoogleMaps(selectedProduct.location.lat, selectedProduct.location.lng)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center border-2 border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md group-active:scale-90">
                  <Navigation size={28} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Đường đi</span>
              </button>
              
              <button onClick={() => window.open(`tel:${selectedProduct.contact}`)} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center border-2 border-green-200 group-hover:bg-green-600 group-hover:text-white transition-all shadow-md group-active:scale-90">
                  <Phone size={28} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Liên hệ</span>
              </button>

              <button onClick={() => setIsSaved(!isSaved)} className="flex flex-col items-center gap-2 group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all shadow-md group-active:scale-90 ${isSaved ? 'bg-red-600 text-white border-red-700' : 'bg-slate-50 text-slate-700 border-slate-200 group-hover:bg-slate-200'}`}>
                  <Bookmark size={28} strokeWidth={3} fill={isSaved ? "currentColor" : "none"} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{isSaved ? 'Đã lưu' : 'Lưu lại'}</span>
              </button>

              <button className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center border-2 border-slate-200 group-hover:bg-slate-200 transition-all shadow-md group-active:scale-90">
                  <Share2 size={28} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Chia sẻ</span>
              </button>
            </div>

            <div className="space-y-6 border-t-2 border-slate-100 pt-8">
              <div className="flex gap-5">
                <MapPin className="text-red-600 shrink-0" size={24} />
                <div>
                  <p className="text-base font-bold text-black leading-tight">{selectedProduct.location.address}</p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Vị trí thực tế</p>
                </div>
              </div>

              <div className="flex gap-5">
                <Info className="text-blue-600 shrink-0" size={24} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-green-700 font-mono tracking-tight">{selectedProduct.regionCode}</p>
                    <CheckCircle size={14} className="text-green-600" />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Mã số vùng trồng (PUC)</p>
                </div>
              </div>

              <div className="flex gap-5">
                <Calendar className="text-orange-600 shrink-0" size={24} />
                <div>
                  <p className="text-base font-bold text-black">Tháng {selectedProduct.harvestMonths.join(', ')}</p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Mùa vụ thu hoạch chính</p>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
               <h4 className="text-xs font-black text-black uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Sprout size={16} /> Thông tin canh tác
               </h4>
               <p className="text-slate-600 font-medium italic leading-relaxed">
                 "{selectedProduct.description}"
               </p>
               <div className="mt-4 flex items-center justify-between text-xs font-black text-green-700 uppercase">
                 <span>Chủ vườn: {selectedProduct.farmerName}</span>
                 <ExternalLink size={14} />
               </div>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-slate-100">
               <div className="flex items-center justify-between mb-4">
                 <h4 className="text-xs font-black text-black uppercase tracking-widest">Đánh giá cộng đồng</h4>
                 <button className="text-blue-700 text-xs font-black uppercase underline">Xem tất cả</button>
               </div>
               <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white shrink-0">
                      <Star size={18} fill="white" />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl flex-1 border border-slate-100">
                       <p className="text-xs font-bold text-slate-600 leading-tight">"Nông sản rất tươi, HTX hỗ trợ nhiệt tình. Có mã PUC nên cực kỳ yên tâm khi mua sỉ."</p>
                       <p className="text-[10px] font-black text-black mt-2 uppercase tracking-widest">- Thương lái Miền Tây</p>
                    </div>
                  </div>
               </div>
            </div>

            <button className="w-full mt-10 bg-black text-white py-5 rounded-2xl font-black text-xl uppercase tracking-tighter flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] transition-all active:scale-95">
               Gửi yêu cầu thu mua <ChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* 3. Floating Quick Buttons */}
      <div className="absolute bottom-32 right-6 z-[1000] flex flex-col gap-3">
        <button 
          onClick={() => {
            if (navigator.geolocation && mapRef.current) {
              navigator.geolocation.getCurrentPosition((pos) => {
                mapRef.current!.flyTo([pos.coords.latitude, pos.coords.longitude], 13, {
                  duration: 2.0
                });
              });
            }
          }}
          className="bg-white border-4 border-black p-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 transition-all text-black active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <Navigation size={28} strokeWidth={4} className="text-blue-700" />
        </button>
      </div>

      {selectedProduct && (
        <div 
          className="md:hidden absolute inset-0 bg-black/40 z-[2500] backdrop-blur-[2px]" 
          onClick={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

const Sprout = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 20 3-3 3 3M10 17v-5M12 9s2.5-4 5-4 5 4 5 4-2.5 4-5 4-5-4-5-4ZM10 9s-2.5-4-5-4-5 4-5 4 2.5 4 5 4 5-4 5-4Z"/></svg>
);

export default MapInterface;
