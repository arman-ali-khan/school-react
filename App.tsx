
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import NProgress from 'nprogress';
import { RootState, AppDispatch } from './store';
import { restoreSession, signOutUser, setUser } from './store/slices/authSlice';
import { 
  fetchAllContent, 
  addNoticeThunk, 
  addNewsThunk, 
  addPageThunk,
  updatePageThunk,
  deletePageThunk,
  deleteNoticeThunk, 
  deleteNewsThunk, 
  updateSettingsThunk, 
  updateSidebarThunk,
  updateInfoCardsThunk,
  updateHomeWidgetsThunk,
  incrementVisit,
  setMenuItems, 
  setInfoCards,
  markNotificationRead
} from './store/slices/contentSlice';

// Layout Components
import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Feature Components
import HeroSlider from './components/features/HeroSlider';
import NewsTicker from './components/features/NewsTicker';
import NoticeBoard from './components/features/NoticeBoard';
import Sidebar from './components/features/Sidebar';
import InfoCardsSection from './components/features/InfoCardsSection';
import HomeWidget from './components/features/HomeWidget';
import NotificationBanner from './components/features/NotificationBanner';

// Page Components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ChairmanMessagePage from './pages/ChairmanMessagePage';
import SingleNoticePage from './pages/SingleNoticePage';
import SingleNewsPage from './pages/SingleNewsPage';
import SearchPage from './pages/SearchPage';
import AllNoticesPage from './pages/AllNoticesPage';
import AllNewsPage from './pages/AllNewsPage';
import AdminDashboard from './pages/AdminDashboard.tsx';
import DynamicPage from './pages/DynamicPage';
import NotificationsPage from './pages/NotificationsPage';
import OurFacultyPage from './pages/OurFacultyPage';
import ResultsPage from './pages/ResultsPage';

// Configure NProgress
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>() as any;
  const { user, isLoading: isAuthLoading } = useSelector((state: RootState) => state.auth);
  const { 
    notices, news, pages, teachers, employees, results, carouselItems, sidebarSections, 
    infoCards, menuItems, topBarConfig, footerConfig, 
    homeWidgets, notifications, isLoading: isContentLoading 
  } = useSelector((state: RootState) => state.content);

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<any>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useCallback((page: string, params: any = {}, updateHash = true) => {
    NProgress.start();
    setCurrentPage(page);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (updateHash) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val) searchParams.set(key, String(val));
      });
      const queryString = searchParams.toString();
      window.location.hash = queryString ? `${page}?${queryString}` : page;
    }
  }, []);

  useEffect(() => {
    dispatch(restoreSession());
    dispatch(fetchAllContent());
    dispatch(incrementVisit());
    
    const handleHashChange = () => {
      NProgress.start();
      const hash = window.location.hash.replace('#', '');
      if (!hash) { 
        navigate('home', {}, false); 
        return; 
      }
      const [page, query] = hash.split('?');
      const params = Object.fromEntries(new URLSearchParams(query || ''));
      navigate(page, params, false);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [dispatch, navigate]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Complete progress bar when the page content effectively changes
  useEffect(() => {
    NProgress.done();
  }, [currentPage, routeParams]);

  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <HeroSlider items={carouselItems} />
              <NewsTicker 
                newsItems={news} 
                onNavigateNews={(item) => navigate('news', { newsId: item.id })} 
                onViewAll={() => navigate('all-news')} 
              />
              <NoticeBoard 
                notices={notices} 
                onNavigateNotice={(id) => navigate('notice', { id })} 
                onViewAll={() => navigate('all-notices')} 
              />
              <InfoCardsSection cards={infoCards} />
              <div className="space-y-6">
                {homeWidgets.map(w => <HomeWidget key={w.id} config={w} />)}
              </div>
            </div>
            <div className="lg:col-span-4">
              <Sidebar 
                sections={sidebarSections} 
                onNavigateChairman={() => navigate('chairman')} 
              />
            </div>
          </div>
        );
      
      case 'login':
        return <LoginPage onBack={() => navigate('home')} onRegisterClick={() => navigate('register')} onForgotPasswordClick={() => navigate('forgot-password')} onLogin={(u) => { dispatch(setUser(u)); navigate('home'); }} />;
      case 'register':
        return <RegisterPage onBack={() => navigate('home')} onLoginClick={() => navigate('login')} onTermsClick={() => navigate('terms')} onPrivacyClick={() => navigate('privacy')} onRegisterSuccess={(u) => { dispatch(setUser(u)); navigate('home'); }} />;
      case 'forgot-password': return <ForgotPasswordPage onBack={() => navigate('login')} />;
      case 'terms': return <TermsPage onBack={() => window.history.back()} />;
      case 'privacy': return <PrivacyPolicyPage onBack={() => window.history.back()} />;
      case 'chairman': 
        const chairmanSection = sidebarSections.find(s => s.type === 'message');
        return <ChairmanMessagePage onBack={() => navigate('home')} data={chairmanSection?.data} />;
      case 'our-faculty':
        return <OurFacultyPage teachers={teachers} employees={employees} onBack={() => navigate('home')} />;
      case 'results':
        return <ResultsPage results={results} onBack={() => navigate('home')} />;
      case 'notice': return <SingleNoticePage noticeId={routeParams.id} notices={notices} onBack={() => navigate('home')} />;
      case 'news': return <SingleNewsPage newsItem={news.find(n => n.id === routeParams.newsId)} onBack={() => navigate('home')} />;
      case 'all-notices': return <AllNoticesPage notices={notices} onBack={() => navigate('home')} onNavigateNotice={(id) => navigate('notice', { id })} />;
      case 'all-news': return <AllNewsPage newsItems={news} onBack={() => navigate('home')} onNavigateNews={(n) => navigate('news', { newsId: n.id })} />;
      case 'search': return <SearchPage query={routeParams.q || ''} notices={notices} onBack={() => navigate('home')} onNavigateNotice={(id) => navigate('notice', { id })} />;
      case 'page-viewer':
        const page = pages.find(p => p.slug === routeParams.slug);
        return page ? <DynamicPage page={page} onBack={() => navigate('home')} /> : <NotFound />;
      case 'admin-dashboard':
        if (user?.role !== 'Admin') return <AccessDenied />;
        return (
          <AdminDashboard 
            onBack={() => navigate('home')}
          />
        );
      case 'notifications':
        if (user?.role !== 'Admin') return <AccessDenied />;
        return (
          <NotificationsPage 
            notifications={notifications}
            onMarkRead={(id) => dispatch(markNotificationRead(id))}
            onBack={() => navigate('home')}
          />
        );
      default: return <NotFound />;
    }
  };

  if (isAuthLoading || isContentLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-4">
        <RefreshCw className="animate-spin text-emerald-600" size={48} />
        <p className="text-sm font-bold text-gray-400 dark:text-gray-600 animate-pulse uppercase tracking-widest">Portal Initializing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-950 transition-colors">
      <TopBar 
        onNavigate={(p) => navigate(p)} 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        user={user} 
        onLogout={() => dispatch(signOutUser())} 
        config={topBarConfig}
      />
      <Header />
      <Navbar 
        onSearch={(q) => navigate('search', { q })} 
        menuItems={menuItems} 
        onNavigate={(h) => {
          if (h === 'home') navigate('home');
          else if (h.startsWith('page:')) navigate('page-viewer', { slug: h.split(':')[1] });
          else navigate(h);
        }} 
      />
      
      {/* Admin Exclusive Notification Banner */}
      {user?.role === 'Admin' && (
        <NotificationBanner 
          notifications={notifications}
          onMarkRead={(id) => dispatch(markNotificationRead(id))}
          onSeeAll={() => navigate('notifications')}
        />
      )}

      <main className="flex-grow container mx-auto sm:px-4 py-8">
        {renderActivePage()}
      </main>
      <Footer config={footerConfig} />
    </div>
  );
};

const NotFound = () => <div className="text-center py-32"><h2 className="text-4xl font-bold text-gray-300">404</h2><p className="text-gray-500">Page Not Found</p></div>;
const AccessDenied = () => <div className="text-center py-32"><h2 className="text-4xl font-bold text-red-400">Restricted</h2><p className="text-gray-500">Admin privileges required.</p></div>;

export default App;
