import React, { useState } from 'react';
import { ChevronRight, Phone, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { SidebarSection, SidebarLink, SidebarHotline } from '../types';

interface SidebarProps {
    sections: SidebarSection[];
    onNavigateChairman: () => void;
}

// Sub-components for cleaner rendering
const MessageSection: React.FC<{ data: any, onNavigate: () => void }> = ({ data, onNavigate }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden transition-colors">
        <div className="bg-emerald-800 dark:bg-emerald-900 text-white p-2 text-center font-bold text-sm uppercase tracking-wide">
           Chairman's Message
        </div>
        <div className="p-4 flex flex-col items-center text-center">
           <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-3 border-4 border-emerald-50 dark:border-gray-600">
               <img src={data.image || "https://via.placeholder.com/150"} alt={data.name} className="w-full h-full object-cover" />
           </div>
           <h4 className="font-bold text-emerald-900 dark:text-emerald-400 text-sm">{data.name}</h4>
           <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{data.designation}</p>
           <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 italic line-clamp-4">
               "{data.quote}"
           </p>
           <button onClick={onNavigate} className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Read More</button>
        </div>
    </div>
);

const ImageCardSection: React.FC<{ title: string, data: any }> = ({ title, data }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden transition-colors">
        <div className="bg-emerald-800 dark:bg-emerald-900 text-white py-2 px-4 font-bold text-sm">
           {title}
        </div>
        <div className="p-4 flex flex-col items-center bg-gray-50 dark:bg-gray-900">
           <div className="w-full overflow-hidden mb-2 bg-white dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
                <img 
                   src={data.image || "https://via.placeholder.com/300"} 
                   alt={data.name} 
                   className="w-full h-auto object-cover" 
                />
           </div>
           <p className="font-bold text-gray-900 dark:text-gray-200 text-sm text-center mt-1">{data.name}</p>
        </div>
    </div>
);

const AudioSection: React.FC<{ title: string, data: any }> = ({ title, data }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden transition-colors">
        <div className="bg-emerald-700 dark:bg-emerald-800 text-white p-2 font-bold text-sm">
           {title}
        </div>
        <div className="p-4 flex justify-center bg-[#f3f4f6] dark:bg-gray-900">
            <audio controls className="w-full h-10">
                <source src={data.audioUrl} type="audio/ogg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    </div>
);

const LinkListSection: React.FC<{ title: string, data: any }> = ({ title, data }) => {
    const [showAll, setShowAll] = useState(false);
    const links: SidebarLink[] = data.links || [];
    const displayedLinks = showAll ? links : links.slice(0, 5);
    const hasMore = links.length > 5;

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden transition-colors">
            <div className="bg-emerald-700 dark:bg-emerald-800 text-white p-2 font-bold text-sm">
                {title}
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {displayedLinks.map((link, idx) => (
                    <li key={idx} className="hover:bg-emerald-50 dark:hover:bg-gray-700/50 transition">
                        <a 
                            href={link.href} 
                            target={link.isExternal ? "_blank" : undefined}
                            rel={link.isExternal ? "noopener noreferrer" : undefined}
                            className="block p-3 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 font-medium"
                        >
                            <div className="flex items-center gap-2">
                                {link.isExternal && <ExternalLink size={12} className="text-emerald-500" />}
                                <span>{link.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {link.badge && (
                                    <span className="bg-red-500 text-white text-[10px] px-1.5 rounded">{link.badge}</span>
                                )}
                                <ChevronRight size={14} className="text-gray-400 dark:text-gray-500" />
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
            {hasMore && (
                <button 
                    onClick={() => setShowAll(!showAll)}
                    className="w-full py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-gray-50 dark:bg-gray-700/30 hover:bg-emerald-100 dark:hover:bg-gray-700 transition flex items-center justify-center gap-1 border-t border-gray-200 dark:border-gray-700"
                >
                    {showAll ? 'See Less' : 'See More'}
                    {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
            )}
        </div>
    );
}

const HotlineSection: React.FC<{ title: string, data: any }> = ({ title, data }) => {
    const hotlines: SidebarHotline[] = data.hotlines || [];
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden transition-colors">
            <div className="bg-emerald-700 dark:bg-emerald-800 text-white p-2 font-bold text-sm">
               {title}
            </div>
            <div className="p-3 bg-[#f0fdf4] dark:bg-gray-900/50 grid grid-cols-2 gap-3">
               {hotlines.map((hotline, idx) => (
                   <a href={`tel:${hotline.number}`} key={idx} className="flex flex-col items-center justify-center p-2 rounded-lg border border-emerald-100 dark:border-emerald-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow group text-center h-20">
                       <span className="text-[10px] leading-tight font-medium text-gray-600 dark:text-gray-300 mb-1">{hotline.title}</span>
                       <div className="flex items-center gap-1 font-bold text-lg text-emerald-700 dark:text-emerald-400">
                          <Phone size={14} className="fill-current" />
                          {hotline.number}
                       </div>
                   </a>
               ))}
            </div>
        </div>
    );
}

const Sidebar: React.FC<SidebarProps> = ({ sections, onNavigateChairman }) => {
  return (
    <div className="space-y-6">
      {sections.map((section) => {
          switch(section.type) {
              case 'message':
                  return <MessageSection key={section.id} data={section.data} onNavigate={onNavigateChairman} />;
              case 'image_card':
                  return <ImageCardSection key={section.id} title={section.title} data={section.data} />;
              case 'audio':
                  return <AudioSection key={section.id} title={section.title} data={section.data} />;
              case 'list':
                  return <LinkListSection key={section.id} title={section.title} data={section.data} />;
              case 'hotlines':
                  return <HotlineSection key={section.id} title={section.title} data={section.data} />;
              default:
                  return null;
          }
      })}
    </div>
  );
};

export default Sidebar;