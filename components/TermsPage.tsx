import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
      <button onClick={onBack} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>
      
      <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full">
            <FileText size={24} className="text-emerald-700 dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Terms and Conditions</h1>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 space-y-4">
        <p className="font-bold">Last Updated: May 2024</p>
        
        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mt-4">1. Acceptance of Terms</h3>
        <p>By accessing and using the Board of Intermediate and Secondary Education, Dinajpur website (the "Site"), you accept and agree to be bound by the terms and provision of this agreement.</p>

        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mt-4">2. Educational Content</h3>
        <p>All content provided on this website is for informational purposes only. The Board makes no representations as to the accuracy or completeness of any information on this site or found by following any link on this site.</p>

        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mt-4">3. User Accounts</h3>
        <p>To access certain features of the website, you may be asked to create an account. You are responsible for maintaining the confidentiality of your account and password.</p>

        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mt-4">4. Intellectual Property</h3>
        <p>The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights and intellectual property laws.</p>
        
        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mt-4">5. Limitation of Liability</h3>
        <p>In no event shall the Board be liable for any special, incidental, indirect, or consequential damages of any kind whatsoever resulting from loss of use, data, or profits.</p>
      </div>
    </div>
  );
};

export default TermsPage;