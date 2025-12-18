
import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, Newspaper, Users, ArrowLeft, 
  Menu, Image, Settings, Globe, Search, Play, Files, AlertTriangle, X
} from 'lucide-react';
import { 
  Notice, User as UserType, Page, CarouselItem, SidebarSection, InfoCard, MenuItem, 
  TopBarConfig, FooterConfig, HomeWidgetConfig, NewsItem, SchoolInfo, SEOMeta 
} from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  updateSettingsThunk, updateSidebarThunk, updateInfoCardsThunk, 
  updateHomeWidgetsThunk, addNoticeThunk, addNewsThunk, addPageThunk,
  updatePageThunk, deletePageThunk, deleteNoticeThunk, deleteNewsThunk 
} from '../store/slices/contentSlice';

import AdminOverview from '../components/admin/AdminOverview';
import AdminNotices from '../components/admin/AdminNotices';
import AdminPages from '../components/admin/AdminPages';
import AdminCarousel from '../components/admin/AdminCarousel';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminSiteSettings from '../components/admin/AdminSiteSettings';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminInfoCards from '../components/admin/AdminInfoCards';
import AdminHomeWidgets from '../components/admin/AdminHomeWidgets';

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

  const [activeTab, setActiveTab] = useState<'overview' | 'notices' | 'news' | 'pages' | 'infocards' | 'sidebar' | 'carousel' | 'menu' | 'settings' | 'homepage'>('overview');
  const [globalError, setGlobalError] = useState<string | null>(null);

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
            onDelete={id => handleAction(() => dispatch(deleteNoticeThunk(id)).unwrap())} 
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

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-10 transition-colors">
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

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 h-fit shrink-0 overflow-hidden">
              <nav className="p-2 space-y-1">
                  {[
                      { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                      { id: 'notices', icon: FileText, label: 'Notices' },
                      { id: 'pages', icon: Files, label: 'Pages' },
                      { id: 'carousel', icon: Image, label: 'Banners' },
                      { id: 'menu', icon: Menu, label: 'Menu' },
                      { id: 'infocards', icon: Play, label: 'Info Cards' },
                      { id: 'sidebar', icon: Settings, label: 'Sidebar' },
                      { id: 'homepage', icon: LayoutDashboard, label: 'Widgets' },
                      { id: 'settings', icon: Globe, label: 'Site Setup' },
                  ].map((item) => (
                      <button 
                          key={item.id}
                          onClick={() => setActiveTab(item.id as any)}
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
    </div>
  );
};

export default AdminDashboard;
