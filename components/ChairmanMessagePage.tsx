import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ChairmanMessagePageProps {
  onBack: () => void;
}

const ChairmanMessagePage: React.FC<ChairmanMessagePageProps> = ({ onBack }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 border-b border-emerald-100 dark:border-gray-700 flex justify-between items-center">
             <button onClick={onBack} className="flex items-center text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold">
                <ArrowLeft size={16} className="mr-1" /> Back to Home
             </button>
             <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-400">Chairman's Message</h2>
        </div>
        
        <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center">
                    <div className="w-48 h-56 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden border-4 border-white dark:border-gray-600 mb-4">
                        <img 
                            src="https://picsum.photos/200/200?random=10" 
                            alt="Prof. Md. Kamrul Islam" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-900 dark:text-white">Prof. Md. Kamrul Islam</h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">Chairman</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Board of Intermediate and Secondary Education, Dinajpur</p>
                </div>

                <div className="md:w-2/3 prose prose-emerald dark:prose-invert max-w-none">
                    <p className="lead text-lg text-gray-700 dark:text-gray-300">
                        "Welcome to the official website of the Board of Intermediate and Secondary Education, Dinajpur. We are committed to ensuring quality education and transparent examination systems for all students in the Rangpur division."
                    </p>
                    
                    <p className="text-gray-700 dark:text-gray-300">
                        Since its inception, the Dinajpur Education Board has been striving to modernize the education management system. We have introduced digital services for student registration, form fill-up, and result publication to ensure hassle-free services for students, teachers, and guardians.
                    </p>
                    
                    <p className="text-gray-700 dark:text-gray-300">
                        Our mission is to foster an environment where academic excellence is prioritized alongside moral development. We believe that technology plays a crucial role in today's education sector, and we are continuously working to integrate modern ICT facilities into our operational framework.
                    </p>
                    
                    <p className="text-gray-700 dark:text-gray-300">
                        I seek the cooperation of all stakeholders—teachers, parents, and students—to maintain a fair and conducive academic atmosphere. Let us work together to build a prosperous and educated nation.
                    </p>
                    
                </div>
            </div>
        </div>
    </div>
  );
};

export default ChairmanMessagePage;