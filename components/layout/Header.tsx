
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-900 py-6 shadow-sm transition-colors border-b dark:border-gray-800">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
          <div className="w-full h-full rounded-full bg-emerald-700 flex items-center justify-center text-white border-4 border-emerald-50 dark:border-gray-800 shadow-xl">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12"><path d="M22 10v6M2 10v6"/><path d="M2 16h20"/><path d="M12 22v-6"/><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m22 7-10 5-10-5"/></svg>
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 dark:text-emerald-500 uppercase font-serif tracking-tight">
            Board of Intermediate and Secondary Education
          </h1>
          <h2 className="text-xl md:text-2xl text-emerald-700 dark:text-emerald-600 font-semibold">
            Dinajpur, Bangladesh
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Empowering the Future through Quality Assessment</p>
        </div>
        
        <div className="hidden lg:flex ml-auto items-center gap-4">
             <div className="bg-emerald-50 dark:bg-gray-800 p-4 rounded-xl border border-emerald-100 dark:border-gray-700 flex items-center gap-4 shadow-sm">
                <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest">Board Hotline</p>
                    <p className="text-2xl font-black text-emerald-800 dark:text-emerald-400">16221</p>
                </div>
             </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
