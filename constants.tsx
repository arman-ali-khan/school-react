
import { MenuItem, Notice, CarouselItem, SidebarSection, InfoCard, Page, TopBarConfig, FooterConfig, HomeWidgetConfig, NewsItem } from './types';
import React from 'react';

export const MAIN_MENU: MenuItem[] = [
  { id: '1', label: 'Home', href: 'home' },
  { id: '2', label: 'About Us', href: '#', children: [{ id: '2-1', label: 'History', href: 'page:about-us' }, { id: '2-2', label: 'Mission & Vision', href: '#' }, { id: '2-3', label: 'Organogram', href: '#' }] },
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
];

export const NEWS_ITEMS: NewsItem[] = [
  { id: 'n1', title: "নাম ও বয়স সংশোধন ফি বর্ধিতকরণ (২০২৫)", date: '2024-05-15', content: "ফি বর্ধিতকরণ সংক্রান্ত বিস্তারিত তথ্য..." },
  { id: 'n2', title: "২০২৪ সালের এইচএসসি পরীক্ষার ফল পুনঃনিরীক্ষণ", date: '2024-05-14', content: "ফলাফল পুনঃনিরীক্ষণ পদ্ধতি..." },
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
        type: 'list',
        title: "Internal e-Services",
        data: {
            links: [
                { label: 'Online Name Correction', href: '#', iconName: 'Edit' },
                { label: 'e-SIF (Registration)', href: '#', iconName: 'UserPlus' },
                { label: 'e-FF (Form Fill-up)', href: '#', iconName: 'FileText' },
                { label: 'Result Archive', href: '#', iconName: 'Archive' },
                { label: 'Webmail Account', href: '#', isExternal: true, iconName: 'Mail' },
            ]
        }
    },
    {
        id: '3',
        type: 'image_card',
        title: "Important Document",
        data: {
            image: "https://picsum.photos/400/300?random=20",
            name: "Board Meeting Minutes"
        }
    },
    {
        id: '4',
        type: 'image_only',
        title: "Logo Only",
        data: {
            image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Board_of_Intermediate_and_Secondary_Education%2C_Dinajpur_Logo.svg/220px-Board_of_Intermediate_and_Secondary_Education%2C_Dinajpur_Logo.svg.png"
        }
    },
    {
        id: '5',
        type: 'video',
        title: "Intro Video",
        data: {
            url: "https://www.youtube.com/embed/zQDAi8tI-cU"
        }
    },
    {
        id: '6',
        type: 'map',
        title: "Find Us",
        data: {
            url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14392.296538356165!2d88.6331948!3d25.6015569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fb5290a7895083%3A0x6a0c007133346914!2sEducation%20Board%2C%20Dinajpur!5e0!3m2!1sen!2sbd!4v1715800000000!5m2!1sen!2sbd"
        }
    },
    {
        id: '7',
        type: 'hotlines',
        title: "Help & Support",
        data: {
            hotlines: [
                { title: 'Information Desk', number: '16221' },
                { title: 'SSC Help', number: '01712-345678' }
            ]
        }
    },
    {
        id: '8',
        type: 'audio',
        title: "National Anthem",
        data: {
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
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
        title: 'শিক্ষক-কর্মচারী কর্নার',
        iconName: 'UserCog',
        links: [
            { text: 'এমপিও নোটিশ', href: '#' },
            { text: 'পদোন্নতি তালিকা', href: '#' },
            { text: 'পেনশন ফরম', href: '#' }
        ]
    }
];

export const INITIAL_PAGES: Page[] = [
    {
        id: '1',
        title: 'About Us',
        slug: 'about-us',
        date: '2024-05-15',
        content: `<h3>Our History</h3><p>The Board of Intermediate and Secondary Education, Dinajpur was established to oversee and manage the educational standards of the Rangpur division. It ensures fair examinations and quality assessment processes for millions of students across northern Bangladesh.</p>`
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
        { label: "Directorate of Secondary and Higher Education", href: "http://www.dshe.gov.bd" }
    ],
    copyrightText: "© 2024 Board of Intermediate and Secondary Education, Dinajpur. All rights reserved."
};

export const DEFAULT_HOME_WIDGETS: HomeWidgetConfig[] = [
    {
        id: '1',
        title: "ভিডিও বার্তা (Video Message)",
        type: 'youtube',
        url: "https://www.youtube.com/embed/zQDAi8tI-cU"
    },
    {
        id: '2',
        title: "অবস্থান মানচিত্র (Map)",
        type: 'map',
        url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14392.296538356165!2d88.6331948!3d25.6015569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fb5290a7895083%3A0x6a0c007133346914!2sEducation%20Board%2C%20Dinajpur!5e0!3m2!1sen!2sbd!4v1715800000000!5m2!1sen!2sbd"
    }
];
