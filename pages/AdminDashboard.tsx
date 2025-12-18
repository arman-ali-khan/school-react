
import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, Newspaper, Users, ArrowLeft, 
  Menu, Image, Settings, Globe, Search, Play, Files
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

// Refactored Components
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

  const generateUUID = () => Math.random().toString(36).substring(2, 9);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview stats={{ notices: notices.length, news: news.length, pages: pages.length, widgets: homeWidgets.length }} />;
      case 'notices':
        return <AdminNotices notices={notices} onAdd={n=>dispatch(addNoticeThunk(n))} onDelete={id=>dispatch(deleteNoticeThunk(id))} generateUUID={generateUUID} />;
      case 'pages':
        return <AdminPages pages={pages} onAdd={p=>dispatch(addPageThunk(p))} onUpdate={p=>dispatch(updatePageThunk(p))} onDelete={id=>dispatch(deletePageThunk(id))} generateUUID={generateUUID} />;
      case 'carousel':
        return <AdminCarousel items={carouselItems} onUpdate={items=>dispatch(updateSettingsThunk({key:'carouselItems', value:items}))} generateUUID={generateUUID} />;
      case 'menu':
        return <AdminNavbar menuItems={menuItems} onUpdate={items=>dispatch(updateSettingsThunk({key:'menuItems', value:items}))} generateUUID={generateUUID} />;
      case 'sidebar':
        return <AdminSidebar sections={sidebarSections} onUpdate={items=>dispatch(updateSidebarThunk(items))} generateUUID={generateUUID} />;
      case 'infocards':
        return <AdminInfoCards cards={infoCards} onUpdate={items=>dispatch(updateInfoCardsThunk(items))} generateUUID={generateUUID} />;
      case 'homepage':
        return <AdminHomeWidgets widgets={homeWidgets} onUpdate={items=>dispatch(updateHomeWidgetsThunk(items))} generateUUID={generateUUID} />;
      case 'settings':
        return (
          <AdminSiteSettings 
            topBar={topBarConfig} footer={footerConfig} school={schoolInfo} seo={seoMeta}
            onUpdateTopBar={c=>dispatch(updateSettingsThunk({key:'topBarConfig', value:c}))}
            onUpdateFooter={c=>dispatch(updateSettingsThunk({key:'footerConfig', value:c}))}
            onUpdateSchool={s=>dispatch(updateSettingsThunk({key:'schoolInfo', value:s}))}
            onUpdateSEO={s=>dispatch(updateSettingsThunk({key:'seoMeta', value:s}))}
          />
        );
      default:
        return <div className="p-20 text-center text-gray-400 italic">Tab coming soon...</div>;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-10 transition-colors">
      <div className="bg-emerald-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
                <LayoutDashboard size={24} />
                <h1 className="text-xl font-bold">Portal Administration</h1>
            </div>
            <button onClick={onBack} className="text-sm bg-emerald-800 hover:bg-emerald-700 px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all">
                <ArrowLeft size={16} /> Exit Admin
            </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Navigation Rail */}
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

        {/* Dynamic Panel */}
        <div className="flex-1 min-w-0">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
