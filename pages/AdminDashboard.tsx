
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, FileText, Newspaper, Users, Plus, Trash2, ArrowLeft, 
  Menu, Image, Settings, Link, Speaker, Phone, GripVertical, ChevronUp, 
  ChevronDown, Edit, Globe, Calendar, Mail, MapPin, Type, Video, Upload, 
  FileCheck, FileWarning, Eye, Save, RefreshCw, AlertCircle, Headphones
} from 'lucide-react';
import { 
  Notice, User, Page, CarouselItem, SidebarSection, InfoCard, MenuItem, 
  SidebarSectionType, TopBarConfig, FooterConfig, HomeWidgetConfig, HomeWidgetType, NewsItem 
} from '../types';

interface AdminDashboardProps {
  user: User;
  notices: Notice[];
  news: NewsItem[];
  pages: Page[];
  carouselItems: CarouselItem[];
  sidebarSections: SidebarSection[];
  infoCards: InfoCard[];
  menuItems: MenuItem[];
  topBarConfig: TopBarConfig;
  footerConfig: FooterConfig;
  homeWidgets: HomeWidgetConfig[];
  
  onAddNotice: (notice: Notice) => Promise<any>;
  onAddNews: (newsItem: NewsItem) => Promise<any>;
  onDeleteNotice: (id: string) => void;
  onDeleteNews: (id: string) => void;
  
  onUpdatePages: (pages: Page[]) => void;
  onUpdateCarousel: (items: CarouselItem[]) => void;
  onUpdateSidebar: (sections: SidebarSection[]) => void;
  onUpdateInfoCards: (cards: InfoCard[]) => void;
  onUpdateMenu: (items: MenuItem[]) => void;
  onUpdateTopBar: (config: TopBarConfig) => void;
  onUpdateFooter: (config: FooterConfig) => void;
  onUpdateHomeWidgets: (widgets: HomeWidgetConfig[]) => void;
  
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, notices, news, pages, carouselItems, sidebarSections, infoCards, menuItems, topBarConfig, footerConfig, homeWidgets,
  onAddNotice, onAddNews, onDeleteNotice, onDeleteNews,
  onUpdatePages, onUpdateCarousel, onUpdateSidebar, onUpdateInfoCards, onUpdateMenu, onUpdateTopBar, onUpdateFooter, onUpdateHomeWidgets,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notices' | 'news' | 'pages' | 'homepage' | 'sidebar' | 'infocards' | 'menu' | 'settings'>('overview');
  
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeType, setNoticeType] = useState<'general' | 'student' | 'college' | 'exam'>('general');
  const [noticeBody, setNoticeBody] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [isNewsPublishing, setIsNewsPublishing] = useState(false);

  const generateUUID = () => Math.random().toString(36).substring(2, 9);

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || isPublishing) return;
    setIsPublishing(true);
    const newNotice: Notice = {
      id: generateUUID(),
      title: noticeTitle,
      date: new Date().toISOString().split('T')[0],
      type: noticeType,
      link: '#',
      content: noticeBody,
    };
    try {
      await onAddNotice(newNotice);
      setNoticeTitle(''); setNoticeBody('');
      alert('Notice published!');
    } catch (err) { alert('Error publishing notice'); } finally { setIsPublishing(false); }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || isNewsPublishing) return;
    setIsNewsPublishing(true);
    const newNews: NewsItem = {
      id: generateUUID(),
      title: newsTitle,
      content: newsContent,
      date: new Date().toISOString().split('T')[0]
    };
    try {
      await onAddNews(newNews);
      setNewsTitle(''); setNewsContent('');
      alert('News published!');
    } catch (err) { alert('Error publishing news'); } finally { setIsNewsPublishing(false); }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-10 transition-colors">
      <div className="bg-emerald-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
                <LayoutDashboard size={24} />
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <button onClick={onBack} className="text-sm bg-emerald-800 hover:bg-emerald-700 px-3 py-1 rounded flex items-center gap-1 transition-colors">
                <ArrowLeft size={14} /> Back to Site
            </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-fit shrink-0 overflow-hidden">
            <nav className="p-2 space-y-1">
                {[
                    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                    { id: 'notices', icon: FileText, label: 'Notices' },
                    { id: 'news', icon: Newspaper, label: 'News Ticker' },
                    { id: 'pages', icon: FileText, label: 'Pages' },
                    { id: 'sidebar', icon: Menu, label: 'Sidebar sections' },
                    { id: 'infocards', icon: Image, label: 'Info Cards' },
                    { id: 'homepage', icon: Settings, label: 'Home Widgets' },
                    { id: 'settings', icon: Globe, label: 'Portal Config' },
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full text-left p-3 rounded-md flex items-center gap-3 text-sm font-medium transition ${activeTab === item.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <item.icon size={18} /> {item.label}
                    </button>
                ))}
            </nav>
        </div>

        <div className="flex-1 min-w-0">
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">System Status</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                            <p className="text-gray-500 text-xs uppercase font-bold">Total Notices</p>
                            <h3 className="text-3xl font-bold text-emerald-600 mt-1">{notices.length}</h3>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                            <p className="text-gray-500 text-xs uppercase font-bold">News Items</p>
                            <h3 className="text-3xl font-bold text-blue-600 mt-1">{news.length}</h3>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                            <p className="text-gray-500 text-xs uppercase font-bold">Home Widgets</p>
                            <h3 className="text-3xl font-bold text-orange-600 mt-1">{homeWidgets.length}</h3>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                            <p className="text-gray-500 text-xs uppercase font-bold">Sidebar Parts</p>
                            <h3 className="text-3xl font-bold text-purple-600 mt-1">{sidebarSections.length}</h3>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'notices' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Notice Management</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><Plus size={18} className="text-emerald-600" /> New Notice</h3>
                        <form onSubmit={handleNoticeSubmit} className="space-y-4">
                            <input type="text" value={noticeTitle} onChange={e=>setNoticeTitle(e.target.value)} className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Notice Title" required />
                            <select value={noticeType} onChange={e=>setNoticeType(e.target.value as any)} className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="general">General</option>
                                <option value="student">Student</option>
                                <option value="college">College</option>
                                <option value="exam">Exam</option>
                            </select>
                            <textarea value={noticeBody} onChange={e=>setNoticeBody(e.target.value)} className="w-full h-32 p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Content Body" />
                            <button type="submit" disabled={isPublishing} className="bg-emerald-700 text-white px-6 py-2 rounded font-bold hover:bg-emerald-800 disabled:opacity-50 transition-colors">
                                {isPublishing ? 'Publishing...' : 'Publish Notice'}
                            </button>
                        </form>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded border dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 border-b dark:border-gray-600 font-bold text-xs uppercase text-gray-500">Existing Notices</div>
                        <ul className="divide-y dark:divide-gray-700">
                            {notices.map(n => (
                                <li key={n.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded text-emerald-700 dark:text-emerald-400"><FileText size={18}/></div>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">{n.title}</p>
                                            <p className="text-xs text-gray-400">{n.date} • {n.type}</p>
                                        </div>
                                    </div>
                                    <button onClick={()=>onDeleteNotice(n.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === 'news' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">News Ticker Management</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-600"><Plus size={18} /> Add Headline</h3>
                        <form onSubmit={handleNewsSubmit} className="space-y-4">
                            <input type="text" value={newsTitle} onChange={e=>setNewsTitle(e.target.value)} className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Short headline for ticker" required />
                            <textarea value={newsContent} onChange={e=>setNewsContent(e.target.value)} className="w-full h-24 p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Full story content" />
                            <button type="submit" disabled={isNewsPublishing} className="bg-blue-700 text-white px-6 py-2 rounded font-bold hover:bg-blue-800 disabled:opacity-50 transition-colors">
                                {isNewsPublishing ? 'Publishing...' : 'Add News Item'}
                            </button>
                        </form>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded border dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 border-b dark:border-gray-600 font-bold text-xs uppercase text-gray-500">Active News Items</div>
                        <ul className="divide-y dark:divide-gray-700">
                            {news.map(n => (
                                <li key={n.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded text-blue-700 dark:text-blue-400"><Newspaper size={18}/></div>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">{n.title}</p>
                                            <p className="text-xs text-gray-400">{n.date}</p>
                                        </div>
                                    </div>
                                    <button onClick={()=>onDeleteNews(n.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === 'sidebar' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Sidebar Layout</h2>
                    <div className="bg-white dark:bg-gray-800 rounded border dark:border-gray-700 shadow-sm overflow-hidden">
                        <ul className="divide-y dark:divide-gray-700">
                            {sidebarSections.map(s => (
                                <li key={s.id} className="p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded text-purple-700 dark:text-purple-400">
                                            {s.type === 'message' && <Users size={18}/>}
                                            {s.type === 'list' && <Link size={18}/>}
                                            {s.type === 'hotlines' && <Phone size={18}/>}
                                            {s.type === 'audio' && <Headphones size={18}/>}
                                            {s.type === 'map' && <MapPin size={18}/>}
                                            {s.type === 'video' && <Video size={18}/>}
                                            {s.type === 'image_card' && <Image size={18}/>}
                                            {s.type === 'image_only' && <Image size={18}/>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">{s.title || '(Image Only)'}</p>
                                            <p className="text-xs text-gray-400 uppercase tracking-tighter font-bold">Type: {s.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-gray-400 hover:text-emerald-600 p-2"><Edit size={16}/></button>
                                        <button className="text-red-300 hover:text-red-600 p-2"><Trash2 size={16}/></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className="w-full p-4 bg-gray-50 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <Plus size={16} /> Add Sidebar Widget
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'homepage' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Homepage Content</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {homeWidgets.map(w => (
                            <div key={w.id} className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700 flex justify-between items-center shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg text-orange-600">
                                        {w.type === 'youtube' && <Video size={20}/>}
                                        {w.type === 'map' && <MapPin size={20}/>}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm dark:text-white">{w.title}</h4>
                                        <p className="text-xs text-gray-400 truncate max-w-xs">{w.url}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-gray-400 hover:text-emerald-600 p-2"><Edit size={16}/></button>
                                    <button className="text-red-300 hover:text-red-600 p-2"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-400 hover:text-emerald-600 hover:border-emerald-600 transition-all font-bold flex items-center justify-center gap-2">
                        <Plus size={20} /> Add Homepage Widget
                    </button>
                </div>
            )}

            {activeTab === 'infocards' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Info Cards (Grid Icons)</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {infoCards.map(c => (
                            <div key={c.id} className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700 shadow-sm flex flex-col transition-all hover:border-emerald-200">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-sm dark:text-white">{c.title}</h4>
                                    <div className="flex gap-1">
                                        <button className="text-gray-400 hover:text-emerald-600 p-1"><Edit size={14}/></button>
                                        <button className="text-red-300 hover:text-red-600 p-1"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                                <div className="text-[10px] text-gray-400 mb-3 italic font-bold uppercase">Icon Key: {c.iconName}</div>
                                <ul className="space-y-1">
                                    {c.links.map((l, i) => <li key={i} className="text-xs text-emerald-600 dark:text-emerald-400">• {l.text}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <button className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-bold text-xs text-gray-500 hover:text-emerald-600 transition-colors">
                        Add New Info Card
                    </button>
                </div>
            )}
            
            {activeTab === 'settings' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Portal Configuration</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 shadow-sm space-y-6">
                        <div>
                            <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2"><Globe size={18}/> Top Bar Config</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" value={topBarConfig.phone} onChange={e=>onUpdateTopBar({...topBarConfig, phone: e.target.value})} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" placeholder="Support Phone" />
                                <input type="text" value={topBarConfig.email} onChange={e=>onUpdateTopBar({...topBarConfig, email: e.target.value})} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" placeholder="Contact Email" />
                            </div>
                        </div>
                        <div className="pt-6 border-t dark:border-gray-700">
                             <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2"><MapPin size={18}/> Footer Config</h3>
                             <textarea value={footerConfig.address} onChange={e=>onUpdateFooter({...footerConfig, address: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm mb-4 h-24" placeholder="Full Office Address" />
                             <input type="text" value={footerConfig.copyrightText} onChange={e=>onUpdateFooter({...footerConfig, copyrightText: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" placeholder="Copyright text" />
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
