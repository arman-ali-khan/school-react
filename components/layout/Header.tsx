
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  GraduationCap, School, Book, Library, Award, Shield, Building, Users, CheckCircle, FileText 
} from 'lucide-react';

const IconMapper: Record<string, React.FC<any>> = {
  GraduationCap, School, Book, Library, Award, Shield, Building, Users, CheckCircle, FileText
};

const Header: React.FC = () => {
  const { schoolInfo } = useSelector((state: RootState) => state.content);

  const renderLogo = () => {
    if (schoolInfo.logoUrl) {
      return <img src={schoolInfo.logoUrl} alt="Board Logo" className="w-full h-full object-cover" />;
    }
    
    if (schoolInfo.iconName && IconMapper[schoolInfo.iconName]) {
      const IconComponent = IconMapper[schoolInfo.iconName];
      return <IconComponent className="w-12 h-12" />;
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12"><path d="M22 10v6M2 10v6"/><path d="M2 16h20"/><path d="M12 22v-6"/><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m22 7-10 5-10-5"/></svg>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-900 py-6 shadow-sm transition-colors border-b dark:border-gray-800">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
          <div className="w-full h-full rounded-full bg-emerald-700 flex items-center justify-center text-white border-4 border-emerald-50 dark:border-gray-800 shadow-xl overflow-hidden">
             {renderLogo()}
          </div>
        </div>
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 dark:text-emerald-500 uppercase font-serif tracking-tight">
            {schoolInfo.name}
          </h1>
           <h1 className="text-sm md:text-xl mt-1 font-bold text-emerald-900 dark:text-emerald-500 uppercase font-serif tracking-tight">
            {schoolInfo.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium italic">{schoolInfo.address}</p>
        </div>
        
        <div className="hidden lg:flex items-center gap-4">
             <div className="bg-emerald-50 dark:bg-gray-800 p-4 rounded-xl border border-emerald-100 dark:border-gray-700 flex items-center gap-6 shadow-sm">
                <div className="text-center border-r border-emerald-100 dark:border-gray-700 pr-6">
                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest">EIIN</p>
                    <p className="text-xl font-black text-emerald-800 dark:text-emerald-400">{schoolInfo.eiin}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest">Founded</p>
                    <p className="text-xl font-black text-emerald-800 dark:text-emerald-400">{schoolInfo.code}</p>
                </div>
             </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
