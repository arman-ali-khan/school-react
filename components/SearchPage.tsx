import React from 'react';
import { ArrowLeft, Search, FileText } from 'lucide-react';
import { Notice } from '../types';

interface SearchPageProps {
  query: string;
  notices: Notice[];
  onBack: () => void;
  onNavigateNotice: (id: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ query, notices, onBack, onNavigateNotice }) => {
  // Simple filter logic for notices
  const results = notices.filter(notice => 
    notice.title.toLowerCase().includes(query.toLowerCase()) || 
    notice.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 min-h-[60vh] transition-colors">
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400">
           <ArrowLeft size={20} />
        </button>
        <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Search size={20} className="text-emerald-600 dark:text-emerald-400" />
                Search Results
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Showing results for: "<span className="font-bold text-gray-800 dark:text-gray-200">{query}</span>"</p>
        </div>
      </div>

      {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((item) => (
                <div key={item.id} className="p-4 border border-gray-100 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer" onClick={() => onNavigateNotice(item.id)}>
                    <div className="flex gap-3">
                         <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded text-emerald-600 dark:text-emerald-400 h-fit">
                            <FileText size={20} />
                         </div>
                         <div>
                             <h3 className="font-bold text-emerald-800 dark:text-emerald-400 hover:underline">{item.title}</h3>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <span className="mr-3">Date: {item.date}</span>
                                <span className="bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded text-xs uppercase text-gray-700 dark:text-gray-300">{item.type}</span>
                             </p>
                         </div>
                    </div>
                </div>
            ))}
          </div>
      ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg">No results found for "{query}"</p>
              <p className="text-sm">Try checking your spelling or using different keywords.</p>
          </div>
      )}
    </div>
  );
};

export default SearchPage;