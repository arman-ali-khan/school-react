
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Bot, Sparkles, MessageSquareText, User as UserIcon, 
  Save, RefreshCw, Key, ShieldCheck, Info, Database, 
  Calendar, CheckCircle2, Zap
} from 'lucide-react';
import { SEOMeta } from '../../types';
import { RootState } from '../../store';

interface AdminAPISettingsProps {
  seo: SEOMeta;
  onUpdateSEO: (s: SEOMeta) => Promise<any>;
}

const AdminAPISettings: React.FC<AdminAPISettingsProps> = ({ seo, onUpdateSEO }) => {
  const { visitorStats } = useSelector((state: RootState) => state.content);
  const [localSEO, setLocalSEO] = useState<SEOMeta>(seo);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalSEO(seo);
  }, [seo]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdateSEO(localSEO);
      alert('API settings updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save API settings.');
    } finally {
      setSaving(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <h3 className="font-black text-emerald-800 dark:text-emerald-400 mb-6 flex items-center gap-2 uppercase tracking-widest text-sm">
      <Icon size={18}/> {title}
    </h3>
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* API Data Statistics Card */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-600 text-white p-5 rounded-3xl shadow-xl shadow-emerald-900/10 flex flex-col justify-between h-40">
           <div className="flex items-center justify-between opacity-80">
              <span className="text-[10px] font-black uppercase tracking-widest">History Log</span>
              <Database size={16} />
           </div>
           <div>
              <h4 className="text-4xl font-black mb-1">{visitorStats.historyDays}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Days of records tracked</p>
           </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border dark:border-gray-700 shadow-sm flex flex-col justify-between h-40">
           <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] font-black uppercase tracking-widest">API Health</span>
              <Zap size={16} className="text-yellow-500" />
           </div>
           <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-2xl font-black dark:text-white tracking-tighter">99.9%</h4>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Gemini API Connectivity</p>
           </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border dark:border-gray-700 shadow-sm flex flex-col justify-between h-40">
           <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] font-black uppercase tracking-widest">Sync Cycle</span>
              <Calendar size={16} className="text-blue-500" />
           </div>
           <div>
              <h4 className="text-2xl font-black dark:text-white tracking-tighter">Automated</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Global Data Integrity</p>
           </div>
        </div>
      </section>

      {/* Website Subscription Config */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
        <SectionHeader icon={Key} title="Subscription Store Configuration" />
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
              <ShieldCheck size={10}/> Website Subscription API Key
            </label>
            <input 
              type="password" 
              value={localSEO.websiteSubscriptionKey || ''} 
              onChange={e => setLocalSEO({...localSEO, websiteSubscriptionKey: e.target.value})} 
              className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500" 
              placeholder="Enter subscription service key..." 
            />
            <p className="text-[9px] text-gray-400 mt-2 flex items-center gap-1 italic">
              <Info size={10}/> This key authorizes paid board features and SMS alerts.
            </p>
          </div>
        </div>
      </section>

      {/* Gemini AI Assistant Config */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
        <SectionHeader icon={Bot} title="Gemini AI Configuration" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          <div className="space-y-6">
             <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                <Sparkles size={10}/> AI Model ID
              </label>
              <input 
                type="text" 
                value={localSEO.aiModel || ''} 
                onChange={e => setLocalSEO({...localSEO, aiModel: e.target.value})} 
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500" 
                placeholder="gemini-3-flash-preview" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                <MessageSquareText size={10}/> Dynamic Welcome Message
              </label>
              <textarea 
                value={localSEO.aiWelcomeMessage || ''} 
                onChange={e => setLocalSEO({...localSEO, aiWelcomeMessage: e.target.value})} 
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl dark:text-white text-sm h-24 focus:ring-2 focus:ring-emerald-500 resize-none shadow-inner" 
                placeholder="Message shown when chat opens..." 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
              <UserIcon size={10}/> Assistant Persona (System Instruction)
            </label>
            <textarea 
              value={localSEO.aiSystemInstruction || ''} 
              onChange={e => setLocalSEO({...localSEO, aiSystemInstruction: e.target.value})} 
              className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl dark:text-white text-sm h-full min-h-[180px] focus:ring-2 focus:ring-emerald-500 resize-none shadow-inner" 
              placeholder="Instructions that define how the AI acts..." 
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4 border-t dark:border-gray-700">
        <button 
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50"
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Synchronizing...' : 'Save API Settings'}
        </button>
      </div>
    </div>
  );
};

export default AdminAPISettings;
