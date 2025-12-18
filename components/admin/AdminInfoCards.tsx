
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Edit, Save, Play, Image as ImageIcon, FileText, 
  RefreshCw, Upload, FileCheck, X, Check, Search, ChevronDown,
  GraduationCap, Book, BookOpen, School, Library, Pencil, Pen, Eraser, 
  Ruler, Calculator, FlaskConical, Atom, Globe, Languages, Music, Palette, 
  Microscope, Dna, Binary, Code, Cpu, Laptop, Tablets, Award, Medal, 
  Trophy, Star, Users, User, UserCheck, History, Landmark, Navigation, 
  Compass, Clock, Calendar, CheckCircle, AlertCircle, Info, HelpCircle, File, 
  Speaker, Map as MapIcon, Archive, Video, UserCog
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
  HelpCircle, Mail: FileText, Phone: Speaker, Archive, FileText, File, Video, Play, Headphones: Speaker, Speaker, Search, UserCog
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

  // Sync with prop when database values change (e.g. after a successful save)
  useEffect(() => {
    setLocalCards(cards);
    setHasChanges(false);
  }, [cards]);

  const handleGlobalSave = async () => {
    // Validation: Filter out cards that are completely empty or still have default values without links
    const validCards = localCards.filter(c => {
      const hasContent = c.title.trim() !== '' && c.title !== 'New Category';
      const hasLinks = c.links.length > 0;
      const hasImage = !!c.imageUrl;
      return hasContent || hasLinks || hasImage;
    });

    if (validCards.length === 0 && localCards.length > 0) {
      if (!window.confirm('The cards you added appear empty. Save anyway?')) return;
    }

    setIsSaving(true);
    try {
      await onUpdate(validCards);
      setHasChanges(false);
      alert('Info cards updated successfully!');
    } catch (err) {
      alert('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    const newId = `temp-${generateUUID()}`;
    const newCard: InfoCard = { id: newId, title: 'New Category', iconName: 'FileText', links: [] };
    setLocalCards([...localCards, newCard]);
    setEditingCardId(newId);
    setHasChanges(true);
  };

  const handleUpdateLocal = (id: string, updates: Partial<InfoCard>) => {
    setLocalCards(prev => prev.map(c => String(c.id) === String(id) ? { ...c, ...updates } : c));
    setHasChanges(true);
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
      } else throw new Error('Upload failed');
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setIsUploading(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this card?')) {
      setLocalCards(prev => prev.filter(c => String(c.id) !== String(id)));
      if (editingCardId === id) setEditingCardId(null);
      setHasChanges(true);
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
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all border border-emerald-100 dark:border-emerald-800"
          >
            <Plus size={14} /> Add Card
          </button>
          <button 
            onClick={handleGlobalSave}
            disabled={!hasChanges || isSaving}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs transition-all shadow-lg ${hasChanges ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
            {isSaving ? 'Saving...' : 'Save All Cards'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {localCards.map(card => {
          const cardIdStr = String(card.id);
          const isEditing = editingCardId === cardIdStr;
          const CurrentIcon = IconMapper[card.iconName] || FileText;

          return (
            <div key={cardIdStr} className={`bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all overflow-hidden ${isEditing ? 'border-emerald-500 ring-4 ring-emerald-500/5 shadow-xl' : 'border-transparent dark:border-gray-700 shadow-sm'}`}>
              <div className="flex items-center p-4 gap-4 bg-gray-50/50 dark:bg-gray-900/20 border-b dark:border-gray-700">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-700 flex items-center justify-center text-emerald-600 shadow-inner overflow-hidden">
                  {card.imageUrl ? (
                    <img src={card.imageUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <CurrentIcon size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={card.title} 
                    onChange={e => handleUpdateLocal(cardIdStr, { title: e.target.value })}
                    className="font-black text-sm bg-transparent border-none focus:ring-0 w-full dark:text-white p-0"
                    placeholder="Category Title"
                  />
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-tighter mt-0.5">
                    {card.links.length} Active Links • {card.imageUrl ? 'Custom Image' : `Icon: ${card.iconName}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEditingCardId(isEditing ? null : cardIdStr)}
                    className={`p-2.5 rounded-xl transition-all ${isEditing ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-emerald-600'}`}
                  >
                    <Edit size={18}/>
                  </button>
                  <button 
                    onClick={() => handleDelete(cardIdStr)}
                    className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                  >
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Custom Image (Overrides Icon)</label>
                        <div 
                          onClick={() => !isUploading && fileInputRef.current?.click()}
                          className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${card.imageUrl ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400'}`}
                        >
                          {isUploading === cardIdStr ? (
                            <RefreshCw className="animate-spin text-emerald-600" />
                          ) : card.imageUrl ? (
                            <div className="w-full h-full p-2 flex flex-col items-center justify-center">
                              <img src={card.imageUrl} className="max-h-full object-contain rounded" alt="" />
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleUpdateLocal(cardIdStr, { imageUrl: '' }); }}
                                className="absolute top-1 right-1 p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                              ><X size={12}/></button>
                            </div>
                          ) : (
                            <>
                              <Upload size={20} className="text-gray-300 mb-1" />
                              <span className="text-[10px] font-bold text-gray-400">UPLOAD LOGO</span>
                            </>
                          )}
                          <input type="file" ref={fileInputRef} className="hidden" onChange={e => handleFileUpload(e, cardIdStr)} accept="image/*" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Or Select Icon</label>
                        <div className="relative">
                          <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl p-2 mb-2 border dark:border-gray-700">
                            <Search size={14} className="text-gray-400 mr-2" />
                            <input 
                              type="text" 
                              placeholder="Search icons..." 
                              value={searchIcon}
                              onChange={e => setSearchIcon(e.target.value)}
                              className="bg-transparent border-none focus:ring-0 text-xs w-full dark:text-white"
                            />
                          </div>
                          <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto p-1 scrollbar-hide">
                            {filteredIcons.map(iconName => {
                              const Icon = IconMapper[iconName] || FileText;
                              const isSelected = card.iconName === iconName;
                              return (
                                <button
                                  key={iconName}
                                  onClick={() => handleUpdateLocal(cardIdStr, { iconName, imageUrl: '' })}
                                  className={`p-2 rounded-lg transition-all flex items-center justify-center ${isSelected ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-400 hover:bg-emerald-50'}`}
                                  title={iconName}
                                >
                                  <Icon size={16} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase flex justify-between items-center">
                        Menu Links
                        <button 
                          onClick={() => handleUpdateLocal(cardIdStr, { links: [...card.links, { text: 'New Link', href: '#' }] })}
                          className="text-emerald-600 dark:text-emerald-400 hover:underline"
                        >+ Add Row</button>
                      </label>
                      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                        {card.links.map((link, lIdx) => (
                          <div key={lIdx} className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border dark:border-gray-700 flex flex-col gap-2 relative group">
                            <input 
                              type="text" 
                              value={link.text} 
                              onChange={e => {
                                const links = [...card.links];
                                links[lIdx] = { ...link, text: e.target.value };
                                handleUpdateLocal(cardIdStr, { links });
                              }}
                              className="bg-white dark:bg-gray-800 border-none rounded-lg p-2 text-[11px] font-bold dark:text-white"
                              placeholder="Link Label"
                            />
                            <input 
                              type="text" 
                              value={link.href} 
                              onChange={e => {
                                const links = [...card.links];
                                links[lIdx] = { ...link, href: e.target.value };
                                handleUpdateLocal(cardIdStr, { links });
                              }}
                              className="bg-white dark:bg-gray-800 border-none rounded-lg p-2 text-[10px] dark:text-white font-mono"
                              placeholder="URL or page:slug"
                            />
                            <button 
                              onClick={() => handleUpdateLocal(cardIdStr, { links: card.links.filter((_, i) => i !== lIdx) })}
                              className="absolute top-1 right-1 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14}/>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEditingCardId(null)}
                    className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-2xl font-bold text-xs shadow-lg transition-all"
                  >
                    Finish Editing Card
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {localCards.length === 0 && (
          <div className="lg:col-span-2 p-20 text-center border-2 border-dashed rounded-3xl border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
            <Layout size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-400 font-medium">No info cards. Click "Add Card" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Layout = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
);

export default AdminInfoCards;
