
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, ChevronUp, ChevronDown, Settings, 
  Layout, Type, MapPin, Video, Headphones, Phone, 
  Calendar, Clock, Link as LinkIcon, Image as ImageIcon,
  Timer, FileText, X, PlusCircle, Save, Upload, RefreshCw, FileCheck,
  AlertCircle
} from 'lucide-react';
import { SidebarSection, SidebarSectionType, SidebarLink, SidebarHotline } from '../../types';

interface AdminSidebarProps {
  sections: SidebarSection[];
  onUpdate: (sections: SidebarSection[]) => Promise<any>;
  generateUUID: () => string;
}

const CLOUDINARY_UPLOAD_PRESET = "school"; 
const CLOUDINARY_CLOUD_NAME = "dgituybrt";

const SECTION_TYPES: { type: SidebarSectionType; label: string; icon: any }[] = [
  { type: 'message', label: "Chairman's Message", icon: Type },
  { type: 'list', label: "Quick Links", icon: Layout },
  { type: 'hotlines', label: "Hotlines", icon: Phone },
  { type: 'map', label: "Google Map", icon: MapPin },
  { type: 'video', label: "YouTube Video", icon: Video },
  { type: 'audio', label: "Audio Player", icon: Headphones },
  { type: 'image_card', label: "Image w/ Text", icon: ImageIcon },
  { type: 'image_only', label: "Static Image", icon: ImageIcon },
  { type: 'countdown', label: "Countdown", icon: Timer },
  { type: 'datetime', label: "Current Time", icon: Clock },
  { type: 'notice', label: "Notice Block", icon: FileText },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ sections, onUpdate, generateUUID }) => {
  const [localSections, setLocalSections] = useState<SidebarSection[]>(sections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setLocalSections(sections);
    setHasUnsavedChanges(false);
  }, [sections]);

  const handleAdd = (type: SidebarSectionType) => {
    const defaultData: Record<string, any> = {
      message: { name: '', designation: '', image: '', quote: '' },
      list: { links: [] },
      hotlines: { hotlines: [] },
      map: { url: '' },
      video: { url: '' },
      audio: { audioUrl: '' },
      image_card: { image: '', name: '' },
      image_only: { image: '' },
      countdown: { targetDate: new Date().toISOString() },
      datetime: {},
      notice: { content: '' }
    };

    const newId = `temp-${generateUUID()}`;
    const newSection: SidebarSection = {
      id: newId,
      type,
      title: "New Widget",
      data: defaultData[type] || {}
    };
    
    setLocalSections(prev => [...prev, newSection]);
    setEditingId(newId);
    setHasUnsavedChanges(true);
  };

  const handleLocalUpdate = (id: string, updates: Partial<SidebarSection>) => {
    setLocalSections(prev => prev.map(s => String(s.id) === String(id) ? { ...s, ...updates } : s));
    setHasUnsavedChanges(true);
  };

  const handleLocalDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this widget? (Save Changes to update site)')) {
      const idStr = String(id);
      setLocalSections(prev => prev.filter(s => String(s.id) !== idStr));
      if (String(editingId) === idStr) setEditingId(null);
      setHasUnsavedChanges(true);
    }
  };

  const move = (index: number, direction: 'up' | 'down') => {
    const newSections = [...localSections];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= localSections.length) return;
    
    [newSections[index], newSections[target]] = [newSections[target], newSections[index]];
    setLocalSections(newSections);
    setHasUnsavedChanges(true);
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(localSections);
      setHasUnsavedChanges(false);
      alert('Sidebar configuration saved successfully!');
    } catch (err) {
      alert('Failed to save sidebar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, dataKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKey = `${sectionId}-${dataKey}`;
    setIsUploading(uploadKey);
    
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
        const section = localSections.find(s => String(s.id) === String(sectionId));
        if (section) {
          handleLocalUpdate(sectionId, {
            data: { ...section.data, [dataKey]: data.secure_url }
          });
        }
      }
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setIsUploading(null);
    }
  };

  const UploaderField = ({ label, value, sectionId, dataKey, accept }: any) => {
    const inputId = `file-${sectionId}-${dataKey}`;
    const isThisUploading = isUploading === `${sectionId}-${dataKey}`;

    return (
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase">{label}</label>
        <div className="flex flex-col gap-2">
          <div className="relative group">
            <input 
              type="text" 
              value={value || ''} 
              onChange={e => {
                const section = localSections.find(s => String(s.id) === String(sectionId));
                if (section) handleLocalUpdate(sectionId, { data: { ...section.data, [dataKey]: e.target.value } });
              }}
              className="w-full p-2.5 pr-10 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs dark:text-white font-mono"
            />
          </div>
          <div className="relative">
            <input type="file" id={inputId} onChange={e => handleFileUpload(e, sectionId, dataKey)} className="hidden" accept={accept} />
            <label htmlFor={inputId} className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all border-gray-200 dark:border-gray-700 hover:border-emerald-400">
              {isThisUploading ? <RefreshCw className="animate-spin" /> : <Upload size={16} />}
              <span className="text-[10px] font-bold uppercase tracking-wider">{isThisUploading ? 'Uploading...' : 'Upload File'}</span>
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32">
      <div className={`sticky top-20 z-40 bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 shadow-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${hasUnsavedChanges ? 'border-orange-500 ring-4 ring-orange-500/10' : 'border-emerald-500/30'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${hasUnsavedChanges ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {hasUnsavedChanges ? <AlertCircle size={20} /> : <FileCheck size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-sm dark:text-white">Sidebar Widgets</h3>
            <p className="text-[10px] text-gray-500 uppercase font-bold">{hasUnsavedChanges ? 'Unsaved changes in draft' : 'Synchronized'}</p>
          </div>
        </div>
        <button onClick={handleGlobalSave} disabled={!hasUnsavedChanges || isSaving} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${hasUnsavedChanges ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
          {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">Add Sidebar Widget</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {SECTION_TYPES.map(st => (
            <button key={st.type} type="button" onClick={() => handleAdd(st.type)} className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-xl border border-gray-100 dark:border-gray-600 transition-all">
              <st.icon size={14} className="text-emerald-600 dark:text-emerald-400" /> <span className="truncate">{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {localSections.map((section, idx) => {
          const sectionIdStr = String(section.id);
          const isThisEditing = String(editingId) === sectionIdStr;
          return (
            <div key={sectionIdStr} className={`bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all overflow-hidden ${isThisEditing ? 'border-emerald-500 ring-4 ring-emerald-500/5 shadow-xl' : 'border-transparent dark:border-gray-700 shadow-sm'}`}>
              <div className="flex items-center p-4 gap-4 bg-gray-50/50 dark:bg-gray-900/20 border-b dark:border-gray-700">
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => move(idx, 'up')} disabled={idx === 0} className="p-1 text-gray-400 hover:text-emerald-500 disabled:opacity-20"><ChevronUp size={14}/></button>
                  <button type="button" onClick={() => move(idx, 'down')} disabled={idx === localSections.length - 1} className="p-1 text-gray-400 hover:text-emerald-500 disabled:opacity-20"><ChevronDown size={14}/></button>
                </div>
                <div className="flex-1">
                  <input type="text" value={section.title} onChange={e => handleLocalUpdate(sectionIdStr, { title: e.target.value })} className="font-black text-sm bg-transparent border-none focus:ring-0 w-full dark:text-white p-0" />
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditingId(isThisEditing ? null : sectionIdStr)} className={`p-2.5 rounded-xl transition-all ${isThisEditing ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-emerald-600'}`}><Settings size={18}/></button>
                  <button type="button" onClick={(e) => handleLocalDelete(e, sectionIdStr)} className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={18}/></button>
                </div>
              </div>

              {isThisEditing && (
                <div className="p-6 space-y-6 animate-in slide-in-from-top-4">
                  {section.type === 'message' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Name" value={section.data.name || ''} onChange={e=>handleLocalUpdate(sectionIdStr, {data: {...section.data, name: e.target.value}})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm dark:text-white" />
                      <input type="text" placeholder="Designation" value={section.data.designation || ''} onChange={e=>handleLocalUpdate(sectionIdStr, {data: {...section.data, designation: e.target.value}})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm dark:text-white" />
                      <div className="md:col-span-2">
                        <UploaderField label="Profile Image" value={section.data.image} sectionId={sectionIdStr} dataKey="image" accept="image/*" />
                      </div>
                    </div>
                  )}
                  {section.type === 'list' && (
                    <div className="space-y-3">
                      {section.data.links?.map((link: SidebarLink, lIdx: number) => (
                        <div key={lIdx} className="flex gap-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                          <input type="text" placeholder="Label" value={link.label} onChange={e => {
                            const links = [...section.data.links];
                            links[lIdx] = { ...link, label: e.target.value };
                            handleLocalUpdate(sectionIdStr, { data: { ...section.data, links } });
                          }} className="flex-1 p-2 bg-white dark:bg-gray-800 rounded text-xs dark:text-white" />
                          <button onClick={() => {
                            const links = section.data.links.filter((_: any, i: number) => i !== lIdx);
                            handleLocalUpdate(sectionIdStr, { data: { ...section.data, links } });
                          }} className="text-red-500 p-2"><Trash2 size={14}/></button>
                        </div>
                      ))}
                      <button onClick={() => {
                        const links = [...(section.data.links || []), { label: 'New Link', href: '#' }];
                        handleLocalUpdate(sectionIdStr, { data: { ...section.data, links } });
                      }} className="w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-700 text-emerald-600 font-bold text-xs rounded-xl">+ Add Link</button>
                    </div>
                  )}
                  <button type="button" onClick={() => setEditingId(null)} className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-2xl font-bold text-xs shadow-lg">Close Editor</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSidebar;
