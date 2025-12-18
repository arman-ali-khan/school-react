
import React, { useState, useRef } from 'react';
import { Trash2, Save, RefreshCw, Plus, Upload, FileCheck, X, FileText as FileIcon } from 'lucide-react';
import { Notice } from '../../types';

interface AdminNoticesProps {
  notices: Notice[];
  onAdd: (notice: Notice) => Promise<any>;
  onDelete: (id: string) => Promise<any> | void;
  generateUUID: () => string;
}

const CLOUDINARY_UPLOAD_PRESET = "school"; 
const CLOUDINARY_CLOUD_NAME = "dgituybrt";

const AdminNotices: React.FC<AdminNoticesProps> = ({ notices, onAdd, onDelete, generateUUID }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'general' | 'student' | 'college' | 'exam'>('general');
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setFileUrl(data.secure_url);
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isPublishing || isUploading) return;
    
    setIsPublishing(true);
    try {
      await onAdd({
        id: generateUUID(),
        title,
        date: new Date().toISOString().split('T')[0],
        type,
        link: fileUrl || '#',
        content,
        file_url: fileUrl || undefined,
      });
      setTitle(''); 
      setContent('');
      setFileUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally { 
      setIsPublishing(false); 
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (window.confirm('Delete this notice?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
          <Plus size={18}/> Publish New Notice
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Notice Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e=>setTitle(e.target.value)} 
                className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder="e.g., HSC Examination 2025 Revised Schedule" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Category</label>
              <select 
                value={type} 
                onChange={e=>setType(e.target.value as any)} 
                className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
              >
                <option value="general">General</option>
                <option value="student">Student</option>
                <option value="college">College</option>
                <option value="exam">Exam</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">Text Content (Optional)</label>
              <textarea 
                value={content} 
                onChange={e=>setContent(e.target.value)} 
                className="w-full h-40 p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none" 
                placeholder="Write HTML or plain text notice content here..." 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">Attachment (Image or PDF)</label>
              <div 
                onClick={() => !fileUrl && fileInputRef.current?.click()}
                className={`h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative group ${
                  fileUrl 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="animate-spin text-emerald-600" size={32} />
                    <span className="text-xs font-bold text-emerald-600">Uploading to Cloudinary...</span>
                  </div>
                ) : fileUrl ? (
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-800 rounded-full text-emerald-600 dark:text-emerald-300">
                      <FileCheck size={32} />
                    </div>
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 truncate max-w-[200px]">
                      {fileUrl.split('/').pop()}
                    </span>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFileUrl(''); }}
                      className="absolute top-2 right-2 p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="text-gray-400 group-hover:text-emerald-500 transition-colors mb-2" />
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Click to upload Document</span>
                    <span className="text-[10px] text-gray-400 mt-1">Supports PDF, JPG, PNG</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".pdf,image/*" 
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isPublishing || isUploading || !title.trim()} 
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-emerald-700/20"
            >
              {isPublishing ? <RefreshCw className="animate-spin" size={20}/> : <Save size={20}/>} 
              Publish Notice
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b dark:border-gray-700">
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-widest">Recent Notices</h4>
        </div>
        <ul className="divide-y dark:divide-gray-700">
          {notices.map(n => {
            const isThisDeleting = deletingId === n.id;
            return (
              <li key={n.id} className={`p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors ${isThisDeleting ? 'opacity-50' : ''}`}>
                <div className="flex gap-4 items-center">
                  <div className={`p-2 rounded-lg ${
                    n.type === 'exam' ? 'bg-red-50 text-red-600' :
                    n.type === 'student' ? 'bg-blue-50 text-blue-600' :
                    n.type === 'college' ? 'bg-purple-50 text-purple-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    <FileIcon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm dark:text-white group-hover:text-emerald-600 transition-colors">{n.title}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase">
                      {n.date} • {n.type} {n.file_url && <span className="ml-2 text-emerald-500 font-black tracking-tighter">[ATTACHMENT]</span>}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteNotice(n.id)} 
                  disabled={isThisDeleting}
                  className="text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  title="Delete Notice"
                >
                  {isThisDeleting ? <RefreshCw className="animate-spin" size={18} /> : <Trash2 size={18}/>}
                </button>
              </li>
            );
          })}
          {notices.length === 0 && (
            <li className="p-10 text-center text-gray-400 italic text-sm">No notices published yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminNotices;
