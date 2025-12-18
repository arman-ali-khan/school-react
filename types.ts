
import React from 'react';

export interface Notice {
  id: string;
  title: string;
  date: string;
  type: 'general' | 'student' | 'college' | 'exam';
  link: string;
  content?: string;
  file_url?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  thumbnail_url?: string;
  date: string;
}

export type UserRole = 'Admin' | 'Student' | 'Teacher' | 'Guardian';

export interface User {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
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

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface CarouselItem {
  id: string;
  image: string;
  caption: string;
}

// Added SidebarLink interface for navigation items in sidebar
export interface SidebarLink {
  label: string;
  href: string;
  isExternal?: boolean;
  iconName?: string;
  badge?: string;
}

// Added SidebarHotline interface for contact items in sidebar
export interface SidebarHotline {
  title: string;
  number: string;
}

export type SidebarSectionType = 
  | 'message' 
  | 'image_card' 
  | 'audio' 
  | 'list' 
  | 'hotlines' 
  | 'map' 
  | 'video' 
  | 'image_only'
  | 'countdown'
  | 'datetime'
  | 'notice';

export interface SidebarSection {
  id: string;
  type: SidebarSectionType;
  title: string;
  data: any; 
}

export interface TopBarConfig {
  phone: string;
  email: string;
  showDateTime: boolean;
}

export interface FooterConfig {
  address: string;
  phone: string;
  email: string;
  govtLinksTitle: string;
  govtLinks: { label: string; href: string }[];
  copyrightText: string;
}

export interface SchoolInfo {
  name: string;
  title: string;
  logoUrl: string;
  address: string;
  hotline: string;
  eiin: string;
  code: string;
}

export interface SEOMeta {
  title: string;
  description: string;
  keywords: string;
  author: string;
}

export type HomeWidgetType = 'youtube' | 'map' | 'image' | 'video' | 'html';

export interface HomeWidgetConfig {
  id: string;
  title: string;
  type: HomeWidgetType;
  url: string;
  content?: string;
}

export interface InfoCard {
  id: string;
  title: string;
  iconName: string;
  imageUrl?: string;
  links: { text: string; href: string }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
