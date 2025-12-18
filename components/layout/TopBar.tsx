
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, Mail, UserPlus, LogIn, Moon, Sun, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { User, TopBarConfig } from '../../types';

interface TopBarProps {
    onNavigate: (page: string) => void;
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
    <div className="bg-emerald-900 dark:bg-gray-950 text-emerald-50 dark:text-gray-400 text-xs py-2 px-4 border-b border-emerald-800 dark:border-gray-800 transition-colors">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          {config.showDateTime && (
            <>
                <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {currentTime.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {currentTime.toLocaleTimeString('en-US')}
                </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-r border-emerald-800 dark:border-gray-800 pr-4 hidden sm:flex">
            {config.phone && <a href={`tel:${config.phone}`} className="flex items-center gap-1 hover:text-white transition-colors"><Phone size={12} /> {config.phone}</a>}
            {config.email && <a href={`mailto:${config.email}`} className="flex items-center gap-1 hover:text-white transition-colors"><Mail size={12} /> {config.email}</a>}
          </div>
          
          <div className="flex gap-2 items-center">
             <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-emerald-800 dark:hover:bg-gray-800 transition-colors text-yellow-300 dark:text-gray-400">
                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
             </button>

             {user ? (
                 <div className="flex items-center gap-2">
                    {user.role === 'Admin' && (
                        <button onClick={() => onNavigate('admin-dashboard')} className="flex items-center gap-1 bg-emerald-800 dark:bg-gray-800 hover:bg-emerald-700 px-2 py-1 rounded text-[10px] font-bold text-yellow-300 border border-emerald-700 dark:border-gray-700 transition-all">
                            <LayoutDashboard size={10} /> DASHBOARD
                        </button>
                    )}
                    <span className="text-emerald-200 truncate max-w-[100px]">{user.name}</span>
                    <button onClick={onLogout} className="p-1.5 bg-red-900/50 hover:bg-red-800 rounded transition-colors text-white" title="Logout"><LogOut size={12} /></button>
                 </div>
             ) : (
                 <div className="flex gap-1">
                    <button onClick={() => onNavigate('login')} className="flex items-center gap-1 bg-emerald-800 dark:bg-gray-800 hover:bg-emerald-700 px-2 py-1 rounded transition-all">
                        <LogIn size={10} /> Login
                    </button>
                    <button onClick={() => onNavigate('register')} className="flex items-center gap-1 bg-white dark:bg-emerald-600 text-emerald-900 dark:text-white px-2 py-1 rounded font-bold hover:bg-gray-100 transition-all">
                        <UserPlus size={10} /> Register
                    </button>
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
