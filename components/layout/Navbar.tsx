
import React, { useState } from 'react';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { MenuItem } from '../../types';

interface NavbarProps {
    onSearch: (query: string) => void;
    menuItems: MenuItem[];
    onNavigate: (href: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, menuItems, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDropdown = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          onSearch(searchQuery);
      }
  };

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      setIsOpen(false);
      onNavigate(href);
  };

  return (
    <nav className="bg-emerald-700 dark:bg-gray-800 text-white shadow-md sticky top-0 z-40 border-t border-emerald-600 dark:border-gray-700 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12">
           <button 
             className="md:hidden p-2 hover:bg-emerald-600 dark:hover:bg-gray-700 rounded"
             onClick={() => setIsOpen(!isOpen)}
           >
             {isOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
           
           <ul className="hidden md:flex gap-1 h-full text-sm font-medium">
             {menuItems.map((item) => (
               <li key={item.id} className="relative group h-full">
                 <a 
                   href={item.href} 
                   onClick={(e) => handleLinkClick(e, item.href)}
                   className="h-full flex items-center px-4 hover:bg-emerald-800 dark:hover:bg-gray-700 transition-colors border-r border-emerald-600 dark:border-gray-700 last:border-0 cursor-pointer"
                 >
                   {item.label}
                   {item.children && <ChevronDown size={14} className="ml-1 opacity-70" />}
                 </a>
                 
                 {item.children && item.children.length > 0 && (
                   <div className="absolute left-0 top-full w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-xl border-t-2 border-emerald-500 hidden group-hover:block animate-fade-in !z-96">
                     <ul className="py-1">
                       {item.children.map((child) => (
                         <li key={child.id}>
                           <a 
                                href={child.href} 
                                onClick={(e) => handleLinkClick(e, child.href)}
                                className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-emerald-700 dark:hover:text-emerald-400 text-sm border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer"
                           >
                             {child.label}
                           </a>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
               </li>
             ))}
           </ul>

           <div className="hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative mb-0">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-3 pr-8 py-1 rounded text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 w-40 transition-all focus:w-56 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button type="submit" className="absolute right-2 top-1.5 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                    <Search className="w-4 h-4" />
                </button>
              </form>
           </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-emerald-800 dark:bg-gray-900 pb-4">
             <ul>
               {menuItems.map((item) => (
                 <li key={item.id} className="border-b border-emerald-700 dark:border-gray-700">
                    <div className="flex justify-between items-center pr-4">
                        <a 
                            href={item.href} 
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className="block px-4 py-3 hover:bg-emerald-700 dark:hover:bg-gray-800 w-full"
                        >
                            {item.label}
                        </a>
                        {item.children && item.children.length > 0 && (
                            <button onClick={() => toggleDropdown(item.label)} className="p-2">
                                <ChevronDown size={16} className={`transform transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                            </button>
                        )}
                    </div>
                    {item.children && activeDropdown === item.label && (
                        <ul className="bg-emerald-900 dark:bg-gray-950">
                            {item.children.map((child) => (
                                <li key={child.id}>
                                    <a 
                                        href={child.href} 
                                        onClick={(e) => handleLinkClick(e, child.href)}
                                        className="block px-8 py-2 text-sm hover:bg-emerald-800 dark:hover:bg-gray-800 text-emerald-100 dark:text-gray-300"
                                    >
                                        {child.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                 </li>
               ))}
               <li className="p-4">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 rounded text-sm text-gray-800 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none"
                        />
                         <button type="submit" className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">
                            <Search className="w-4 h-4" />
                        </button>
                    </form>
               </li>
             </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
