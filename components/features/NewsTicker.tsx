
import React, { useState, useEffect } from 'react';
import { NewsItem } from '../../types';

const ITEM_HEIGHT = 24; 

interface NewsTickerProps {
    newsItems: NewsItem[];
    onNavigateNews: (item: NewsItem) => void;
    onViewAll: () => void;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ newsItems, onNavigateNews, onViewAll }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (newsItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-2 flex items-center justify-between rounded-lg shadow-sm mb-4 transition-colors">
       <div className="flex items-center flex-1 overflow-hidden px-1">
          <span className="font-bold text-emerald-800 dark:text-emerald-400 mr-2 whitespace-nowrap text-sm">Update:</span>
          
          <div className="relative w-full overflow-hidden" style={{ height: `${ITEM_HEIGHT}px` }}>
             <div 
               className="transition-transform duration-700 ease-in-out flex flex-col"
               style={{ transform: `translateY(-${currentIndex * ITEM_HEIGHT}px)` }}
             >
                {newsItems.map((item) => (
                    <div 
                        key={item.id} 
                        className="flex items-center w-full"
                        style={{ height: `${ITEM_HEIGHT}px` }}
                    >
                         <button 
                             onClick={() => onNavigateNews(item)}
                             className="text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline truncate w-full text-left"
                         >
                            {item.title}
                         </button>
                    </div>
                ))}
                {newsItems.length === 0 && (
                     <div className="text-sm text-gray-500 italic">No news updates.</div>
                )}
             </div>
          </div>
       </div>
       
       <button 
          onClick={onViewAll}
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 ml-3 rounded shadow-sm transition-colors uppercase tracking-wider shrink-0"
       >
          All
       </button>
    </div>
  );
};

export default NewsTicker;
