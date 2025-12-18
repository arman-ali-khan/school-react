
import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { CarouselItem } from '../../types';

interface AdminCarouselProps {
  items: CarouselItem[];
  onUpdate: (items: CarouselItem[]) => Promise<any> | void;
  generateUUID: () => string;
}

const AdminCarousel: React.FC<AdminCarouselProps> = ({ items, onUpdate, generateUUID }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async () => {
    await onUpdate([...items, { id: generateUUID(), image: 'https://picsum.photos/800/400', caption: 'New Banner Caption' }]);
  };

  const handleUpdate = async (id: string, field: keyof CarouselItem, val: string) => {
    await onUpdate(items.map(item => String(item.id) === String(id) ? { ...item, [field]: val } : item));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this banner image?')) {
      const idStr = String(id);
      setDeletingId(idStr);
      try {
        await onUpdate(items.filter(item => String(item.id) !== idStr));
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl dark:text-white">Homepage Banners</h3>
        <button onClick={handleAdd} className="bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg transition-all hover:bg-emerald-800"><Plus size={18}/> Add Banner</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => {
          const isDeleting = deletingId === String(item.id);
          return (
            <div key={item.id} className={`bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden shadow-sm flex flex-col transition-all ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
              <img src={item.image} className="w-full h-40 object-cover" alt="Banner Preview" />
              <div className="p-4 space-y-3">
                <input type="text" value={item.image} onChange={e=>handleUpdate(item.id, 'image', e.target.value)} className="w-full p-2 border rounded text-xs dark:bg-gray-700 dark:text-white" placeholder="Image URL" />
                <input type="text" value={item.caption} onChange={e=>handleUpdate(item.id, 'caption', e.target.value)} className="w-full p-2 border rounded text-sm font-bold dark:bg-gray-700 dark:text-white" placeholder="Caption Text" />
                <button 
                  onClick={()=>handleDelete(item.id)} 
                  disabled={isDeleting}
                  className="w-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center justify-center gap-2 text-sm font-bold border border-red-100 dark:border-red-900/30 transition-all"
                >
                  {isDeleting ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14}/>} 
                  {isDeleting ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminCarousel;
