
import React from 'react';
import { 
  Play, UserCog, FileText, GraduationCap, Image,
  Book, BookOpen, School, Library, Pencil, Pen, Eraser, 
  Ruler, Calculator, FlaskConical, Atom, Globe, Languages, Music, Palette, 
  Microscope, Dna, Binary, Code, Cpu, Laptop, Tablets, Award, Medal, 
  Trophy, Star, Users, User, UserCheck, History, Landmark, Navigation, 
  Compass, Clock, Calendar, CheckCircle, AlertCircle, Info, HelpCircle, File, 
  Speaker, Search, Map as MapIcon, Archive, Video
} from 'lucide-react';
import { InfoCard } from '../../types';

// Map all possible icon strings to their Lucide components
const IconMapper: Record<string, React.FC<any>> = {
  GraduationCap, Book, BookOpen, School, Library, Pencil, Pen, Eraser, Ruler, Calculator,
  FlaskConical, Atom, Globe, Languages, Music, Palette, Microscope, Dna, Binary, Code,
  Cpu, Laptop, Tablets, Award, Medal, Trophy, Star, Users, User, UserCheck,
  History, Landmark, MapIcon, Navigation, Compass, Clock, Calendar, CheckCircle, AlertCircle, Info,
  HelpCircle, Mail: FileText, Phone: Speaker, Archive, FileText, File, Video, Play, Headphones: Speaker, Speaker, Search, UserCog
};

interface InfoCardProps {
  title: string;
  iconName: string;
  imageUrl?: string;
  links: { text: string; href: string }[];
}

const InfoCardComponent: React.FC<InfoCardProps> = ({ title, iconName, imageUrl, links }) => {
    const renderIcon = () => {
        // PRIORITY 1: CUSTOM IMAGE UPLOAD
        if (imageUrl) {
            return (
              <div className="w-full h-24 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 overflow-hidden flex items-center justify-center p-1 shadow-sm">
                <img 
                  src={imageUrl} 
                  alt={title} 
                  className="w-full h-full object-contain"
                />
              </div>
            );
        }

        // PRIORITY 2: SPECIAL JUBILEE LOGO
        if (iconName === 'image-jubilee') {
             return (
              <div className="w-full h-24 bg-white dark:bg-gray-100 rounded-lg flex items-center justify-center p-1 shadow-sm border border-gray-100">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Golden_Jubilee_of_Bangladesh_Independence_Logo.svg/240px-Golden_Jubilee_of_Bangladesh_Independence_Logo.svg.png" 
                  alt="Golden Jubilee" 
                  className="w-full h-full object-contain"
                />
              </div>
            );
        }
        
        // PRIORITY 3: SELECTED ICON
        const IconComponent = IconMapper[iconName] || FileText;
        
        // Define color schemes based on common icon types
        let colorClasses = "text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800";
        if (['UserCog', 'Users', 'User'].includes(iconName)) colorClasses = "text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800";
        if (['GraduationCap', 'School', 'Book'].includes(iconName)) colorClasses = "text-orange-600 bg-orange-50 border-orange-100 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800";
        if (['Award', 'Medal', 'Trophy'].includes(iconName)) colorClasses = "text-yellow-600 bg-yellow-50 border-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800";

        return (
            <div className={`w-20 h-20 aspect-square rounded-2xl flex items-center justify-center border-2 shadow-sm transition-transform group-hover:scale-105 ${colorClasses}`}>
                <IconComponent size={40} strokeWidth={1.5} />
            </div>
        );
    }

    const resolveHref = (href: string) => {
      if (href.startsWith('page:')) {
        return `#page-viewer?slug=${href.split(':')[1]}`;
      }
      return href;
    }

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden font-sans flex flex-col h-full hover:shadow-md transition-all duration-300 group">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3.5 border-b border-gray-200 dark:border-gray-600">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm tracking-tight">{title}</h3>
            </div>
            <div className="p-5 flex gap-5 items-start flex-grow">
              <div className="w-5/12 flex justify-center items-start">
                  {renderIcon()}
              </div>
              <div className="w-7/12">
                  <ul className="space-y-2.5">
                  {links.map((item, idx) => (
                      <li key={idx}>
                      <a 
                        href={resolveHref(item.href)} 
                        className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors group/link leading-tight"
                      >
                          <Play size={10} className="text-emerald-600 dark:text-emerald-500 fill-emerald-600 dark:fill-emerald-500 group-hover/link:scale-125 transition-transform mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{item.text}</span>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card) => (
        <InfoCardComponent 
          key={card.id}
          title={card.title}
          iconName={card.iconName}
          imageUrl={card.imageUrl}
          links={card.links}
        />
      ))}
    </div>
  );
};

export default InfoCardsSection;
