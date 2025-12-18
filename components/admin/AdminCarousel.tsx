
import React from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { CarouselItem } from '../../types';

interface AdminCarouselProps {
  items: CarouselItem[];
  onUpdate: (items: CarouselItem[]) => void;
  generateUUID: () => string;
}

const AdminCarousel: React.FC<AdminCarouselProps> = ({ items, onUpdate, generateUUID }) => {
  const handleAdd = () => {
    onUpdate([...items, { id: generateUUID(), image: 'https://picsum.photos/800/400', caption: 'New Banner Caption' }]);
  };

  const handleUpdate = (id: string, field: keyof CarouselItem, val: string) => {
    onUpdate(items.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const handleDelete = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl dark:text-white">Homepage Banners</h3>
        <button onClick={handleAdd} className="bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold"><Plus size={18}/> Add Banner</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden shadow-sm flex flex-col">
            <img src={item.image} className="w-full h-40 object-cover" alt="Banner Preview" />
            <div className="p-4 space-y-3">
              <input type="text" value={item.image} onChange={e=>handleUpdate(item.id, 'image', e.target.value)} className="w-full p-2 border rounded text-xs dark:bg-gray-700 dark:text-white" placeholder="Image URL" />
              <input type="text" value={item.caption} onChange={e=>handleUpdate(item.id, 'caption', e.target.value)} className="w-full p-2 border rounded text-sm font-bold dark:bg-gray-700 dark:text-white" placeholder="Caption Text" />
              <button onClick={()=>handleDelete(item.id)} className="w-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center justify-center gap-2 text-sm font-bold border border-red-100 dark:border-red-900/30"><Trash2 size={14}/> Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCarousel;
