
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredNotices = filter === 'all' 
    ? notices 
    : notices.filter(n => n.type === filter);

  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotices = filteredNotices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 min-h-[80vh] flex flex-col">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 border-b dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                 <button onClick={onBack} className="flex items-center text-sm text-emerald-700 font-bold mb-2">
                    <ArrowLeft size={16} className="mr-1" /> Back
                 </button>
                 <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                    <FileText className="text-emerald-600" size={24} />
                    All Notices
                 </h1>
            </div>
            <div className="bg-white dark:bg-gray-700 p-1 rounded-lg border dark:border-gray-600">
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="bg-transparent text-sm dark:text-white p-1"
                >
                    <option value="all">All Categories</option>
                    <option value="general">General</option>
                    <option value="student">Student</option>
                    <option value="college">College</option>
                    <option value="exam">Exam</option>
                </select>
            </div>
        </div>

        <div className="p-4 md:p-8 flex-grow">
            <div className="grid gap-4">
                {currentNotices.map((notice) => (
                    <div 
                        key={notice.id} 
                        onClick={() => onNavigateNotice(notice.id)}
                        className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition cursor-pointer flex items-center gap-4"
                    >
                         <div className="flex-shrink-0 flex flex-col items-center justify-center bg-emerald-50 dark:bg-gray-700 w-16 h-16 rounded-lg text-center">
                            <span className="text-xs font-bold text-gray-500 uppercase">{new Date(notice.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-2xl font-bold text-emerald-700 leading-none">{new Date(notice.date).getDate()}</span>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-lg font-bold dark:text-white group-hover:text-emerald-700">{notice.title}</h3>
                            <span className="text-xs uppercase text-gray-400 font-bold">{notice.type}</span>
                        </div>
                        <button className="text-emerald-600 bg-emerald-50 p-2 rounded hover:bg-emerald-600 hover:text-white transition">
                            <Download size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default AllNoticesPage;
