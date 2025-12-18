
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import { Notice, Page, CarouselItem, SidebarSection, InfoCard, MenuItem, TopBarConfig, FooterConfig, HomeWidgetConfig, NewsItem, SchoolInfo, SEOMeta } from '../../types';
import { NOTICES, NEWS_ITEMS, INITIAL_PAGES, CAROUSEL_ITEMS, SIDEBAR_SECTIONS, INFO_CARDS, MAIN_MENU, DEFAULT_TOPBAR_CONFIG, DEFAULT_FOOTER_CONFIG, DEFAULT_HOME_WIDGETS } from '../../constants';

interface ContentState {
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
  schoolInfo: SchoolInfo;
  seoMeta: SEOMeta;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  notices: NOTICES,
  news: NEWS_ITEMS,
  pages: INITIAL_PAGES,
  carouselItems: CAROUSEL_ITEMS,
  sidebarSections: SIDEBAR_SECTIONS,
  infoCards: INFO_CARDS,
  menuItems: MAIN_MENU,
  topBarConfig: DEFAULT_TOPBAR_CONFIG,
  footerConfig: DEFAULT_FOOTER_CONFIG,
  homeWidgets: DEFAULT_HOME_WIDGETS,
  schoolInfo: {
    name: "Board of Intermediate and Secondary Education",
    title: "Dinajpur",
    logoUrl: "",
    address: "Upashahar, Dinajpur",
    hotline: "16221",
    eiin: "123456",
    code: "789"
  },
  seoMeta: {
    title: "Dinajpur Education Board Portal",
    description: "Official portal for Dinajpur Education Board",
    keywords: "education, board, dinajpur, results, notices",
    author: "BISE Engineering"
  },
  isLoading: true,
  error: null,
};

export const fetchAllContent = createAsyncThunk('content/fetchAll', async () => {
  const results = await Promise.allSettled([
    supabase.from('notices').select('*').order('date', { ascending: false }),
    supabase.from('news_items').select('*').order('date', { ascending: false }),
    supabase.from('pages').select('*').order('date', { ascending: false }),
    supabase.from('carousel_items').select('*').order('id'),
    supabase.from('home_widgets').select('*').order('id'),
    supabase.from('sidebar_sections').select('*').order('order_index', { ascending: true }),
    supabase.from('info_cards').select('*').order('order_index', { ascending: true }),
    supabase.from('settings').select('value').eq('key', 'topBarConfig'),
    supabase.from('settings').select('value').eq('key', 'footerConfig'),
    supabase.from('settings').select('value').eq('key', 'schoolInfo'),
    supabase.from('settings').select('value').eq('key', 'seoMeta'),
    supabase.from('settings').select('value').eq('key', 'menuItems'),
    supabase.from('settings').select('value').eq('key', 'carouselItems'),
  ]);

  const data: any = {};
  if (results[0].status === 'fulfilled' && results[0].value.data) data.notices = results[0].value.data;
  if (results[1].status === 'fulfilled' && results[1].value.data) data.news = results[1].value.data;
  if (results[2].status === 'fulfilled' && results[2].value.data) data.pages = results[2].value.data;
  if (results[3].status === 'fulfilled' && results[3].value.data) data.carouselItems = results[3].value.data;
  if (results[4].status === 'fulfilled' && results[4].value.data) data.homeWidgets = results[4].value.data;
  if (results[5].status === 'fulfilled' && results[5].value.data) data.sidebarSections = results[5].value.data;
  if (results[6].status === 'fulfilled' && results[6].value.data) {
    data.infoCards = results[6].value.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        iconName: item.icon_name,
        imageUrl: item.image_url,
        links: item.links
    }));
  }
  if (results[7].status === 'fulfilled' && results[7].value.data?.length) data.topBarConfig = results[7].value.data[0]?.value;
  if (results[8].status === 'fulfilled' && results[8].value.data?.length) data.footerConfig = results[8].value.data[0]?.value;
  if (results[9].status === 'fulfilled' && results[9].value.data?.length) data.schoolInfo = results[9].value.data[0]?.value;
  if (results[10].status === 'fulfilled' && results[10].value.data?.length) data.seoMeta = results[10].value.data[0]?.value;
  if (results[11].status === 'fulfilled' && results[11].value.data?.length) data.menuItems = results[11].value.data[0]?.value;
  if (results[12].status === 'fulfilled' && results[12].value.data?.length) data.carouselItems = results[12].value.data[0]?.value;

  return data;
});

export const addNoticeThunk = createAsyncThunk('content/addNotice', async (notice: Notice) => {
  const { id, ...payload } = notice;
  const { data, error } = await supabase.from('notices').insert([payload]).select().single();
  if (error) throw error;
  return data as Notice;
});

export const addNewsThunk = createAsyncThunk('content/addNews', async (newsItem: NewsItem) => {
  const { id, ...payload } = newsItem;
  const { data, error } = await supabase.from('news_items').insert([payload]).select().single();
  if (error) throw error;
  return data as NewsItem;
});

export const addPageThunk = createAsyncThunk('content/addPage', async (page: Page) => {
  const { id, ...payload } = page;
  const { data, error } = await supabase.from('pages').insert([payload]).select().single();
  if (error) throw error;
  return data as Page;
});

export const updatePageThunk = createAsyncThunk('content/updatePage', async (page: Page) => {
  const { id, ...payload } = page;
  const { data, error } = await supabase.from('pages').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data as Page;
});

export const updateSettingsThunk = createAsyncThunk('content/updateSettings', async ({ key, value }: { key: string, value: any }) => {
  const { error } = await supabase.from('settings').upsert({ key, value });
  if (error) throw error;
  return { key, value };
});

export const updateSidebarThunk = createAsyncThunk('content/updateSidebar', async (sections: SidebarSection[]) => {
    // Better delete logic: targeting every row via a numeric filter or a valid catch-all
    await supabase.from('sidebar_sections').delete().neq('order_index', -999);
    if (sections.length === 0) return [];
    // Stripping IDs to allow DB to generate fresh ones and avoid conflicts
    const payload = sections.map((s, index) => ({ title: s.title, type: s.type, data: s.data, order_index: index }));
    const { data, error } = await supabase.from('sidebar_sections').insert(payload).select();
    if (error) throw error;
    return data as SidebarSection[];
});

export const updateInfoCardsThunk = createAsyncThunk('content/updateInfoCards', async (cards: InfoCard[]) => {
    // Better delete logic: targeting every row via a numeric filter
    await supabase.from('info_cards').delete().neq('order_index', -999);
    if (cards.length === 0) return [];
    const validCards = cards.filter(c => c.title !== 'New Category' || c.links.length > 0 || c.imageUrl);
    const payload = validCards.map((c, index) => ({ title: c.title, icon_name: c.iconName, image_url: c.imageUrl, links: c.links, order_index: index }));
    if (payload.length === 0) return [];
    const { data, error } = await supabase.from('info_cards').insert(payload).select();
    if (error) throw error;
    return data.map((item: any) => ({ id: item.id, title: item.title, iconName: item.icon_name, imageUrl: item.image_url, links: item.links })) as InfoCard[];
});

export const updateHomeWidgetsThunk = createAsyncThunk('content/updateHomeWidgets', async (widgets: HomeWidgetConfig[]) => {
    await supabase.from('home_widgets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (widgets.length === 0) return [];
    const { data, error } = await supabase.from('home_widgets').insert(widgets).select();
    if (error) throw error;
    return data as HomeWidgetConfig[];
});

export const deleteNoticeThunk = createAsyncThunk('content/deleteNotice', async (id: string) => {
  await supabase.from('notices').delete().eq('id', id);
  return id;
});

export const deleteNewsThunk = createAsyncThunk('content/deleteNews', async (id: string) => {
  await supabase.from('news_items').delete().eq('id', id);
  return id;
});

export const deletePageThunk = createAsyncThunk('content/deletePage', async (id: string) => {
  await supabase.from('pages').delete().eq('id', id);
  return id;
});

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.menuItems = action.payload;
    },
    setInfoCards: (state, action: PayloadAction<InfoCard[]>) => {
      state.infoCards = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllContent.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllContent.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.isLoading = false;
      })
      .addCase(addNoticeThunk.fulfilled, (state, action) => { state.notices.unshift(action.payload); })
      .addCase(addNewsThunk.fulfilled, (state, action) => { state.news.unshift(action.payload); })
      .addCase(addPageThunk.fulfilled, (state, action) => { state.pages.unshift(action.payload); })
      .addCase(updatePageThunk.fulfilled, (state, action) => { state.pages = state.pages.map(p => p.id === action.payload.id ? action.payload : p); })
      .addCase(updateSidebarThunk.fulfilled, (state, action) => { state.sidebarSections = action.payload; })
      .addCase(updateInfoCardsThunk.fulfilled, (state, action) => { state.infoCards = action.payload; })
      .addCase(updateHomeWidgetsThunk.fulfilled, (state, action) => { state.homeWidgets = action.payload; })
      .addCase(deleteNoticeThunk.fulfilled, (state, action) => { state.notices = state.notices.filter(n => n.id !== action.payload); })
      .addCase(deleteNewsThunk.fulfilled, (state, action) => { state.news = state.news.filter(n => n.id !== action.payload); })
      .addCase(deletePageThunk.fulfilled, (state, action) => { state.pages = state.pages.filter(p => p.id !== action.payload); })
      .addCase(updateSettingsThunk.fulfilled, (state, action) => {
        if (action.payload.key === 'topBarConfig') state.topBarConfig = action.payload.value;
        if (action.payload.key === 'footerConfig') state.footerConfig = action.payload.value;
        if (action.payload.key === 'schoolInfo') state.schoolInfo = action.payload.value;
        if (action.payload.key === 'seoMeta') state.seoMeta = action.payload.value;
        if (action.payload.key === 'menuItems') state.menuItems = action.payload.value;
        if (action.payload.key === 'carouselItems') state.carouselItems = action.payload.value;
      });
  },
});

export const { setMenuItems, setInfoCards } = contentSlice.actions;
export default contentSlice.reducer;
