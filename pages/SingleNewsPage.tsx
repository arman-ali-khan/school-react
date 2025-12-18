
import React from 'react';
import { ArrowLeft, Calendar, Share2, Newspaper } from 'lucide-react';
import { NewsItem } from '../types';

interface SingleNewsPageProps {
  newsItem?: NewsItem;
  onBack: () => void;
}

const SingleNewsPage: React.FC<SingleNewsPageProps> = ({ newsItem, onBack }) => {
  if (!newsItem) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-lg">
        <p className="text-red-500 mb-4">News item not found.</p>
        <button onClick={onBack} className="text-emerald-600 underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="relative h-64 md:h-80 w-full bg-emerald-900 flex items-center justify-center overflow-hidden">
            {newsItem.thumbnail_url ? (
                <img 
                    src={newsItem.thumbnail_url} 
                    alt={newsItem.title} 
                    className="w-full h-full object-cover"
                />
            ) : (
                <Newspaper size={120} className="text-white/20" />
            )}
            <div className="absolute top-4 left-4">
                <button onClick={onBack} className="flex items-center gap-1 bg-white/90 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-white dark:hover:bg-gray-900 transition shadow-sm backdrop-blur-sm">
                    <ArrowLeft size={14} /> Back
                </button>
            </div>
        </div>

        <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-bold">
                    <Calendar size={14} />
                    <span>{newsItem.date}</span>
                </div>
                <button className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                    <Share2 size={18} />
                </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight border-b dark:border-gray-700 pb-4">
                {newsItem.title}
            </h1>

            <div 
              className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: newsItem.content }}
            />
        </div>
    </div>
  );
};

export default SingleNewsPage;
