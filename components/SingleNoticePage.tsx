import React from 'react';
import { ArrowLeft, Download, FileText, Calendar } from 'lucide-react';
import { Notice } from '../types';

interface SingleNoticePageProps {
  noticeId: string;
  notices: Notice[];
  onBack: () => void;
}

const SingleNoticePage: React.FC<SingleNoticePageProps> = ({ noticeId, notices, onBack }) => {
  const notice = notices.find(n => n.id === noticeId);
  
  if (!notice) {
    return <div className="p-8 text-center text-red-500">Notice not found. <button onClick={onBack} className="underline ml-2">Go Back</button></div>;
  }

  // Mock logic: Even IDs are PDFs, Odd IDs are text
  // Safely parse ID, if not a number default to odd (text)
  const isPdf = !isNaN(parseInt(noticeId)) && parseInt(noticeId) % 2 === 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[600px] flex flex-col transition-colors">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 border-b border-emerald-100 dark:border-gray-700 flex justify-between items-center">
             <button onClick={onBack} className="flex items-center text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold">
                <ArrowLeft size={16} className="mr-1" /> Back to Notice Board
             </button>
             <div className="flex gap-2">
                 <button className="flex items-center gap-1 bg-emerald-600 dark:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs hover:bg-emerald-700 dark:hover:bg-emerald-600 transition">
                    <Download size={14} /> Download {isPdf ? 'PDF' : 'Attachment'}
                 </button>
             </div>
        </div>

        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{notice.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><Calendar size={14} /> Published: {notice.date}</span>
                <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold border ${
                    notice.type === 'exam' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' :
                    notice.type === 'student' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' :
                    notice.type === 'college' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30' :
                    'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-600'
                }`}>{notice.type}</span>
            </div>
        </div>

        <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            {isPdf ? (
                <div className="w-full h-[600px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm rounded flex items-center justify-center relative overflow-hidden">
                     {/* Using a dummy PDF viewer iframe placeholder or actual embed if URL existed */}
                     <iframe 
                        src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
                        className="w-full h-full"
                        title="Notice PDF"
                     >
                        <div className="text-center p-4">
                            <p className="text-gray-700 dark:text-gray-300">Your browser does not support PDFs. <a href="#" className="text-emerald-600 dark:text-emerald-400 underline">Download the PDF</a> to view it.</p>
                        </div>
                     </iframe>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 shadow-sm rounded min-h-[400px]">
                    <div className="flex items-center justify-center mb-6 opacity-10 dark:opacity-20 text-gray-900 dark:text-white">
                        <FileText size={64} />
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                        <p className="mb-4">
                            <strong>Ref: BISE/DIN/{notice.id}/2024</strong> <br/>
                            <strong>Date: {notice.date}</strong>
                        </p>
                        <p className="mb-4">
                            This is to inform all concerned regarding the <strong>{notice.title}</strong>. 
                        </p>
                        <p className="mb-4">
                            The details of the instruction are as follows:
                            <br/>
                            1. Ensure all documents are submitted by the deadline.
                            <br/>
                            2. Late submissions will not be entertained.
                            <br/>
                            3. Please contact the controller of examinations for further clarification.
                        </p>
                        <p className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 text-right">
                            Signed,<br/>
                            <strong>Secretary</strong><br/>
                            Board of Intermediate and Secondary Education, Dinajpur
                        </p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default SingleNoticePage;