
import React, { useState } from 'react';
import { ArrowLeft, Newspaper, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface AllNewsPageProps {
  newsItems: string[];
  onBack: () => void;
  onNavigateNews: (title: string) => void;
}

const ITEMS_PER_PAGE = 5;

const AllNewsPage: React.FC<AllNewsPageProps> = ({ newsItems, onBack, onNavigateNews }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(newsItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNewsItems = newsItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors min-h-[80vh] flex flex-col">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 border-b border-emerald-100 dark:border-gray-700">
             <button onClick={onBack} className="flex items-center text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold mb-2">
                <ArrowLeft size={16} className="mr-1" /> Back to Home
             </button>
             <h1 className="text-2xl font-bold text-emerald-900 dark:text-white flex items-center gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full">
                    <Newspaper className="text-emerald-600 dark:text-emerald-400" size={24} />
                </div>
                Latest News & Updates
             </h1>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Stay updated with the latest announcements from the Dinajpur Education Board.
             </p>
        </div>

        <div className="p-4 md:p-8 flex-grow">
            <div className="grid gap-4">
                {currentNewsItems.map((news, index) => (
                    <div 
                        key={index} 
                        onClick={() => onNavigateNews(news)}
                        className="dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-700/50 transition cursor-pointer group flex gap-4 items-center"
                    >
                         <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            <Newspaper size={20} />
                        </div>

                        <div className="flex-grow">
                            <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                {news}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 dark:text-gray-500">
                                <Calendar size={12} />
                                Published recently
                            </div>
                        </div>

                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                             <ArrowLeft size={20} className="rotate-180 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                ))}
                {newsItems.length === 0 && (
                     <div className="text-center py-10 text-gray-500">No news updates available.</div>
                )}
            </div>
        </div>

        {newsItems.length > ITEMS_PER_PAGE && (
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

export default AllNewsPage;
