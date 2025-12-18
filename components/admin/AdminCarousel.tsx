
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, RefreshCw, Upload, X, Check, Save, AlertCircle } from 'lucide-react';
import { CarouselItem } from '../../types';

interface AdminCarouselProps {
  items: CarouselItem[];
  onUpdate: (items: CarouselItem[]) => Promise<any>;
  generateUUID: () => string;
}

const CLOUDINARY_UPLOAD_PRESET = "school"; 
const CLOUDINARY_CLOUD_NAME = "dgituybrt";

const AdminCarousel: React.FC<AdminCarouselProps> = ({ items, onUpdate, generateUUID }) => {
  const [localItems, setLocalItems] = useState<CarouselItem[]>(items);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local state when props change (initial load or after external update)
  useEffect(() => {
    setLocalItems(items);
    setHasChanges(false);
  }, [items]);

  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      // Filter out invalid items (no image)
      const validItems = localItems.filter(item => item.image.trim() !== '');
      await onUpdate(validItems);
      setHasChanges(false);
      alert('Banner configuration saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save banners.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
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
        handleLocalUpdate(id, 'image', data.secure_url);
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploadingId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAdd = () => {
    const newId = `temp-${generateUUID()}`;
    setLocalItems([...localItems, { id: newId, image: '', caption: 'New Banner Caption' }]);
    setHasChanges(true);
  };

  const handleLocalUpdate = (id: string, field: keyof CarouselItem, val: string) => {
    setLocalItems(prev => prev.map(item => String(item.id) === String(id) ? { ...item, [field]: val } : item));
    setHasChanges(true);
  };

  const handleLocalDelete = (id: string) => {
    if (window.confirm('Remove this banner from the draft?')) {
      setLocalItems(prev => prev.filter(item => String(item.id) !== String(id)));
      setHasChanges(true);
    }
  };

  const triggerUpload = (id: string) => {
    setActiveUploadId(id);
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32">
      {/* Header & Save Action */}
      <div className={`sticky top-20 z-40 bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 shadow-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${hasChanges ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${hasChanges ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {hasChanges ? <AlertCircle size={20} /> : <Save size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-sm dark:text-white">Banners Manager</h3>
            <p className="text-[10px] text-gray-500 uppercase font-bold">
              {hasChanges ? 'Unsaved changes in draft' : 'Banners are synchronized'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all border border-emerald-100 dark:border-emerald-800"
          >
            <Plus size={14} /> Add Banner
          </button>
          <button 
            onClick={handleGlobalSave}
            disabled={!hasChanges || isSaving}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs transition-all shadow-lg ${hasChanges ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
            {isSaving ? 'Saving...' : 'Save All Banners'}
          </button>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => activeUploadId && handleFileUpload(e, activeUploadId)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localItems.map((item, idx) => {
          const idStr = String(item.id);
          const isUploading = uploadingId === idStr;

          return (
            <div key={idStr} className={`bg-white dark:bg-gray-800 rounded-2xl border-2 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col transition-all group hover:border-emerald-500/50`}>
              <div className="relative h-48 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <>
                    <img src={item.image} className="w-full h-full object-cover" alt="Banner Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button 
                        onClick={() => triggerUpload(idStr)}
                        className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all"
                        title="Change Image"
                       >
                         <Upload size={20} />
                       </button>
                    </div>
                  </>
                ) : (
                  <button 
                    onClick={() => triggerUpload(idStr)}
                    className="flex flex-col items-center gap-2 text-gray-400 hover:text-emerald-500 transition-colors"
                  >
                    {isUploading ? <RefreshCw className="animate-spin" size={32} /> : <Upload size={32} />}
                    <span className="text-xs font-bold uppercase tracking-widest">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                )}
                
                {isUploading && (
                   <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-sm flex items-center justify-center">
                      <RefreshCw className="animate-spin text-white" size={32} />
                   </div>
                )}
                
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  Position {idx + 1}
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Banner Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={item.image} 
                      onChange={e=>handleLocalUpdate(idStr, 'image', e.target.value)} 
                      className="flex-1 p-2 bg-gray-50 dark:bg-gray-900 border-none rounded-lg text-[10px] dark:text-white font-mono focus:ring-1 focus:ring-emerald-500" 
                      placeholder="https://..." 
                    />
                    <button 
                      onClick={() => triggerUpload(idStr)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-emerald-600 rounded-lg transition-colors"
                      title="Upload file"
                    >
                      <Upload size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Banner Caption</label>
                  <input 
                    type="text" 
                    value={item.caption} 
                    onChange={e=>handleLocalUpdate(idStr, 'caption', e.target.value)} 
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-lg text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Caption Text" 
                  />
                </div>

                <button 
                  onClick={()=>handleLocalDelete(idStr)} 
                  disabled={isUploading}
                  className="w-full py-2.5 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14}/> 
                  Remove from Draft
                </button>
              </div>
            </div>
          );
        })}

        {localItems.length === 0 && (
          <div className="md:col-span-2 p-20 text-center border-2 border-dashed rounded-3xl border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
            <ImageIcon size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-400 font-medium">No homepage banners yet. Click "Add Banner" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCarousel;
