
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, FileText, Newspaper, Users, Plus, Trash2, ArrowLeft, 
  Menu, Image, Settings, Link, Speaker, Phone, GripVertical, ChevronUp, 
  ChevronDown, Edit, Globe, Calendar, Mail, MapPin, Type, Video, Upload, 
  FileCheck, FileWarning, Eye, Save, RefreshCw, AlertCircle, Headphones, X,
  Bold, Italic, List, ListOrdered, Link as LinkIcon, Code, Heading1, Heading2, Timer, Clock,
  Book, BookOpen, GraduationCap, School, Library, Pencil, Pen, Eraser, 
  Ruler, Calculator, FlaskConical, Atom, Languages, Music, Palette, 
  Microscope, Dna, Binary, Cpu, Laptop, Tablets, Award, Medal, 
  Trophy, Star, User, UserCheck, History, Landmark, Navigation, 
  Compass, CheckCircle, Info, HelpCircle, File, Search,
  Map as MapIcon, Archive, Play
} from 'lucide-react';
import { 
  Notice, User as UserType, Page, CarouselItem, SidebarSection, InfoCard, MenuItem, 
  SidebarSectionType, TopBarConfig, FooterConfig, HomeWidgetConfig, HomeWidgetType, NewsItem 
} from '../types';

interface AdminDashboardProps {
  user: UserType;
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
  onAddPage: (page: Page) => Promise<any>;
  onUpdatePage: (page: Page) => Promise<any>;
  onDeletePage: (id: string) => void;
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

const EDUCATION_ICONS = [
  "GraduationCap", "Book", "BookOpen", "School", "Library", "Pencil", "Pen", "Eraser", "Ruler", "Calculator",
  "FlaskConical", "Atom", "Globe", "Languages", "Music", "Palette", "Microscope", "Dna", "Binary", "Code",
  "Cpu", "Laptop", "Tablets", "Award", "Medal", "Trophy", "Star", "Users", "User", "UserCheck",
  "History", "Landmark", "MapIcon", "Navigation", "Compass", "Clock", "Calendar", "CheckCircle", "AlertCircle", "Info",
  "HelpCircle", "Mail", "Phone", "Archive", "FileText", "File", "Video", "Play", "Headphones", "Speaker"
];

const IconMapper: Record<string, React.FC<any>> = {
  GraduationCap, Book, BookOpen, School, Library, Pencil, Pen, Eraser, Ruler, Calculator,
  FlaskConical, Atom, Globe, Languages, Music, Palette, Microscope, Dna, Binary, Code,
  Cpu, Laptop, Tablets, Award, Medal, Trophy, Star, Users, User, UserCheck,
  History, Landmark, MapIcon, Navigation, Compass, Clock, Calendar, CheckCircle, AlertCircle, Info,
  HelpCircle, Mail, Phone, Archive, FileText, File, Video, Play, Headphones, Speaker, Search
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, notices, news, pages, carouselItems, sidebarSections, infoCards, menuItems, topBarConfig, footerConfig, homeWidgets,
  onAddNotice, onAddNews, onAddPage, onUpdatePage, onDeletePage, onDeleteNotice, onDeleteNews,
  onUpdatePages, onUpdateCarousel, onUpdateSidebar, onUpdateInfoCards, onUpdateMenu, onUpdateTopBar, onUpdateFooter, onUpdateHomeWidgets,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notices' | 'news' | 'pages' | 'homepage' | 'sidebar' | 'infocards' | 'menu' | 'settings'>('overview');
  
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingSidebar, setIsSavingSidebar] = useState(false);
  
  // Forms
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeType, setNoticeType] = useState<'general' | 'student' | 'college' | 'exam'>('general');
  const [noticeBody, setNoticeBody] = useState('');

  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsThumbnailUrl, setNewsThumbnailUrl] = useState('');
  const [isNewsUploading, setIsNewsUploading] = useState(false);
  const [isNewsPublishing, setIsNewsPublishing] = useState(false);

  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [pageForm, setPageForm] = useState({ title: '', content: '', slug: '' });
  const [isPageSaving, setIsPageSaving] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [editingWidget, setEditingWidget] = useState<SidebarSection | null>(null);
  const [widgetForm, setWidgetForm] = useState<{
    type: SidebarSectionType;
    title: string;
    data: any;
  }>({
    type: 'list',
    title: '',
    data: {}
  });

  const generateUUID = () => Math.random().toString(36).substring(2, 9);
  
  const CLOUDINARY_UPLOAD_PRESET = "school"; 
  const CLOUDINARY_CLOUD_NAME = "dgituybrt";
  const newsThumbnailInputRef = useRef<HTMLInputElement>(null);
  const widgetMediaInputRef = useRef<HTMLInputElement>(null);

  const handleCloudinaryUpload = async (file: File, resourceType: 'image' | 'video' | 'auto' = 'auto') => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) return data.secure_url;
      throw new Error(data.error?.message || 'Upload failed');
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please check file type and size.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

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
      thumbnail_url: newsThumbnailUrl,
      date: new Date().toISOString().split('T')[0]
    };
    try {
      await onAddNews(newNews);
      setNewsTitle(''); setNewsContent(''); setNewsThumbnailUrl('');
      alert('News published successfully!');
    } catch (err) { alert('Error publishing news'); } finally { setIsNewsPublishing(false); }
  };

  const handlePageSave = async () => {
    if (!pageForm.title.trim() || isPageSaving) return;
    setIsPageSaving(true);
    const slug = pageForm.slug.trim() || pageForm.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const pageData: Page = {
        id: editingPage?.id || generateUUID(),
        title: pageForm.title,
        content: pageForm.content,
        slug: slug,
        date: new Date().toISOString()
    };
    try {
        if (editingPage) await onUpdatePage(pageData); else await onAddPage(pageData);
        setEditingPage(null); setPageForm({ title: '', content: '', slug: '' });
        alert("Page saved!");
    } catch (err) { alert("Failed to save page"); } finally { setIsPageSaving(false); }
  };

  const handleWidgetSave = async () => {
    if (!widgetForm.title && !['image_only', 'datetime'].includes(widgetForm.type)) {
        alert("Title is required");
        return;
    }
    
    setIsSavingSidebar(true);
    try {
        const newWidget: SidebarSection = {
            id: editingWidget?.id || generateUUID(),
            title: widgetForm.title,
            type: widgetForm.type,
            data: widgetForm.data
        };
        const newSections = editingWidget 
            ? sidebarSections.map(s => s.id === editingWidget.id ? newWidget : s) 
            : [...sidebarSections, newWidget];
        
        await onUpdateSidebar(newSections);
        setEditingWidget(null);
        setWidgetForm({ type: 'list', title: '', data: {} });
        alert("Sidebar updated successfully!");
    } catch (err) {
        alert("Failed to update sidebar widgets.");
    } finally {
        setIsSavingSidebar(false);
    }
  };

  const handleDeleteWidget = async (id: string, title: string) => {
    if (!window.confirm(`Permanently delete this sidebar widget: "${title}"?`)) return;
    
    setIsSavingSidebar(true);
    try {
        const newSections = sidebarSections.filter(item => item.id !== id);
        await onUpdateSidebar(newSections);
        alert("Widget deleted!");
    } catch (err) {
        alert("Failed to delete widget.");
    } finally {
        setIsSavingSidebar(false);
    }
  }

  const initWidgetForm = (type: SidebarSectionType) => {
    let data: any = {};
    switch(type) {
        case 'list': data = { links: [{ label: '', href: '', iconName: 'GraduationCap', isExternal: false }] }; break;
        case 'hotlines': data = { hotlines: [{ title: '', number: '' }] }; break;
        case 'message': data = { name: '', designation: '', image: '', quote: '' }; break;
        case 'image_card': data = { image: '', name: '' }; break;
        case 'notice': data = { content: '' }; break;
        case 'countdown': data = { targetDate: '', label: '' }; break;
        case 'audio': data = { audioUrl: '' }; break;
        case 'video':
        case 'map': data = { url: '' }; break;
        case 'datetime': data = {}; break;
        case 'image_only': data = { image: '' }; break;
        default: data = {};
    }
    setWidgetForm({ ...widgetForm, type, data });
  };

  const confirmDelete = (type: string, title: string, callback: () => void) => {
    if (window.confirm(`Permanently delete this ${type}: "${title}"?`)) callback();
  };

  const insertTag = (tag: string, closeTag?: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = pageForm.content;
    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newContent = closeTag ? before + `<${tag}>` + selectedText + `</${closeTag}>` + after : before + `<${tag}>` + selectedText + after;
    setPageForm({ ...pageForm, content: newContent });
    setTimeout(() => textarea.focus(), 0);
  };

  const [iconSearch, setIconSearch] = useState('');
  const filteredIcons = useMemo(() => 
    EDUCATION_ICONS.filter(i => i.toLowerCase().includes(iconSearch.toLowerCase())), 
    [iconSearch]
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-10 transition-colors font-sans">
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
                    { id: 'pages', icon: FileText, label: 'Page Manager' },
                    { id: 'sidebar', icon: Menu, label: 'Sidebar Widgets' },
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
                            <p className="text-gray-500 text-xs uppercase font-bold">Total Pages</p>
                            <h3 className="text-3xl font-bold text-orange-600 mt-1">{pages.length}</h3>
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
                        <h3 className="font-bold mb-4 text-emerald-700">Publish New Notice</h3>
                        <form onSubmit={handleNoticeSubmit} className="space-y-4">
                            <input type="text" value={noticeTitle} onChange={e=>setNoticeTitle(e.target.value)} className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Notice Title" required />
                            <select value={noticeType} onChange={e=>setNoticeType(e.target.value as any)} className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="general">General</option>
                                <option value="student">Student</option>
                                <option value="college">College</option>
                                <option value="exam">Exam</option>
                            </select>
                            <textarea value={noticeBody} onChange={e=>setNoticeBody(e.target.value)} className="w-full h-32 p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Content Body" />
                            <button type="submit" disabled={isPublishing} className="bg-emerald-700 text-white px-6 py-2 rounded font-bold hover:bg-emerald-800 disabled:opacity-50">
                                {isPublishing ? 'Publishing...' : 'Publish Notice'}
                            </button>
                        </form>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded border dark:border-gray-700 shadow-sm">
                        <ul className="divide-y dark:divide-gray-700">
                            {notices.map(n => (
                                <li key={n.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-sm dark:text-white">{n.title}</p>
                                        <p className="text-xs text-gray-400">{n.date} • {n.type}</p>
                                    </div>
                                    <button onClick={() => confirmDelete('notice', n.title, () => onDeleteNotice(n.id))} className="text-red-400 p-2"><Trash2 size={18}/></button>
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
                        <h3 className="font-bold mb-4 text-blue-600">Add Headline</h3>
                        <form onSubmit={handleNewsSubmit} className="space-y-4">
                            <input type="text" value={newsTitle} onChange={e=>setNewsTitle(e.target.value)} className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Headline" required />
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">Thumbnail</label>
                                <div className="flex items-center gap-4">
                                    {newsThumbnailUrl && <img src={newsThumbnailUrl} className="w-16 h-16 object-cover rounded border dark:border-gray-600" />}
                                    <button type="button" onClick={() => newsThumbnailInputRef.current?.click()} className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-500 transition">
                                        {isUploading ? <RefreshCw className="animate-spin" /> : <Upload size={24} />}
                                    </button>
                                    <input type="file" ref={newsThumbnailInputRef} className="hidden" onChange={async e => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await handleCloudinaryUpload(file, 'image');
                                            if (url) setNewsThumbnailUrl(url);
                                        }
                                    }} accept="image/*" />
                                </div>
                            </div>
                            <textarea value={newsContent} onChange={e=>setNewsContent(e.target.value)} className="w-full h-24 p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Full Content" />
                            <button type="submit" disabled={isNewsPublishing} className="bg-blue-700 text-white px-6 py-2 rounded font-bold disabled:opacity-50">Publish News</button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'pages' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Page Manager</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" value={pageForm.title} onChange={e => setPageForm({...pageForm, title: e.target.value})} className="p-2.5 border rounded text-sm dark:bg-gray-700 dark:text-white" placeholder="Title" />
                            <input type="text" value={pageForm.slug} onChange={e => setPageForm({...pageForm, slug: e.target.value})} className="p-2.5 border rounded text-sm dark:bg-gray-700 dark:text-white" placeholder="Slug" />
                        </div>
                        <div className="border dark:border-gray-600 rounded-lg overflow-hidden">
                             <div className="bg-gray-50 dark:bg-gray-700 p-1.5 border-b dark:border-gray-600 flex flex-wrap gap-1">
                                {[
                                    { icon: Heading1, action: () => insertTag('h1', 'h1') },
                                    { icon: Bold, action: () => insertTag('b', 'b') },
                                    { icon: List, action: () => insertTag('ul>\n  <li>', 'li>\n</ul>') },
                                    { icon: LinkIcon, action: () => insertTag('a href="#"', 'a') }
                                ].map((tool, idx) => (
                                    <button key={idx} type="button" onClick={tool.action} className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-300 transition">
                                        <tool.icon size={16} />
                                    </button>
                                ))}
                             </div>
                             <textarea ref={contentRef} value={pageForm.content} onChange={e => setPageForm({...pageForm, content: e.target.value})} className="w-full h-64 p-4 text-sm dark:bg-gray-800 dark:text-white font-mono" />
                        </div>
                        <button onClick={handlePageSave} disabled={isPageSaving} className="bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-800 disabled:opacity-50">Save Page</button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
                        <ul className="divide-y dark:divide-gray-700">
                            {pages.map(p => (
                                <li key={p.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-sm dark:text-white">{p.title}</p>
                                        <p className="text-xs text-gray-400">/{p.slug}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingPage(p); setPageForm({ title: p.title, content: p.content, slug: p.slug }); window.scrollTo({top:0}); }} className="p-2 text-emerald-600"><Edit size={18}/></button>
                                        <button onClick={() => confirmDelete('page', p.title, () => onDeletePage(p.id))} className="p-2 text-red-500"><Trash2 size={18}/></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === 'sidebar' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Sidebar Widgets</h2>
                        {editingWidget && <button onClick={() => {setEditingWidget(null); setWidgetForm({type:'list', title:'', data:{}});}} className="text-xs bg-gray-200 dark:bg-gray-700 px-3 py-1.5 rounded-lg font-bold"><X size={14}/> Cancel</button>}
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] uppercase font-black text-gray-400">Widget Type</label>
                                <select value={widgetForm.type} onChange={e => initWidgetForm(e.target.value as SidebarSectionType)} className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="message">Chairman Message</option>
                                    <option value="list">Link List</option>
                                    <option value="image_card">Image Card</option>
                                    <option value="image_only">Image Only</option>
                                    <option value="video">Video Embed</option>
                                    <option value="map">Map Embed</option>
                                    <option value="hotlines">Hotlines</option>
                                    <option value="audio">Audio Player</option>
                                    <option value="countdown">Countdown Timer</option>
                                    <option value="datetime">Date & Time</option>
                                    <option value="notice">HTML Notice</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black text-gray-400">Title</label>
                                <input type="text" value={widgetForm.title} onChange={e => setWidgetForm({...widgetForm, title: e.target.value})} className="w-full p-2.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700">
                             {['message', 'image_card', 'image_only'].includes(widgetForm.type) && (
                                 <div className="space-y-4">
                                     <div className="flex items-center gap-4">
                                         {widgetForm.data.image && <img src={widgetForm.data.image} className="w-16 h-16 object-cover rounded border dark:border-gray-600" />}
                                         <button type="button" onClick={() => widgetMediaInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded text-sm hover:bg-gray-50 transition">
                                             {isUploading ? <RefreshCw className="animate-spin" size={16} /> : <Upload size={16} />} 
                                             Upload {widgetForm.type === 'message' ? 'Photo' : 'Image'}
                                         </button>
                                         <input type="file" ref={widgetMediaInputRef} className="hidden" accept="image/*" onChange={async e => {
                                             const file = e.target.files?.[0];
                                             if (file) {
                                                 const url = await handleCloudinaryUpload(file, 'image');
                                                 if (url) setWidgetForm({...widgetForm, data: {...widgetForm.data, image: url}});
                                             }
                                         }} />
                                     </div>
                                     {widgetForm.type === 'message' && (
                                         <div className="grid grid-cols-2 gap-4">
                                             <input type="text" placeholder="Name" value={widgetForm.data.name} onChange={e=>setWidgetForm({...widgetForm, data:{...widgetForm.data, name:e.target.value}})} className="p-2 border rounded text-sm dark:bg-gray-700 dark:text-white" />
                                             <input type="text" placeholder="Designation" value={widgetForm.data.designation} onChange={e=>setWidgetForm({...widgetForm, data:{...widgetForm.data, designation:e.target.value}})} className="p-2 border rounded text-sm dark:bg-gray-700 dark:text-white" />
                                             <textarea placeholder="Quote" value={widgetForm.data.quote} onChange={e=>setWidgetForm({...widgetForm, data:{...widgetForm.data, quote:e.target.value}})} className="col-span-2 p-2 border rounded text-sm dark:bg-gray-700 dark:text-white" />
                                         </div>
                                     )}
                                     {widgetForm.type === 'image_card' && <input type="text" placeholder="Label" value={widgetForm.data.name} onChange={e=>setWidgetForm({...widgetForm, data:{...widgetForm.data, name:e.target.value}})} className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:text-white" />}
                                 </div>
                             )}

                             {widgetForm.type === 'audio' && (
                                 <div className="space-y-4">
                                     <div className="flex items-center gap-4">
                                         <button type="button" onClick={() => widgetMediaInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded text-sm hover:bg-gray-50 transition">
                                             {isUploading ? <RefreshCw className="animate-spin" size={16} /> : <Speaker size={16} />} 
                                             {widgetForm.data.audioUrl ? 'Change Audio' : 'Upload Audio (MP3)'}
                                         </button>
                                         <input type="file" ref={widgetMediaInputRef} className="hidden" accept="audio/mpeg" onChange={async e => {
                                             const file = e.target.files?.[0];
                                             if (file) {
                                                 const url = await handleCloudinaryUpload(file, 'video'); 
                                                 if (url) setWidgetForm({...widgetForm, data: {...widgetForm.data, audioUrl: url}});
                                             }
                                         }} />
                                     </div>
                                     {widgetForm.data.audioUrl && <p className="text-[10px] text-emerald-500 font-bold truncate">{widgetForm.data.audioUrl}</p>}
                                 </div>
                             )}

                             {widgetForm.type === 'list' && (
                                 <div className="space-y-4">
                                     {widgetForm.data.links?.map((link: any, i: number) => (
                                         <div key={i} className="space-y-2 p-3 bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
                                             <div className="flex gap-2">
                                                 <input type="text" placeholder="Label" value={link.label} onChange={e => {
                                                     const links = [...widgetForm.data.links];
                                                     links[i] = { ...links[i], label: e.target.value };
                                                     setWidgetForm({...widgetForm, data: {...widgetForm.data, links}});
                                                 }} className="flex-1 p-2 border rounded text-xs dark:bg-gray-700 dark:text-white" />
                                                 <input type="text" placeholder="URL" value={link.href} onChange={e => {
                                                     const links = [...widgetForm.data.links];
                                                     links[i] = { ...links[i], href: e.target.value };
                                                     setWidgetForm({...widgetForm, data: {...widgetForm.data, links}});
                                                 }} className="flex-1 p-2 border rounded text-xs dark:bg-gray-700 dark:text-white" />
                                                 <button onClick={() => {
                                                     const links = widgetForm.data.links.filter((_:any, idx:number) => idx !== i);
                                                     setWidgetForm({...widgetForm, data: {...widgetForm.data, links}});
                                                 }} className="text-red-500"><Trash2 size={16}/></button>
                                             </div>
                                             
                                             <div>
                                                 <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Select Icon</p>
                                                 <div className="flex gap-2 mb-2">
                                                     <div className="relative flex-1">
                                                         <Search className="absolute left-2 top-2 text-gray-400" size={14} />
                                                         <input type="text" placeholder="Search icons..." value={iconSearch} onChange={e=>setIconSearch(e.target.value)} className="w-full pl-7 pr-2 py-1 border rounded text-[10px] dark:bg-gray-700 dark:text-white" />
                                                     </div>
                                                     <div className="w-8 h-8 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 rounded border dark:border-emerald-800 text-emerald-600">
                                                         {(() => { const Icon = IconMapper[link.iconName || 'GraduationCap']; return Icon ? <Icon size={18} /> : <HelpCircle size={18} />; })()}
                                                     </div>
                                                 </div>
                                                 <div className="grid grid-cols-10 gap-1 h-24 overflow-y-auto p-1 bg-gray-50 dark:bg-gray-900 rounded border dark:border-gray-700">
                                                     {filteredIcons.map(iconName => {
                                                         const Icon = IconMapper[iconName];
                                                         return (
                                                             <button key={iconName} type="button" onClick={() => {
                                                                 const links = [...widgetForm.data.links];
                                                                 links[i] = { ...links[i], iconName };
                                                                 setWidgetForm({...widgetForm, data: {...widgetForm.data, links}});
                                                             }} className={`p-1 flex items-center justify-center rounded transition ${link.iconName === iconName ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-100 dark:hover:bg-emerald-900 text-gray-400'}`} title={iconName}>
                                                                 <Icon size={14} />
                                                             </button>
                                                         );
                                                     })}
                                                 </div>
                                             </div>
                                         </div>
                                     ))}
                                     <button onClick={() => setWidgetForm({...widgetForm, data: {...widgetForm.data, links: [...(widgetForm.data.links || []), {label:'', href:'', iconName: 'GraduationCap'}]}})} className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Plus size={14}/> Add Link</button>
                                 </div>
                             )}

                             {widgetForm.type === 'hotlines' && (
                                 <div className="space-y-2">
                                     {widgetForm.data.hotlines?.map((h: any, i: number) => (
                                         <div key={i} className="flex gap-2 items-center">
                                             <input type="text" placeholder="Title" value={h.title} onChange={e => {
                                                 const hotlines = [...widgetForm.data.hotlines];
                                                 hotlines[i] = { ...hotlines[i], title: e.target.value };
                                                 setWidgetForm({...widgetForm, data: {...widgetForm.data, hotlines}});
                                             }} className="flex-1 p-2 border rounded text-xs dark:bg-gray-700 dark:text-white" />
                                             <input type="text" placeholder="Number" value={h.number} onChange={e => {
                                                 const hotlines = [...widgetForm.data.hotlines];
                                                 hotlines[i] = { ...hotlines[i], number: e.target.value };
                                                 setWidgetForm({...widgetForm, data: {...widgetForm.data, hotlines}});
                                             }} className="flex-1 p-2 border rounded text-xs dark:bg-gray-700 dark:text-white" />
                                             <button onClick={() => {
                                                 const hotlines = widgetForm.data.hotlines.filter((_:any, idx:number) => idx !== i);
                                                 setWidgetForm({...widgetForm, data: {...widgetForm.data, hotlines}});
                                             }} className="text-red-500"><Trash2 size={16}/></button>
                                         </div>
                                     ))}
                                     <button onClick={() => setWidgetForm({...widgetForm, data: {...widgetForm.data, hotlines: [...(widgetForm.data.hotlines || []), {title:'', number:''}]}})} className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Plus size={14}/> Add Hotline</button>
                                 </div>
                             )}

                             {['video', 'map'].includes(widgetForm.type) && (
                                 <div>
                                     <label className="text-xs font-bold text-gray-500 mb-1 block">Embed URL</label>
                                     <input 
                                         type="text" 
                                         placeholder="Paste embed URL here..." 
                                         value={widgetForm.data.url} 
                                         onChange={e=>setWidgetForm({...widgetForm, data:{...widgetForm.data, url:e.target.value}})} 
                                         className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:text-white" 
                                     />
                                     <p className="text-[10px] text-gray-400 mt-1">For Video, use YouTube embed format: https://www.youtube.com/embed/VIDEO_ID</p>
                                 </div>
                             )}

                             {widgetForm.type === 'countdown' && (
                                 <div className="space-y-3">
                                     <div>
                                         <label className="text-xs font-bold text-gray-500 mb-1 block">Target Date & Time</label>
                                         <input 
                                             type="datetime-local" 
                                             value={widgetForm.data.targetDate} 
                                             onChange={e=>setWidgetForm({...widgetForm, data:{...widgetForm.data, targetDate:e.target.value}})} 
                                             className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:text-white" 
                                         />
                                     </div>
                                     <div>
                                         <label className="text-xs font-bold text-gray-500 mb-1 block">Countdown Label</label>
                                         <input 
                                             type="text" 
                                             placeholder="e.g. SSC Exam Starts" 
                                             value={widgetForm.data.label} 
                                             onChange={e=>setWidgetForm({...widgetForm, data:{...widgetForm.data, label:e.target.value}})} 
                                             className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:text-white" 
                                         />
                                     </div>
                                 </div>
                             )}

                             {widgetForm.type === 'notice' && (
                                 <div>
                                     <label className="text-xs font-bold text-gray-500 mb-1 block">Notice Content (HTML Supported)</label>
                                     <textarea 
                                         placeholder="Write your HTML content here..." 
                                         value={widgetForm.data.content} 
                                         onChange={e=>setWidgetForm({...widgetForm, data:{...widgetForm.data, content:e.target.value}})} 
                                         className="w-full h-40 p-2 border rounded text-sm dark:bg-gray-700 dark:text-white font-mono" 
                                     />
                                 </div>
                             )}

                             {widgetForm.type === 'datetime' && (
                                 <p className="text-xs text-gray-500 italic">This widget has no specific settings. It automatically displays the current system time and date.</p>
                             )}
                        </div>

                        <button onClick={handleWidgetSave} disabled={isSavingSidebar} className="bg-emerald-700 text-white px-8 py-2 rounded font-bold hover:bg-emerald-800 transition flex items-center gap-2 disabled:opacity-50">
                            {isSavingSidebar ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18}/>} 
                            {editingWidget ? 'Update Widget' : 'Save Widget'}
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm overflow-hidden">
                        <ul className="divide-y dark:divide-gray-700">
                            {sidebarSections.map(s => (
                                <li key={s.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                            {(() => { const Icon = IconMapper[s.type === 'list' ? 'GraduationCap' : s.type === 'message' ? 'User' : s.type === 'audio' ? 'Headphones' : s.type === 'video' ? 'Video' : 'Image']; return Icon ? <Icon size={20}/> : <HelpCircle size={20}/>; })()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">{s.title || (s.type === 'image_only' ? '(Logo/Image)' : s.type)}</p>
                                            <p className="text-[10px] text-gray-400 uppercase font-black">{s.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingWidget(s); setWidgetForm({ type: s.type, title: s.title, data: s.data }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 text-emerald-600"><Edit size={18}/></button>
                                        <button onClick={() => handleDeleteWidget(s.id, s.title || s.type)} className="p-2 text-red-500"><Trash2 size={18}/></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
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
                                        <button onClick={() => confirmDelete('info card', c.title, () => {})} className="text-red-300 hover:text-red-600 p-1"><Trash2 size={14}/></button>
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
