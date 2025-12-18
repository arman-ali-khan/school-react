
import { MenuItem, Notice, CarouselItem, SidebarSection, InfoCard, Page, TopBarConfig, FooterConfig, HomeWidgetConfig, NewsItem } from './types';
import React from 'react';

export const MAIN_MENU: MenuItem[] = [
  { id: '1', label: 'Home', href: 'home' }
];

export const NOTICES: Notice[] = [];

export const NEWS_ITEMS: NewsItem[] = [];

export const CAROUSEL_ITEMS: CarouselItem[] = [];

export const SIDEBAR_SECTIONS: SidebarSection[] = [];

export const INFO_CARDS: InfoCard[] = [];

export const INITIAL_PAGES: Page[] = [];

export const DEFAULT_TOPBAR_CONFIG: TopBarConfig = {
    phone: "+880-531-65552",
    email: "dinajpurboard@gmail.com",
    showDateTime: true
};

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
    address: "Board of Intermediate and Secondary Education\nUpashahar, Dinajpur-5200, Bangladesh",
    phone: "+880-531-65552",
    email: "info@dinajpureducationboard.gov.bd",
    govtLinksTitle: "Important Govt. Links",
    govtLinks: [
        { label: "Ministry of Education", href: "https://moedu.gov.bd" },
        { label: "Directorate of Secondary and Higher Education", href: "http://www.dshe.gov.bd" }
    ],
    copyrightText: "© 2024 Board of Intermediate and Secondary Education, Dinajpur. All rights reserved."
};

export const DEFAULT_HOME_WIDGETS: HomeWidgetConfig[] = [];
