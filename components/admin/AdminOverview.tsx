
import React from 'react';
import { useSelector } from 'react-redux';
import { 
  FileText, Newspaper, Users, Layout, TrendingUp, 
  PlusCircle, ArrowRight, Activity, Calendar, Eye
} from 'lucide-react';
import { RootState } from '../../store';

interface AdminOverviewProps {
  stats: {
    notices: number;
    news: number;
    pages: number;
    widgets: number;
  }
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ stats }) => {
  const { visitorStats } = useSelector((state: RootState) => state.content);
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  const visitorHistory = visitorStats?.lastSevenDays?.length > 0 
    ? visitorStats.lastSevenDays 
    : [
        { day: 'Mon', count: 0 },
        { day: 'Tue', count: 0 },
        { day: 'Wed', count: 0 },
        { day: 'Thu', count: 0 },
        { day: 'Fri', count: 0 },
        { day: 'Sat', count: 0 },
        { day: 'Sun', count: 0 },
      ];

  const maxVal = Math.max(...visitorHistory.map(h => Number(h.count || 0)), 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Cards: Live Visitor Statistics (Same as Footer Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Today</p>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
                <Users size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-emerald-600 mt-2">{formatNumber(visitorStats.today)}</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Yesterday</p>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                <Users size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-blue-600 mt-2">{formatNumber(visitorStats.yesterday)}</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">This Month</p>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-600 group-hover:scale-110 transition-transform">
                <Calendar size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-orange-600 mt-2">{formatNumber(visitorStats.month)}</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Hits</p>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
                <Eye size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-purple-600 mt-2">{formatNumber(visitorStats.total)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Statistics Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-black text-gray-800 dark:text-white text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" />
                Traffic Analytics
              </h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Engagement Trends (Last 7 Days)</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                <Activity size={12} className="animate-pulse" /> Live
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 px-2 border-b dark:border-gray-700 pb-2">
            {visitorHistory.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
                <div className="relative w-full flex flex-col items-center justify-end h-full">
                    <div className="absolute -top-8 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-2 z-10 whitespace-nowrap shadow-xl">
                        {item.count.toLocaleString()} visits
                    </div>
                    <div 
                        style={{ height: `${(Number(item.count || 0) / maxVal) * 100}%`, minHeight: '4px' }} 
                        className={`w-full max-w-[40px] rounded-t-xl transition-all duration-1000 group-hover:brightness-110 shadow-lg ${
                            idx === visitorHistory.length - 1 
                                ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' 
                                : 'bg-gradient-to-t from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600'
                        }`}
                    ></div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${idx === visitorHistory.length - 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Content Summary */}
        <div className="space-y-6">
            <div className="bg-emerald-700 text-white p-6 rounded-3xl shadow-xl shadow-emerald-900/20 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                    <Newspaper size={120} />
                </div>
                <h4 className="font-black uppercase tracking-widest text-[10px] opacity-80 mb-1">Headline Stream</h4>
                <p className="text-xl font-black mb-6">Active News: {stats.news}</p>
                <button 
                    onClick={() => window.location.hash = 'news'}
                    className="w-full py-3 bg-white text-emerald-800 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors shadow-lg active:scale-95"
                >
                    <PlusCircle size={16} /> Create Headline
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-black text-gray-800 dark:text-white text-sm uppercase tracking-widest flex items-center gap-2">
                        <FileText size={16} className="text-orange-500" />
                        Notice Hub
                    </h4>
                    <button onClick={() => window.location.hash = 'notices'} className="text-[10px] font-black text-emerald-600 uppercase hover:underline">Settings</button>
                </div>
                <div className="space-y-4">
                    <button 
                      onClick={() => window.location.hash = 'notices'}
                      className="w-full py-2.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-100 transition-all border border-orange-100 dark:border-orange-900/30 active:scale-95 shadow-sm"
                    >
                      <PlusCircle size={14} /> Post New Notice
                    </button>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border dark:border-gray-700 flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <FileText size={14} className="text-gray-400" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold truncate dark:text-gray-200">Database Ready</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">System: Operational</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
