
import React from 'react';
import { NewsItem } from '../../types';
import { Newspaper } from 'lucide-react';

interface NewsTickerProps {
    newsItems: NewsItem[];
    onNavigateNews: (item: NewsItem) => void;
    onViewAll: () => void;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ newsItems, onNavigateNews, onViewAll }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-emerald-100 dark:border-gray-700 flex items-center rounded-lg shadow-sm mb-6 overflow-hidden transition-colors h-10 group/ticker">
       {/* Label Section */}
       <div className="bg-red-600 text-white px-4 h-full flex items-center gap-2 z-10 shadow-[4px_0_10px_rgba(0,0,0,0.1)] relative shrink-0">
          <Newspaper size={14} className="animate-pulse" />
          <span className="font-black text-[11px] uppercase tracking-widest whitespace-nowrap">Latest News</span>
       </div>
       
       {/* Scrolling Content */}
       <div className="flex-1 overflow-hidden relative h-full flex items-center">
          {newsItems.length > 0 ? (
            <div className="flex whitespace-nowrap animate-marquee group-hover/ticker:[animation-play-state:paused] hover:cursor-pointer">
              {/* Double the items for seamless looping */}
              {[...newsItems, ...newsItems].map((item, idx) => (
                <button 
                  key={`${item.id}-${idx}`}
                  onClick={() => onNavigateNews(item)}
                  className="inline-flex items-center px-6 text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3 shrink-0" />
                  {item.title}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-6 text-xs text-gray-400 italic">Connecting to live feed...</div>
          )}
       </div>
       
       {/* View All Button */}
       <button 
          onClick={onViewAll}
          className="bg-emerald-50 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-gray-600 text-emerald-700 dark:text-emerald-300 text-[10px] font-black px-4 h-full border-l border-emerald-100 dark:border-gray-600 transition-colors uppercase tracking-widest shrink-0 z-10"
       >
          All News
       </button>

       <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
       `}</style>
    </div>
  );
};

export default NewsTicker;
