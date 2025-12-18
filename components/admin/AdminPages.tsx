
import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Save, Heading1, Bold, List, RefreshCw } from 'lucide-react';
import { Page } from '../../types';

interface AdminPagesProps {
  pages: Page[];
  onAdd: (page: Page) => Promise<any>;
  onUpdate: (page: Page) => Promise<any>;
  onDelete: (id: string) => Promise<any> | void;
  generateUUID: () => string;
}

const AdminPages: React.FC<AdminPagesProps> = ({ pages, onAdd, onUpdate, onDelete, generateUUID }) => {
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = async () => {
    if (!title.trim()) return;
    const pageData: Page = {
      id: editingPage?.id || generateUUID(),
      title,
      content,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      date: new Date().toISOString()
    };
    if (editingPage) await onUpdate(pageData); else await onAdd(pageData);
    reset();
  };

  const reset = () => {
    setEditingPage(null); setTitle(''); setSlug(''); setContent('');
  };

  const handleDeletePage = async (id: string) => {
    if (window.confirm('Delete this page?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  }

  const insertTag = (tag: string, closeTag?: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = content.substring(0, start);
    const middle = content.substring(start, end);
    const after = content.substring(end);
    const newContent = closeTag ? `${before}<${tag}>${middle}</${closeTag}>${after}` : `${before}<${tag}>${middle}${after}`;
    setContent(newContent);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
          {editingPage ? <Edit size={18}/> : <Plus size={18}/>} {editingPage ? 'Edit Page' : 'Create Page'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={title} onChange={e=>setTitle(e.target.value)} className="p-2.5 border rounded-lg text-sm dark:bg-gray-700 dark:text-white" placeholder="Page Title" />
          <input type="text" value={slug} onChange={e=>setSlug(e.target.value)} className="p-2.5 border rounded-lg text-sm dark:bg-gray-700 dark:text-white" placeholder="Slug (optional)" />
        </div>
        <div className="border dark:border-gray-600 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 p-2 border-b dark:border-gray-600 flex gap-2">
            <button onClick={()=>insertTag('h2', 'h2')} className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded"><Heading1 size={16}/></button>
            <button onClick={()=>insertTag('b', 'b')} className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded"><Bold size={16}/></button>
            <button onClick={()=>insertTag('li', 'li')} className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded"><List size={16}/></button>
          </div>
          <textarea ref={textareaRef} value={content} onChange={e=>setContent(e.target.value)} className="w-full h-64 p-4 text-sm dark:bg-gray-800 dark:text-white font-mono focus:outline-none" placeholder="HTML or Text Content" />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-emerald-700 text-white px-8 py-2 rounded-lg font-bold flex items-center gap-2"><Save size={18}/> Save Page</button>
          {editingPage && <button onClick={reset} className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold">Cancel</button>}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden shadow-sm">
        <ul className="divide-y dark:divide-gray-700">
          {pages.map(p => {
            const isThisDeleting = deletingId === p.id;
            return (
              <li key={p.id} className={`p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 ${isThisDeleting ? 'opacity-50' : ''}`}>
                <div><p className="font-bold text-sm dark:text-white">{p.title}</p><p className="text-xs text-gray-400">/{p.slug}</p></div>
                <div className="flex gap-1">
                  <button disabled={isThisDeleting} onClick={()=>{setEditingPage(p); setTitle(p.title); setSlug(p.slug); setContent(p.content); window.scrollTo({top:0, behavior:'smooth'})}} className="text-blue-400 p-2 disabled:opacity-50"><Edit size={18}/></button>
                  <button disabled={isThisDeleting} onClick={()=>handleDeletePage(p.id)} className="text-red-400 p-2 disabled:opacity-50">
                    {isThisDeleting ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18}/>}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AdminPages;
