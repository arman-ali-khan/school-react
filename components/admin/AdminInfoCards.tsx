
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Edit, Save, RefreshCw, Upload, X, Check, Search, 
  GraduationCap, Book, BookOpen, School, Library, Pencil, Pen, Eraser, 
  Ruler, Calculator, FlaskConical, Atom, Globe, Languages, Music, Palette, 
  Microscope, Dna, Binary, Code, Cpu, Laptop, Tablets, Award, Medal, 
  Trophy, Star, Users, User, UserCheck, History, Landmark, Navigation, 
  Compass, Clock, Calendar, CheckCircle, AlertCircle, Info, HelpCircle, File, 
  Speaker, Map as MapIcon, Archive, Video, UserCog, FileText
} from 'lucide-react';
import { InfoCard } from '../../types';

const ICON_LIST = [
  'GraduationCap', 'Book', 'BookOpen', 'School', 'Library', 'Pencil', 'Pen', 'Eraser', 'Ruler', 'Calculator',
  'FlaskConical', 'Atom', 'Globe', 'Languages', 'Music', 'Palette', 'Microscope', 'Dna', 'Binary', 'Code',
  'Cpu', 'Laptop', 'Tablets', 'Award', 'Medal', 'Trophy', 'Star', 'Users', 'User', 'UserCheck',
  'History', 'Landmark', 'MapIcon', 'Navigation', 'Compass', 'Clock', 'Calendar', 'CheckCircle', 'AlertCircle', 'Info',
  'HelpCircle', 'Mail', 'Phone', 'Archive', 'FileText', 'File', 'Video', 'Play', 'Headphones', 'Speaker', 'Search', 'UserCog'
];

const IconMapper: Record<string, React.FC<any>> = {
  GraduationCap, Book, BookOpen, School, Library, Pencil, Pen, Eraser, Ruler, Calculator,
  FlaskConical, Atom, Globe, Languages, Music, Palette, Microscope, Dna, Binary, Code,
  Cpu, Laptop, Tablets, Award, Medal, Trophy, Star, Users, User, UserCheck,
  History, Landmark, MapIcon, Navigation, Compass, Clock, Calendar, CheckCircle, AlertCircle, Info,
  HelpCircle, Mail: FileText, Phone: Speaker, Archive, FileText, File, Video, Play: FileText, Headphones: Speaker, Speaker, Search, UserCog
};

interface AdminInfoCardsProps {
  cards: InfoCard[];
  onUpdate: (cards: InfoCard[]) => Promise<any>;
  generateUUID: () => string;
}

const CLOUDINARY_UPLOAD_PRESET = "school"; 
const CLOUDINARY_CLOUD_NAME = "dgituybrt";

const AdminInfoCards: React.FC<AdminInfoCardsProps> = ({ cards, onUpdate, generateUUID }) => {
  const [localCards, setLocalCards] = useState<InfoCard[]>(cards);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchIcon, setSearchIcon] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalCards(cards);
    setHasChanges(false);
  }, [cards]);

  const handleGlobalSave = async () => {
    const validCards = localCards.filter(c => {
      const isDefault = c.title === 'New Category' && c.links.length === 0 && !c.imageUrl;
      return !isDefault && c.title.trim() !== '';
    });

    setIsSaving(true);
    try {
      await onUpdate(validCards);
      setHasChanges(false);
      alert('Info cards updated successfully!');
    } catch (err) {
      alert('Failed to save info cards.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    const newId = `temp-${generateUUID()}`;
    const newCard: InfoCard = { id: newId, title: 'New Category', iconName: 'FileText', links: [] };
    setLocalCards(prev => [...prev, newCard]);
    setEditingCardId(newId);
    setHasChanges(true);
  };

  const handleUpdateLocal = (id: string, updates: Partial<InfoCard>) => {
    setLocalCards(prev => prev.map(c => String(c.id) === String(id) ? { ...c, ...updates } : c));
    setHasChanges(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this card?')) {
      const idStr = String(id);
      setLocalCards(prev => prev.filter(c => String(c.id) !== idStr));
      if (String(editingCardId) === idStr) setEditingCardId(null);
      setHasChanges(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, cardId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(cardId);
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
        handleUpdateLocal(cardId, { imageUrl: data.secure_url });
      }
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setIsUploading(null);
    }
  };

  const filteredIcons = ICON_LIST.filter(icon => 
    icon.toLowerCase().includes(searchIcon.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32">
      <div className={`sticky top-20 z-40 bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 shadow-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${hasChanges ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${hasChanges ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
            <Save size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm dark:text-white">Info Cards Manager</h3>
            <p className="text-[10px] text-gray-500 uppercase font-bold">{hasChanges ? 'Unsaved changes in draft' : 'Database synchronized'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all border border-emerald-100 dark:border-emerald-800">
            <Plus size={14} /> Add Card
          </button>
          <button onClick={handleGlobalSave} disabled={!hasChanges || isSaving} className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs transition-all shadow-lg ${hasChanges ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
            {isSaving ? 'Saving...' : 'Save All Cards'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {localCards.map(card => {
          const cardIdStr = String(card.id);
          const isEditing = editingCardId === cardIdStr;
          const CurrentIcon = IconMapper[card.iconName] || FileText;

          return (
            <div key={cardIdStr} className={`bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all overflow-hidden ${isEditing ? 'border-emerald-500 ring-4 ring-emerald-500/5 shadow-xl' : 'border-transparent dark:border-gray-700 shadow-sm'}`}>
              <div className="flex items-center p-4 gap-4 bg-gray-50/50 dark:bg-gray-900/20 border-b dark:border-gray-700">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-700 flex items-center justify-center text-emerald-600 shadow-inner overflow-hidden">
                  {card.imageUrl ? <img src={card.imageUrl} className="w-full h-full object-cover" /> : <CurrentIcon size={24} />}
                </div>
                <div className="flex-1">
                  <input type="text" value={card.title} onChange={e => handleUpdateLocal(cardIdStr, { title: e.target.value })} className="font-black text-sm bg-transparent border-none focus:ring-0 w-full dark:text-white p-0" placeholder="Title" />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditingCardId(isEditing ? null : cardIdStr)} className={`p-2.5 rounded-xl transition-all ${isEditing ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-emerald-600'}`}><Edit size={18}/></button>
                  <button onClick={() => handleDelete(cardIdStr)} className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={18}/></button>
                </div>
              </div>

              {isEditing && (
                <div className="p-6 space-y-6 animate-in slide-in-from-top-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Custom Image</label>
                        <div onClick={() => !isUploading && fileInputRef.current?.click()} className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer relative ${card.imageUrl ? 'border-emerald-500' : 'border-gray-200'}`}>
                          {isUploading === cardIdStr ? <RefreshCw className="animate-spin" /> : card.imageUrl ? <img src={card.imageUrl} className="max-h-full object-contain p-2" /> : <Upload className="text-gray-300" />}
                          <input type="file" ref={fileInputRef} className="hidden" onChange={e => handleFileUpload(e, cardIdStr)} accept="image/*" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Select Icon</label>
                        <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl p-2 mb-2"><Search size={14} className="text-gray-400 mr-2" /><input type="text" placeholder="Search..." value={searchIcon} onChange={e => setSearchIcon(e.target.value)} className="bg-transparent border-none focus:ring-0 text-xs w-full dark:text-white" /></div>
                        <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto scrollbar-hide">{filteredIcons.map(iconName => {
                          const Icon = IconMapper[iconName] || FileText;
                          const isSelected = card.iconName === iconName;
                          return <button key={iconName} onClick={() => handleUpdateLocal(cardIdStr, { iconName, imageUrl: '' })} className={`p-2 rounded-lg transition-all flex items-center justify-center ${isSelected ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-400'}`}><Icon size={16} /></button>;
                        })}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase flex justify-between">Links<button onClick={() => handleUpdateLocal(cardIdStr, { links: [...card.links, { text: 'New Link', href: '#' }] })} className="text-emerald-600">+ Add</button></label>
                      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                        {card.links.map((link, lIdx) => (
                          <div key={lIdx} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl border dark:border-gray-700 flex flex-col gap-1 relative group">
                            <input type="text" value={link.text} onChange={e => { const links = [...card.links]; links[lIdx] = { ...link, text: e.target.value }; handleUpdateLocal(cardIdStr, { links }); }} className="bg-white dark:bg-gray-800 rounded p-1 text-[11px] font-bold dark:text-white" />
                            <input type="text" value={link.href} onChange={e => { const links = [...card.links]; links[lIdx] = { ...link, href: e.target.value }; handleUpdateLocal(cardIdStr, { links }); }} className="bg-white dark:bg-gray-800 rounded p-1 text-[10px] dark:text-white font-mono" />
                            <button onClick={() => handleUpdateLocal(cardIdStr, { links: card.links.filter((_, i) => i !== lIdx) })} className="absolute top-1 right-1 text-red-400 opacity-0 group-hover:opacity-100"><X size={14}/></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setEditingCardId(null)} className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-2xl font-bold text-xs shadow-lg">Finish Editing</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminInfoCards;
