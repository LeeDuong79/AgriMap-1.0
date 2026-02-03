
import React from 'react';
import { FarmProduct } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieIcon, Sprout, Target } from 'lucide-react';

interface FarmerAnalyticsProps {
  products: FarmProduct[];
}

const FarmerAnalytics: React.FC<FarmerAnalyticsProps> = ({ products }) => {
  const data = products.map(p => ({
    name: p.name,
    yield: p.expectedYield,
    area: p.area
  }));

  const COLORS = ['#000000', '#15803d', '#16a34a', '#333333'];

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-5xl font-black text-black tracking-tighter uppercase mb-2">Thống kê Sản xuất</h1>
        <p className="text-xl font-bold text-slate-600">Phân tích dữ liệu sản lượng và hiệu quả canh tác của nông hộ.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] border-4 border-black shadow-2xl">
          <h3 className="text-xl font-black text-black uppercase tracking-tighter mb-8 flex items-center gap-3">
            <BarChart3 className="text-green-700" /> SẢN LƯỢNG DỰ KIẾN (TẤN)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#000000', fontWeight: 'bold', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#000000', fontWeight: 'bold'}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '16px', border: '2px solid black', fontWeight: 'bold'}} />
                <Bar dataKey="yield" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border-4 border-black shadow-2xl">
          <h3 className="text-xl font-black text-black uppercase tracking-tighter mb-8 flex items-center gap-3">
            <PieIcon className="text-black" /> CƠ CẤU DIỆN TÍCH (HA)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="area"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: '2px solid black', fontWeight: 'bold'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
             {data.map((d, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                 <span className="text-xs font-black text-black uppercase">{d.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] border-4 border-black shadow-2xl flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h3 className="text-3xl font-black uppercase tracking-tighter">Hiệu suất Nông hộ Số</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tổng diện tích</p>
              <p className="text-4xl font-black">{data.reduce((a, b) => a + b.area, 0)} HA</p>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Sản lượng kỳ vọng</p>
              <p className="text-4xl font-black">{data.reduce((a, b) => a + b.yield, 0)} TẤN</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 p-10 rounded-[2.5rem] border border-white/20 text-center">
           <Target size={48} className="mx-auto mb-4 text-green-400" />
           <p className="text-4xl font-black">98%</p>
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Độ chính xác dữ liệu</p>
        </div>
      </div>
    </div>
  );
};

export default FarmerAnalytics;
