
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

// Layout Components
import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ChatWidget from './components/layout/ChatWidget';

// Home Feature Components
import HeroSlider from './components/home/HeroSlider';
import NoticeBoard from './components/home/NoticeBoard';
import InfoCardsSection from './components/home/InfoCardsSection';
import NewsTicker from './components/home/NewsTicker';
import Sidebar from './components/home/Sidebar';

// UI Components
import HomeWidget from './components/ui/HomeWidget';

// Auth Pages
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import TermsPage from './components/auth/TermsPage';
import PrivacyPolicyPage from './components/auth/PrivacyPolicyPage';

// Content Pages
import AdminDashboard from './components/admin/AdminDashboard';
import ChairmanMessagePage from './components/content/ChairmanMessagePage';
import SingleNoticePage from './components/content/SingleNoticePage';
import SingleNewsPage from './components/content/SingleNewsPage';
import SearchPage from './components/content/SearchPage';
import AllNoticesPage from './components/content/AllNoticesPage';
import AllNewsPage from './components/content/AllNewsPage';
import DynamicPage from './components/content/DynamicPage';

// Logic & Data
import { useAuth } from './hooks/useAuth';
import { useContent } from './hooks/useContent';
import { supabase } from './services/supabase';
import { Notice, User, Page, CarouselItem, SidebarSection, InfoCard, MenuItem, TopBarConfig, FooterConfig, HomeWidgetConfig } from './types/index';

type PageType = 'home' | 'login' | 'register' | 'terms' | 'privacy' | 'forgot-password' | 'chairman' | 'notice' | 'news' | 'search' | 'all-notices' | 'all-news' | 'admin-dashboard' | 'page-viewer';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [currentNoticeId, setCurrentNoticeId] = useState<string>('');
  const [currentNewsTitle, setCurrentNewsTitle] = useState<string>('');
  const [currentSlug, setCurrentSlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const { user, isAuthLoading, logout, setUser } = useAuth();
  const { 
    notices, setNotices, news, setNews, pages, setPages, carouselItems, setCarouselItems,
    sidebarSections, setSidebarSections, infoCards, setInfoCards, menuItems, setMenuItems,
    topBarConfig, setTopBarConfig, footerConfig, setFooterConfig, homeWidgets, setHomeWidgets
  } = useContent();

  const handleNavigate = useCallback((page: PageType, params?: { id?: string, title?: string, query?: string, slug?: string }, updateHash = true) => {
    if (params?.id) setCurrentNoticeId(params.id);
    if (params?.title) setCurrentNewsTitle(params.title);
    if (params?.query) setSearchQuery(params.query);
    if (params?.slug) setCurrentSlug(params.slug);
    
    setCurrentPage(page);
    window.scrollTo(0, 0);

    if (updateHash) {
      const searchParams = new URLSearchParams();
      if (params?.id) searchParams.set('id', params.id);
      if (params?.title) searchParams.set('title', params.title);
      if (params?.query) searchParams.set('q', params.query);
      if (params?.slug) searchParams.set('slug', params.slug);
      const queryString = searchParams.toString();
      window.location.hash = queryString ? `${page}?${queryString}` : page;
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) { handleNavigate('home', {}, false); return; }
      const [pagePart, queryPart] = hash.split('?');
      const params = new URLSearchParams(queryPart || '');
      handleNavigate(pagePart as PageType, {
        id: params.get('id') || '',
        title: params.get('title') || '',
        query: params.get('q') || '',
        slug: params.get('slug') || ''
      }, false);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [handleNavigate]);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDarkMode(true);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = async () => {
    await logout();
    handleNavigate('home');
  };

  const updateTopBar = async (config: TopBarConfig) => {
    setTopBarConfig(config);
    await supabase.from('settings').upsert({ key: 'topBarConfig', value: config });
  };

  const updateFooter = async (config: FooterConfig) => {
    setFooterConfig(config);
    await supabase.from('settings').upsert({ key: 'footerConfig', value: config });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 flex-col gap-4">
        <RefreshCw className="animate-spin text-emerald-600" size={48} />
        <p className="text-emerald-700 font-bold text-lg animate-pulse">BISE Dinajpur Portal</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <TopBar onNavigate={(page) => handleNavigate(page as PageType)} isDarkMode={isDarkMode} toggleTheme={toggleTheme} user={user} onLogout={handleLogout} config={topBarConfig} />
      <Header />
      <Navbar onSearch={(query) => handleNavigate('search', { query })} menuItems={menuItems} onNavigate={(href) => {
          if (href.startsWith('page:')) handleNavigate('page-viewer', { slug: href.replace('page:', '') });
          else if (href === 'home' || href === 'chairman') handleNavigate(href as any);
          else if (href.startsWith('http')) window.open(href, '_blank');
      }} />
      <main className="flex-grow container mx-auto px-4 py-6">
        {currentPage === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <HeroSlider items={carouselItems} />
              <NewsTicker newsItems={news} onNavigateNews={(title) => handleNavigate('news', { title })} onViewAll={() => handleNavigate('all-news')} />
              <NoticeBoard notices={notices} onNavigateNotice={(id) => handleNavigate('notice', { id })} onViewAll={() => handleNavigate('all-notices')} />
              <InfoCardsSection cards={infoCards} />
              {homeWidgets.map(widget => <HomeWidget key={widget.id} config={widget} />)}
            </div>
            <div className="lg:col-span-4">
              <Sidebar sections={sidebarSections} onNavigateChairman={() => handleNavigate('chairman')} />
            </div>
          </div>
        )}
        {currentPage === 'login' && <LoginPage onBack={() => handleNavigate('home')} onRegisterClick={() => handleNavigate('register')} onForgotPasswordClick={() => handleNavigate('forgot-password')} onLogin={setUser} />}
        {currentPage === 'register' && <RegisterPage onBack={() => handleNavigate('home')} onLoginClick={() => handleNavigate('login')} onTermsClick={() => handleNavigate('terms')} onPrivacyClick={() => handleNavigate('privacy')} onRegisterSuccess={setUser} />}
        {currentPage === 'admin-dashboard' && user?.role === 'Admin' && (
            <AdminDashboard user={user} notices={notices} news={news} pages={pages} carouselItems={carouselItems} sidebarSections={sidebarSections} infoCards={infoCards} menuItems={menuItems} topBarConfig={topBarConfig} footerConfig={footerConfig} homeWidgets={homeWidgets} onAddNotice={(n) => setNotices([n, ...notices])} onAddNews={(n) => setNews([n, ...news])} onDeleteNotice={(id) => setNotices(notices.filter(n => n.id !== id))} onDeleteNews={(i) => setNews(news.filter((_, idx) => idx !== i))} onUpdatePages={setPages} onUpdateCarousel={setCarouselItems} onUpdateSidebar={setSidebarSections} onUpdateInfoCards={setInfoCards} onUpdateMenu={setMenuItems} onUpdateTopBar={updateTopBar} onUpdateFooter={updateFooter} onUpdateHomeWidgets={setHomeWidgets} onBack={() => handleNavigate('home')} />
        )}
        {currentPage === 'page-viewer' && <DynamicPage page={pages.find(p => p.slug === currentSlug) || pages[0]} onBack={() => handleNavigate('home')} />}
        {currentPage === 'terms' && <TermsPage onBack={() => handleNavigate('register')} />}
        {currentPage === 'privacy' && <PrivacyPolicyPage onBack={() => handleNavigate('register')} />}
        {currentPage === 'forgot-password' && <ForgotPasswordPage onBack={() => handleNavigate('login')} />}
        {currentPage === 'chairman' && <ChairmanMessagePage onBack={() => handleNavigate('home')} />}
        {currentPage === 'notice' && <SingleNoticePage noticeId={currentNoticeId} notices={notices} onBack={() => handleNavigate('home')} />}
        {currentPage === 'news' && <SingleNewsPage newsTitle={currentNewsTitle} onBack={() => handleNavigate('home')} />}
        {currentPage === 'all-notices' && <AllNoticesPage notices={notices} onBack={() => handleNavigate('home')} onNavigateNotice={(id) => handleNavigate('notice', { id })} />}
        {currentPage === 'all-news' && <AllNewsPage newsItems={news} onBack={() => handleNavigate('home')} onNavigateNews={(title) => handleNavigate('news', { title })} />}
        {currentPage === 'search' && <SearchPage query={searchQuery} notices={notices} onBack={() => handleNavigate('home')} onNavigateNotice={(id) => handleNavigate('notice', { id })} />}
      </main>
      <ChatWidget />
      <Footer config={footerConfig} />
    </div>
  );
};
export default App;
