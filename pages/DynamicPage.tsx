
import React from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Page } from '../types';

interface DynamicPageProps {
  page: Page;
  onBack: () => void;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ page, onBack }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors min-h-[60vh]">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 border-b border-emerald-100 dark:border-gray-700">
            <button onClick={onBack} className="flex items-center text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold mb-4">
                <ArrowLeft size={16} className="mr-1" /> Back to Home
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{page.title}</h1>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={12} className="mr-1" />
                <span>Last updated: {new Date(page.date).toLocaleDateString()}</span>
            </div>
        </div>

        <div className="p-8">
            <div 
                className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </div>
    </div>
  );
};

export default DynamicPage;
