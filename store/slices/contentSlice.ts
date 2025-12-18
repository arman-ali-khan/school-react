
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import { Notice, Page, CarouselItem, SidebarSection, InfoCard, MenuItem, TopBarConfig, FooterConfig, HomeWidgetConfig, NewsItem } from '../../types';
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
    supabase.from('settings').select('value').eq('key', 'topBarConfig'),
    supabase.from('settings').select('value').eq('key', 'footerConfig')
  ]);

  const data: Partial<ContentState> = {};
  if (results[0].status === 'fulfilled' && results[0].value.data?.length) data.notices = results[0].value.data;
  if (results[1].status === 'fulfilled' && results[1].value.data?.length) data.news = results[1].value.data;
  if (results[2].status === 'fulfilled' && results[2].value.data?.length) data.pages = results[2].value.data;
  if (results[3].status === 'fulfilled' && results[3].value.data?.length) data.carouselItems = results[3].value.data;
  if (results[4].status === 'fulfilled' && results[4].value.data?.length) data.homeWidgets = results[4].value.data;
  if (results[5].status === 'fulfilled' && results[5].value.data?.length) data.sidebarSections = results[5].value.data;
  if (results[6].status === 'fulfilled' && results[6].value.data?.length) data.topBarConfig = results[6].value.data[0]?.value || DEFAULT_TOPBAR_CONFIG;
  if (results[7].status === 'fulfilled' && results[7].value.data?.length) data.footerConfig = results[7].value.data[0]?.value || DEFAULT_FOOTER_CONFIG;

  return data;
});

export const addNoticeThunk = createAsyncThunk('content/addNotice', async (notice: Notice, { rejectWithValue }) => {
  const { id, ...payload } = notice;
  const { data, error } = await supabase.from('notices').insert([payload]).select().single();
  if (error) return rejectWithValue(error.message);
  return data as Notice;
});

export const addNewsThunk = createAsyncThunk('content/addNews', async (newsItem: NewsItem, { rejectWithValue }) => {
  const { id, ...payload } = newsItem;
  const { data, error } = await supabase.from('news_items').insert([payload]).select().single();
  if (error) return rejectWithValue(error.message);
  return data as NewsItem;
});

export const addPageThunk = createAsyncThunk('content/addPage', async (page: Page, { rejectWithValue }) => {
  const { id, ...payload } = page;
  const { data, error } = await supabase.from('pages').insert([payload]).select().single();
  if (error) return rejectWithValue(error.message);
  return data as Page;
});

export const updatePageThunk = createAsyncThunk('content/updatePage', async (page: Page, { rejectWithValue }) => {
  const { id, created_at, ...payload } = page as any;
  const { data, error } = await supabase.from('pages').update(payload).eq('id', id).select().single();
  if (error) return rejectWithValue(error.message);
  return data as Page;
});

export const updateSidebarThunk = createAsyncThunk('content/updateSidebar', async (sections: SidebarSection[]) => {
    // To maintain synchronization, we delete existing and re-insert with correct order_index
    // Note: In production, a more granular update/reorder logic is preferred, but for 
    // widget management, full-sync is standard.
    const { error: deleteError } = await supabase.from('sidebar_sections').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) throw deleteError;

    const payload = sections.map((s, index) => ({
        title: s.title,
        type: s.type,
        data: s.data,
        order_index: index
    }));

    const { data, error: insertError } = await supabase.from('sidebar_sections').insert(payload).select();
    if (insertError) throw insertError;
    return data as SidebarSection[];
});

export const updateHomeWidgetsThunk = createAsyncThunk('content/updateHomeWidgets', async (widgets: HomeWidgetConfig[]) => {
    await supabase.from('home_widgets').delete().neq('id', '0');
    const { data, error } = await supabase.from('home_widgets').insert(widgets).select();
    if (error) throw error;
    return data as HomeWidgetConfig[];
});

export const deleteNoticeThunk = createAsyncThunk('content/deleteNotice', async (id: string) => {
  const { error } = await supabase.from('notices').delete().eq('id', id);
  if (error) throw error;
  return id;
});

export const deleteNewsThunk = createAsyncThunk('content/deleteNews', async (id: string) => {
  const { error } = await supabase.from('news_items').delete().eq('id', id);
  if (error) throw error;
  return id;
});

export const deletePageThunk = createAsyncThunk('content/deletePage', async (id: string) => {
  const { error } = await supabase.from('pages').delete().eq('id', id);
  if (error) throw error;
  return id;
});

export const updateSettingsThunk = createAsyncThunk('content/updateSettings', async ({ key, value }: { key: string, value: any }) => {
  const { error } = await supabase.from('settings').upsert({ key, value });
  if (error) throw error;
  return { key, value };
});
   
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => { state.menuItems = action.payload; },
    setInfoCards: (state, action: PayloadAction<InfoCard[]>) => { state.infoCards = action.payload; },
    setSidebarSections: (state, action: PayloadAction<SidebarSection[]>) => { state.sidebarSections = action.payload; },
    setHomeWidgets: (state, action: PayloadAction<HomeWidgetConfig[]>) => { state.homeWidgets = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllContent.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllContent.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.isLoading = false;
      })
      .addCase(fetchAllContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch content';
      })
      .addCase(addNoticeThunk.fulfilled, (state, action) => {
        state.notices.unshift(action.payload);
      })
      .addCase(addNewsThunk.fulfilled, (state, action) => {
        state.news.unshift(action.payload);
      })
      .addCase(addPageThunk.fulfilled, (state, action) => {
        state.pages.unshift(action.payload);
      })
      .addCase(updatePageThunk.fulfilled, (state, action) => {
        state.pages = state.pages.map(p => p.id === action.payload.id ? action.payload : p);
      })
      .addCase(updateSidebarThunk.fulfilled, (state, action) => {
        state.sidebarSections = action.payload;
      })
      .addCase(updateHomeWidgetsThunk.fulfilled, (state, action) => {
        state.homeWidgets = action.payload;
      })
      .addCase(deleteNoticeThunk.fulfilled, (state, action) => {
        state.notices = state.notices.filter(n => n.id !== action.payload);
      })
      .addCase(deleteNewsThunk.fulfilled, (state, action) => {
        state.news = state.news.filter(n => n.id !== action.payload);
      })
      .addCase(deletePageThunk.fulfilled, (state, action) => {
        state.pages = state.pages.filter(p => p.id !== action.payload);
      })
      .addCase(updateSettingsThunk.fulfilled, (state, action) => {
        if (action.payload.key === 'topBarConfig') state.topBarConfig = action.payload.value;
        if (action.payload.key === 'footerConfig') state.footerConfig = action.payload.value;
      });
  },
});

export const { setMenuItems, setInfoCards, setSidebarSections, setHomeWidgets } = contentSlice.actions;
export default contentSlice.reducer;
