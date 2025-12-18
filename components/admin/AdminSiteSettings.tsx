
import React from 'react';
import { Save, Globe, Info, Search, Phone } from 'lucide-react';
import { TopBarConfig, FooterConfig, SchoolInfo, SEOMeta } from '../../types';

interface AdminSiteSettingsProps {
  topBar: TopBarConfig;
  footer: FooterConfig;
  school: SchoolInfo;
  seo: SEOMeta;
  onUpdateTopBar: (c: TopBarConfig) => void;
  onUpdateFooter: (c: FooterConfig) => void;
  onUpdateSchool: (s: SchoolInfo) => void;
  onUpdateSEO: (s: SEOMeta) => void;
}

const AdminSiteSettings: React.FC<AdminSiteSettingsProps> = ({ 
  topBar, footer, school, seo, onUpdateTopBar, onUpdateFooter, onUpdateSchool, onUpdateSEO 
}) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* School Info */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
          <Info size={20}/> School Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Board/School Name</label>
            <input type="text" value={school.name} onChange={e=>onUpdateSchool({...school, name: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Title (Short)</label>
            <input type="text" value={school.title} onChange={e=>onUpdateSchool({...school, title: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Logo URL</label>
            <input type="text" value={school.logoUrl} onChange={e=>onUpdateSchool({...school, logoUrl: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">EIIN</label>
              <input type="text" value={school.eiin} onChange={e=>onUpdateSchool({...school, eiin: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">Code</label>
              <input type="text" value={school.code} onChange={e=>onUpdateSchool({...school, code: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Top Bar Config */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
          <Phone size={20}/> Top Bar & Support
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Support Hotline</label>
            <input type="text" value={topBar.phone} onChange={e=>onUpdateTopBar({...topBar, phone: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Contact Email</label>
            <input type="email" value={topBar.email} onChange={e=>onUpdateTopBar({...topBar, email: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
          </div>
        </div>
      </section>

      {/* SEO Meta */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
          <Search size={20}/> SEO Metadata
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Site Title (Meta)</label>
            <input type="text" value={seo.title} onChange={e=>onUpdateSEO({...seo, title: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Meta Description</label>
            <textarea value={seo.description} onChange={e=>onUpdateSEO({...seo, description: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm h-20" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Keywords (Comma separated)</label>
            <input type="text" value={seo.keywords} onChange={e=>onUpdateSEO({...seo, keywords: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
          </div>
        </div>
      </section>

      {/* Footer Config */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
          <Globe size={20}/> Footer Configuration
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Address Block</label>
            <textarea value={footer.address} onChange={e=>onUpdateFooter({...footer, address: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm h-24" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Copyright Text</label>
            <input type="text" value={footer.copyrightText} onChange={e=>onUpdateFooter({...footer, copyrightText: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSiteSettings;
