
import React from 'react';

export interface Notice {
  id: string;
  title: string;
  date: string;
  type: 'general' | 'student' | 'college' | 'exam';
  link: string;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface User {
  name: string;
  email: string;
  role: string;
  institute?: string;
  mobile?: string;
}

export interface Page {
    id: string;
    title: string;
    content: string;
    slug: string;
    date: string;
}

export interface CarouselItem {
    id: string;
    image: string;
    caption: string;
}

export type SidebarSectionType = 'message' | 'image_card' | 'audio' | 'list' | 'hotlines';

export interface SidebarLink {
    label: string;
    href: string;
    badge?: string;
    isExternal?: boolean;
}

export interface SidebarHotline {
    number: string;
    title: string;
}

export interface SidebarSection {
    id: string;
    type: SidebarSectionType;
    title: string;
    data: {
        name?: string;
        designation?: string;
        quote?: string;
        image?: string;
        audioUrl?: string;
        links?: SidebarLink[];
        hotlines?: SidebarHotline[];
    };
}

export interface TopBarConfig {
    phone: string;
    email: string;
    showDateTime: boolean;
}

export interface FooterLink {
    label: string;
    href: string;
}

export interface FooterConfig {
    address: string;
    phone: string;
    email: string;
    govtLinksTitle: string;
    govtLinks: FooterLink[];
    copyrightText: string;
}

export type HomeWidgetType = 'youtube' | 'map' | 'image' | 'video';

export interface HomeWidgetConfig {
    id: string;
    title: string;
    type: HomeWidgetType;
    url: string;
}

export interface InfoCardLink {
    text: string;
    href: string;
}

export interface InfoCard {
    id: string;
    title: string;
    iconName: string;
    links: InfoCardLink[];
}
