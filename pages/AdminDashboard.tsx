
import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, Newspaper, Users, ArrowLeft, 
  Menu, Image, Settings, Globe, Search, Play, Files, AlertTriangle, X, Code, Bell
} from 'lucide-react';
import { 
  Notice, User as UserType, Page, CarouselItem, SidebarSection, InfoCard, MenuItem, 
  TopBarConfig, FooterConfig, HomeWidgetConfig, NewsItem, SchoolInfo, SEOMeta 
} from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  updateSettingsThunk, updateSidebarThunk, updateInfoCardsThunk, 
  updateHomeWidgetsThunk, addNoticeThunk, updateNoticeThunk, addNewsThunk, updateNewsThunk, addPageThunk,
  updatePageThunk, deletePageThunk, deleteNoticeThunk, deleteNewsThunk 
} from '../store/slices/contentSlice';

import AdminOverview from '../components/admin/AdminOverview';
import AdminNotices from '../components/admin/AdminNotices';
import AdminNews from '../components/admin/AdminNews';
import AdminPages from '../components/admin/AdminPages';
import AdminCarousel from '../components/admin/AdminCarousel';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminSiteSettings from '../components/admin/AdminSiteSettings';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminInfoCards from '../components/admin/AdminInfoCards';
import AdminHomeWidgets from '../components/admin/AdminHomeWidgets';
import AdminAPISettings from '../components/admin/AdminAPISettings';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const dispatch = useDispatch() as any;
  const { 
    notices, news, pages, carouselItems, sidebarSections, 
    infoCards, menuItems, topBarConfig, footerConfig, 
    homeWidgets, schoolInfo, seoMeta 
  } = useSelector((state: RootState) => state.content);

  const [activeTab, setActiveTab] = useState<'overview' | 'notices' | 'news' | 'pages' | 'infocards' | 'sidebar' | 'carousel' | 'menu' | 'settings' | 'homepage' | 'api'>('overview');
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const generateUUID = () => Math.random().toString(36).substring(2, 11);

  const handleAction = async (action: () => Promise<any>) => {
    setGlobalError(null);
    try {
      await action();
    } catch (err: any) {
      console.error("Dashboard Action Error:", err);
      setGlobalError(err.message || "A network error occurred. Please check your connection.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview stats={{ notices: notices.length, news: news.length, pages: pages.length, widgets: homeWidgets.length }} />;
      case 'notices':
        return (
          <AdminNotices 
            notices={notices} 
            onAdd={n => handleAction(() => dispatch(addNoticeThunk(n)).unwrap())} 
            onUpdate={n => handleAction(() => dispatch(updateNoticeThunk(n)).unwrap())}
            onDelete={id => handleAction(() => dispatch(deleteNoticeThunk(id)).unwrap())} 
            generateUUID={generateUUID} 
          />
        );
      case 'news':
        return (
          <AdminNews 
            news={news} 
            onAdd={n => handleAction(() => dispatch(addNewsThunk(n)).unwrap())} 
            onUpdate={n => handleAction(() => dispatch(updateNewsThunk(n)).unwrap())}
            onDelete={id => handleAction(() => dispatch(deleteNewsThunk(id)).unwrap())} 
            generateUUID={generateUUID} 
          />
        );
      case 'pages':
        return (
          <AdminPages 
            pages={pages} 
            onAdd={p => handleAction(() => dispatch(addPageThunk(p)).unwrap())} 
            onUpdate={p => handleAction(() => dispatch(updatePageThunk(p)).unwrap())} 
            onDelete={id => handleAction(() => dispatch(deletePageThunk(id)).unwrap())} 
            generateUUID={generateUUID} 
            onPreviewPage={(slug) => {
              window.location.hash = `page-viewer?slug=${slug}`;
              onBack();
            }}
          />
        );
      case 'carousel':
        return <AdminCarousel items={carouselItems} onUpdate={items => handleAction(() => dispatch(updateSettingsThunk({key:'carouselItems', value:items})).unwrap())} generateUUID={generateUUID} />;
      case 'menu':
        return <AdminNavbar menuItems={menuItems} onUpdate={items => handleAction(() => dispatch(updateSettingsThunk({key:'menuItems', value:items})).unwrap())} generateUUID={generateUUID} />;
      case 'sidebar':
        return <AdminSidebar sections={sidebarSections} onUpdate={items => handleAction(() => dispatch(updateSidebarThunk(items)).unwrap())} generateUUID={generateUUID} />;
      case 'infocards':
        return <AdminInfoCards cards={infoCards} onUpdate={items => handleAction(() => dispatch(updateInfoCardsThunk(items)).unwrap())} generateUUID={generateUUID} />;
      case 'homepage':
        return <AdminHomeWidgets widgets={homeWidgets} onUpdate={items => handleAction(() => dispatch(updateHomeWidgetsThunk(items)).unwrap())} generateUUID={generateUUID} />;
      case 'api':
        return (
          <AdminAPISettings 
            seo={seoMeta}
            onUpdateSEO={s => handleAction(() => dispatch(updateSettingsThunk({key:'seoMeta', value:s})).unwrap())}
          />
        );
      case 'settings':
        return (
          <AdminSiteSettings 
            topBar={topBarConfig} footer={footerConfig} school={schoolInfo} seo={seoMeta}
            onUpdateTopBar={c => handleAction(() => dispatch(updateSettingsThunk({key:'topBarConfig', value:c})).unwrap())}
            onUpdateFooter={c => handleAction(() => dispatch(updateSettingsThunk({key:'footerConfig', value:c})).unwrap())}
            onUpdateSchool={s => handleAction(() => dispatch(updateSettingsThunk({key:'schoolInfo', value:s})).unwrap())}
            onUpdateSEO={s => handleAction(() => dispatch(updateSettingsThunk({key:'seoMeta', value:s})).unwrap())}
          />
        );
      default:
        return <div className="p-20 text-center text-gray-400 italic">Feature coming soon...</div>;
    }
  };

  const menuItemsList = [
      { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
      { id: 'notices', icon: FileText, label: 'Notices' },
      { id: 'news', icon: Newspaper, label: 'News Ticker' },
      { id: 'pages', icon: Files, label: 'Pages' },
      { id: 'carousel', icon: Image, label: 'Banners' },
      { id: 'menu', icon: Menu, label: 'Menu' },
      { id: 'infocards', icon: Play, label: 'Info Cards' },
      { id: 'sidebar', icon: Settings, label: 'Sidebar' },
      { id: 'homepage', icon: LayoutDashboard, label: 'Widgets' },
      { id: 'api', icon: Code, label: 'API & AI' },
      { id: 'settings', icon: Globe, label: 'Site Setup' },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-24 md:pb-10 transition-colors">
      <div className="bg-emerald-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
                <LayoutDashboard size={24} />
                <h1 className="text-xl font-bold tracking-tight">Portal Administration</h1>
            </div>
            <button onClick={onBack} className="text-sm bg-emerald-800 hover:bg-emerald-700 px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all">
                <ArrowLeft size={16} /> Exit Admin
            </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {globalError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl flex items-center justify-between text-red-700 dark:text-red-400 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} />
              <p className="text-sm font-bold">{globalError}</p>
            </div>
            <button onClick={() => setGlobalError(null)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 relative">
          {/* Overlay for Drawer */}
          {isDrawerOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm transition-all"
              onClick={() => setIsDrawerOpen(false)}
            />
          )}

          {/* Sidebar / Menu Drawer */}
          <div className={`
            fixed md:relative inset-y-0 left-0 z-[70] md:z-auto
            w-72 md:w-64 bg-white dark:bg-gray-900 rounded-r-2xl md:rounded-xl shadow-2xl md:shadow-sm border dark:border-gray-800 
            h-full md:h-fit shrink-0 overflow-hidden transform transition-transform duration-300 ease-in-out
            ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
              <div className="md:hidden flex items-center justify-between p-4 border-b dark:border-gray-800 bg-emerald-50 dark:bg-emerald-950/20">
                <h2 className="font-black text-emerald-800 dark:text-emerald-400 text-xs uppercase tracking-widest">Admin Menu</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-gray-400"><X size={20}/></button>
              </div>
              <nav className="p-2 space-y-1">
                  {menuItemsList.map((item) => (
                      <button 
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as any);
                            setIsDrawerOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-lg flex items-center gap-3 text-sm font-semibold transition ${activeTab === item.id ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                      >
                          <item.icon size={18} /> {item.label}
                      </button>
                  ))}
              </nav>
          </div>

          <div className="flex-1 min-w-0">
              {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t dark:border-gray-800 z-[50] md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-colors">
        <div className="flex items-center justify-around p-2">
           {/* 1. Admin Menu Drawer show button */}
           <button 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${isDrawerOpen ? 'text-emerald-600 scale-110' : 'text-gray-400'}`}
           >
             <Menu size={22} />
             <span className="text-[10px] font-black uppercase tracking-tighter">Menu</span>
           </button>

           {/* 2. Notifications */}
           <button 
            onClick={() => window.location.hash = 'notifications'}
            className="flex flex-col items-center gap-0.5 p-2 text-gray-400 transition-all hover:text-emerald-600"
           >
             <Bell size={22} />
             <span className="text-[10px] font-black uppercase tracking-tighter">Alerts</span>
           </button>

           {/* 3. Admin Overview */}
           <button 
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${activeTab === 'overview' ? 'text-emerald-600 scale-110' : 'text-gray-400'}`}
           >
             <LayoutDashboard size={22} />
             <span className="text-[10px] font-black uppercase tracking-tighter">Summary</span>
           </button>

           {/* 4. Notice */}
           <button 
            onClick={() => setActiveTab('notices')}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${activeTab === 'notices' ? 'text-emerald-600 scale-110' : 'text-gray-400'}`}
           >
             <FileText size={22} />
             <span className="text-[10px] font-black uppercase tracking-tighter">Notice</span>
           </button>

           {/* 5. Site Setup */}
           <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${activeTab === 'settings' ? 'text-emerald-600 scale-110' : 'text-gray-400'}`}
           >
             <Globe size={22} />
             <span className="text-[10px] font-black uppercase tracking-tighter">Setup</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
