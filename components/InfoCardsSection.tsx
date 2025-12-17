import React from 'react';
import { Play, UserCog, FileText, GraduationCap, Image } from 'lucide-react';
import { InfoCard } from '../types';

interface InfoCardProps {
  title: string;
  iconName: string;
  links: { text: string; href: string }[];
}

const InfoCardComponent: React.FC<InfoCardProps> = ({ title, iconName, links }) => {
    // Helper to render icon/image based on name
    const renderIcon = () => {
        if (iconName === 'image-jubilee') {
             return <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Golden_Jubilee_of_Bangladesh_Independence_Logo.svg/240px-Golden_Jubilee_of_Bangladesh_Independence_Logo.svg.png" 
                alt="Golden Jubilee" 
                className="w-full h-auto object-contain max-h-24 p-1 bg-white dark:bg-gray-200 rounded"
            />
        }
        
        const size = 40;
        let Icon = FileText;
        let colorClass = "text-gray-600";
        let bgClass = "bg-gray-50";
        let borderClass = "border-gray-200";

        if (iconName === 'UserCog') {
            Icon = UserCog;
            colorClass = "text-blue-600 dark:text-blue-400";
            bgClass = "bg-blue-50 dark:bg-blue-900/30";
            borderClass = "border-blue-100 dark:border-blue-800";
        } else if (iconName === 'FileText') {
            Icon = FileText;
            colorClass = "text-purple-600 dark:text-purple-400";
            bgClass = "bg-purple-50 dark:bg-purple-900/30";
            borderClass = "border-purple-100 dark:border-purple-800";
        } else if (iconName === 'GraduationCap') {
            Icon = GraduationCap;
            colorClass = "text-orange-600 dark:text-orange-400";
            bgClass = "bg-orange-50 dark:bg-orange-900/30";
            borderClass = "border-orange-100 dark:border-orange-800";
        } else {
            // Default generic
            Icon = Image;
        }

        return (
            <div className={`w-full max-w-[80px] aspect-square ${bgClass} rounded-lg flex items-center justify-center border-2 ${borderClass}`}>
                <Icon size={size} className={colorClass} />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden font-sans flex flex-col h-full hover:shadow-md transition-all duration-200">
            <div className="bg-[#f3f4f6] dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{title}</h3>
            </div>
            <div className="p-4 flex gap-4 items-start flex-grow">
            <div className="w-5/12 flex justify-center items-start pt-1">
                {renderIcon()}
            </div>
            <div className="w-7/12">
                <ul className="space-y-2">
                {links.map((item, idx) => (
                    <li key={idx}>
                    <a href={item.href} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors group leading-tight">
                        <Play size={10} className="text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400 group-hover:scale-110 transition-transform mt-0.5 flex-shrink-0" />
                        <span>{item.text}</span>
                    </a>
                    </li>
                ))}
                </ul>
            </div>
            </div>
        </div>
    );
};

interface InfoCardsSectionProps {
    cards: InfoCard[];
}

const InfoCardsSection: React.FC<InfoCardsSectionProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {cards.map((card) => (
        <InfoCardComponent 
          key={card.id}
          title={card.title}
          iconName={card.iconName}
          links={card.links}
        />
      ))}
    </div>
  );
};

export default InfoCardsSection;