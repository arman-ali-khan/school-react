
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Move, RefreshCw, Save, PlusCircle, Link, Layers, X, ChevronDown } from 'lucide-react';
import { MenuItem } from '../../types';

interface AdminNavbarProps {
  menuItems: MenuItem[];
  onUpdate: (items: MenuItem[]) => Promise<any>;
  generateUUID: () => string;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ menuItems, onUpdate, generateUUID }) => {
  const [localItems, setLocalItems] = useState<MenuItem[]>(menuItems);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local state when props change (initial load)
  useEffect(() => {
    setLocalItems(menuItems);
    setHasChanges(false);
  }, [menuItems]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(localItems);
      setHasChanges(false);
      alert('Menu structure saved successfully!');
    } catch (err) {
      alert('Failed to save menu.');
    } finally {
      setIsSaving(false);
    }
  };

  const addRootItem = () => {
    const newItem: MenuItem = { id: generateUUID(), label: 'New Page', href: '#' };
    setLocalItems([...localItems, newItem]);
    setHasChanges(true);
  };

  const updateRootItem = (id: string, field: keyof MenuItem, val: any) => {
    setLocalItems(localItems.map(item => item.id === id ? { ...item, [field]: val } : item));
    setHasChanges(true);
  };

  const removeRootItem = (id: string) => {
    if (window.confirm('Delete this menu item and all its sub-links?')) {
      setLocalItems(localItems.filter(item => item.id !== id));
      setHasChanges(true);
    }
  };

  const addSubLink = (parentId: string) => {
    setLocalItems(localItems.map(item => {
      if (item.id === parentId) {
        const children = [...(item.children || []), { id: generateUUID(), label: 'Sub Page', href: '#' }];
        return { ...item, children };
      }
      return item;
    }));
    setHasChanges(true);
  };

  const updateSubLink = (parentId: string, childId: string, field: string, val: string) => {
    setLocalItems(localItems.map(item => {
      if (item.id === parentId && item.children) {
        const children = item.children.map(child => 
          child.id === childId ? { ...child, [field]: val } : child
        );
        return { ...item, children };
      }
      return item;
    }));
    setHasChanges(true);
  };

  const removeSubLink = (parentId: string, childId: string) => {
    setLocalItems(localItems.map(item => {
      if (item.id === parentId && item.children) {
        const children = item.children.filter(child => child.id !== childId);
        return { ...item, children };
      }
      return item;
    }));
    setHasChanges(true);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...localItems];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= localItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    setLocalItems(newItems);
    setHasChanges(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 shadow-sm gap-4">
        <div>
          <h3 className="font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-2 uppercase tracking-widest text-sm">
            <Layers size={18} /> Menu Structure
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Manage header navigation & sub-links</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={addRootItem}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all border border-emerald-100 dark:border-emerald-800"
          >
            <Plus size={14} /> Add Root Item
          </button>
          
          <button 
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs transition-all shadow-lg ${hasChanges ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? 'Saving...' : 'Save Menu Structure'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {localItems.map((item, index) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden transition-all">
            {/* Root Item Row */}
            <div className="flex items-center p-4 gap-4 bg-gray-50/50 dark:bg-gray-900/20 border-b dark:border-gray-700">
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-1 text-gray-300 hover:text-emerald-500 disabled:opacity-10"><ChevronDown size={14} className="rotate-180"/></button>
                <button type="button" onClick={() => moveItem(index, 'down')} disabled={index === localItems.length - 1} className="p-1 text-gray-300 hover:text-emerald-500 disabled:opacity-10"><ChevronDown size={14}/></button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Menu Label</label>
                  <input 
                    type="text" 
                    value={item.label} 
                    onChange={e => updateRootItem(item.id, 'label', e.target.value)}
                    className="w-full p-2 bg-white dark:bg-gray-900 border-none rounded-lg text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Destination (URL or slug)</label>
                  <div className="relative">
                    <Link size={12} className="absolute left-2.5 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      value={item.href} 
                      onChange={e => updateRootItem(item.id, 'href', e.target.value)}
                      className="w-full p-2 pl-8 bg-white dark:bg-gray-900 border-none rounded-lg text-xs dark:text-white font-mono" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => addSubLink(item.id)}
                  className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  title="Add Sub-link"
                >
                  <PlusCircle size={18}/>
                </button>
                <button 
                  onClick={() => removeRootItem(item.id)}
                  className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            </div>

            {/* Sub-links Section */}
            {(item.children && item.children.length > 0) ? (
              <div className="p-4 pl-12 bg-emerald-50/20 dark:bg-gray-950/20 space-y-2">
                {item.children.map((child) => (
                  <div key={child.id} className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-300">
                    <div className="w-4 h-8 border-l-2 border-b-2 border-emerald-100 dark:border-gray-700 rounded-bl-xl mt-[-16px]"></div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        value={child.label} 
                        onChange={e => updateSubLink(item.id, child.id, 'label', e.target.value)}
                        className="w-full p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-xs font-bold dark:text-white focus:ring-1 focus:ring-emerald-500" 
                        placeholder="Child Label"
                      />
                      <input 
                        type="text" 
                        value={child.href} 
                        onChange={e => updateSubLink(item.id, child.id, 'href', e.target.value)}
                        className="w-full p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-[10px] dark:text-white font-mono" 
                        placeholder="Child URL"
                      />
                    </div>
                    <button 
                      onClick={() => removeSubLink(item.id, child.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {localItems.length === 0 && (
          <div className="p-20 text-center border-2 border-dashed rounded-3xl border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
            <Layers size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-400 font-medium">Navigation menu is empty. Start by adding a root item.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
