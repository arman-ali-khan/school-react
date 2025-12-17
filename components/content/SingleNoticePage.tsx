
import React from 'react';
import { ArrowLeft, Download, Calendar } from 'lucide-react';
import { Notice } from '../../types/index';

interface SingleNoticePageProps { noticeId: string; notices: Notice[]; onBack: () => void; }

const SingleNoticePage: React.FC<SingleNoticePageProps> = ({ noticeId, notices, onBack }) => {
  const notice = notices.find(n => n.id === noticeId);
  if (!notice) return <div className="p-8 text-center text-red-500">Notice not found. <button onClick={onBack} className="underline">Go Back</button></div>;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 overflow-hidden min-h-[600px] flex flex-col">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 border-b dark:border-gray-700 flex justify-between items-center">
             <button onClick={onBack} className="flex items-center text-sm text-emerald-700 font-bold"><ArrowLeft size={16} /> Back</button>
             <button className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded text-xs"><Download size={14} /> Download</button>
        </div>
        <div className="p-6 border-b dark:border-gray-700"><h1 className="text-2xl font-bold mb-2">{notice.title}</h1><div className="flex items-center gap-4 text-sm text-gray-500"><span className="flex items-center gap-1"><Calendar size={14} /> Published: {notice.date}</span></div></div>
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-8"><div className="bg-white dark:bg-gray-800 p-8 rounded shadow-sm min-h-[400px] prose dark:prose-invert"><p>Official notice details for <strong>{notice.title}</strong>.</p></div></div>
    </div>
  );
};
export default SingleNoticePage;
