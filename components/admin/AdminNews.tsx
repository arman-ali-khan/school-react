
import React, { useState, useRef } from 'react';
import { Trash2, Edit, Save, RefreshCw, Plus, Upload, ImageIcon, X, Newspaper, AlertCircle } from 'lucide-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NewsItem } from '../../types';

interface AdminNewsProps {
  news: NewsItem[];
  onAdd: (newsItem: NewsItem) => Promise<any>;
  onUpdate: (newsItem: NewsItem) => Promise<any>;
  onDelete: (id: string) => Promise<any> | void;
  generateUUID: () => string;
}

const CLOUDINARY_UPLOAD_PRESET = "school"; 
const CLOUDINARY_CLOUD_NAME = "dgituybrt";

const AdminNews: React.FC<AdminNewsProps> = ({ news, onAdd, onUpdate, onDelete, generateUUID }) => {
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const resetForm = () => {
    setEditingNews(null);
    setTitle('');
    setContent('');
    setThumbnailUrl('');
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
        setThumbnailUrl(data.secure_url);
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Thumbnail upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isPublishing || isUploading) return;
    
    setIsPublishing(true);
    try {
      const newsData: NewsItem = {
        id: editingNews?.id || generateUUID(),
        title,
        content,
        thumbnail_url: thumbnailUrl || undefined,
        date: editingNews?.date || new Date().toISOString().split('T')[0],
      };

      if (editingNews) {
        await onUpdate(newsData);
      } else {
        await onAdd(newsData);
      }
      resetForm();
    } finally { 
      setIsPublishing(false); 
    }
  };

  const startEditing = (n: NewsItem) => {
    setEditingNews(n);
    setTitle(n.title);
    setContent(n.content);
    setThumbnailUrl(n.thumbnail_url || '');
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Delete this news item?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500" ref={formRef}>
      {/* Input Form */}
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 shadow-xl transition-all ${editingNews ? 'border-orange-500 ring-4 ring-orange-500/5' : 'border-gray-100 dark:border-gray-700'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-black flex items-center gap-2 uppercase tracking-widest text-sm ${editingNews ? 'text-orange-600 dark:text-orange-400' : 'text-blue-800 dark:text-blue-400'}`}>
            {editingNews ? <Edit size={18}/> : <Plus size={18}/>} 
            {editingNews ? 'Headline Correction' : 'New Ticker Headline'}
          </h3>
          {editingNews && (
            <button onClick={resetForm} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-wider">
              <X size={12}/> Discard Edit
            </button>
          )}
        </div>

        {editingNews && (
          <div className="mb-6 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-xl flex items-center gap-3 text-orange-700 dark:text-orange-300">
             <AlertCircle size={18} />
             <p className="text-xs font-bold uppercase tracking-tight">Updating News Headline: {editingNews.title.slice(0, 30)}...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ticker Headline</label>
            <input 
              type="text" 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold shadow-inner" 
              placeholder="e.g., Board Chairman announces new digital portal features..." 
              required 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detailed Story (Click Ticker to read)</label>
              <div className="prose prose-sm max-w-none">
                <CKEditor
                  editor={ClassicEditor}
                  data={content}
                  onChange={(_, editor) => setContent(editor.getData())}
                  config={{
                    licenseKey: 'GPL',
                    placeholder: 'Write the full story here...',
                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo']
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">News Thumbnail (800x400)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`h-[345px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative group overflow-hidden ${
                  thumbnailUrl 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="animate-spin text-blue-600" size={32} />
                    <span className="text-[10px] font-black text-blue-600 uppercase">Uploading Photo...</span>
                  </div>
                ) : thumbnailUrl ? (
                  <div className="w-full h-full relative group/img">
                    <img src={thumbnailUrl} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                       <Upload size={32} className="text-white" />
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setThumbnailUrl(''); }}
                      className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-300 group-hover:text-blue-500 transition-all border dark:border-gray-700">
                      <ImageIcon size={32} />
                    </div>
                    <span className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-4">Drop Header Image</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t dark:border-gray-700 flex justify-end">
            <button 
              type="submit" 
              disabled={isPublishing || isUploading || !title.trim() || !content.trim()} 
              className={`px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${
                editingNews 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20' 
                  : 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-700/20'
              } disabled:opacity-50`}
            >
              {isPublishing ? <RefreshCw className="animate-spin" size={18}/> : editingNews ? <Save size={18}/> : <Plus size={18}/>} 
              {editingNews ? 'Apply Corrections' : 'Add to Ticker Feed'}
            </button>
          </div>
        </form>
      </div>

      {/* Ticker Management List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b dark:border-gray-700">
          <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Active Ticker Items ({news.length})</h4>
        </div>
        <ul className="divide-y dark:divide-gray-700">
          {news.map(n => {
            const isThisDeleting = deletingId === n.id;
            const isCurrentlyEditing = editingNews?.id === n.id;
            return (
              <li key={n.id} className={`px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900/40 group transition-all ${isCurrentlyEditing ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}`}>
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <div className={`w-14 h-10 rounded-lg flex items-center justify-center overflow-hidden border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 ${isCurrentlyEditing ? 'ring-2 ring-orange-500 border-transparent shadow-md' : 'text-gray-400 shadow-sm'}`}>
                    {n.thumbnail_url ? (
                      <img src={n.thumbnail_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <Newspaper size={18} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold text-sm truncate ${isCurrentlyEditing ? 'text-orange-600' : 'dark:text-white group-hover:text-blue-600 transition-colors'}`}>{n.title}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                      {n.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => startEditing(n)}
                    className={`p-2.5 rounded-xl transition-all border ${isCurrentlyEditing ? 'bg-orange-600 text-white border-orange-600' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:text-orange-500 hover:border-orange-500 shadow-sm'}`}
                    title="Edit News"
                  >
                    <Edit size={16}/>
                  </button>
                  <button 
                    onClick={() => handleDeleteNews(n.id)} 
                    disabled={isThisDeleting}
                    className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm border border-red-100 dark:border-red-900/30"
                  >
                    {isThisDeleting ? <RefreshCw className="animate-spin" size={16} /> : <Trash2 size={16}/>}
                  </button>
                </div>
              </li>
            );
          })}
          {news.length === 0 && (
            <li className="p-16 text-center text-gray-400 italic font-medium">Ticker is empty. Feed is idle.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminNews;
