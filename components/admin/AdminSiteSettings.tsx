
import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Globe, Info, Search, Phone, RefreshCw, Plus, Trash2, 
  Link as LinkIcon, Mail, Upload, X, ImageIcon, 
  GraduationCap, School, Book, Library, Award, Shield, Building, Users, CheckCircle, FileText
} from 'lucide-react';
import { TopBarConfig, FooterConfig, SchoolInfo, SEOMeta } from '../../types';

interface AdminSiteSettingsProps {
  topBar: TopBarConfig;
  footer: FooterConfig;
  school: SchoolInfo;
  seo: SEOMeta;
  onUpdateTopBar: (c: TopBarConfig) => Promise<any>;
  onUpdateFooter: (c: FooterConfig) => Promise<any>;
  onUpdateSchool: (s: SchoolInfo) => Promise<any>;
  onUpdateSEO: (s: SEOMeta) => Promise<any>;
}

const ICON_OPTIONS = [
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'School', icon: School },
  { name: 'Book', icon: Book },
  { name: 'Library', icon: Library },
  { name: 'Award', icon: Award },
  { name: 'Shield', icon: Shield },
  { name: 'Building', icon: Building },
  { name: 'Users', icon: Users },
  { name: 'CheckCircle', icon: CheckCircle },
  { name: 'FileText', icon: FileText }
];

const CLOUDINARY_UPLOAD_PRESET = "school"; 
const CLOUDINARY_CLOUD_NAME = "dgituybrt";

const AdminSiteSettings: React.FC<AdminSiteSettingsProps> = ({ 
  topBar, footer, school, seo, onUpdateTopBar, onUpdateFooter, onUpdateSchool, onUpdateSEO 
}) => {
  const [localSchool, setLocalSchool] = useState<SchoolInfo>(school);
  const [localTopBar, setLocalTopBar] = useState<TopBarConfig>(topBar);
  const [localSEO, setLocalSEO] = useState<SEOMeta>(seo);
  const [localFooter, setLocalFooter] = useState<FooterConfig>(footer);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setLocalSchool(school); }, [school]);
  useEffect(() => { setLocalTopBar(topBar); }, [topBar]);
  useEffect(() => { setLocalSEO(seo); }, [seo]);
  useEffect(() => { setLocalFooter(footer); }, [footer]);

  const handleSave = async (section: string, action: () => Promise<any>) => {
    setSaving(prev => ({ ...prev, [section]: true }));
    try {
      await action();
      alert(`${section} updated successfully!`);
    } catch (err) {
      console.error(err);
      alert(`Failed to save ${section}.`);
    } finally {
      setSaving(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
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
        setLocalSchool({ ...localSchool, logoUrl: data.secure_url });
      }
    } catch (err) {
      console.error(err);
      alert('Logo upload failed.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const addFooterLink = () => {
    setLocalFooter({
      ...localFooter,
      govtLinks: [...localFooter.govtLinks, { label: 'New Link', href: 'https://' }]
    });
  };

  const updateFooterLink = (index: number, field: 'label' | 'href', value: string) => {
    const updatedLinks = localFooter.govtLinks.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    );
    setLocalFooter({ ...localFooter, govtLinks: updatedLinks });
  };

  const removeFooterLink = (index: number) => {
    const updatedLinks = localFooter.govtLinks.filter((_, i) => i !== index);
    setLocalFooter({ ...localFooter, govtLinks: updatedLinks });
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <h3 className="font-black text-emerald-800 dark:text-emerald-400 mb-6 flex items-center gap-2 uppercase tracking-widest text-sm">
      <Icon size={18}/> {title}
    </h3>
  );

  const SaveButton = ({ section, onClick }: { section: string, onClick: () => void }) => (
    <div className="flex justify-end pt-4 border-t dark:border-gray-700 mt-4">
      <button 
        type="button"
        onClick={onClick}
        disabled={saving[section]}
        className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-xl font-bold text-xs transition-all shadow-md shadow-emerald-900/10 disabled:opacity-50"
      >
        {saving[section] ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
        {saving[section] ? 'Storing...' : `Save ${section}`}
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* School Info */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
        <SectionHeader icon={Info} title="Board Identification" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
          {/* Logo / Icon Picker */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Board Brand (Logo/Icon)</label>
            <div 
              onClick={() => logoInputRef.current?.click()}
              className={`h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${localSchool.logoUrl ? 'border-emerald-500' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400'}`}
            >
              {isUploadingLogo ? (
                <RefreshCw className="animate-spin text-emerald-500" />
              ) : localSchool.logoUrl ? (
                <div className="w-full h-full relative group">
                  <img src={localSchool.logoUrl} className="w-full h-full object-contain p-4" alt="Logo Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <X className="text-white" size={24} onClick={(e) => { e.stopPropagation(); setLocalSchool({...localSchool, logoUrl: ''}); }} />
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <Upload className="mx-auto text-gray-300 mb-2" size={24} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Upload Logo</p>
                </div>
              )}
              <input type="file" ref={logoInputRef} className="hidden" onChange={handleLogoUpload} accept="image/*" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase">Or Select System Icon</label>
              <div className="grid grid-cols-5 gap-2">
                {ICON_OPTIONS.map(opt => (
                  <button 
                    key={opt.name}
                    onClick={() => setLocalSchool({ ...localSchool, iconName: opt.name, logoUrl: '' })}
                    className={`p-2 rounded-lg border transition-all flex items-center justify-center ${localSchool.iconName === opt.name && !localSchool.logoUrl ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-gray-50 dark:bg-gray-900 text-gray-400 border-transparent hover:border-emerald-200'}`}
                  >
                    <opt.icon size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Board/School Name</label>
              <input type="text" value={localSchool.name} onChange={e=>setLocalSchool({...localSchool, name: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Location Title</label>
              <input type="text" value={localSchool.title} onChange={e=>setLocalSchool({...localSchool, title: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">EIIN</label>
              <input type="text" value={localSchool.eiin} onChange={e=>setLocalSchool({...localSchool, eiin: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Board Code</label>
              <input type="text" value={localSchool.code} onChange={e=>setLocalSchool({...localSchool, code: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Header Address Line</label>
              <input type="text" value={localSchool.address} onChange={e=>setLocalSchool({...localSchool, address: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>
        
        <SaveButton section="School Info" onClick={() => handleSave('School Info', () => onUpdateSchool(localSchool))} />
      </section>

      {/* Top Bar Config */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
        <SectionHeader icon={Phone} title="Global Contact & Nav" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Hotline Phone</label>
            <input type="text" value={localTopBar.phone} onChange={e=>setLocalTopBar({...localTopBar, phone: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Primary Email</label>
            <input type="email" value={localTopBar.email} onChange={e=>setLocalTopBar({...localTopBar, email: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex items-center gap-3 pt-4">
             <input 
              type="checkbox" 
              id="show-dt" 
              checked={localTopBar.showDateTime} 
              onChange={e=>setLocalTopBar({...localTopBar, showDateTime: e.target.checked})}
              className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
             />
             <label htmlFor="show-dt" className="text-sm font-bold text-gray-600 dark:text-gray-300">Show Live Clock in Header</label>
          </div>
        </div>
        <SaveButton section="Top Bar" onClick={() => handleSave('Top Bar', () => onUpdateTopBar(localTopBar))} />
      </section>

      {/* SEO Meta */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
        <SectionHeader icon={Search} title="Search Engine Presence" />
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Site Title</label>
            <input type="text" value={localSEO.title} onChange={e=>setLocalSEO({...localSEO, title: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
            <textarea value={localSEO.description} onChange={e=>setLocalSEO({...localSEO, description: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm h-20 focus:ring-2 focus:ring-emerald-500 resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Keywords (Comma separated)</label>
            <input type="text" value={localSEO.keywords} onChange={e=>setLocalSEO({...localSEO, keywords: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        <SaveButton section="SEO Meta" onClick={() => handleSave('SEO Meta', () => onUpdateSEO(localSEO))} />
      </section>

      {/* Footer Config */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
        <SectionHeader icon={Globe} title="Footer Content" />
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Office Address</label>
              <textarea value={localFooter.address} onChange={e=>setLocalFooter({...localFooter, address: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm h-full min-h-[120px] focus:ring-2 focus:ring-emerald-500 resize-none shadow-inner" />
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Copyright Line</label>
                <input type="text" value={localFooter.copyrightText} onChange={e=>setLocalFooter({...localFooter, copyrightText: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Phone size={10}/> Footer Phone</label>
                  <input type="text" value={localFooter.phone} onChange={e=>setLocalFooter({...localFooter, phone: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Mail size={10}/> Footer Email</label>
                  <input type="email" value={localFooter.email} onChange={e=>setLocalFooter({...localFooter, email: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                <LinkIcon size={12} /> Important Links (Footer)
              </label>
              <button 
                type="button" 
                onClick={addFooterLink}
                className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-all flex items-center gap-1"
              >
                <Plus size={12} /> Add Link
              </button>
            </div>

            <div className="space-y-3">
              {localFooter.govtLinks.map((link, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-3 bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-700 relative group transition-all hover:border-emerald-200 dark:hover:border-emerald-800">
                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase px-1">Label</label>
                    <input 
                      type="text" 
                      value={link.label} 
                      onChange={e => updateFooterLink(idx, 'label', e.target.value)}
                      className="w-full p-1.5 bg-white dark:bg-gray-800 border-none rounded-lg text-xs font-bold dark:text-white focus:ring-1 focus:ring-emerald-500" 
                      placeholder="Ministry of Education"
                    />
                  </div>
                  <div className="flex-[2] space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase px-1">URL / Link</label>
                    <input 
                      type="text" 
                      value={link.href} 
                      onChange={e => updateFooterLink(idx, 'href', e.target.value)}
                      className="w-full p-1.5 bg-white dark:bg-gray-800 border-none rounded-lg text-xs font-mono dark:text-white focus:ring-1 focus:ring-emerald-500" 
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <button 
                      type="button"
                      onClick={() => removeFooterLink(idx)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      title="Remove Link"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {localFooter.govtLinks.length === 0 && (
                <div className="p-8 text-center text-gray-400 italic text-xs border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
                  No links added to the footer section yet.
                </div>
              )}
            </div>
          </div>
        </div>
        <SaveButton section="Footer" onClick={() => handleSave('Footer', () => onUpdateFooter(localFooter))} />
      </section>
    </div>
  );
};

export default AdminSiteSettings;
