
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

export interface SidebarLink {
  label: string;
  href: string;
  isExternal?: boolean;
  iconName?: string;
  badge?: string;
}

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
  iconName?: string;
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
  googleAnalyticsId?: string;
  ogImageUrl?: string;
  // Gemini AI Dynamic Config
  aiSystemInstruction?: string;
  aiModel?: string;
  aiWelcomeMessage?: string;
  // Subscription API Config
  websiteSubscriptionKey?: string;
}

export interface VisitorStats {
  today: number;
  yesterday: number;
  month: number;
  total: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export type HomeWidgetType = 'youtube' | 'map' | 'image' | 'video';

export interface HomeWidgetConfig {
  id: string;
  title: string;
  type: HomeWidgetType;
  url: string;
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
