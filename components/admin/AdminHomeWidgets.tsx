
import React, { useState } from 'react';
import { Plus, Trash2, Video, MapPin, Image as ImageIcon, Save, RefreshCw } from 'lucide-react';
import { HomeWidgetConfig, HomeWidgetType } from '../../types';

interface AdminHomeWidgetsProps {
  widgets: HomeWidgetConfig[];
  onUpdate: (widgets: HomeWidgetConfig[]) => Promise<any> | void;
  generateUUID: () => string;
}

const AdminHomeWidgets: React.FC<AdminHomeWidgetsProps> = ({ widgets, onUpdate, generateUUID }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    onUpdate([...widgets, { id: generateUUID(), title: 'New Widget', type: 'youtube', url: '' }]);
  };

  const handleUpdate = (id: any, updates: Partial<HomeWidgetConfig>) => {
    onUpdate(widgets.map(w => String(w.id) === String(id) ? { ...w, ...updates } : w));
  };

  const handleDelete = async (e: React.MouseEvent, id: any) => {
    e.preventDefault();
    const idStr = String(id);
    if (window.confirm('Delete this home widget?')) {
      setDeletingId(idStr);
      try {
        const filtered = widgets.filter(w => String(w.id) !== idStr);
        await onUpdate(filtered);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl dark:text-white">Main Area Widgets</h3>
        <button onClick={handleAdd} className="bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg"><Plus size={18}/> Add Widget</button>
      </div>

      <div className="space-y-4">
        {widgets.map((w, idx) => {
          const isThisDeleting = deletingId === String(w.id);
          return (
            <div key={w.id} className={`bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 shadow-sm space-y-4 transition-all ${isThisDeleting ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
              <div className="flex justify-between items-center">
                 <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Widget #{idx + 1}</span>
                 <button 
                  onClick={(e) => handleDelete(e, w.id)} 
                  disabled={isThisDeleting}
                  className="text-red-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                >
                   {isThisDeleting ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18}/>}
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Widget Title</label>
                  <input type="text" value={w.title} onChange={e=>handleUpdate(w.id, {title: e.target.value})} className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Content Type</label>
                  <select value={w.type} onChange={e=>handleUpdate(w.id, {type: e.target.value as HomeWidgetType})} className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white text-sm">
                    <option value="youtube">YouTube Embed</option>
                    <option value="map">Google Maps Embed</option>
                    <option value="image">Static Image</option>
                    <option value="video">Direct Video Link</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Source URL / Embed Code</label>
                  <input type="text" value={w.url} onChange={e=>handleUpdate(w.id, {url: e.target.value})} className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white text-sm font-mono" placeholder="https://..." />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHomeWidgets;
