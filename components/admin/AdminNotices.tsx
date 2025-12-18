
import React, { useState, useRef } from 'react';
import { Trash2, Edit, Save, RefreshCw, Plus, Upload, FileCheck, X, FileText as FileIcon, AlertCircle } from 'lucide-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Notice } from '../../types';

interface AdminNoticesProps {
  notices: Notice[];
  onAdd: (notice: Notice) => Promise<any>;
  onUpdate: (notice: Notice) => Promise<any>;
  onDelete: (id: string) => Promise<any> | void;
  generateUUID: () => string;
}

const CLOUDINARY_UPLOAD_PRESET = "school"; 
const CLOUDINARY_CLOUD_NAME = "dgituybrt";

const AdminNotices: React.FC<AdminNoticesProps> = ({ notices, onAdd, onUpdate, onDelete, generateUUID }) => {
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'general' | 'student' | 'college' | 'exam'>('general');
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const resetForm = () => {
    setEditingNotice(null);
    setTitle('');
    setType('general');
    setContent('');
    setFileUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
      const noticeData: Notice = {
        id: editingNotice?.id || generateUUID(),
        title,
        date: editingNotice?.date || new Date().toISOString().split('T')[0],
        type,
        link: fileUrl || '#',
        content,
        file_url: fileUrl || undefined,
      };

      if (editingNotice) {
        await onUpdate(noticeData);
      } else {
        await onAdd(noticeData);
      }
      resetForm();
    } finally { 
      setIsPublishing(false); 
    }
  };

  const startEditing = (notice: Notice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setType(notice.type);
    setContent(notice.content || '');
    setFileUrl(notice.file_url || '');
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="space-y-6 animate-in fade-in duration-500" ref={formRef}>
      {/* Editor Form */}
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 shadow-xl transition-all ${editingNotice ? 'border-blue-500 ring-4 ring-blue-500/5' : 'border-gray-100 dark:border-gray-700'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-black flex items-center gap-2 uppercase tracking-widest text-sm ${editingNotice ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-800 dark:text-emerald-400'}`}>
            {editingNotice ? <Edit size={18}/> : <Plus size={18}/>} 
            {editingNotice ? 'Notice Correction Mode' : 'Publish New Notice'}
          </h3>
          {editingNotice && (
            <button onClick={resetForm} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-wider">
              <X size={12}/> Discard Edit
            </button>
          )}
        </div>

        {editingNotice && (
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex items-center gap-3 text-blue-700 dark:text-blue-300">
             <AlertCircle size={18} />
             <p className="text-xs font-bold uppercase tracking-tight">You are currently editing Notice ID: {editingNotice.id.slice(0, 8)}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notice Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e=>setTitle(e.target.value)} 
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold shadow-inner" 
                placeholder="e.g., HSC Examination 2025 Revised Schedule" 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
              <select 
                value={type} 
                onChange={e=>setType(e.target.value as any)} 
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white outline-none text-sm font-bold shadow-inner"
              >
                <option value="general">General Notice</option>
                <option value="student">Student Info</option>
                <option value="college">College Admin</option>
                <option value="exam">Examination</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Article Body (Optional)</label>
              <div className="prose prose-sm max-w-none">
                <CKEditor
                  editor={ClassicEditor}
                  data={content}
                  onChange={(_, editor) => setContent(editor.getData())}
                  config={{
                    licenseKey: 'GPL',
                    placeholder: 'Type full announcement text here...',
                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo']
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Official Document (PDF/JPG)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`h-[350px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative group overflow-hidden ${
                  fileUrl 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-900'
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="animate-spin text-emerald-600" size={32} />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Syncing to Cloud...</span>
                  </div>
                ) : fileUrl ? (
                  <div className="flex flex-col items-center gap-3 p-6 text-center">
                    <div className="p-4 bg-emerald-100 dark:bg-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-300 shadow-lg">
                      <FileCheck size={40} />
                    </div>
                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 truncate max-w-[240px] uppercase font-mono bg-white dark:bg-gray-800 px-3 py-1 rounded-full border dark:border-gray-700">
                      {fileUrl.split('/').pop()}
                    </span>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFileUrl(''); }}
                      className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-md"
                    >
                      <X size={16} />
                    </button>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">Click to replace file</p>
                  </div>
                ) : (
                  <>
                    <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-3xl mb-4 text-gray-300 group-hover:text-emerald-500 transition-all border dark:border-gray-700 group-hover:scale-110">
                      <Upload size={32} />
                    </div>
                    <span className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Upload Board Document</span>
                    <span className="text-[9px] text-gray-400 mt-2 font-bold opacity-60">PDF, JPG, PNG (Max 10MB)</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,image/*" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t dark:border-gray-700 flex justify-end">
            <button 
              type="submit" 
              disabled={isPublishing || isUploading || !title.trim()} 
              className={`px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${
                editingNotice 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20' 
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
              } disabled:opacity-50 disabled:grayscale`}
            >
              {isPublishing ? <RefreshCw className="animate-spin" size={18}/> : editingNotice ? <Save size={18}/> : <Plus size={18}/>} 
              {editingNotice ? 'Update Database Entry' : 'Publish to Portal'}
            </button>
          </div>
        </form>
      </div>

      {/* List Archive */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Portal Notice Archive ({notices.length})</h4>
          <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-red-400" />
             <div className="w-2 h-2 rounded-full bg-yellow-400" />
             <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
        </div>
        <ul className="divide-y dark:divide-gray-700">
          {notices.map(n => {
            const isThisDeleting = deletingId === n.id;
            const isCurrentlyEditing = editingNotice?.id === n.id;
            return (
              <li key={n.id} className={`px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900/40 group transition-all ${isCurrentlyEditing ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <div className={`p-3 rounded-xl transition-all shadow-sm ${
                    n.type === 'exam' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' :
                    n.type === 'student' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' :
                    n.type === 'college' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' :
                    'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'
                  } ${isCurrentlyEditing ? 'ring-2 ring-blue-500' : ''}`}>
                    <FileIcon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-black text-sm truncate transition-colors ${isCurrentlyEditing ? 'text-blue-600' : 'dark:text-white group-hover:text-emerald-600'}`}>{n.title}</p>
                      {isCurrentlyEditing && <span className="text-[8px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded-full animate-pulse">EDITING</span>}
                    </div>
                    <div className="flex items-center gap-3">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        {n.date} • {n.type}
                       </p>
                       {n.file_url && (
                        <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                           File Attached
                        </div>
                       )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => startEditing(n)}
                    className={`p-2.5 rounded-xl transition-all border ${isCurrentlyEditing ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:text-blue-600 hover:border-blue-500 shadow-sm'}`}
                    title="Edit Notice"
                  >
                    <Edit size={16}/>
                  </button>
                  <button 
                    onClick={() => handleDeleteNotice(n.id)} 
                    disabled={isThisDeleting}
                    className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm border border-red-100 dark:border-red-900/30"
                  >
                    {isThisDeleting ? <RefreshCw className="animate-spin" size={16} /> : <Trash2 size={16}/>}
                  </button>
                </div>
              </li>
            );
          })}
          {notices.length === 0 && (
            <li className="p-20 text-center text-gray-400 italic font-medium">No notices found in database.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminNotices;
