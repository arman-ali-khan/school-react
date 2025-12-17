
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, FileText, Newspaper, Users, Plus, Trash2, ArrowLeft, 
  Menu, Image, Settings, Link, Speaker, Phone, GripVertical, ChevronUp, 
  ChevronDown, Edit, Globe, Calendar, Mail, MapPin, Type, Video, Upload, 
  FileCheck, FileWarning, Eye, Save, RefreshCw, AlertCircle 
} from 'lucide-react';
import { 
  Notice, User, Page, CarouselItem, SidebarSection, InfoCard, MenuItem, 
  SidebarSectionType, TopBarConfig, FooterConfig, HomeWidgetConfig, HomeWidgetType 
} from '../types';

interface AdminDashboardProps {
  user: User;
  notices: Notice[];
  news: string[];
  pages: Page[];
  carouselItems: CarouselItem[];
  sidebarSections: SidebarSection[];
  infoCards: InfoCard[];
  menuItems: MenuItem[];
  topBarConfig: TopBarConfig;
  footerConfig: FooterConfig;
  homeWidgets: HomeWidgetConfig[];
  
  onAddNotice: (notice: Notice) => Promise<any>;
  onAddNews: (newsItem: string) => void;
  onDeleteNotice: (id: string) => void;
  onDeleteNews: (index: number) => void;
  
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
  
  // -- Notices State --
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeType, setNoticeType] = useState<'general' | 'student' | 'college' | 'exam'>('general');
  const [noticeContentMode, setNoticeContentMode] = useState<'text' | 'file'>('text');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeFileUrl, setNoticeFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUUID = () => {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    // Fallback for non-secure contexts
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Cloudinary Config (Unsigned Upload)
  const CLOUDINARY_UPLOAD_PRESET = "school"; 
  const CLOUDINARY_CLOUD_NAME = "dgituybrt";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
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
        setNoticeFileUrl(data.secure_url);
        alert('File uploaded successfully!');
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Cloudinary Upload Failed. Please check your cloud name and preset.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || isPublishing) return;
    
    setIsPublishing(true);
    setPublishError('');

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
      // Reset Form on Success
      setNoticeTitle('');
      setNoticeBody('');
      setNoticeFileUrl('');
      alert('Notice published to Supabase successfully!');
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred';
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        errorMessage = err.message || JSON.stringify(err);
      }
      setPublishError(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };

  // -- News State & Handlers --
  const [newsItem, setNewsItem] = useState('');
  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsItem.trim()) return;
    onAddNews(newsItem);
    setNewsItem('');
    alert('News headline added!');
  };

  // -- Page State & Handlers --
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
    alert('Page saved!');
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
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Logged in as</p>
                <p className="font-bold text-gray-800 dark:text-white truncate">{user.name}</p>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full mt-1 inline-block">{user.role}</span>
            </div>
            <nav className="p-2 space-y-1">
                {[
                    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                    { id: 'notices', icon: FileText, label: 'Notices' },
                    { id: 'news', icon: Newspaper, label: 'News Ticker' },
                    { id: 'pages', icon: FileText, label: 'Pages' },
                    { id: 'menu', icon: Menu, label: 'Header Menu' },
                    { id: 'homepage', icon: Image, label: 'Homepage' },
                    { id: 'sidebar', icon: Settings, label: 'Sidebar Manager' },
                    { id: 'topbar', icon: Phone, label: 'Top Bar' },
                    { id: 'footer', icon: Globe, label: 'Footer' },
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                             <p className="text-gray-500 text-sm">Users</p>
                             <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                                {JSON.parse(localStorage.getItem('users') || '[]').length || 1}
                             </h3>
                        </div>
                    </div>
                </div>
            )}

            {/* Notices Tab */}
            {activeTab === 'notices' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Manage Notices</h2>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-md mb-6 text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                          <Plus size={18} /> Create & Publish New Notice
                        </h3>
                        
                        {publishError && (
                          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-center gap-2 mb-6 border border-red-200 dark:border-red-800">
                            <AlertCircle size={20} />
                            <p className="text-sm font-medium">{publishError}</p>
                          </div>
                        )}

                        <form onSubmit={handleNoticeSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Notice Title</label>
                                    <input 
                                      type="text" 
                                      value={noticeTitle} 
                                      onChange={e=>setNoticeTitle(e.target.value)} 
                                      className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-emerald-500" 
                                      placeholder="e.g. SSC Exam Routine 2024"
                                      required 
                                      disabled={isPublishing}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Notice Category</label>
                                    <select 
                                      value={noticeType} 
                                      onChange={e=>setNoticeType(e.target.value as any)} 
                                      className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                      disabled={isPublishing}
                                    >
                                        <option value="general">General Notice</option>
                                        <option value="student">Student Info</option>
                                        <option value="college">College/Institution Info</option>
                                        <option value="exam">Examination Info</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border dark:border-gray-700">
                              <label className="block text-xs font-bold text-gray-500 mb-3">Notice Content Type</label>
                              <div className="flex gap-4 mb-4">
                                <button 
                                  type="button"
                                  onClick={() => setNoticeContentMode('text')}
                                  disabled={isPublishing}
                                  className={`flex-1 py-3 px-4 rounded-md border-2 flex items-center justify-center gap-2 transition ${noticeContentMode === 'text' ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                                >
                                  <Type size={18} /> Rich Text Body
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => setNoticeContentMode('file')}
                                  disabled={isPublishing}
                                  className={`flex-1 py-3 px-4 rounded-md border-2 flex items-center justify-center gap-2 transition ${noticeContentMode === 'file' ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                                >
                                  <Upload size={18} /> PDF / Image Upload
                                </button>
                              </div>

                              {noticeContentMode === 'text' ? (
                                <div className="space-y-2">
                                  <label className="block text-xs font-bold text-gray-400">Notice Body (HTML Supported)</label>
                                  <textarea 
                                    value={noticeBody}
                                    onChange={e => setNoticeBody(e.target.value)}
                                    className="w-full h-64 p-3 border rounded text-sm font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-emerald-500"
                                    placeholder="Write the notice details here. You can use <p>, <strong>, <ul> tags..."
                                    disabled={isPublishing}
                                  ></textarea>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-4">
                                    <button 
                                      type="button"
                                      onClick={() => fileInputRef.current?.click()}
                                      disabled={isUploading || isPublishing}
                                      className="bg-emerald-600 text-white px-6 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                      {isUploading ? <RefreshCw className="animate-spin" size={18} /> : <Upload size={18} />}
                                      Upload to Cloudinary
                                    </button>
                                    <input 
                                      type="file" 
                                      ref={fileInputRef} 
                                      className="hidden" 
                                      accept=".pdf,image/*"
                                      onChange={handleFileUpload} 
                                    />
                                    {noticeFileUrl && (
                                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                        <FileCheck size={16} /> File Ready
                                      </div>
                                    )}
                                  </div>
                                  <input 
                                    type="text" 
                                    value={noticeFileUrl}
                                    onChange={e => setNoticeFileUrl(e.target.value)}
                                    placeholder="Or paste external file URL here..."
                                    className="w-full p-2.5 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    disabled={isPublishing}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="flex justify-end pt-4">
                                <button 
                                  type="submit" 
                                  disabled={isPublishing || !noticeTitle.trim()}
                                  className="bg-emerald-800 text-white px-10 py-3 rounded-md text-sm font-bold hover:bg-emerald-900 flex items-center gap-2 shadow-lg transition disabled:opacity-50"
                                >
                                  {isPublishing ? (
                                    <>
                                      <RefreshCw size={18} className="animate-spin" /> Publishing to Database...
                                    </>
                                  ) : (
                                    <>
                                      <Save size={18} /> Publish Notice
                                    </>
                                  )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-bold text-gray-700 dark:text-gray-300">Recently Published</h3>
                      <ul className="bg-white dark:bg-gray-800 rounded border dark:border-gray-700 divide-y dark:divide-gray-700 shadow-sm">
                          {notices.map(n => (
                              <li key={n.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                  <div className="flex items-center gap-4">
                                      <div className={`p-2 rounded ${
                                        n.type === 'exam' ? 'bg-red-100 text-red-600' : 
                                        n.type === 'student' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        <FileText size={20} />
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold dark:text-white">{n.title}</p>
                                          <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                            <span>{n.date}</span>
                                            <span className="capitalize">{n.type}</span>
                                            {n.file_url && <span className="text-emerald-600 flex items-center gap-0.5"><Link size={10} /> PDF</span>}
                                            {n.content && <span className="text-blue-600 flex items-center gap-0.5"><Type size={10} /> Body</span>}
                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button className="text-gray-400 hover:text-emerald-600 p-2"><Edit size={16}/></button>
                                    <button onClick={()=>onDeleteNotice(n.id)} className="text-gray-400 hover:text-red-600 p-2"><Trash2 size={16}/></button>
                                  </div>
                              </li>
                          ))}
                      </ul>
                    </div>
                </div>
            )}

            {/* Other tabs remain the same... */}
            {activeTab === 'news' && (
                 <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Manage News Ticker</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleNewsSubmit} className="flex gap-4">
                            <input type="text" value={newsItem} onChange={e=>setNewsItem(e.target.value)} className="flex-1 p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="News headline..." required />
                            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-700 font-bold">Add Headline</button>
                        </form>
                    </div>
                    <ul className="bg-white dark:bg-gray-800 rounded border dark:border-gray-700 divide-y dark:divide-gray-700">
                        {news.map((n, i) => (
                            <li key={i} className="p-3 flex justify-between items-center">
                                <span className="text-sm dark:text-white">{n}</span>
                                <button onClick={()=>onDeleteNews(i)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                            </li>
                        ))}
                    </ul>
                 </div>
            )}
            
            {activeTab === 'pages' && (
              <div className="space-y-6">
                  <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Manage Pages</h2>
                      <button 
                          onClick={() => { setEditingPage(null); setPageForm({ title: '', content: '', slug: '' }); }}
                          className="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                          Reset Form
                      </button>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                      <h3 className="font-bold text-emerald-800 dark:text-emerald-400">{editingPage ? 'Edit Page' : 'Create New Page'}</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Page Title</label>
                              <input type="text" value={pageForm.title} onChange={e=>setPageForm({...pageForm, title: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Slug (URL)</label>
                              <input type="text" value={pageForm.slug} onChange={e=>setPageForm({...pageForm, slug: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., about-us" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Content (HTML)</label>
                          <textarea value={pageForm.content} onChange={e=>setPageForm({...pageForm, content: e.target.value})} rows={6} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                      </div>
                      <button onClick={handlePageSave} className="bg-emerald-600 text-white px-6 py-2 rounded text-sm hover:bg-emerald-700 font-bold">Save Page</button>
                  </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
