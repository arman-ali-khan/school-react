
import React from 'react';
import { Bell, ArrowLeft, CheckCircle, Trash2, Calendar, Info, AlertTriangle, AlertCircle, MailOpen } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsPageProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onBack: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onMarkRead, onBack }) => {
  
  const getIcon = (type: string, isRead: boolean) => {
    const size = 20;
    const colorClass = isRead ? 'text-gray-400' : '';
    
    switch (type) {
      case 'success': return <CheckCircle size={size} className={`${colorClass || 'text-emerald-500'}`} />;
      case 'warning': return <AlertTriangle size={size} className={`${colorClass || 'text-orange-500'}`} />;
      case 'error': return <AlertCircle size={size} className={`${colorClass || 'text-red-500'}`} />;
      default: return <Info size={size} className={`${colorClass || 'text-blue-500'}`} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[60vh] flex flex-col transition-colors overflow-hidden">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 border-b border-emerald-100 dark:border-gray-700">
        <button onClick={onBack} className="flex items-center text-sm text-emerald-700 dark:text-emerald-400 font-bold mb-4 hover:underline">
          <ArrowLeft size={16} className="mr-1" /> Back to Portal
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-emerald-900 dark:text-white flex items-center gap-3">
              <Bell className="text-emerald-600" />
              System Notifications
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Management and audit log of portal activities.</p>
          </div>
          <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-xl border dark:border-gray-600 text-xs font-bold text-gray-500">
            {notifications.filter(n => !n.is_read).length} UNREAD
          </div>
        </div>
      </div>

      <div className="flex-grow p-4 md:p-8">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row gap-4 sm:items-center justify-between ${
                  n.is_read 
                    ? 'bg-gray-50/50 dark:bg-gray-900/20 border-gray-100 dark:border-gray-700 grayscale-[0.5]' 
                    : 'bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-800 shadow-sm ring-1 ring-emerald-500/5'
                }`}
              >
                <div className="flex gap-4 items-start flex-1">
                  <div className={`p-3 rounded-2xl ${n.is_read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-emerald-50 dark:bg-emerald-900/30 shadow-inner'}`}>
                    {getIcon(n.type, n.is_read)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-black text-sm uppercase tracking-tight ${n.is_read ? 'text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                        {n.title}
                      </h3>
                      {!n.is_read && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                    </div>
                    <p className={`text-sm mt-1 leading-relaxed ${n.is_read ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(n.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Bell size={12} /> {n.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {!n.is_read && (
                    <button 
                      onClick={() => onMarkRead(n.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all shadow-md shadow-emerald-900/10"
                    >
                      <MailOpen size={14} /> Mark as Read
                    </button>
                  )}
                  {n.link && (
                    <a 
                      href={n.link}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                      View Link
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-full mb-4">
              <Bell size={48} className="opacity-20" />
            </div>
            <p className="text-lg font-bold uppercase tracking-widest">No notifications</p>
            <p className="text-sm mt-1">Your inbox is clear for now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
