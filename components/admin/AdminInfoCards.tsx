
import React, { useState } from 'react';
import { Plus, Trash2, Edit, Save, Play, Image as ImageIcon, FileText, RefreshCw } from 'lucide-react';
import { InfoCard } from '../../types';

interface AdminInfoCardsProps {
  cards: InfoCard[];
  onUpdate: (cards: InfoCard[]) => Promise<any> | void;
  generateUUID: () => string;
}

const AdminInfoCards: React.FC<AdminInfoCardsProps> = ({ cards, onUpdate, generateUUID }) => {
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newId = generateUUID();
    const newCard: InfoCard = { id: newId, title: 'New Category', iconName: 'FileText', links: [] };
    onUpdate([...cards, newCard]);
    setEditingCardId(String(newId));
  };

  const handleUpdate = (id: any, updates: Partial<InfoCard>) => {
    onUpdate(cards.map(c => String(c.id) === String(id) ? { ...c, ...updates } : c));
  };

  const handleLinkChange = (cardId: any, lIdx: number, field: 'text' | 'href', val: string) => {
    const card = cards.find(c => String(c.id) === String(cardId));
    if (!card) return;
    const links = [...card.links];
    links[lIdx] = { ...links[lIdx], [field]: val };
    handleUpdate(cardId, { links });
  };

  const handleDelete = async (e: React.MouseEvent, id: any) => {
    e.preventDefault();
    const idStr = String(id);
    if (window.confirm('Delete this info card?')) {
      setDeletingId(idStr);
      try {
        const filtered = cards.filter(c => String(c.id) !== idStr);
        await onUpdate(filtered);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl dark:text-white">Homepage Info Cards</h3>
        <button onClick={handleAdd} className="bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg"><Plus size={18}/> Add Card</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(card => {
          const cardIdStr = String(card.id);
          const isEditing = String(editingCardId) === cardIdStr;
          const isDeleting = deletingId === cardIdStr;
          
          return (
            <div key={cardIdStr} className={`bg-white dark:bg-gray-800 rounded-xl border-2 p-5 transition-all ${isEditing ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-transparent dark:border-gray-700 shadow-sm'} ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600"><ImageIcon size={20}/></div>
                   <input 
                      type="text" 
                      value={card.title} 
                      onChange={e => handleUpdate(card.id, { title: e.target.value })} 
                      className="font-black text-lg bg-transparent border-none p-0 focus:ring-0 dark:text-white" 
                   />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditingCardId(isEditing ? null : cardIdStr)} disabled={isDeleting} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg disabled:opacity-50"><Edit size={18}/></button>
                  <button onClick={(e) => handleDelete(e, card.id)} disabled={isDeleting} className="p-2 text-red-400 hover:bg-red-50 rounded-lg disabled:opacity-50">
                    {isDeleting ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18}/>}
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Icon Class</label>
                      <input type="text" value={card.iconName} onChange={e=>handleUpdate(card.id, {iconName: e.target.value})} className="w-full p-2 border rounded text-xs dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Image URL (Optional)</label>
                      <input type="text" value={card.imageUrl || ''} onChange={e=>handleUpdate(card.id, {imageUrl: e.target.value})} className="w-full p-2 border rounded text-xs dark:bg-gray-700 dark:text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Links</p>
                    {card.links.map((link, lIdx) => (
                      <div key={lIdx} className="flex gap-2 items-center">
                        <input type="text" value={link.text} onChange={e=>handleLinkChange(card.id, lIdx, 'text', e.target.value)} className="flex-1 p-2 border rounded text-xs dark:bg-gray-700 dark:text-white" placeholder="Label" />
                        <input type="text" value={link.href} onChange={e=>handleLinkChange(card.id, lIdx, 'href', e.target.value)} className="flex-1 p-2 border rounded text-xs dark:bg-gray-700 dark:text-white font-mono" placeholder="URL" />
                        <button onClick={() => handleUpdate(card.id, { links: card.links.filter((_, i) => i !== lIdx) })} className="text-red-400"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button onClick={() => handleUpdate(card.id, { links: [...card.links, { text: 'New Link', href: '#' }] })} className="text-[11px] font-black text-emerald-600 flex items-center gap-1">+ ADD ROW</button>
                  </div>
                  <button onClick={() => setEditingCardId(null)} className="w-full py-2 bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-sm">Save Changes</button>
                </div>
              )}

              {!isEditing && (
                <ul className="space-y-1 mt-2">
                  {card.links.slice(0, 3).map((l, i) => (
                    <li key={i} className="text-xs text-gray-500 truncate flex items-center gap-2"><Play size={8} className="fill-current"/> {l.text}</li>
                  ))}
                  {card.links.length > 3 && <li className="text-[10px] text-gray-400 italic">+{card.links.length - 3} more...</li>}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminInfoCards;
