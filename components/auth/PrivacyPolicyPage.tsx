
import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
      <button onClick={onBack} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>

      <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full">
            <Shield size={24} className="text-emerald-700 dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Privacy Policy</h1>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 space-y-4">
        <p>Your privacy is important to us. It is Dinajpur Education Board's policy to respect your privacy regarding any information we may collect from you across our website.</p>

        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mt-4">1. Information We Collect</h3>
        <p>We may ask for personal information, such as your:</p>
        <ul className="list-disc pl-5">
            <li>Name</li>
            <li>Email</li>
            <li>Phone number</li>
            <li>Student Registration/Roll Number</li>
        </ul>

        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mt-4">2. How We Use Information</h3>
        <p>We use the information we collect in various ways, including to:</p>
        <ul className="list-disc pl-5">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Communicate with you regarding updates, results, or notices</li>
        </ul>

        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mt-4">3. Data Security</h3>
        <p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet is 100% secure.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
