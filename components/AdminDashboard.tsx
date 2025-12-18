
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, FileText, Newspaper, Users, Plus, Trash2, ArrowLeft, 
  Menu, Image, Settings, Link, Speaker, Phone, GripVertical, ChevronUp, 
  ChevronDown, Edit, Globe, Calendar, Mail, MapPin, Type, Video, Upload, 
  FileCheck, FileWarning, Eye, Save, RefreshCw, AlertCircle 
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
  
  // CMS Actions
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
  const [activeTab, setActiveTab] = useState<'overview' | 'notices' | 'news' | 'pages' | 'homepage' | 'sidebar' | 'menu' | 'topbar' | 'footer'>('overview');
  
  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeType, setNoticeType] = useState<'general' | 'student' | 'college' | 'exam'>('general');
  const [noticeContentMode, setNoticeContentMode] = useState<'text' | 'file'>('text');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeFileUrl, setNoticeFileUrl] = useState('');

  // News Form State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsThumbnailUrl, setNewsThumbnailUrl] = useState('');
  const [isNewsUploading, setIsNewsUploading] = useState(false);
  const [isNewsPublishing, setIsNewsPublishing] = useState(false);
  const [newsPublishError, setNewsPublishError] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newsThumbnailInputRef = useRef<HTMLInputElement>(null);

  const generateUUID = () => {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const CLOUDINARY_UPLOAD_PRESET = "school"; 
  const CLOUDINARY_CLOUD_NAME = "dgituybrt";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'notice' | 'news') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === 'news') setIsNewsUploading(true); else setIsUploading(true);
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
        if (target === 'news') setNewsThumbnailUrl(data.secure_url); else setNoticeFileUrl(data.secure_url);
        alert('File uploaded successfully!');
      } else throw new Error(data.error?.message || 'Upload failed');
    } catch (err) {
      console.error(err);
      alert('Cloudinary Upload Failed.');
    } finally {
      if (target === 'news') setIsNewsUploading(false); else setIsUploading(false);
    }
  };

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || isPublishing) return;
    setIsPublishing(true); setPublishError('');
    const newNotice: Notice = {
      id: generateUUID(),
      title: noticeTitle,
      date: new Date().toISOString().split('T')[0],
      type: noticeType,
      link: '#',
      content: noticeContentMode === 'text' ? noticeBody : undefined,
      file_url: noticeContentMode === 'file' ? noticeFileUrl : undefined,
    };
    try {
      await onAddNotice(newNotice);
      setNoticeTitle(''); setNoticeBody(''); setNoticeFileUrl('');
      alert('Notice published!');
    } catch (err: any) { setPublishError(err.message || String(err)); } finally { setIsPublishing(false); }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || isNewsPublishing) return;
    setIsNewsPublishing(true); setNewsPublishError('');
    const newNews: NewsItem = {
      id: generateUUID(),
      title: newsTitle,
      content: newsContent,
      thumbnail_url: newsThumbnailUrl,
      date: new Date().toISOString().split('T')[0]
    };
    try {
      await onAddNews(newNews);
      setNewsTitle(''); setNewsContent(''); setNewsThumbnailUrl('');
      alert('News published successfully!');
    } catch (err: any) { setNewsPublishError(err.message || String(err)); } finally { setIsNewsPublishing(false); }
  };

  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [pageForm, setPageForm] = useState({ title: '', content: '', slug: '' });

  const handlePageSave = () => {
    if (!pageForm.title || !pageForm.slug) return;
    const newPage: Page = {
        id: generateUUID(),
        title: pageForm.title,
        content: pageForm.content,
        slug: pageForm.slug.toLowerCase().replace(/\s+/g, '-'),
        date: new Date().toISOString()
    };
    let newPages = editingPage ? pages.map(p => p.id === editingPage.id ? newPage : p) : [...pages, newPage];
    onUpdatePages(newPages);
    setEditingPage(null);
    setPageForm({ title: '', content: '', slug: '' });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-10">
      <div className="bg-emerald-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
                <LayoutDashboard size={24} />
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <button onClick={onBack} className="text-sm bg-emerald-800 hover:bg-emerald-700 px-3 py-1 rounded flex items-center gap-1">
                <ArrowLeft size={14} /> Back to Site
            </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-fit shrink-0">
            <nav className="p-2 space-y-1">
                {[
                    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                    { id: 'notices', icon: FileText, label: 'Notices' },
                    { id: 'news', icon: Newspaper, label: 'News Ticker' },
                    { id: 'pages', icon: FileText, label: 'Pages' },
                    { id: 'menu', icon: Menu, label: 'Header Menu' },
                    { id: 'homepage', icon: Image, label: 'Homepage' },
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

        {/* Content Area */}
        <div className="flex-1 min-w-0">
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500 text-sm">Notices</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{notices.length}</h3>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500 text-sm">News Items</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{news.length}</h3>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500 text-sm">Pages</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{pages.length}</h3>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'notices' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Manage Notices</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
                        <h3 className="font-bold mb-4 text-emerald-800 dark:text-emerald-400">Publish New Notice</h3>
                        <form onSubmit={handleNoticeSubmit} className="space-y-4">
                            <input type="text" value={noticeTitle} onChange={e=>setNoticeTitle(e.target.value)} className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:text-white" placeholder="Notice Title" required />
                            <select value={noticeType} onChange={e=>setNoticeType(e.target.value as any)} className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:text-white">
                                <option value="general">General</option>
                                <option value="student">Student</option>
                                <option value="exam">Exam</option>
                            </select>
                            <textarea value={noticeBody} onChange={e=>setNoticeBody(e.target.value)} className="w-full h-32 p-2.5 border rounded text-sm dark:bg-gray-700 dark:text-white" placeholder="Content (HTML support)" />
                            <button type="submit" disabled={isPublishing} className="bg-emerald-700 text-white px-6 py-2 rounded font-bold hover:bg-emerald-800 disabled:opacity-50">
                                {isPublishing ? 'Publishing...' : 'Publish Notice'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'news' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Manage News Ticker</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold mb-4 text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                          <Plus size={18} /> Create New News Item
                        </h3>
                        
                        {newsPublishError && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{newsPublishError}</div>}

                        <form onSubmit={handleNewsSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">News Title</label>
                                <input 
                                  type="text" 
                                  value={newsTitle} 
                                  onChange={e=>setNewsTitle(e.target.value)} 
                                  className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:text-white" 
                                  placeholder="Headline for ticker"
                                  required 
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Thumbnail Image</label>
                                    <div className="flex items-center gap-2">
                                        <button 
                                          type="button" 
                                          onClick={()=>newsThumbnailInputRef.current?.click()}
                                          className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300"
                                          disabled={isNewsUploading}
                                        >
                                          {isNewsUploading ? <RefreshCw className="animate-spin" size={14} /> : <Upload size={14} />}
                                        </button>
                                        <input 
                                          type="file" 
                                          ref={newsThumbnailInputRef} 
                                          className="hidden" 
                                          onChange={e=>handleFileUpload(e, 'news')} 
                                          accept="image/*"
                                        />
                                        {newsThumbnailUrl && <img src={newsThumbnailUrl} className="w-10 h-10 object-cover rounded border" alt="Thumbnail" />}
                                    </div>
                                    <input 
                                      type="text" 
                                      value={newsThumbnailUrl} 
                                      onChange={e=>setNewsThumbnailUrl(e.target.value)} 
                                      className="w-full mt-2 p-2 border rounded text-xs dark:bg-gray-700 dark:text-white" 
                                      placeholder="Or paste image URL"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">News Content (Rich Text / HTML)</label>
                                <div className="border rounded dark:border-gray-600">
                                    <div className="bg-gray-50 dark:bg-gray-700 p-2 border-b flex gap-2">
                                        <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Bold"><strong>B</strong></button>
                                        <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Italic"><em>I</em></button>
                                        <button type="button" className="p-1 hover:bg-gray-200 rounded" title="List"><Users size={14}/></button>
                                    </div>
                                    <textarea 
                                      value={newsContent} 
                                      onChange={e=>setNewsContent(e.target.value)} 
                                      className="w-full h-48 p-3 text-sm dark:bg-gray-700 dark:text-white focus:outline-none" 
                                      placeholder="Write the full news story here..."
                                      required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button 
                                  type="submit" 
                                  disabled={isNewsPublishing || !newsTitle.trim()}
                                  className="bg-emerald-800 text-white px-8 py-2.5 rounded font-bold hover:bg-emerald-900 flex items-center gap-2 disabled:opacity-50"
                                >
                                  {isNewsPublishing ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                                  Publish News
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
                        <ul className="divide-y dark:divide-gray-700">
                            {news.map(n => (
                                <li key={n.id} className="p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        {n.thumbnail_url ? <img src={n.thumbnail_url} className="w-12 h-12 object-cover rounded" /> : <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded"><Newspaper size={20}/></div>}
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">{n.title}</p>
                                            <p className="text-xs text-gray-500">{n.date}</p>
                                        </div>
                                    </div>
                                    <button onClick={()=>onDeleteNews(n.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18}/></button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
