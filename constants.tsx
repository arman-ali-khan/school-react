import { MenuItem, Notice, QuickLink, CarouselItem, SidebarSection, InfoCard, Page, TopBarConfig, FooterConfig, HomeWidgetConfig } from './types';
import { FileText, Award, BookOpen, Globe, Layout, Users } from 'lucide-react';
import React from 'react';

export const MAIN_MENU: MenuItem[] = [
  { id: '1', label: 'Home', href: 'home' },
  { id: '2', label: 'About Us', href: '#', children: [{ id: '2-1', label: 'History', href: '#' }, { id: '2-2', label: 'Mission & Vision', href: '#' }, { id: '2-3', label: 'Organogram', href: '#' }] },
  { id: '3', label: 'Administration', href: '#', children: [{ id: '3-1', label: 'Chairman', href: 'chairman' }, { id: '3-2', label: 'Officers', href: '#' }, { id: '3-3', label: 'Staff', href: '#' }] },
  { id: '4', label: 'Institute', href: '#', children: [{ id: '4-1', label: 'School List', href: '#' }, { id: '4-2', label: 'College List', href: '#' }] },
  { id: '5', label: 'Results', href: '#', children: [{ id: '5-1', label: 'SSC Result', href: '#' }, { id: '5-2', label: 'HSC Result', href: '#' }, { id: '5-3', label: 'JSC Result', href: '#' }] },
  { id: '6', label: 'Archive', href: '#' },
  { id: '7', label: 'Contact', href: '#' },
];

export const NOTICES: Notice[] = [
  { id: '1', title: 'HSC Examination 2024 Routine (Revised)', date: '2024-05-10', type: 'exam', link: '#' },
  { id: '2', title: 'Urgent Notice regarding Form Fill-up for SSC 2025', date: '2024-05-08', type: 'student', link: '#' },
  { id: '3', title: 'Monthly Pay Order (MPO) Notice for May 2024', date: '2024-05-05', type: 'college', link: '#' },
  { id: '4', title: 'Application for Name Correction (JSC/SSC)', date: '2024-05-01', type: 'general', link: '#' },
  { id: '5', title: 'Result Re-scrutiny Instructions for HSC 2023', date: '2024-04-28', type: 'exam', link: '#' },
  { id: '6', title: 'Holiday List 2024 for all affiliated institutions', date: '2024-01-15', type: 'general', link: '#' },
  { id: '7', title: 'Registration Card Distribution Schedule Class IX', date: '2024-05-11', type: 'student', link: '#' },
  { id: '8', title: 'Meeting regarding SSC 2024 Center Management', date: '2024-05-12', type: 'college', link: '#' },
  { id: '9', title: 'Distribution of Academic Transcript SSC 2023', date: '2024-05-13', type: 'student', link: '#' },
  { id: '10', title: 'e-SIF Registration Guidelines for 2024-25 Session', date: '2024-05-14', type: 'college', link: '#' },
];

export const NEWS_ITEMS = [
  "নাম ও বয়স সংশোধন ফি বর্ধিতকরণ ও অনলাইন আবেদন দাখিল (২০২৫-১০-১৫)",
  "২০২৪ সালের এইচএসসি পরীক্ষার ফল পুনঃনিরীক্ষণ নোটিশ",
  "ই-ফাইলিং সংক্রান্ত জরুরি বিজ্ঞপ্তি (২০২৪-০৯-২০)",
  "বোর্ড চ্যালেঞ্জ এর ফলাফল প্রকাশ সংক্রান্ত বিজ্ঞপ্তি",
  "জুনিয়র স্কুল সার্টিফিকেট (JSC) পরীক্ষার সনদ বিতরণ প্রসঙ্গে",
  "২০২৪ সালের এসএসসি পরীক্ষার কেন্দ্র তালিকা প্রকাশ",
  "বোর্ড বৃত্তি সংক্রান্ত জরুরি বিজ্ঞপ্তি",
  "প্রধান পরীক্ষকদের নিয়ে মতবিনিময় সভা সংক্রান্ত",
];

export const CAROUSEL_ITEMS: CarouselItem[] = [
  { id: '1', image: 'https://picsum.photos/800/400?random=1', caption: "Main Administrative Building of Dinajpur Education Board" },
  { id: '2', image: 'https://picsum.photos/800/400?random=2', caption: "Annual Sports Day Celebration 2024" },
  { id: '3', image: 'https://picsum.photos/800/400?random=3', caption: "HSC Result Publication Ceremony with Honorable Chairman" }
];

export const SIDEBAR_SECTIONS: SidebarSection[] = [
    {
        id: '1',
        type: 'message',
        title: "Chairman's Message",
        data: {
            name: "Prof. Md. Kamrul Islam",
            designation: "Chairman, BISE Dinajpur",
            image: "https://picsum.photos/200/200?random=10",
            quote: "We are committed to ensuring quality education and transparent examination systems for all students in the Rangpur division."
        }
    },
    {
        id: '2',
        type: 'image_card',
        title: "চেয়ারম্যান মহোদয়",
        data: {
            name: "প্রফেসর মোঃ তৌহিদুল ইসলাম",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        }
    },
    {
        id: '3',
        type: 'audio',
        title: "জাতীয় সঙ্গীত",
        data: {
            audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/National_anthem_of_Bangladesh_%28vocal%29.ogg"
        }
    },
    {
        id: '4',
        type: 'list',
        title: "Internal e-Services",
        data: {
            links: [
                { label: 'Online Name Correction', href: '#' },
                { label: 'e-SIF (Registration)', href: '#' },
                { label: 'e-FF (Form Fill-up)', href: '#' },
                { label: 'Institution Panel Login', href: '#', badge: 'New' },
                { label: 'Online Sonali Seba', href: '#' },
                { label: 'One Stop Service', href: '#' },
                { label: 'Center Management System', href: '#' },
                { label: 'Result Archive', href: '#' },
            ]
        }
    },
    {
        id: '5',
        type: 'list',
        title: "Important Links",
        data: {
            links: [
                { label: 'Ministry of Education', href: 'https://moedu.gov.bd', isExternal: true },
                { label: 'DSHE', href: 'http://www.dshe.gov.bd', isExternal: true },
                { label: 'Banbeis', href: 'http://www.banbeis.gov.bd', isExternal: true },
                { label: 'Education Board Results', href: '#', isExternal: true },
            ]
        }
    },
    {
        id: '6',
        type: 'hotlines',
        title: "জরুরি হটলাইন",
        data: {
            hotlines: [
                { number: '৩৩৩', title: 'সরকারি তথ্য' },
                { number: '৯৯৯', title: 'জাতীয় জরুরি সেবা' },
                { number: '১০৯', title: 'নারী ও শিশু নির্যাতন' },
            ]
        }
    }
];

export const INFO_CARDS: InfoCard[] = [
    {
        id: '1',
        title: 'স্বাধীনতার সুবর্ণজয়ন্তী',
        iconName: 'image-jubilee',
        links: [
            { text: 'আদেশ/নোটিশ', href: '#' },
            { text: 'কার্যক্রম', href: '#' },
            { text: 'ছবি গ্যালারি', href: '#' },
            { text: 'ভিডিও', href: '#' }
        ]
    },
    {
        id: '2',
        title: 'Board Service',
        iconName: 'UserCog',
        links: [
            { text: 'Online Application', href: '#' },
            { text: 'Application Status', href: '#' },
            { text: 'Document Verification', href: '#' },
            { text: 'Result Archive', href: '#' }
        ]
    },
    {
        id: '3',
        title: 'Student Corner',
        iconName: 'GraduationCap',
        links: [
            { text: 'SSC 2024 Info', href: '#' },
            { text: 'HSC 2024 Info', href: '#' },
            { text: 'Registration Card', href: '#' },
            { text: 'Admit Card', href: '#' }
        ]
    },
    {
        id: '4',
        title: 'Download Corner',
        iconName: 'FileText',
        links: [
            { text: 'Forms', href: '#' },
            { text: 'Notifications', href: '#' },
            { text: 'Academic Calendar', href: '#' },
            { text: 'Syllabus', href: '#' }
        ]
    }
];

export const INITIAL_PAGES: Page[] = [
    {
        id: '1',
        title: 'About Us',
        slug: 'about-us',
        date: '2024-05-15',
        content: `
            <p class="lead">The Board of Intermediate and Secondary Education, Dinajpur was established to oversee and manage the educational standards of the Rangpur division.</p>
            <h3>Our Mission</h3>
            <p>To provide quality education management, ensure fair examinations, and foster an environment of academic excellence.</p>
            <h3>Our History</h3>
            <p>Founded in 2006, the board has been instrumental in modernizing the education system in the northern region of Bangladesh.</p>
        `
    }
];

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
        { label: "Directorate of Secondary and Higher Education", href: "http://www.dshe.gov.bd" },
        { label: "National Portal", href: "https://bangladesh.gov.bd" },
        { label: "BANBEIS", href: "http://www.banbeis.gov.bd" }
    ],
    copyrightText: "© 2024 Board of Intermediate and Secondary Education, Dinajpur. All rights reserved."
};

export const DEFAULT_HOME_WIDGETS: HomeWidgetConfig[] = [
    {
        id: '1',
        title: "শিক্ষক-কর্মচারী এবং ছাত্র-ছাত্রীদের জন্য বিশেষ অনুদান",
        type: 'youtube',
        url: "https://www.youtube.com/embed/zQDAi8tI-cU"
    },
    {
        id: '2',
        title: "Google Map",
        type: 'map',
        url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.606772795287!2d88.63496331502102!3d25.617937983702166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fb529d18776b3f%3A0x62953046f5627686!2sBoard%20of%20Intermediate%20and%20Secondary%20Education%2C%20Dinajpur!5e0!3m2!1sen!2sbd!4v1684000000000!5m2!1sen!2sbd"
    }
];