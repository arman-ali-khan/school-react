
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, RefreshCw, Eye, Copy, Check } from 'lucide-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Page } from '../../types';

interface AdminPagesProps {
  pages: Page[];
  onAdd: (page: Page) => Promise<any>;
  onUpdate: (page: Page) => Promise<any>;
  onDelete: (id: string) => Promise<any> | void;
  generateUUID: () => string;
  onPreviewPage?: (slug: string) => void;
}

const AdminPages: React.FC<AdminPagesProps> = ({ pages, onAdd, onUpdate, onDelete, generateUUID, onPreviewPage }) => {
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const sanitizeSlug = (val: string) => {
    return val.toLowerCase()
      .replace(/[^a-z0-9-\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSave = async () => {
    if (!title.trim() || isSaving) return;
    setIsSaving(true);
    try {
      const finalSlug = sanitizeSlug(slug || title);
      const pageData: Page = {
        id: editingPage?.id || generateUUID(),
        title,
        content,
        slug: finalSlug,
        date: new Date().toISOString()
      };
      if (editingPage) await onUpdate(pageData); else await onAdd(pageData);
      reset();
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setEditingPage(null); setTitle(''); setSlug(''); setContent('');
  };

  const handleDeletePage = async (id: string) => {
    if (window.confirm('Delete this page permanently?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const copyToClipboard = (pageSlug: string) => {
    const internalLink = `page:${pageSlug}`;
    navigator.clipboard.writeText(internalLink);
    setCopiedSlug(pageSlug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
          {editingPage ? <Edit size={18}/> : <Plus size={18}/>} {editingPage ? 'Edit Page' : 'Create New Page'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Page Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="e.g., Admission Guidelines" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">URL Slug (Will be sanitized)</label>
            <input 
              type="text" 
              value={slug} 
              onChange={e=>setSlug(sanitizeSlug(e.target.value))} 
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono" 
              placeholder="e.g., admission-rules" 
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Page Content</label>
          <div className="prose prose-sm max-w-none">
            <CKEditor
              editor={ClassicEditor}
              data={content}
              onChange={(_, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
              config={{
                licenseKey: 'GPL',
                placeholder: 'Write your page content here...',
                toolbar: [
                  'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo'
                ]
              }}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button 
            onClick={handleSave} 
            disabled={!title.trim() || isSaving}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>} 
            {editingPage ? 'Update Page' : 'Publish Page'}
          </button>
          {editingPage && (
            <button onClick={reset} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-300 transition-all">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-widest">Active Site Pages</h4>
          <span className="text-[10px] text-gray-400 font-medium">To link to these, use the format: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-emerald-600">page:slug</code></span>
        </div>
        <ul className="divide-y dark:divide-gray-700">
          {pages.map(p => {
            const isThisDeleting = deletingId === p.id;
            return (
              <li key={p.id} className={`p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors ${isThisDeleting ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                    <FileIcon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm dark:text-white group-hover:text-emerald-600 transition-colors">{p.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">/{p.slug}</span>
                      <button 
                        onClick={() => copyToClipboard(p.slug)}
                        className={`text-[9px] font-bold flex items-center gap-1 transition-all ${copiedSlug === p.slug ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-600'}`}
                      >
                        {copiedSlug === p.slug ? <Check size={10}/> : <Copy size={10}/>}
                        {copiedSlug === p.slug ? 'COPIED' : 'COPY INTERNAL LINK'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => onPreviewPage?.(p.slug)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 border dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:border-emerald-500 hover:text-emerald-600 transition-all"
                  >
                    <Eye size={14}/> View
                  </button>
                  <button 
                    disabled={isThisDeleting} 
                    onClick={()=>{
                      setEditingPage(p); 
                      setTitle(p.title); 
                      setSlug(p.slug); 
                      setContent(p.content); 
                      window.scrollTo({top:0, behavior:'smooth'});
                    }} 
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 border dark:border-gray-600 text-blue-500 rounded-lg text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                  >
                    <Edit size={14}/> Edit
                  </button>
                  <button 
                    disabled={isThisDeleting} 
                    onClick={()=>handleDeletePage(p.id)} 
                    className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    {isThisDeleting ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16}/>}
                  </button>
                </div>
              </li>
            );
          })}
          {pages.length === 0 && (
            <li className="p-12 text-center text-gray-400 italic text-sm">No dynamic pages created. Start by creating your first page above.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

const FileIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

export default AdminPages;
