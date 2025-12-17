import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Notice } from '../types';

interface AllNoticesPageProps {
  notices: Notice[];
  onBack: () => void;
  onNavigateNotice: (id: string) => void;
}

const ITEMS_PER_PAGE = 5;

const AllNoticesPage: React.FC<AllNoticesPageProps> = ({ notices, onBack, onNavigateNotice }) => {
  const [filter, setFilter] = useState<'all' | 'student' | 'college' | 'exam' | 'general'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredNotices = filter === 'all' 
    ? notices 
    : notices.filter(n => n.type === filter);

  // Pagination Logic
  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotices = filteredNotices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors min-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 border-b border-emerald-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                 <button onClick={onBack} className="flex items-center text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold mb-2">
                    <ArrowLeft size={16} className="mr-1" /> Back to Home
                 </button>
                 <h1 className="text-2xl font-bold text-emerald-900 dark:text-white flex items-center gap-2">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full">
                        <FileText className="text-emerald-600 dark:text-emerald-400" size={24} />
                    </div>
                    All Notices
                 </h1>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Archive of all published notices and circulars.
                 </p>
            </div>
            
            <div className="flex items-center gap-2 bg-white dark:bg-gray-700 p-1 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                <Filter size={16} className="ml-2 text-gray-400" />
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none p-1 pr-2"
                >
                    <option value="all">All Categories</option>
                    <option value="general">General</option>
                    <option value="student">Student</option>
                    <option value="college">College</option>
                    <option value="exam">Exam</option>
                </select>
            </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 flex-grow">
            {currentNotices.length > 0 ? (
                <div className="grid gap-4">
                    {currentNotices.map((notice) => (
                        <div 
                            key={notice.id} 
                            onClick={() => onNavigateNotice(notice.id)}
                            className="dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-700/50 transition cursor-pointer group flex flex-col md:flex-row gap-4 items-start md:items-center"
                        >
                             <div className="flex-shrink-0 flex flex-col items-center justify-center bg-emerald-50 dark:bg-gray-700 border border-emerald-100 dark:border-gray-600 rounded-lg w-16 h-16 p-2 text-center group-hover:bg-emerald-100 dark:group-hover:bg-gray-600 transition-colors">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{new Date(notice.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 leading-none">{new Date(notice.date).getDate()}</span>
                            </div>

                            <div className="flex-grow">
                                <div className="flex gap-2 mb-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                        notice.type === 'exam' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' :
                                        notice.type === 'student' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' :
                                        notice.type === 'college' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30' :
                                        'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-600'
                                    }`}>
                                        {notice.type.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                                        Ref: DIN/{notice.id}/2024
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                    {notice.title}
                                </h3>
                            </div>

                            <button className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all flex-shrink-0">
                                <Download size={16} />
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
                    <FileText size={64} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">No notices found in this category.</p>
                </div>
            )}
        </div>

        {/* Pagination Controls */}
        {filteredNotices.length > ITEMS_PER_PAGE && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-center items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition ${
                  currentPage === page 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
    </div>
  );
};

export default AllNoticesPage;