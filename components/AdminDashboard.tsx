import React, { useState } from 'react';
import { LayoutDashboard, FileText, Newspaper, Users, Plus, Trash2, ArrowLeft, Menu, Image, Settings, Link, Speaker, Phone, GripVertical, ChevronUp, ChevronDown, Edit, Globe, Calendar, Mail, MapPin, Type, Video } from 'lucide-react';
import { Notice, User, Page, CarouselItem, SidebarSection, InfoCard, MenuItem, SidebarSectionType, TopBarConfig, FooterConfig, HomeWidgetConfig, HomeWidgetType } from '../types';

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
  
  onAddNotice: (notice: Notice) => void;
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

  // -- News State --
  const [newsItem, setNewsItem] = useState('');

  // -- Pages State --
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [pageForm, setPageForm] = useState({ title: '', content: '', slug: '' });

  // -- Carousel State --
  const [slideForm, setSlideForm] = useState({ image: '', caption: '' });

  // -- Sidebar State --
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionForm, setSectionForm] = useState<Partial<SidebarSection>>({
      title: '',
      type: 'list',
      data: {}
  });

  // -- Menu State --
  const [menuLabel, setMenuLabel] = useState('');
  const [menuHref, setMenuHref] = useState('');

  // -- TopBar State --
  const [localTopBarConfig, setLocalTopBarConfig] = useState<TopBarConfig>(topBarConfig);

  // -- Footer State --
  const [localFooterConfig, setLocalFooterConfig] = useState<FooterConfig>(footerConfig);

  // -- Home Widgets State --
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [widgetForm, setWidgetForm] = useState<Partial<HomeWidgetConfig>>({
      title: '',
      type: 'youtube',
      url: ''
  });

  // --- Handlers ---

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;
    onAddNotice({
      id: Date.now().toString(),
      title: noticeTitle,
      date: new Date().toISOString().split('T')[0],
      type: noticeType,
      link: '#'
    });
    setNoticeTitle('');
    alert('Notice published!');
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsItem.trim()) return;
    onAddNews(newsItem);
    setNewsItem('');
    alert('News updated!');
  };

  const handlePageSave = () => {
      if (!pageForm.title || !pageForm.slug) return;
      const newPage: Page = {
          id: editingPage ? editingPage.id : Date.now().toString(),
          title: pageForm.title,
          content: pageForm.content,
          slug: pageForm.slug.toLowerCase().replace(/\s+/g, '-'),
          date: new Date().toISOString()
      };

      let newPages;
      if (editingPage) {
          newPages = pages.map(p => p.id === editingPage.id ? newPage : p);
      } else {
          newPages = [...pages, newPage];
      }
      onUpdatePages(newPages);
      setEditingPage(null);
      setPageForm({ title: '', content: '', slug: '' });
      alert('Page saved!');
  };

  const handlePageDelete = (id: string) => {
      if(confirm('Delete this page?')) {
          onUpdatePages(pages.filter(p => p.id !== id));
      }
  };

  const handleCarouselAdd = () => {
      if(!slideForm.image) return;
      onUpdateCarousel([...carouselItems, { id: Date.now().toString(), ...slideForm }]);
      setSlideForm({ image: '', caption: '' });
  };

  const handleCarouselDelete = (id: string) => {
      onUpdateCarousel(carouselItems.filter(c => c.id !== id));
  };

  // --- Sidebar Handlers ---

  const handleAddSidebarSection = () => {
      setEditingSectionId(null);
      setSectionForm({
          id: Date.now().toString(),
          title: 'New Section',
          type: 'list',
          data: { links: [] }
      });
  };

  const handleEditSidebarSection = (section: SidebarSection) => {
      setEditingSectionId(section.id);
      setSectionForm({ ...section }); 
  };

  const handleDeleteSidebarSection = (id: string) => {
      if(confirm('Are you sure you want to delete this sidebar section?')) {
          onUpdateSidebar(sidebarSections.filter(s => s.id !== id));
          if (editingSectionId === id) setEditingSectionId(null);
      }
  };

  const handleMoveSidebarSection = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === sidebarSections.length - 1) return;

      const newSections = [...sidebarSections];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      onUpdateSidebar(newSections);
  };

  const handleSaveSidebarSection = () => {
      if (!sectionForm.title) return;

      const newSection = {
          id: editingSectionId || Date.now().toString(),
          title: sectionForm.title,
          type: sectionForm.type as SidebarSectionType,
          data: sectionForm.data || {}
      };

      let newSections;
      if (editingSectionId) {
          newSections = sidebarSections.map(s => s.id === editingSectionId ? newSection : s);
      } else {
          newSections = [...sidebarSections, newSection];
      }

      onUpdateSidebar(newSections);
      setEditingSectionId(null);
      alert('Sidebar section saved!');
  };

  const handleSidebarDataChange = (field: string, value: any) => {
      setSectionForm(prev => ({
          ...prev,
          data: { ...prev.data, [field]: value }
      }));
  };

  const handleMenuAdd = () => {
      if (!menuLabel || !menuHref) return;
      const newItem: MenuItem = {
          id: Date.now().toString(),
          label: menuLabel,
          href: menuHref
      };
      onUpdateMenu([...menuItems, newItem]);
      setMenuLabel('');
      setMenuHref('');
  };

  const handleMenuDelete = (id: string) => {
      onUpdateMenu(menuItems.filter(m => m.id !== id));
  };

  // --- TopBar & Footer Handlers ---

  const handleSaveTopBar = () => {
      onUpdateTopBar(localTopBarConfig);
      alert('Top Bar configuration saved!');
  };

  const handleSaveFooter = () => {
      onUpdateFooter(localFooterConfig);
      alert('Footer configuration saved!');
  };

  // --- Home Widget Handlers ---

  const handleAddHomeWidget = () => {
      setEditingWidgetId(null);
      setWidgetForm({
          title: 'New Section',
          type: 'youtube',
          url: ''
      });
  };

  const handleEditHomeWidget = (widget: HomeWidgetConfig) => {
      setEditingWidgetId(widget.id);
      setWidgetForm({ ...widget });
  };

  const handleDeleteHomeWidget = (id: string) => {
      if(confirm('Are you sure you want to delete this home section?')) {
          onUpdateHomeWidgets(homeWidgets.filter(w => w.id !== id));
          if (editingWidgetId === id) setEditingWidgetId(null);
      }
  };

  const handleMoveHomeWidget = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === homeWidgets.length - 1) return;

      const newWidgets = [...homeWidgets];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]];
      onUpdateHomeWidgets(newWidgets);
  };

  const handleSaveHomeWidget = () => {
      if (!widgetForm.title) return;

      const newWidget = {
          id: editingWidgetId || Date.now().toString(),
          title: widgetForm.title!,
          type: widgetForm.type as HomeWidgetType,
          url: widgetForm.url || ''
      };

      let newWidgets;
      if (editingWidgetId) {
          newWidgets = homeWidgets.map(w => w.id === editingWidgetId ? newWidget : w);
      } else {
          newWidgets = [...homeWidgets, newWidget];
      }

      onUpdateHomeWidgets(newWidgets);
      setEditingWidgetId(null);
      alert('Home section saved!');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-10">
      {/* Admin Header */}
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
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Manage Notices</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-md mb-4 text-emerald-800 dark:text-emerald-400">Publish New Notice</h3>
                        <form onSubmit={handleNoticeSubmit} className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                                <input type="text" value={noticeTitle} onChange={e=>setNoticeTitle(e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                            </div>
                            <div className="w-32">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                                <select value={noticeType} onChange={e=>setNoticeType(e.target.value as any)} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="general">General</option>
                                    <option value="student">Student</option>
                                    <option value="college">College</option>
                                    <option value="exam">Exam</option>
                                </select>
                            </div>
                            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-700">Publish</button>
                        </form>
                    </div>
                    <ul className="bg-white dark:bg-gray-800 rounded border dark:border-gray-700 divide-y dark:divide-gray-700">
                        {notices.map(n => (
                            <li key={n.id} className="p-3 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium dark:text-white">{n.title}</p>
                                    <span className="text-xs text-gray-500">{n.date} - {n.type}</span>
                                </div>
                                <button onClick={()=>onDeleteNotice(n.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* News Tab */}
            {activeTab === 'news' && (
                 <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Manage News Ticker</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleNewsSubmit} className="flex gap-4">
                            <input type="text" value={newsItem} onChange={e=>setNewsItem(e.target.value)} className="flex-1 p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="News headline..." required />
                            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-700">Add</button>
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

            {/* Pages Tab */}
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

                    <div className="bg-white dark:bg-gray-800 rounded border dark:border-gray-700 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Slug</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {pages.map(p => (
                                    <tr key={p.id}>
                                        <td className="px-6 py-4 text-sm font-medium dark:text-white">{p.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{p.slug}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={()=>{ setEditingPage(p); setPageForm({ title: p.title, content: p.content, slug: p.slug }); }} className="text-blue-600 text-xs hover:underline">Edit</button>
                                            <button onClick={()=>handlePageDelete(p.id)} className="text-red-600 text-xs hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Menu Tab */}
            {activeTab === 'menu' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Header Menu</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                         <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Label</label>
                                <input type="text" value={menuLabel} onChange={e=>setMenuLabel(e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Link (use 'page:slug' for internal)</label>
                                <input type="text" value={menuHref} onChange={e=>setMenuHref(e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <button onClick={handleMenuAdd} className="bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-700">Add Item</button>
                         </div>
                    </div>
                    <ul className="bg-white dark:bg-gray-800 rounded border dark:border-gray-700 divide-y dark:divide-gray-700">
                        {menuItems.map(item => (
                            <li key={item.id} className="p-3 flex justify-between items-center">
                                <div>
                                    <span className="font-bold text-sm mr-2 dark:text-white">{item.label}</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{item.href}</span>
                                </div>
                                <button onClick={()=>handleMenuDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Homepage Tab */}
            {activeTab === 'homepage' && (
                <div className="space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Hero Slider</h2>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Image URL</label>
                                    <input type="text" value={slideForm.image} onChange={e=>setSlideForm({...slideForm, image: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Caption</label>
                                    <input type="text" value={slideForm.caption} onChange={e=>setSlideForm({...slideForm, caption: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <button onClick={handleCarouselAdd} className="bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-700">Add Slide</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {carouselItems.map(item => (
                                <div key={item.id} className="relative group rounded overflow-hidden border dark:border-gray-700">
                                    <img src={item.image} alt="slide" className="w-full h-32 object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <button onClick={()=>handleCarouselDelete(item.id)} className="text-red-400 bg-white p-2 rounded-full"><Trash2 size={16}/></button>
                                    </div>
                                    <p className="text-xs p-2 bg-white dark:bg-gray-800 truncate">{item.caption}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Widget Management */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold text-gray-800 dark:text-white">Homepage Sections</h2>
                             <button onClick={handleAddHomeWidget} className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-700 flex items-center gap-2">
                                 <Plus size={16} /> Add Section
                             </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Widget List */}
                            <div className="lg:col-span-1 space-y-3">
                                 {homeWidgets.map((widget, index) => (
                                     <div 
                                         key={widget.id} 
                                         className={`p-3 bg-white dark:bg-gray-800 rounded-lg border cursor-pointer transition flex items-center justify-between ${editingWidgetId === widget.id ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'}`}
                                         onClick={() => handleEditHomeWidget(widget)}
                                     >
                                         <div className="flex items-center gap-3">
                                             <div className="text-gray-400">
                                                 <GripVertical size={16} />
                                             </div>
                                             <div>
                                                 <h4 className="font-bold text-sm text-gray-800 dark:text-white truncate max-w-[150px]">{widget.title}</h4>
                                                 <p className="text-xs text-gray-500 uppercase">{widget.type}</p>
                                             </div>
                                         </div>
                                         <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                             <button onClick={() => handleMoveHomeWidget(index, 'up')} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><ChevronUp size={14}/></button>
                                             <button onClick={() => handleMoveHomeWidget(index, 'down')} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><ChevronDown size={14}/></button>
                                             <button onClick={() => handleDeleteHomeWidget(widget.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                                         </div>
                                     </div>
                                 ))}
                            </div>

                            {/* Widget Editor Form */}
                            <div className="lg:col-span-2">
                                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                    {editingWidgetId || widgetForm.title ? (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center border-b pb-2 mb-4">
                                                <h3 className="font-bold text-lg text-emerald-800 dark:text-emerald-400">
                                                    {editingWidgetId ? 'Edit Section' : 'New Section'}
                                                </h3>
                                                {!editingWidgetId && <button onClick={() => setWidgetForm({title: '', type: 'youtube', url: ''})} className="text-xs text-red-500">Cancel</button>}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                                                <input type="text" value={widgetForm.title} onChange={e=>setWidgetForm({...widgetForm, title: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                                                <select value={widgetForm.type} onChange={e=>setWidgetForm({...widgetForm, type: e.target.value as HomeWidgetType})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    <option value="youtube">YouTube Embed</option>
                                                    <option value="video">HTML5 Video</option>
                                                    <option value="image">Image</option>
                                                    <option value="map">Map</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">URL / Source</label>
                                                <input type="text" value={widgetForm.url} onChange={e=>setWidgetForm({...widgetForm, url: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                                <p className="text-[10px] text-gray-400 mt-1">For YouTube, you can paste the full video URL.</p>
                                            </div>

                                            <div className="pt-4 flex justify-end">
                                                <button onClick={handleSaveHomeWidget} className="bg-emerald-600 text-white px-6 py-2 rounded text-sm font-bold hover:bg-emerald-700">Save Section</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                                            <Settings size={48} className="mb-4 opacity-20" />
                                            <p>Select a section to edit or create a new one.</p>
                                        </div>
                                    )}
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar Tab */}
            {activeTab === 'sidebar' && (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                         <h2 className="text-xl font-bold text-gray-800 dark:text-white">Sidebar Manager</h2>
                         <button onClick={handleAddSidebarSection} className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-700 flex items-center gap-2">
                             <Plus size={16} /> Add Section
                         </button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Section List (Left) */}
                        <div className="lg:col-span-1 space-y-3">
                             {sidebarSections.map((section, index) => (
                                 <div 
                                     key={section.id} 
                                     className={`p-3 bg-white dark:bg-gray-800 rounded-lg border cursor-pointer transition flex items-center justify-between ${editingSectionId === section.id ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'}`}
                                     onClick={() => handleEditSidebarSection(section)}
                                 >
                                     <div className="flex items-center gap-3">
                                         <div className="text-gray-400">
                                             <GripVertical size={16} />
                                         </div>
                                         <div>
                                             <h4 className="font-bold text-sm text-gray-800 dark:text-white">{section.title}</h4>
                                             <p className="text-xs text-gray-500 uppercase">{section.type.replace('_', ' ')}</p>
                                         </div>
                                     </div>
                                     <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                         <button onClick={() => handleMoveSidebarSection(index, 'up')} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><ChevronUp size={14}/></button>
                                         <button onClick={() => handleMoveSidebarSection(index, 'down')} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><ChevronDown size={14}/></button>
                                         <button onClick={() => handleDeleteSidebarSection(section.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                                     </div>
                                 </div>
                             ))}
                        </div>

                        {/* Editor Form (Right) */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                {editingSectionId || sectionForm.title ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                                            <h3 className="font-bold text-lg text-emerald-800 dark:text-emerald-400">
                                                {editingSectionId ? 'Edit Section' : 'New Section'}
                                            </h3>
                                            {!editingSectionId && <button onClick={() => setSectionForm({title: '', type: 'list', data: {}})} className="text-xs text-red-500">Cancel</button>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">Section Title</label>
                                                <input 
                                                    type="text" 
                                                    value={sectionForm.title} 
                                                    onChange={e => setSectionForm({...sectionForm, title: e.target.value})} 
                                                    className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                                                <select 
                                                    value={sectionForm.type} 
                                                    onChange={e => setSectionForm({...sectionForm, type: e.target.value as SidebarSectionType, data: {}})} 
                                                    className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    disabled={!!editingSectionId} // Prevent changing type after creation for simplicity, or reset data if changed
                                                >
                                                    <option value="message">Chairman Message</option>
                                                    <option value="image_card">Image Card</option>
                                                    <option value="audio">Audio Player</option>
                                                    <option value="list">Link List</option>
                                                    <option value="hotlines">Hotlines Grid</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Dynamic Data Fields */}
                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                            
                                            {sectionForm.type === 'message' && (
                                                <div className="space-y-3">
                                                    <div><label className="text-xs font-bold text-gray-500">Name</label><input type="text" value={sectionForm.data?.name || ''} onChange={e => handleSidebarDataChange('name', e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                                                    <div><label className="text-xs font-bold text-gray-500">Designation</label><input type="text" value={sectionForm.data?.designation || ''} onChange={e => handleSidebarDataChange('designation', e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                                                    <div><label className="text-xs font-bold text-gray-500">Image URL</label><input type="text" value={sectionForm.data?.image || ''} onChange={e => handleSidebarDataChange('image', e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                                                    <div><label className="text-xs font-bold text-gray-500">Quote</label><textarea value={sectionForm.data?.quote || ''} onChange={e => handleSidebarDataChange('quote', e.target.value)} rows={3} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                                                </div>
                                            )}

                                            {sectionForm.type === 'image_card' && (
                                                <div className="space-y-3">
                                                     <div><label className="text-xs font-bold text-gray-500">Name/Caption</label><input type="text" value={sectionForm.data?.name || ''} onChange={e => handleSidebarDataChange('name', e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                                                     <div><label className="text-xs font-bold text-gray-500">Image URL</label><input type="text" value={sectionForm.data?.image || ''} onChange={e => handleSidebarDataChange('image', e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                                                </div>
                                            )}

                                            {sectionForm.type === 'audio' && (
                                                <div className="space-y-3">
                                                    <div><label className="text-xs font-bold text-gray-500">Audio URL</label><input type="text" value={sectionForm.data?.audioUrl || ''} onChange={e => handleSidebarDataChange('audioUrl', e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                                                </div>
                                            )}

                                            {sectionForm.type === 'list' && (
                                                <div className="space-y-3">
                                                    <label className="text-xs font-bold text-gray-500 block">Links</label>
                                                    <div className="space-y-2">
                                                        {(sectionForm.data?.links || []).map((link: any, idx: number) => (
                                                            <div key={idx} className="flex gap-2 items-center">
                                                                <input type="text" value={link.label} onChange={e => {
                                                                    const newLinks = [...(sectionForm.data?.links || [])];
                                                                    newLinks[idx].label = e.target.value;
                                                                    handleSidebarDataChange('links', newLinks);
                                                                }} placeholder="Label" className="flex-1 p-2 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                                                <input type="text" value={link.href} onChange={e => {
                                                                    const newLinks = [...(sectionForm.data?.links || [])];
                                                                    newLinks[idx].href = e.target.value;
                                                                    handleSidebarDataChange('links', newLinks);
                                                                }} placeholder="URL" className="flex-1 p-2 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                                                <button onClick={() => {
                                                                    const newLinks = (sectionForm.data?.links || []).filter((_:any, i:number) => i !== idx);
                                                                    handleSidebarDataChange('links', newLinks);
                                                                }} className="text-red-500 p-1"><Trash2 size={14}/></button>
                                                            </div>
                                                        ))}
                                                        <button 
                                                            onClick={() => handleSidebarDataChange('links', [...(sectionForm.data?.links || []), { label: '', href: '' }])}
                                                            className="text-xs text-emerald-600 font-bold flex items-center gap-1"
                                                        >
                                                            <Plus size={12}/> Add Link
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {sectionForm.type === 'hotlines' && (
                                                <div className="space-y-3">
                                                    <label className="text-xs font-bold text-gray-500 block">Hotlines</label>
                                                    <div className="space-y-2">
                                                        {(sectionForm.data?.hotlines || []).map((line: any, idx: number) => (
                                                            <div key={idx} className="flex gap-2 items-center">
                                                                <input type="text" value={line.title} onChange={e => {
                                                                    const newLines = [...(sectionForm.data?.hotlines || [])];
                                                                    newLines[idx].title = e.target.value;
                                                                    handleSidebarDataChange('hotlines', newLines);
                                                                }} placeholder="Title" className="flex-1 p-2 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                                                <input type="text" value={line.number} onChange={e => {
                                                                    const newLines = [...(sectionForm.data?.hotlines || [])];
                                                                    newLines[idx].number = e.target.value;
                                                                    handleSidebarDataChange('hotlines', newLines);
                                                                }} placeholder="Number" className="w-24 p-2 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                                                <button onClick={() => {
                                                                    const newLines = (sectionForm.data?.hotlines || []).filter((_:any, i:number) => i !== idx);
                                                                    handleSidebarDataChange('hotlines', newLines);
                                                                }} className="text-red-500 p-1"><Trash2 size={14}/></button>
                                                            </div>
                                                        ))}
                                                        <button 
                                                            onClick={() => handleSidebarDataChange('hotlines', [...(sectionForm.data?.hotlines || []), { title: '', number: '' }])}
                                                            className="text-xs text-emerald-600 font-bold flex items-center gap-1"
                                                        >
                                                            <Plus size={12}/> Add Hotline
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                            <button onClick={handleSaveSidebarSection} className="bg-emerald-600 text-white px-6 py-2 rounded text-sm font-bold hover:bg-emerald-700">
                                                Save Section
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                                        <Settings size={48} className="mb-4 opacity-20" />
                                        <p>Select a section to edit or create a new one.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                 </div>
            )}

            {/* Top Bar Tab */}
            {activeTab === 'topbar' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                         <h2 className="text-xl font-bold text-gray-800 dark:text-white">Top Bar Configuration</h2>
                         <button onClick={handleSaveTopBar} className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-700">Save Changes</button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Phone size={12} /> Phone Number</label>
                                <input type="text" value={localTopBarConfig.phone} onChange={e => setLocalTopBarConfig({...localTopBarConfig, phone: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Mail size={12} /> Email Address</label>
                                <input type="text" value={localTopBarConfig.email} onChange={e => setLocalTopBarConfig({...localTopBarConfig, email: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={localTopBarConfig.showDateTime} 
                                        onChange={e => setLocalTopBarConfig({...localTopBarConfig, showDateTime: e.target.checked})} 
                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"><Calendar size={14}/> Show Date & Time</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && (
                <div className="space-y-6">
                     <div className="flex justify-between items-center">
                         <h2 className="text-xl font-bold text-gray-800 dark:text-white">Footer Configuration</h2>
                         <button onClick={handleSaveFooter} className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-700">Save Changes</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                            <h3 className="font-bold text-emerald-800 dark:text-emerald-400 border-b pb-2">Contact Details</h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><MapPin size={12}/> Address (Use \n for new lines)</label>
                                <textarea rows={3} value={localFooterConfig.address} onChange={e => setLocalFooterConfig({...localFooterConfig, address: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Phone size={12}/> Phone</label>
                                <input type="text" value={localFooterConfig.phone} onChange={e => setLocalFooterConfig({...localFooterConfig, phone: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Mail size={12}/> Email</label>
                                <input type="text" value={localFooterConfig.email} onChange={e => setLocalFooterConfig({...localFooterConfig, email: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Type size={12}/> Copyright Text</label>
                                <input type="text" value={localFooterConfig.copyrightText} onChange={e => setLocalFooterConfig({...localFooterConfig, copyrightText: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                            <h3 className="font-bold text-emerald-800 dark:text-emerald-400 border-b pb-2">Important Links</h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Section Title</label>
                                <input type="text" value={localFooterConfig.govtLinksTitle} onChange={e => setLocalFooterConfig({...localFooterConfig, govtLinksTitle: e.target.value})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                {localFooterConfig.govtLinks.map((link, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input type="text" value={link.label} onChange={e => {
                                            const newLinks = [...localFooterConfig.govtLinks];
                                            newLinks[idx].label = e.target.value;
                                            setLocalFooterConfig({...localFooterConfig, govtLinks: newLinks});
                                        }} className="flex-1 p-2 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Label"/>
                                        <input type="text" value={link.href} onChange={e => {
                                            const newLinks = [...localFooterConfig.govtLinks];
                                            newLinks[idx].href = e.target.value;
                                            setLocalFooterConfig({...localFooterConfig, govtLinks: newLinks});
                                        }} className="flex-1 p-2 border rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="URL"/>
                                        <button onClick={() => {
                                            const newLinks = localFooterConfig.govtLinks.filter((_, i) => i !== idx);
                                            setLocalFooterConfig({...localFooterConfig, govtLinks: newLinks});
                                        }} className="text-red-500 p-1"><Trash2 size={14}/></button>
                                    </div>
                                ))}
                                <button onClick={() => setLocalFooterConfig({...localFooterConfig, govtLinks: [...localFooterConfig.govtLinks, {label: '', href: ''}]})} className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-2">
                                    <Plus size={12}/> Add Link
                                </button>
                            </div>
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