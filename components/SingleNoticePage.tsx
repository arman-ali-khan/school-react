
import React from 'react';
import { ArrowLeft, Download, FileText, Calendar, ExternalLink } from 'lucide-react';
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

  // Determine if it's a file display or text display
  const hasFile = !!notice.file_url;
  const isImage = notice.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[600px] flex flex-col transition-colors">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 border-b border-emerald-100 dark:border-gray-700 flex justify-between items-center">
             <button onClick={onBack} className="flex items-center text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold">
                <ArrowLeft size={16} className="mr-1" /> Back to Notice Board
             </button>
             <div className="flex gap-2">
                 {notice.file_url && (
                   <a 
                    href={notice.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-emerald-600 dark:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs hover:bg-emerald-700 dark:hover:bg-emerald-600 transition font-bold shadow-sm"
                   >
                    <Download size={14} /> Download File
                   </a>
                 )}
             </div>
        </div>

        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">{notice.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  <Calendar size={14} /> {notice.date}
                </span>
                <span className={`px-2 py-1 rounded text-xs uppercase font-bold border ${
                    notice.type === 'exam' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' :
                    notice.type === 'student' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' :
                    notice.type === 'college' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30' :
                    'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-600'
                }`}>{notice.type}</span>
                <span className="text-xs text-gray-400">Notice ID: #{notice.id}</span>
            </div>
        </div>

        <div className="flex-1 bg-gray-50 dark:bg-gray-900/30 p-4 md:p-8">
            {hasFile ? (
                <div className="w-full space-y-4">
                  <div className="w-full min-h-[600px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-xl rounded-lg overflow-hidden flex flex-col">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 flex justify-between items-center border-b dark:border-gray-600">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Document Preview</span>
                      <a href={notice.file_url} target="_blank" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 p-1">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    {isImage ? (
                      <div className="p-4 flex justify-center">
                        <img src={notice.file_url} alt={notice.title} className="max-w-full h-auto shadow-sm" />
                      </div>
                    ) : (
                      <iframe 
                        src={`${notice.file_url}#view=FitH`} 
                        className="w-full flex-1 min-h-[600px]"
                        title="Notice PDF"
                      ></iframe>
                    )}
                  </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-center mb-10 opacity-10 dark:opacity-20 text-emerald-900 dark:text-white">
                        <FileText size={80} />
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 flex-1">
                        {notice.content ? (
                          <div dangerouslySetInnerHTML={{ __html: notice.content }} />
                        ) : (
                          <div className="italic text-gray-400 text-center py-20">
                            This notice has no text content. Please check for attachments.
                          </div>
                        )}
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-between items-end">
                      <div className="text-xs text-gray-400">
                        Generated automatically by BISE Dinajpur Digital System
                      </div>
                      <div className="text-right">
                        <div className="mb-4">
                          <img src="https://via.placeholder.com/100x40?text=SIGNATURE" alt="Signature" className="ml-auto dark:invert dark:brightness-200 opacity-60" />
                        </div>
                        <p className="font-bold text-emerald-900 dark:text-emerald-400">Secretary</p>
                        <p className="text-xs text-gray-500">Board of Intermediate and Secondary Education, Dinajpur</p>
                      </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default SingleNoticePage;
