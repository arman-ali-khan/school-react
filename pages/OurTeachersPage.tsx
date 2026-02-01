
import React from 'react';
import { ArrowLeft, User as UserIcon, Phone, MapPin, GraduationCap, Calendar, BookOpen } from 'lucide-react';
import { Teacher } from '../types';

interface OurTeachersPageProps {
  teachers: Teacher[];
  onBack: () => void;
}

const OurTeachersPage: React.FC<OurTeachersPageProps> = ({ teachers, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mb-8 overflow-hidden relative">
        <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
          <GraduationCap size={240} className="text-emerald-900" />
        </div>
        
        <button onClick={onBack} className="flex items-center text-sm font-black text-emerald-700 dark:text-emerald-400 hover:underline uppercase tracking-widest mb-6">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </button>

        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Our Honorable Faculty</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium max-w-2xl">
          Meet the dedicated educators of Board of Intermediate and Secondary Education, Dinajpur. 
          Our faculty is committed to academic excellence and student development.
        </p>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teachers.map((t) => (
          <div key={t.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden bg-gray-50 dark:bg-gray-900">
              {t.photo_url ? (
                <img 
                  src={t.photo_url} 
                  alt={t.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                   <UserIcon size={80} strokeWidth={1} />
                </div>
              )}
              
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                 <div className="text-xs font-black text-white/80 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <BookOpen size={12} className="text-emerald-400" />
                    {t.subject}
                 </div>
                 <h3 className="text-white font-black text-xl leading-tight group-hover:text-emerald-400 transition-colors">{t.name}</h3>
              </div>
            </div>

            {/* Details Area */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full uppercase tracking-wider">
                  {t.position}
                </span>
                {t.birthday && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                    <Calendar size={12} />
                   Joined: {new Date(t.birthday).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{t.address}</p>
                </div>
                
                <a 
                  href={`tel:${t.phone}`} 
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-transparent hover:border-emerald-200 dark:hover:border-emerald-900 transition-all group/phone"
                >
                  <Phone size={16} className="text-emerald-600 group-hover/phone:animate-bounce" />
                  <span className="text-sm font-black text-gray-800 dark:text-gray-200">{t.phone}</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teachers.length === 0 && (
        <div className="text-center py-32 bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700">
           <UserIcon size={48} className="mx-auto text-gray-200 mb-4" />
           <p className="text-gray-400 font-bold uppercase tracking-widest">Faculty records are being synchronized...</p>
        </div>
      )}
    </div>
  );
};

export default OurTeachersPage;
