
import React from 'react';
import { ArrowLeft, User as UserIcon } from 'lucide-react';

interface ChairmanData {
  name: string;
  designation: string;
  image?: string;
  quote?: string;
  content?: string;
}

interface ChairmanMessagePageProps {
  onBack: () => void;
  data?: ChairmanData;
}

const ChairmanMessagePage: React.FC<ChairmanMessagePageProps> = ({ onBack, data }) => {
  const chairmanName = data?.name || "Chairman";
  const chairmanDesignation = data?.designation || "Board of Intermediate and Secondary Education, Dinajpur";
  const chairmanImage = data?.image || "https://res.cloudinary.com/dgituybrt/image/upload/v1740000000/placeholder_profile.png";
  const chairmanQuote = data?.quote || "Welcome to the official website of the Board of Intermediate and Secondary Education, Dinajpur.";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 border-b border-emerald-100 dark:border-gray-700 flex justify-between items-center">
             <button onClick={onBack} className="flex items-center text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold">
                <ArrowLeft size={16} className="mr-1" /> Back to Home
             </button>
             <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-400">Message from the Desk</h2>
        </div>
        
        <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/3 flex flex-col items-center">
                    <div className="w-64 h-72 bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden border-8 border-white dark:border-gray-800 mb-6 rotate-1 hover:rotate-0 transition-transform duration-500">
                        {data?.image ? (
                          <img 
                              src={chairmanImage} 
                              alt={chairmanName} 
                              className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <UserIcon size={120} />
                          </div>
                        )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-black text-emerald-900 dark:text-white leading-tight">{chairmanName}</h3>
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider mt-1">{chairmanDesignation}</p>
                    </div>
                </div>

                <div className="md:w-2/3">
                    <div className="relative">
                      <span className="absolute -top-10 -left-6 text-9xl text-emerald-100 dark:text-emerald-900/30 font-serif leading-none select-none">“</span>
                      <div className="prose prose-emerald dark:prose-invert max-w-none relative z-10">
                          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed italic mb-8 font-medium">
                              "{chairmanQuote}"
                          </p>
                          
                          {data?.content ? (
                            <div className="space-y-4 text-gray-600 dark:text-gray-400 chairman-content" dangerouslySetInnerHTML={{ __html: data.content }} />
                          ) : (
                            <div className="space-y-4 text-gray-600 dark:text-gray-400">
                              <p>
                                  The Dinajpur Education Board is consistently striving to modernize the examination and administration systems through digital transformation. Our primary goal is to ensure that students, teachers, and educational institutions within the Rangpur division can access all necessary services with ease and transparency.
                              </p>
                              <p>
                                  We believe in the power of quality education to transform lives and build a better nation. Through our rigorous assessment processes and academic guidelines, we aim to maintain high standards of excellence that prepare our students for future challenges.
                              </p>
                              <p>
                                  I extend my heartfelt gratitude to all the stakeholders who contribute to our success. Together, we can foster an environment of growth and learning for every student under our jurisdiction.
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                    
                    <div className="mt-12 pt-8 border-t dark:border-gray-700">
                      <p className="font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-tighter text-lg">
                        <span className='font-signature capitalize'>{chairmanName}</span><br/>
                        Signature
                      </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ChairmanMessagePage;
