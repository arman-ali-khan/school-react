
import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Video, MapPin, Image as ImageIcon, 
  Save, RefreshCw, PlusCircle, AlertCircle, FileCheck 
} from 'lucide-react';
import { HomeWidgetConfig, HomeWidgetType } from '../../types';

interface AdminHomeWidgetsProps {
  widgets: HomeWidgetConfig[];
  onUpdate: (widgets: HomeWidgetConfig[]) => Promise<any>;
  generateUUID: () => string;
}

const AdminHomeWidgets: React.FC<AdminHomeWidgetsProps> = ({ widgets, onUpdate, generateUUID }) => {
  const [localWidgets, setLocalWidgets] = useState<HomeWidgetConfig[]>(widgets);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync local state when props update (initial load)
  useEffect(() => {
    setLocalWidgets(widgets);
    setHasUnsavedChanges(false);
  }, [widgets]);

  const handleAdd = () => {
    const newWidget: HomeWidgetConfig = { 
      id: generateUUID(), 
      title: 'New Content Widget', 
      type: 'youtube', 
      url: '' 
    };
    setLocalWidgets([...localWidgets, newWidget]);
    setHasUnsavedChanges(true);
  };

  const handleLocalUpdate = (id: string, updates: Partial<HomeWidgetConfig>) => {
    const idStr = String(id);
    const updated = localWidgets.map(w => String(w.id) === idStr ? { ...w, ...updates } : w);
    setLocalWidgets(updated);
    setHasUnsavedChanges(true);
  };

  const handleLocalDelete = (id: string) => {
    const idStr = String(id);
    if (window.confirm('Remove this widget from your draft? Remember to click Save to apply changes to the live site.')) {
      setLocalWidgets(localWidgets.filter(w => String(w.id) !== idStr));
      setHasUnsavedChanges(true);
    }
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(localWidgets);
      setHasUnsavedChanges(false);
      alert('Homepage widgets updated successfully!');
    } catch (err) {
      console.error("Widget Save Failed:", err);
      alert('Failed to save widgets. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32">
      {/* Draft Status & Save Button - Sticky */}
      <div className={`sticky top-20 z-40 bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 shadow-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${hasUnsavedChanges ? 'border-orange-500 ring-4 ring-orange-500/10' : 'border-emerald-500/30'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${hasUnsavedChanges ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {hasUnsavedChanges ? <AlertCircle size={20} /> : <FileCheck size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-sm dark:text-white">
              {hasUnsavedChanges ? 'Unsaved Widget Changes' : 'Widgets Synced'}
            </h3>
            <p className="text-[10px] text-gray-500 uppercase font-bold">
              {hasUnsavedChanges ? 'Changes will not appear on homepage until saved' : 'Home content is up to date'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleGlobalSave}
          disabled={!hasUnsavedChanges || isSaving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${hasUnsavedChanges ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
        >
          {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Syncing...' : 'Save All Changes'}
        </button>
      </div>

      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-lg dark:text-white">Homepage Main Content Widgets</h3>
        <button 
          onClick={handleAdd} 
          className="bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-md hover:bg-emerald-800 transition-all"
        >
          <PlusCircle size={18}/> Add Widget
        </button>
      </div>

      <div className="space-y-4">
        {localWidgets.map((w, idx) => {
          const isThisDeleting = deletingId === String(w.id);
          return (
            <div key={w.id} className={`bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 shadow-sm space-y-4 transition-all ${isThisDeleting ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
              <div className="flex justify-between items-center border-b dark:border-gray-700 pb-3">
                 <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                      Position {idx + 1}
                    </span>
                    {w.type === 'youtube' && <Video size={14} className="text-red-500" />}
                    {w.type === 'map' && <MapPin size={14} className="text-blue-500" />}
                    {w.type === 'image' && <ImageIcon size={14} className="text-emerald-500" />}
                 </div>
                 <button 
                  onClick={() => handleLocalDelete(w.id)} 
                  className="text-red-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                   <Trash2 size={18}/>
                 </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Widget Title (Header Text)</label>
                  <input 
                    type="text" 
                    value={w.title} 
                    onChange={e => handleLocalUpdate(w.id, {title: e.target.value})} 
                    className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Content Type</label>
                  <select 
                    value={w.type} 
                    onChange={e => handleLocalUpdate(w.id, {type: e.target.value as HomeWidgetType})} 
                    className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm outline-none"
                  >
                    <option value="youtube">YouTube Video</option>
                    <option value="map">Google Map Location</option>
                    <option value="image">Static Banner Image</option>
                    <option value="video">Direct Video URL</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Resource URL (Embed or Direct Link)</label>
                  <input 
                    type="text" 
                    value={w.url} 
                    onChange={e => handleLocalUpdate(w.id, {url: e.target.value})} 
                    className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none" 
                    placeholder="https://..." 
                  />
                </div>
              </div>
            </div>
          );
        })}
        
        {localWidgets.length === 0 && (
          <div className="p-20 text-center border-2 border-dashed rounded-3xl border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
            <Plus size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-400 font-medium">No home widgets defined. Click Add Widget to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHomeWidgets;
