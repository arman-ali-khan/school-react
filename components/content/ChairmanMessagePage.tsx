
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ChairmanMessagePageProps { onBack: () => void; }

const ChairmanMessagePage: React.FC<ChairmanMessagePageProps> = ({ onBack }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 overflow-hidden">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 border-b dark:border-gray-700 flex justify-between items-center">
             <button onClick={onBack} className="flex items-center text-sm text-emerald-700 dark:text-emerald-400 font-bold"><ArrowLeft size={16} className="mr-1" /> Back to Home</button>
             <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-400">Chairman's Message</h2>
        </div>
        <div className="p-8"><div className="flex flex-col md:flex-row gap-8"><div className="md:w-1/3 flex flex-col items-center"><div className="w-48 h-56 bg-gray-200 rounded-lg overflow-hidden mb-4"><img src="https://picsum.photos/200/200?random=10" alt="Chairman" className="w-full h-full object-cover"/></div><h3 className="text-xl font-bold">Prof. Md. Kamrul Islam</h3><p className="text-emerald-600">Chairman</p></div><div className="md:w-2/3 prose dark:prose-invert"><p>"We are committed to quality education and transparent systems."</p><p>Since inception, we strive for modernization.</p></div></div></div>
    </div>
  );
};
export default ChairmanMessagePage;
