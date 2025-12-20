
import React from 'react';
import { Bell, X, ChevronRight, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Notification } from '../../types';

interface NotificationBannerProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onSeeAll: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ notifications, onMarkRead, onSeeAll }) => {
  const unread = notifications.filter(n => !n.is_read);
  if (unread.length === 0) return null;

  const latest = unread[0];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', icon: CheckCircle };
      case 'warning': return { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', icon: AlertTriangle };
      case 'error': return { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: AlertCircle };
      default: return { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', icon: Info };
    }
  };

  const { bg, text, icon: Icon } = getTypeStyles(latest.type);

  return (
    <div className={`border-b dark:border-gray-800 transition-all animate-in slide-in-from-top duration-500 ${bg}`}>
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm ${text}`}>
            <Bell size={14} className="animate-swing" />
          </div>
          <div className="flex items-center gap-2 truncate">
            <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${text} bg-white dark:bg-gray-800`}>
              Admin Alert
            </span>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">
              {latest.title}: <span className="font-medium opacity-80">{latest.message}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button 
            onClick={onSeeAll}
            className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1 hover:underline uppercase tracking-tighter"
          >
            See All ({unread.length}) <ChevronRight size={12} />
          </button>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
          <button 
            onClick={() => onMarkRead(latest.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes swing {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(10deg); }
          30% { transform: rotate(-10deg); }
          50% { transform: rotate(5deg); }
          70% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-swing {
          animation: swing 2s ease infinite;
          transform-origin: top center;
        }
      `}</style>
    </div>
  );
};

export default NotificationBanner;
