
import React, { useState } from 'react';
import { Notice } from '../../types';
import { FileText, Download } from 'lucide-react';

interface NoticeBoardProps {
  notices: Notice[];
  onNavigateNotice: (id: string) => void;
  onViewAll?: () => void;
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices, onNavigateNotice, onViewAll }) => {
  const [filter, setFilter] = useState<'all' | 'student' | 'college' | 'exam' | 'general'>('all');

  const filteredNotices = filter === 'all' 
    ? notices 
    : notices.filter(n => n.type === filter);

  const displayNotices = filteredNotices.slice(0, 5);
 
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex flex-col transition-colors">
      <div className="bg-emerald-50 dark:bg-gray-700/50 p-3 border-b border-emerald-100 dark:border-gray-600 flex justify-between items-center">
        <h3 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
            <div className="p-1.5 bg-emerald-600 dark:bg-emerald-700 rounded text-white">
                <FileText size={16} />
            </div>
            Notice Board
        </h3>
        {onViewAll && (
            <button onClick={onViewAll} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                View All
            </button>
        )}
      </div>
      
      <div className="flex text-xs font-medium border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {(['all', 'general', 'student', 'college', 'exam'] as const).map((tab) => (
            <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 py-2 text-center capitalize transition-colors ${filter === tab ? 'bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-400 border-t-2 border-emerald-500 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                {tab}
            </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto notice-scroll p-0" style={{ maxHeight: '400px' }}>
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {displayNotices.map((notice) => (
                <li key={notice.id} className="p-3 hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 transition flex items-start gap-3 group">
                    <div className="flex-shrink-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded w-12 h-12 p-1 text-center">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{new Date(notice.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 leading-none">{new Date(notice.date).getDate()}</span>
                    </div>
                    <div className="flex-grow cursor-pointer" onClick={() => onNavigateNotice(notice.id)}>
                        <h4 className="text-sm text-gray-800 dark:text-gray-200 font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-400 line-clamp-2">
                            {notice.title}
                        </h4>
                        <div className="flex items-center mt-1 gap-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                notice.type === 'exam' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' :
                                notice.type === 'student' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' :
                                notice.type === 'college' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30' :
                                'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-600'
                            }`}>
                                {notice.type.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">ID: {notice.id.slice(0, 4)}</span>
                        </div>
                    </div>
                    <button onClick={() => onNavigateNotice(notice.id)} className="text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 p-1">
                        <Download size={16} />
                    </button>
                </li>
            ))}
            {displayNotices.length === 0 && (
                <li className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">No notices found.</li>
            )}
        </ul>
      </div>
    </div>
  );
};

export default NoticeBoard;
