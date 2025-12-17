import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, Mail, UserPlus, LogIn, Moon, Sun, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { User, TopBarConfig } from '../types';

interface TopBarProps {
    onNavigate: (page: 'home' | 'login' | 'register' | 'admin-dashboard') => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
    user: User | null;
    onLogout: () => void;
    config: TopBarConfig;
}

const TopBar: React.FC<TopBarProps> = ({ onNavigate, isDarkMode, toggleTheme, user, onLogout, config }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-emerald-900 dark:bg-gray-900 text-emerald-50 dark:text-gray-300 text-xs py-2 px-4 border-b border-emerald-800 dark:border-gray-800 transition-colors">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          {config.showDateTime && (
            <>
                <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {currentTime.toLocaleTimeString('en-US')}
                </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {config.phone && (
              <a href={`tel:${config.phone}`} className="flex items-center gap-1 hover:text-white hidden sm:flex">
                <Phone size={12} /> {config.phone}
              </a>
          )}
          {config.email && (
              <a href={`mailto:${config.email}`} className="flex items-center gap-1 hover:text-white hidden sm:flex">
                <Mail size={12} /> {config.email}
              </a>
          )}
          
          <div className="flex gap-2 ml-2 items-center">
             <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full hover:bg-emerald-800 dark:hover:bg-gray-700 transition-colors text-yellow-300 dark:text-gray-300"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
             </button>

             {user ? (
                 <div className="flex items-center gap-2">
                    {/* Admin Link - Only if role is Admin */}
                    {user.role === 'Admin' && (
                        <button 
                            onClick={() => onNavigate('admin-dashboard')}
                            className="flex items-center gap-1 bg-emerald-800 dark:bg-gray-800 hover:bg-emerald-700 dark:hover:bg-gray-700 px-2 py-1 rounded text-xs transition border border-emerald-700 dark:border-gray-600 font-bold text-yellow-300"
                        >
                            <LayoutDashboard size={10} /> Dashboard
                        </button>
                    )}
                    
                    <div className="flex items-center gap-1 text-emerald-200 px-2">
                         <UserIcon size={10} /> {user.name}
                    </div>
                    
                    <button 
                        onClick={onLogout}
                        className="flex items-center gap-1 bg-red-800/80 hover:bg-red-700 px-2 py-1 rounded text-xs transition"
                        title="Logout"
                    >
                        <LogOut size={10} />
                    </button>
                 </div>
             ) : (
                 <>
                    <button 
                        onClick={() => onNavigate('login')}
                        className="flex items-center gap-1 bg-emerald-800 dark:bg-gray-800 hover:bg-emerald-700 dark:hover:bg-gray-700 px-2 py-1 rounded text-xs transition border border-emerald-700 dark:border-gray-600"
                    >
                        <LogIn size={10} /> Login
                    </button>
                    <button 
                        onClick={() => onNavigate('register')}
                        className="flex items-center gap-1 bg-white dark:bg-gray-700 text-emerald-900 dark:text-white px-2 py-1 rounded text-xs font-bold transition border border-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                        <UserPlus size={10} /> Register
                    </button>
                 </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;