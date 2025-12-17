
import React from 'react';

export interface Notice {
  id: string;
  title: string;
  date: string;
  type: 'general' | 'student' | 'college' | 'exam';
  link: string;
  content?: string; // HTML content for rich text
  file_url?: string; // Cloudinary or external PDF/Image URL
}

export interface MenuItem {
  id: string;
  label: string;
  href: string; // Internal pages use 'page:[id]'
  children?: MenuItem[];
}

export interface QuickLink {
  title: string;
  url: string;
  icon?: React.ReactNode; // For UI rendering
  iconName?: string; // For storage
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
  password?: string; // Stored in local storage for demo purposes
  institute?: string;
  mobile?: string;
}

// CMS Types

export interface Page {
    id: string;
    title: string;
    content: string; // Simple HTML/Text
    slug: string;
    date: string;
}

export interface CarouselItem {
    id: string;
    image: string;
    caption: string;
}

// --- Dynamic Sidebar Types ---

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
        // Message Type
        name?: string;
        designation?: string;
        quote?: string;
        image?: string; // Used in Message and Image Card
        
        // Audio Type
        audioUrl?: string;
        
        // List Type
        links?: SidebarLink[];
        
        // Hotline Type
        hotlines?: SidebarHotline[];
    };
}

// --- Header & Footer Types ---

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

// --- Home Widgets Types ---

export type HomeWidgetType = 'youtube' | 'map' | 'image' | 'video';

export interface HomeWidgetConfig {
    id: string;
    title: string;
    type: HomeWidgetType;
    url: string; // Embed URL, Image Source, or Video Source
}

// -----------------------------

export interface InfoCardLink {
    text: string;
    href: string;
}

export interface InfoCard {
    id: string;
    title: string;
    iconName: string; // 'Play', 'UserCog', 'FileText', 'GraduationCap'
    links: InfoCardLink[];
}
