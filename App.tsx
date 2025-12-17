
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
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
import { NOTICES, NEWS_ITEMS, INITIAL_PAGES, CAROUSEL_ITEMS, SIDEBAR_SECTIONS, INFO_CARDS, MAIN_MENU, DEFAULT_TOPBAR_CONFIG, DEFAULT_FOOTER_CONFIG, DEFAULT_HOME_WIDGETS } from './constants';
import { Notice, User, Page, CarouselItem, SidebarSection, InfoCard, MenuItem, TopBarConfig, FooterConfig, HomeWidgetConfig } from './types';
import { supabase } from './supabaseClient';

type PageType = 'home' | 'login' | 'register' | 'terms' | 'privacy' | 'forgot-password' | 'chairman' | 'notice' | 'news' | 'search' | 'all-notices' | 'all-news' | 'admin-dashboard' | 'page-viewer';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [currentNoticeId, setCurrentNoticeId] = useState<string>('');
  const [currentNewsTitle, setCurrentNewsTitle] = useState<string>('');
  const [currentSlug, setCurrentSlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // -- Data State --
  const [notices, setNotices] = useState<Notice[]>(NOTICES);
  const [news, setNews] = useState<string[]>(NEWS_ITEMS);
  const [pages, setPages] = useState<Page[]>(INITIAL_PAGES);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>(CAROUSEL_ITEMS);
  const [sidebarSections, setSidebarSections] = useState<SidebarSection[]>(SIDEBAR_SECTIONS);
  const [infoCards, setInfoCards] = useState<InfoCard[]>(INFO_CARDS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MAIN_MENU);
  const [topBarConfig, setTopBarConfig] = useState<TopBarConfig>(DEFAULT_TOPBAR_CONFIG);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const [homeWidgets, setHomeWidgets] = useState<HomeWidgetConfig[]>(DEFAULT_HOME_WIDGETS);

  // User State
  const [user, setUser] = useState<User | null>(null);

  // --- Routing Logic ---
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

  // Sync state from URL hash on mount and on hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        handleNavigate('home', {}, false);
        return;
      }

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
  }, [handleNavigate]);

  // -- Initialization & Auth --
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }

    const initApp = async () => {
      try {
        await initSession();
        await fetchContent();

        const hash = window.location.hash.replace('#', '');
        if (hash) {
          const [pagePart, queryPart] = hash.split('?');
          const params = new URLSearchParams(queryPart || '');
          handleNavigate(pagePart as PageType, {
            id: params.get('id') || '',
            title: params.get('title') || '',
            query: params.get('q') || '',
            slug: params.get('slug') || ''
          }, false);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Initialization error:", error);
        setIsLoading(false);
      }
    };

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          localStorage.setItem('user_id', session.user.id);
          localStorage.setItem('user_email', session.user.email || '');
          localStorage.setItem('access_token', session.access_token);

          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!profileError && profile) {
            setUser({
              name: profile.name,
              email: session.user.email || '',
              role: profile.role,
              institute: profile.institute,
              mobile: profile.mobile
            });
          } else {
            setUser({
              name: session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: 'Student'
            });
          }
        } else {
          localStorage.removeItem('user_id');
          localStorage.removeItem('user_email');
          localStorage.removeItem('access_token');
          setUser(null);
        }
      } catch (e) {
        console.warn("Session check failed:", e);
      }
    };

    initApp();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        localStorage.setItem('user_id', session.user.id);
        localStorage.setItem('user_email', session.user.email || '');
        localStorage.setItem('access_token', session.access_token);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            name: profile.name,
            email: session.user.email || '',
            role: profile.role,
            institute: profile.institute,
            mobile: profile.mobile
          });
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('access_token');
        setUser(null);
        handleNavigate('home');
      }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, [handleNavigate]);

  const fetchContent = async () => {
    try {
      const results = await Promise.allSettled([
        supabase.from('notices').select('*').order('date', { ascending: false }),
        supabase.from('news_items').select('content'),
        supabase.from('pages').select('*'),
        supabase.from('carousel_items').select('*').order('id'),
        supabase.from('home_widgets').select('*').order('id'),
        supabase.from('sidebar_sections').select('*').order('id'),
        supabase.from('settings').select('value').eq('key', 'topBarConfig'),
        supabase.from('settings').select('value').eq('key', 'footerConfig')
      ]);

      if (results[0].status === 'fulfilled' && results[0].value.data?.length) setNotices(results[0].value.data);
      if (results[1].status === 'fulfilled' && results[1].value.data?.length) setNews(results[1].value.data.map((n: any) => n.content));
      if (results[2].status === 'fulfilled' && results[2].value.data?.length) setPages(results[2].value.data);
      if (results[3].status === 'fulfilled' && results[3].value.data?.length) setCarouselItems(results[3].value.data);
      if (results[4].status === 'fulfilled' && results[4].value.data?.length) setHomeWidgets(results[4].value.data);
      if (results[5].status === 'fulfilled' && results[5].value.data?.length) setSidebarSections(results[5].value.data);
      
      if (results[6].status === 'fulfilled' && results[6].value.data?.length) setTopBarConfig(results[6].value.data[0].value);
      if (results[7].status === 'fulfilled' && results[7].value.data?.length) setFooterConfig(results[7].value.data[0].value);

    } catch (error) {
      console.error("Content fetch failed:", error);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogin = (userData: User) => {
      setUser(userData);
      if (userData.role === 'Admin') handleNavigate('admin-dashboard');
      else handleNavigate('home');
  };

  const handleLogout = async () => {
      try {
          await supabase.auth.signOut();
      } catch (e) {
          console.error("Logout error:", e);
      } finally {
          localStorage.removeItem('user_id');
          localStorage.removeItem('user_email');
          localStorage.removeItem('access_token');
          setUser(null);
          handleNavigate('home');
      }
  };

  const handleMenuNavigation = (href: string) => {
      if (href.startsWith('page:')) {
          const slug = href.replace('page:', '');
          handleNavigate('page-viewer', { slug });
      } else if (href === 'home') {
          handleNavigate('home');
      } else if (href === 'chairman') {
          handleNavigate('chairman');
      } else {
          if(href.startsWith('http')) window.open(href, '_blank');
          else console.log("Navigation not implemented for", href);
      }
  };

  const updateNotices = async (newNotices: Notice[], action: 'add' | 'delete', target?: Notice | string) => {
    setNotices(newNotices);
    try {
        if (action === 'add' && target) {
          await supabase.from('notices').insert(target as Notice);
        } else if (action === 'delete' && target) {
          await supabase.from('notices').delete().eq('id', target as string);
        }
    } catch (e) {
        console.error("Notice database update failed:", e);
    }
  };

  const updateNews = async (newNews: string[], action: 'add' | 'delete', target?: string) => {
    setNews(newNews);
    try {
        if (action === 'add' && target) {
          await supabase.from('news_items').insert({ content: target });
        } else if (action === 'delete' && target) {
          await supabase.from('news_items').delete().eq('content', target);
        }
    } catch (e) {
        console.error("News database update failed:", e);
    }
  };

  const updatePages = async (newPages: Page[]) => {
    setPages(newPages);
    try {
        await supabase.from('pages').upsert(newPages);
    } catch (e) {
        console.error("Pages database update failed:", e);
    }
  };

  const updateCarousel = async (items: CarouselItem[]) => {
    setCarouselItems(items);
    try {
        await supabase.from('carousel_items').delete().neq('id', 'temp');
        await supabase.from('carousel_items').insert(items);
    } catch (e) {
        console.error("Carousel database update failed:", e);
    }
  };

  const updateSidebar = async (sections: SidebarSection[]) => {
    setSidebarSections(sections);
    try {
        await supabase.from('sidebar_sections').delete().neq('id', 'temp');
        await supabase.from('sidebar_sections').insert(sections);
    } catch (e) {
        console.error("Sidebar database update failed:", e);
    }
  };

  const updateHomeWidgets = async (widgets: HomeWidgetConfig[]) => {
    setHomeWidgets(widgets);
    try {
        await supabase.from('home_widgets').delete().neq('id', 'temp');
        await supabase.from('home_widgets').insert(widgets);
    } catch (e) {
        console.error("Home widgets database update failed:", e);
    }
  };

  const updateTopBar = async (config: TopBarConfig) => {
    setTopBarConfig(config);
    try {
        await supabase.from('settings').upsert({ key: 'topBarConfig', value: config });
    } catch (e) {
        console.error("TopBar settings database update failed:", e);
    }
  };

  const updateFooter = async (config: FooterConfig) => {
    setFooterConfig(config);
    try {
        await supabase.from('settings').upsert({ key: 'footerConfig', value: config });
    } catch (e) {
        console.error("Footer settings database update failed:", e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 flex-col gap-4">
        <RefreshCw className="animate-spin text-emerald-600" size={48} />
        <div className="text-center">
            <p className="text-emerald-700 dark:text-emerald-400 font-bold text-lg animate-pulse">BISE Dinajpur Portal</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Restoring session and loading content...</p>
        </div>
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
              <NewsTicker 
                  newsItems={news}
                  onNavigateNews={(title) => handleNavigate('news', { title })} 
                  onViewAll={() => handleNavigate('all-news')}
              />
              <div className="grid grid-cols-1 gap-6">
                  <NoticeBoard 
                      notices={notices}
                      onNavigateNotice={(id) => handleNavigate('notice', { id })} 
                      onViewAll={() => handleNavigate('all-notices')}
                  />
              </div>
              <InfoCardsSection cards={infoCards} />
              {homeWidgets.map(widget => (
                  <HomeWidget key={widget.id} config={widget} />
              ))}
            </div>
            <div className="lg:col-span-4">
              <Sidebar sections={sidebarSections} onNavigateChairman={() => handleNavigate('chairman')} />
            </div>
          </div>
        )}

        {currentPage === 'login' && (
            <LoginPage 
                onBack={() => handleNavigate('home')} 
                onRegisterClick={() => handleNavigate('register')}
                onForgotPasswordClick={() => handleNavigate('forgot-password')}
                onLogin={handleLogin}
            />
        )}
        {currentPage === 'register' && (
            <RegisterPage 
                onBack={() => handleNavigate('home')} 
                onLoginClick={() => handleNavigate('login')}
                onTermsClick={() => handleNavigate('terms')}
                onPrivacyClick={() => handleNavigate('privacy')}
                onRegisterSuccess={handleLogin}
            />
        )}

        {currentPage === 'admin-dashboard' && user && user.role === 'Admin' && (
            <AdminDashboard 
                user={user}
                notices={notices}
                news={news}
                pages={pages}
                carouselItems={carouselItems}
                sidebarSections={sidebarSections}
                infoCards={infoCards}
                menuItems={menuItems}
                topBarConfig={topBarConfig}
                footerConfig={footerConfig}
                homeWidgets={homeWidgets}
                onAddNotice={(n) => updateNotices([n, ...notices], 'add', n)}
                onAddNews={(n) => updateNews([n, ...news], 'add', n)}
                onDeleteNotice={(id) => updateNotices(notices.filter(n => n.id !== id), 'delete', id)}
                onDeleteNews={(i) => updateNews(news.filter((_, idx) => idx !== i), 'delete', news[i])}
                onUpdatePages={updatePages}
                onUpdateCarousel={updateCarousel}
                onUpdateSidebar={updateSidebar}
                onUpdateInfoCards={setInfoCards}
                onUpdateMenu={setMenuItems}
                onUpdateTopBar={updateTopBar}
                onUpdateFooter={updateFooter}
                onUpdateHomeWidgets={updateHomeWidgets}
                onBack={() => handleNavigate('home')}
            />
        )}

        {currentPage === 'page-viewer' && (
            (() => {
                const page = pages.find(p => p.slug === currentSlug);
                return page ? (
                    <DynamicPage page={page} onBack={() => handleNavigate('home')} />
                ) : (
                    <div className="p-8 text-center">Page not found. <button onClick={() => handleNavigate('home')} className="text-blue-500 underline">Go Home</button></div>
                );
            })()
        )}

        {currentPage === 'terms' && <TermsPage onBack={() => handleNavigate('register')} />}
        {currentPage === 'privacy' && <PrivacyPolicyPage onBack={() => handleNavigate('register')} />}
        {currentPage === 'forgot-password' && <ForgotPasswordPage onBack={() => handleNavigate('login')} />}
        {currentPage === 'chairman' && <ChairmanMessagePage onBack={() => handleNavigate('home')} />}
        {currentPage === 'notice' && <SingleNoticePage noticeId={currentNoticeId} notices={notices} onBack={() => handleNavigate('home')} />}
        {currentPage === 'news' && <SingleNewsPage newsTitle={currentNewsTitle} onBack={() => handleNavigate('home')} />}
        
        {currentPage === 'all-notices' && (
            <AllNoticesPage 
                notices={notices}
                onBack={() => handleNavigate('home')} 
                onNavigateNotice={(id) => handleNavigate('notice', { id })} 
            />
        )} 
        
        {currentPage === 'all-news' && (
            <AllNewsPage 
                newsItems={news}
                onBack={() => handleNavigate('home')} 
                onNavigateNews={(title) => handleNavigate('news', { title })} 
            />
        )}

        {currentPage === 'search' && (
            <SearchPage 
                query={searchQuery} 
                notices={notices}
                onBack={() => handleNavigate('home')} 
                onNavigateNotice={(id) => handleNavigate('notice', { id })}
            />
        )}
      </main>

      <ChatWidget />
      <Footer config={footerConfig} />
    </div>
  );
};

export default App;
