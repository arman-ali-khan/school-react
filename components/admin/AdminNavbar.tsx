
import React from 'react';
import { Plus, Trash2, Edit, ChevronDown, Move } from 'lucide-react';
import { MenuItem } from '../../types';

interface AdminNavbarProps {
  menuItems: MenuItem[];
  onUpdate: (items: MenuItem[]) => void;
  generateUUID: () => string;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ menuItems, onUpdate, generateUUID }) => {
  const handleAdd = () => {
    onUpdate([...menuItems, { id: generateUUID(), label: 'New Link', href: '#' }]);
  };

  const handleUpdate = (id: string, field: keyof MenuItem, val: any) => {
    onUpdate(menuItems.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const handleDelete = (id: string) => {
    onUpdate(menuItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl dark:text-white">Main Navigation Menu</h3>
        <button onClick={handleAdd} className="bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold"><Plus size={18}/> Add Root Item</button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm overflow-hidden">
        <ul className="divide-y dark:divide-gray-700">
          {menuItems.map((item, idx) => (
            <li key={item.id} className="p-4 space-y-3">
              <div className="flex items-center gap-4">
                <Move size={16} className="text-gray-300 cursor-grab" />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="text" value={item.label} onChange={e=>handleUpdate(item.id, 'label', e.target.value)} className="p-2 border rounded text-sm font-bold dark:bg-gray-700 dark:text-white" />
                  <input type="text" value={item.href} onChange={e=>handleUpdate(item.id, 'href', e.target.value)} className="p-2 border rounded text-sm dark:bg-gray-700 dark:text-white font-mono" />
                </div>
                <button onClick={()=>handleDelete(item.id)} className="text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={18}/></button>
              </div>
              {item.children && (
                <div className="ml-10 pl-4 border-l-2 border-emerald-100 dark:border-gray-700 space-y-2">
                  {item.children.map(child => (
                    <div key={child.id} className="flex gap-2 items-center bg-gray-50 dark:bg-gray-900/30 p-2 rounded">
                      <input type="text" value={child.label} className="flex-1 p-1 text-xs border rounded dark:bg-gray-700 dark:text-white" />
                      <button className="text-red-300"><Trash2 size={12}/></button>
                    </div>
                  ))}
                  <button className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">+ Add Sub-item</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminNavbar;
