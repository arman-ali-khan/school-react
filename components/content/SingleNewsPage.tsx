
import React from 'react';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';

interface SingleNewsPageProps {
  newsTitle: string;
  onBack: () => void;
}

const SingleNewsPage: React.FC<SingleNewsPageProps> = ({ newsTitle, onBack }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="relative h-64 md:h-80 w-full">
            <img 
                src={`https://picsum.photos/800/400?random=${newsTitle.length}`} 
                alt="News Banner" 
                className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
                <button onClick={onBack} className="flex items-center gap-1 bg-white/90 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-white dark:hover:bg-gray-900 transition shadow-sm backdrop-blur-sm">
                    <ArrowLeft size={14} /> Back to News
                </button>
            </div>
        </div>

        <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    <span>Published: Today</span>
                </div>
                <button className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                    <Share2 size={18} />
                </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">{newsTitle}</h1>

            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <p className="lead font-medium text-lg mb-4">
                    Detailed report regarding the recent announcement: {newsTitle}.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <blockquote className="border-l-4 border-emerald-500 dark:border-emerald-400 pl-4 italic my-4 text-gray-600 dark:text-gray-400">
                    "This initiative marks a significant step towards the digitization of the education board's services."
                </blockquote>
                <p>
                    More information will be provided in subsequent updates. Stakeholders are requested to keep an eye on the official notice board.
                </p>
            </div>
        </div>
    </div>
  );
};

export default SingleNewsPage;
