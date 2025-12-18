
import React, { useState, useEffect } from 'react';
import { Save, Globe, Info, Search, Phone, RefreshCw } from 'lucide-react';
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

const AdminSiteSettings: React.FC<AdminSiteSettingsProps> = ({ 
  topBar, footer, school, seo, onUpdateTopBar, onUpdateFooter, onUpdateSchool, onUpdateSEO 
}) => {
  // Local States for each section to handle editing before saving
  const [localSchool, setLocalSchool] = useState<SchoolInfo>(school);
  const [localTopBar, setLocalTopBar] = useState<TopBarConfig>(topBar);
  const [localSEO, setLocalSEO] = useState<SEOMeta>(seo);
  const [localFooter, setLocalFooter] = useState<FooterConfig>(footer);

  // Loading/Saving states per section
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // Sync local state when props change (e.g., initial load or external refresh)
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

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <h3 className="font-black text-emerald-800 dark:text-emerald-400 mb-6 flex items-center gap-2 uppercase tracking-widest text-sm">
      <Icon size={18}/> {title}
    </h3>
  );

  const SaveButton = ({ section, onClick }: { section: string, onClick: () => void }) => (
    <div className="flex justify-end pt-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Office Address</label>
            <textarea value={localFooter.address} onChange={e=>setLocalFooter({...localFooter, address: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm h-24 focus:ring-2 focus:ring-emerald-500 resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Copyright Line</label>
            <input type="text" value={localFooter.copyrightText} onChange={e=>setLocalFooter({...localFooter, copyrightText: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl dark:text-white text-sm focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        <SaveButton section="Footer" onClick={() => handleSave('Footer', () => onUpdateFooter(localFooter))} />
      </section>
    </div>
  );
};

export default AdminSiteSettings;
