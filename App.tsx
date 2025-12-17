
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { restoreSession, signOutUser, setUser } from './store/slices/authSlice';
import { fetchAllContent, addNoticeThunk, deleteNoticeThunk, updateSettingsThunk, setMenuItems, setInfoCards } from './store/slices/contentSlice';

import TopBar from './components/TopBar';
import Header from './components/Header';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import NoticeBoard from './components/NoticeBoard';
import Sidebar from './components/Sidebar';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import InfoCardsSection from './components/InfoCardsSection';
import NewsTicker from './components/NewsTicker';
import HomeWidget from './components/HomeWidget';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import TermsPage from './components/TermsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ChairmanMessagePage from './components/ChairmanMessagePage';
import SingleNoticePage from './components/SingleNoticePage';
import SingleNewsPage from './components/SingleNewsPage';
import SearchPage from './components/SearchPage';
import AllNoticesPage from './components/AllNoticesPage';
import AllNewsPage from './components/AllNewsPage';
import AdminDashboard from './components/AdminDashboard';
import DynamicPage from './components/DynamicPage';
import { Notice, User, TopBarConfig, FooterConfig } from './types';

type PageType = 'home' | 'login' | 'register' | 'terms' | 'privacy' | 'forgot-password' | 'chairman' | 'notice' | 'news' | 'search' | 'all-notices' | 'all-news' | 'admin-dashboard' | 'page-viewer';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading: isAuthLoading } = useSelector((state: RootState) => state.auth);
  const { 
    notices, news, pages, carouselItems, sidebarSections, 
    infoCards, menuItems, topBarConfig, footerConfig, 
    homeWidgets, isLoading: isContentLoading 
  } = useSelector((state: RootState) => state.content);

  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [currentNoticeId, setCurrentNoticeId] = useState<string>('');
  const [currentNewsTitle, setCurrentNewsTitle] = useState<string>('');
  const [currentSlug, setCurrentSlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    dispatch(restoreSession());
    dispatch(fetchAllContent());
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDarkMode(true);

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
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [dispatch, handleNavigate]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = async () => {
    await dispatch(signOutUser());
    handleNavigate('home');
  };

  const handleMenuNavigation = (href: string) => {
    if (href.startsWith('page:')) {
      handleNavigate('page-viewer', { slug: href.replace('page:', '') });
    } else if (href === 'home' || href === 'chairman') {
      handleNavigate(href as any);
    } else if (href.startsWith('http')) {
      window.open(href, '_blank');
    }
  };

  if (isAuthLoading || isContentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 flex-col gap-4">
        <RefreshCw className="animate-spin text-emerald-600" size={48} />
        <p className="text-emerald-700 dark:text-emerald-400 font-bold text-lg animate-pulse">BISE Dinajpur Portal</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <TopBar 
        onNavigate={(page) => handleNavigate(page as PageType)} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
        config={topBarConfig}
      />
      <Header />
      <Navbar 
        onSearch={(query) => handleNavigate('search', { query })} 
        menuItems={menuItems}
        onNavigate={handleMenuNavigation}
      />
      
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

        {currentPage === 'login' && <LoginPage onBack={() => handleNavigate('home')} onRegisterClick={() => handleNavigate('register')} onForgotPasswordClick={() => handleNavigate('forgot-password')} onLogin={(u) => { dispatch(setUser(u)); handleNavigate('home'); }} />}
        {currentPage === 'register' && <RegisterPage onBack={() => handleNavigate('home')} onLoginClick={() => handleNavigate('login')} onTermsClick={() => handleNavigate('terms')} onPrivacyClick={() => handleNavigate('privacy')} onRegisterSuccess={(u) => { dispatch(setUser(u)); handleNavigate('home'); }} />}

        {currentPage === 'admin-dashboard' && user?.role === 'Admin' && (
            <AdminDashboard 
                user={user} notices={notices} news={news} pages={pages} carouselItems={carouselItems} sidebarSections={sidebarSections} infoCards={infoCards} menuItems={menuItems} topBarConfig={topBarConfig} footerConfig={footerConfig} homeWidgets={homeWidgets}
                onAddNotice={(n) => dispatch(addNoticeThunk(n)).unwrap()}
                onAddNews={() => {}} // Extend as needed
                onDeleteNotice={(id) => dispatch(deleteNoticeThunk(id))}
                onDeleteNews={() => {}} // Extend as needed
                onUpdatePages={() => {}} // Extend as needed
                onUpdateCarousel={() => {}} // Extend as needed
                onUpdateSidebar={() => {}} // Extend as needed
                onUpdateInfoCards={(c) => dispatch(setInfoCards(c))}
                onUpdateMenu={(m) => dispatch(setMenuItems(m))}
                onUpdateTopBar={(c) => dispatch(updateSettingsThunk({ key: 'topBarConfig', value: c }))}
                onUpdateFooter={(c) => dispatch(updateSettingsThunk({ key: 'footerConfig', value: c }))}
                onUpdateHomeWidgets={() => {}} // Extend as needed
                onBack={() => handleNavigate('home')}
            />
        )}

        {currentPage === 'page-viewer' && (
            pages.find(p => p.slug === currentSlug) ? (
                <DynamicPage page={pages.find(p => p.slug === currentSlug)!} onBack={() => handleNavigate('home')} />
            ) : <div className="p-8 text-center">Page not found.</div>
        )}

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
