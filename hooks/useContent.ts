
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { NOTICES, NEWS_ITEMS, INITIAL_PAGES, CAROUSEL_ITEMS, SIDEBAR_SECTIONS, INFO_CARDS, MAIN_MENU, DEFAULT_TOPBAR_CONFIG, DEFAULT_FOOTER_CONFIG, DEFAULT_HOME_WIDGETS } from '../constants';
import { Notice, Page, CarouselItem, SidebarSection, InfoCard, MenuItem, TopBarConfig, FooterConfig, HomeWidgetConfig } from '../types';

export const useContent = () => {
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
    fetchContent();
  }, []);

  return { 
    notices, setNotices, 
    news, setNews, 
    pages, setPages, 
    carouselItems, setCarouselItems,
    sidebarSections, setSidebarSections,
    infoCards, setInfoCards,
    menuItems, setMenuItems,
    topBarConfig, setTopBarConfig,
    footerConfig, setFooterConfig,
    homeWidgets, setHomeWidgets,
    refresh: fetchContent
  };
};
