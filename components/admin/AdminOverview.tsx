
import React from 'react';
import { FileText, Newspaper, Files, Layout } from 'lucide-react';

interface AdminOverviewProps {
  stats: {
    notices: number;
    news: number;
    pages: number;
    widgets: number;
  }
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notices</p>
        <FileText size={16} className="text-emerald-500" />
      </div>
      <h3 className="text-3xl font-black text-emerald-600 mt-1">{stats.notices}</h3>
    </div>
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Headlines</p>
        <Newspaper size={16} className="text-blue-500" />
      </div>
      <h3 className="text-3xl font-black text-blue-600 mt-1">{stats.news}</h3>
    </div>
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pages</p>
        <Files size={16} className="text-orange-500" />
      </div>
      <h3 className="text-3xl font-black text-orange-600 mt-1">{stats.pages}</h3>
    </div>
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Home Widgets</p>
        <Layout size={16} className="text-purple-500" />
      </div>
      <h3 className="text-3xl font-black text-purple-600 mt-1">{stats.widgets}</h3>
    </div>
  </div>
);

export default AdminOverview;
