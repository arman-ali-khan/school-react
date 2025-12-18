
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
  // Local state for "Draft" changes
  const [localSections, setLocalSections] = useState<SidebarSection[]>(sections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync with props if sections change from outside (e.g. initial load)
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

    const newId = generateUUID();
    const newSection: SidebarSection = {
      id: newId,
      type,
      title: "New Widget",
      data: defaultData[type] || {}
    };
    
    setLocalSections([...localSections, newSection]);
    setEditingId(newId);
    setHasUnsavedChanges(true);
  };

  const handleLocalUpdate = (id: string, updates: Partial<SidebarSection>) => {
    const updated = localSections.map(s => String(s.id) === String(id) ? { ...s, ...updates } : s);
    setLocalSections(updated);
    setHasUnsavedChanges(true);
  };

  const handleLocalDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Remove this widget from your draft? You still need to click "Save Changes" to persist this to the database.')) {
      const filtered = localSections.filter(s => String(s.id) !== String(id));
      setLocalSections(filtered);
      if (editingId === id) setEditingId(null);
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
      console.error("Save failed", err);
      alert('Failed to save. Please check your connection.');
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
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(null);
    }
  };

  const UploaderField = ({ 
    label, 
    value, 
    sectionId, 
    dataKey, 
    accept 
  }: { 
    label: string, 
    value: string, 
    sectionId: string, 
    dataKey: string, 
    accept: string 
  }) => {
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
              placeholder="Paste URL or upload below..."
            />
            {value && (
              <button 
                type="button"
                onClick={() => {
                  const section = localSections.find(s => String(s.id) === String(sectionId));
                  if (section) handleLocalUpdate(sectionId, { data: { ...section.data, [dataKey]: '' } });
                }}
                className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          <div className="relative">
            <input 
              type="file" 
              id={inputId}
              onChange={e => handleFileUpload(e, sectionId, dataKey)}
              className="hidden"
              accept={accept}
            />
            <label 
              htmlFor={inputId}
              className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                value 
                  ? 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 text-gray-400'
              }`}
            >
              {isThisUploading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : value ? (
                <FileCheck size={16} />
              ) : (
                <Upload size={16} />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isThisUploading ? 'Uploading...' : value ? 'Change File' : `Upload ${label.split(' ')[0]}`}
              </span>
            </label>
          </div>
        </div>
      </div>
    );
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
              {hasUnsavedChanges ? 'Unsaved Changes Detected' : 'Configuration Synced'}
            </h3>
            <p className="text-[10px] text-gray-500 uppercase font-bold">
              {hasUnsavedChanges ? 'Click save to update the public website' : 'All changes are live'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleGlobalSave}
          disabled={!hasUnsavedChanges || isSaving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${hasUnsavedChanges ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
        >
          {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Saving to Database...' : 'Save Sidebar Configuration'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
          <PlusCircle size={16} className="text-emerald-500" /> Add Sidebar Widget
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {SECTION_TYPES.map(st => (
            <button 
              key={st.type} 
              type="button"
              onClick={() => handleAdd(st.type)} 
              className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-xl border border-gray-100 dark:border-gray-600 transition-all hover:border-emerald-200 dark:hover:border-emerald-800"
            >
              <st.icon size={14} className="text-emerald-600 dark:text-emerald-400" /> 
              <span className="truncate">{st.label}</span>
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
                  <button type="button" onClick={() => move(idx, 'up')} disabled={idx === 0} className="p-1 text-gray-400 hover:text-emerald-500 disabled:opacity-20 transition-colors"><ChevronUp size={14}/></button>
                  <button type="button" onClick={() => move(idx, 'down')} disabled={idx === localSections.length - 1} className="p-1 text-gray-400 hover:text-emerald-500 disabled:opacity-20 transition-colors"><ChevronDown size={14}/></button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={section.title} 
                      onChange={e => handleLocalUpdate(sectionIdStr, { title: e.target.value })}
                      className="font-black text-sm bg-transparent border-none focus:ring-0 w-full dark:text-white p-0"
                      placeholder="Widget Title"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                       {section.type.replace('_', ' ')}
                     </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setEditingId(isThisEditing ? null : sectionIdStr)} 
                    className={`p-2.5 rounded-xl transition-all ${isThisEditing ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-emerald-600'}`}
                  >
                    <Settings size={18}/>
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => handleLocalDelete(e, sectionIdStr)} 
                    className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                  >
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>

              {isThisEditing && (
                <div className="p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
                  
                  {section.type === 'message' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Person Name</label>
                        <input type="text" value={section.data.name || ''} onChange={e=>handleLocalUpdate(sectionIdStr, {data: {...section.data, name: e.target.value}})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Designation</label>
                        <input type="text" value={section.data.designation || ''} onChange={e=>handleLocalUpdate(sectionIdStr, {data: {...section.data, designation: e.target.value}})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm dark:text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <UploaderField 
                          label="Profile Image" 
                          value={section.data.image} 
                          sectionId={sectionIdStr} 
                          dataKey="image" 
                          accept="image/*" 
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Short Quote</label>
                        <textarea value={section.data.quote || ''} onChange={e=>handleLocalUpdate(sectionIdStr, {data: {...section.data, quote: e.target.value}})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm dark:text-white h-24" />
                      </div>
                    </div>
                  )}

                  {section.type === 'list' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Manage Links</label>
                      {section.data.links?.map((link: SidebarLink, lIdx: number) => (
                        <div key={lIdx} className="flex flex-col sm:flex-row gap-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border dark:border-gray-700">
                          <div className="flex-1 space-y-2">
                             <input type="text" placeholder="Label" value={link.label} onChange={e => {
                               const links = [...section.data.links];
                               links[lIdx] = { ...link, label: e.target.value };
                               handleLocalUpdate(sectionIdStr, { data: { ...section.data, links } });
                             }} className="w-full p-2 border-none bg-white dark:bg-gray-800 rounded-lg text-xs dark:text-white font-bold" />
                             <input type="text" placeholder="URL" value={link.href} onChange={e => {
                               const links = [...section.data.links];
                               links[lIdx] = { ...link, href: e.target.value };
                               handleLocalUpdate(sectionIdStr, { data: { ...section.data, links } });
                             }} className="w-full p-2 border-none bg-white dark:bg-gray-800 rounded-lg text-[10px] dark:text-white font-mono" />
                          </div>
                          <div className="sm:w-32 space-y-2">
                             <input type="text" placeholder="Icon" value={link.iconName} onChange={e => {
                               const links = [...section.data.links];
                               links[lIdx] = { ...link, iconName: e.target.value };
                               handleLocalUpdate(sectionIdStr, { data: { ...section.data, links } });
                             }} className="w-full p-2 border-none bg-white dark:bg-gray-800 rounded-lg text-[10px] dark:text-white" title="Lucide icon name" />
                             <button type="button" onClick={() => {
                                const links = section.data.links.filter((_: any, i: number) => i !== lIdx);
                                handleLocalUpdate(sectionIdStr, { data: { ...section.data, links } });
                             }} className="w-full py-1.5 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all uppercase">Remove</button>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => {
                         const links = [...(section.data.links || []), { label: 'New Link', href: '#', iconName: 'LinkIcon' }];
                         handleLocalUpdate(sectionIdStr, { data: { ...section.data, links } });
                      }} className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-emerald-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all">
                        <PlusCircle size={16} /> Add Link Item
                      </button>
                    </div>
                  )}

                  {section.type === 'hotlines' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Hotline Numbers</label>
                      {section.data.hotlines?.map((h: SidebarHotline, hIdx: number) => (
                        <div key={hIdx} className="flex gap-2 items-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-2xl border dark:border-gray-700">
                          <input type="text" placeholder="Desk Name" value={h.title} onChange={e => {
                             const hotlines = [...section.data.hotlines];
                             hotlines[hIdx] = { ...h, title: e.target.value };
                             handleLocalUpdate(sectionIdStr, { data: { ...section.data, hotlines } });
                          }} className="flex-1 p-2 bg-white dark:bg-gray-800 border-none rounded-lg text-xs dark:text-white" />
                          <input type="text" placeholder="Number" value={h.number} onChange={e => {
                             const hotlines = [...section.data.hotlines];
                             hotlines[hIdx] = { ...h, number: e.target.value };
                             handleLocalUpdate(sectionIdStr, { data: { ...section.data, hotlines } });
                          }} className="flex-1 p-2 bg-white dark:bg-gray-800 border-none rounded-lg text-xs dark:text-white font-bold" />
                          <button type="button" onClick={() => {
                             const hotlines = section.data.hotlines.filter((_: any, i: number) => i !== hIdx);
                             handleLocalUpdate(sectionIdStr, { data: { ...section.data, hotlines } });
                          }} className="p-2 text-red-400 hover:text-red-500"><X size={18}/></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => {
                         const hotlines = [...(section.data.hotlines || []), { title: 'Help Desk', number: '16221' }];
                         handleLocalUpdate(sectionIdStr, { data: { ...section.data, hotlines } });
                      }} className="w-full py-3 border border-emerald-600/30 text-emerald-600 font-bold text-[10px] rounded-xl uppercase hover:bg-emerald-50 transition-all">
                        + Add Hotline Number
                      </button>
                    </div>
                  )}

                  {(section.type === 'video' || section.type === 'map') && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Embed Source URL (iframe src)</label>
                      <input type="text" value={section.data.url || ''} onChange={e=>handleLocalUpdate(sectionIdStr, {data: {...section.data, url: e.target.value}})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs dark:text-white font-mono" placeholder="https://..." />
                    </div>
                  )}

                  {section.type === 'image_card' && (
                    <div className="grid grid-cols-1 gap-4">
                      <UploaderField 
                        label="Card Image" 
                        value={section.data.image} 
                        sectionId={sectionIdStr} 
                        dataKey="image" 
                        accept="image/*" 
                      />
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Bottom Label</label>
                        <input type="text" value={section.data.name || ''} onChange={e=>handleLocalUpdate(sectionIdStr, {data: {...section.data, name: e.target.value}})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm dark:text-white" />
                      </div>
                    </div>
                  )}

                  {section.type === 'audio' && (
                    <div className="grid grid-cols-1 gap-4">
                      <UploaderField 
                        label="Audio Stream File" 
                        value={section.data.audioUrl} 
                        sectionId={sectionIdStr} 
                        dataKey="audioUrl" 
                        accept="audio/*" 
                      />
                    </div>
                  )}

                  {section.type === 'countdown' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Target Event Date & Time</label>
                      <input type="datetime-local" value={section.data.targetDate?.split('.')[0] || ''} onChange={e=>handleLocalUpdate(sectionIdStr, {data: {...section.data, targetDate: e.target.value}})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm dark:text-white" />
                    </div>
                  )}

                  {section.type === 'notice' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Rich Content / HTML Block</label>
                      <textarea value={section.data.content || ''} onChange={e=>handleLocalUpdate(sectionIdStr, {data: {...section.data, content: e.target.value}})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm dark:text-white h-32 font-mono" placeholder="<p>Important announcement...</p>" />
                    </div>
                  )}

                  {section.type === 'image_only' && (
                    <div className="grid grid-cols-1 gap-4">
                      <UploaderField 
                        label="Sidebar Banner Image" 
                        value={section.data.image} 
                        sectionId={sectionIdStr} 
                        dataKey="image" 
                        accept="image/*" 
                      />
                    </div>
                  )}

                  <div className="pt-2">
                    <button type="button" onClick={() => setEditingId(null)} className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all">
                      Close Editor
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {localSections.length === 0 && (
          <div className="p-20 text-center border-2 border-dashed rounded-3xl border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
            <Layout size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-400 font-medium">Your sidebar is empty. Click a button above to add widgets.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
