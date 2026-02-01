
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, GraduationCap, Calendar, CheckCircle2, 
  XCircle, User as UserIcon, BookOpen, Star, LayoutGrid, 
  List, TrendingUp, Users, CheckCircle, Award
} from 'lucide-react';
import { Result } from '../types';

interface ResultsPageProps {
  results: Result[];
  onBack: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ results, onBack }) => {
  const [activeMainTab, setActiveMainTab] = useState<'lookup' | 'archive'>('lookup');
  const [roll, setRoll] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [archiveSearch, setArchiveSearch] = useState('');
  const [searchedResult, setSearchedResult] = useState<Result | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const years = useMemo(() => Array.from({ length: 16 }, (_, i) => new Date().getFullYear() - i), []);

  // Archive Statistics calculation
  const archiveStats = useMemo(() => {
    const yearResults = results.filter(r => r.exam_year === year);
    const attend = yearResults.length;
    const pass = yearResults.filter(r => r.status === 'Pass').length;
    const fail = yearResults.filter(r => r.status === 'Fail').length;
    const gpa5 = yearResults.filter(r => Number(r.gpa) === 5.0).length;
    
    return {
      attend,
      pass,
      fail,
      gpa5,
      passRate: attend > 0 ? ((pass / attend) * 100).toFixed(2) : '0',
      gpaRate: attend > 0 ? ((gpa5 / attend) * 100).toFixed(2) : '0'
    };
  }, [results, year]);

  const filteredArchive = useMemo(() => {
    return results.filter(r => 
      r.exam_year === year && 
      (r.roll_no.includes(archiveSearch) || r.student_name.toLowerCase().includes(archiveSearch.toLowerCase()))
    );
  }, [results, year, archiveSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roll.trim()) return;

    const found = results.find(r => r.roll_no === roll && r.exam_year === year);
    setSearchedResult(found || null);
    setHasSearched(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mb-8 overflow-hidden relative">
        <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
          <GraduationCap size={240} className="text-emerald-900" />
        </div>
        <button onClick={onBack} className="flex items-center text-sm font-black text-emerald-700 dark:text-emerald-400 hover:underline uppercase tracking-widest mb-6">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Results Archive</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium max-w-2xl">
              Official digital verified results portal for JSC, SSC, and HSC examinations from the Board of Intermediate and Secondary Education, Dinajpur.
            </p>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl border dark:border-gray-700 shrink-0">
             <button 
              onClick={() => setActiveMainTab('lookup')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMainTab === 'lookup' ? 'bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
             >
               <Search size={14} /> Individual Lookup
             </button>
             <button 
              onClick={() => setActiveMainTab('archive')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMainTab === 'archive' ? 'bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
             >
               <LayoutGrid size={14} /> All Results
             </button>
          </div>
        </div>
      </div>

      {activeMainTab === 'lookup' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-4">
            <div className="bg-emerald-800 text-white p-8 rounded-[40px] shadow-2xl shadow-emerald-900/20 sticky top-24">
               <div className="flex items-center gap-3 mb-8">
                  <Search size={24} className="text-emerald-400" />
                  <h2 className="text-xl font-black uppercase tracking-tight">Verified Lookup</h2>
               </div>

               <form onSubmit={handleSearch} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase opacity-60 px-2 tracking-widest">Examination Year</label>
                     <select 
                      value={year} onChange={e=>setYear(parseInt(e.target.value))}
                      className="w-full bg-emerald-900 border-none rounded-2xl p-4 text-sm font-black outline-none focus:ring-2 focus:ring-emerald-400 transition-all appearance-none"
                     >
                       {years.map(y => <option key={y} value={y}>{y}</option>)}
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase opacity-60 px-2 tracking-widest">Student Roll Number</label>
                     <input 
                      type="text" value={roll} onChange={e=>setRoll(e.target.value)} required
                      placeholder="e.g. 102458"
                      className="w-full bg-emerald-900 border-none rounded-2xl p-4 text-sm font-black outline-none focus:ring-2 focus:ring-emerald-400 transition-all placeholder:text-white/20"
                     />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 bg-white text-emerald-800 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-emerald-50 active:scale-95 shadow-xl shadow-black/10"
                  >
                    Retrieve Results
                  </button>
               </form>

               <div className="mt-8 pt-8 border-t border-white/10 text-[10px] leading-relaxed opacity-60 font-bold uppercase tracking-widest">
                 Note: Online results are for information only. For official certificates, please visit the board headquarters.
               </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8">
             {!hasSearched ? (
                <div className="bg-white dark:bg-gray-800 h-full min-h-[500px] rounded-[40px] border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center p-12 text-center">
                   <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-200 mb-6">
                      <Search size={48} />
                   </div>
                   <h3 className="text-2xl font-black text-gray-400 tracking-tight uppercase">Ready for Lookup</h3>
                   <p className="text-gray-400 mt-2 font-medium">Enter roll number and year to fetch verified academic records.</p>
                </div>
             ) : searchedResult ? (
                <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
                   <div className="bg-emerald-50 dark:bg-emerald-900/30 p-12 border-b dark:border-gray-700 flex flex-col md:flex-row items-center gap-8">
                      <div className="w-24 h-24 bg-emerald-700 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-700/20">
                         <UserIcon size={48} strokeWidth={1.5} />
                      </div>
                      <div className="text-center md:text-left">
                         <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-2">{searchedResult.student_name}</h2>
                         <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <span className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{searchedResult.exam_type}</span>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-tighter flex items-center gap-1">
                               <Calendar size={12} /> SESSION: {searchedResult.exam_year}
                            </span>
                         </div>
                      </div>
                      <div className="md:ml-auto text-center">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">GPA Status</p>
                         <div className="text-5xl font-black text-emerald-600 tracking-tighter">{Number(searchedResult.gpa).toFixed(2)}</div>
                      </div>
                   </div>

                   <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-emerald-600"><BookOpen size={20}/></div>
                            <div>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Roll Number</p>
                               <p className="text-lg font-black text-gray-800 dark:text-white">{searchedResult.roll_no}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-emerald-600"><Star size={20}/></div>
                            <div>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Academic Grade</p>
                               <p className="text-lg font-black text-gray-800 dark:text-white">{searchedResult.grade}</p>
                            </div>
                         </div>
                      </div>
                      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                         {searchedResult.status === 'Pass' ? (
                            <>
                               <CheckCircle2 size={48} className="text-emerald-500 mb-3" />
                               <h4 className="text-xl font-black text-emerald-600 uppercase tracking-widest">SUCCESSFUL</h4>
                               <p className="text-xs text-gray-400 font-bold mt-1">VERIFIED PASS</p>
                            </>
                         ) : (
                            <>
                               <XCircle size={48} className="text-red-500 mb-3" />
                               <h4 className="text-xl font-black text-red-600 uppercase tracking-widest">FAILED</h4>
                               <p className="text-xs text-gray-400 font-bold mt-1">UNSUCCESSFUL</p>
                            </>
                         )}
                      </div>
                   </div>
                   
                   <div className="bg-gray-50 dark:bg-gray-900/50 px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">BOARD OF DINJPUR • OFFICIAL VERIFICATION SYSTEM</p>
                      <button onClick={() => window.print()} className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 hover:underline uppercase tracking-widest">Print Result Slip</button>
                   </div>
                </div>
             ) : (
                <div className="bg-red-50 dark:bg-red-900/10 border-2 border-dashed border-red-200 dark:border-red-900/30 rounded-[40px] p-20 text-center flex flex-col items-center animate-in shake duration-500">
                   <XCircle size={64} className="text-red-400 mb-4" />
                   <h3 className="text-2xl font-black text-red-500 uppercase tracking-tight">No Record Found</h3>
                   <p className="text-red-400 mt-2 font-medium max-w-xs mx-auto">Roll <span className="font-black">#{roll}</span> for year <span className="font-black">{year}</span> was not found in our verified database.</p>
                   <button onClick={() => setHasSearched(false)} className="mt-8 text-xs font-black text-red-600 uppercase tracking-widest hover:underline">Refine Search</button>
                </div>
             )}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Stats Dashboard */}
          <div className="bg-emerald-800 text-white p-10 rounded-[40px] shadow-2xl shadow-emerald-900/20">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8 border-b border-white/10 pb-8 mb-8">
               <div>
                  <h2 className="text-3xl font-black tracking-tight">Academic Year Performance</h2>
                  <p className="text-emerald-100/60 uppercase font-bold text-xs tracking-widest mt-1">Live Board Statistics • Range: Rangpur Division</p>
               </div>
               <div className="flex items-center gap-4 bg-black/20 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
                 <Calendar className="ml-3 text-emerald-400" size={18} />
                 <select 
                    value={year} onChange={e=>setYear(parseInt(e.target.value))}
                    className="bg-transparent border-none rounded-xl text-lg font-black px-6 py-2 outline-none focus:ring-0 appearance-none"
                 >
                   {years.map(y => <option key={y} value={y} className="text-emerald-900">{y}</option>)}
                 </select>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { label: 'Attended', value: archiveStats.attend, icon: Users, color: 'bg-white/10' },
                { label: 'Passed', value: archiveStats.pass, icon: CheckCircle, color: 'bg-emerald-400/20' },
                { label: 'Failed', value: archiveStats.fail, icon: XCircle, color: 'bg-red-400/20' },
                { label: 'GPA 5.00', value: archiveStats.gpa5, icon: Star, color: 'bg-yellow-400/20' },
                { label: 'Pass Rate', value: `${archiveStats.passRate}%`, icon: TrendingUp, color: 'bg-blue-400/20' },
                { label: 'GPA Rate', value: `${archiveStats.gpaRate}%`, icon: Award, color: 'bg-purple-400/20' },
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} p-6 rounded-3xl border border-white/5 backdrop-blur-md group hover:scale-105 transition-all cursor-default text-center`}>
                   <stat.icon size={20} className="mx-auto mb-3 opacity-60" />
                   <p className="text-[10px] uppercase font-black tracking-widest opacity-60 truncate mb-1">{stat.label}</p>
                   <h4 className="text-2xl font-black">{stat.value}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-8 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col sm:flex-row justify-between items-center gap-6">
               <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                 <List className="text-emerald-600" /> Public Registry Archive
               </h3>
               <div className="relative w-full sm:w-96">
                  <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  <input 
                    type="text" value={archiveSearch} onChange={e=>setArchiveSearch(e.target.value)}
                    placeholder="Search by Roll Number or Student Name..."
                    className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all"
                  />
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border-b dark:border-gray-700">
                    <th className="px-8 py-5">Roll No</th>
                    <th className="px-8 py-5">Student Name</th>
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5">GPA</th>
                    <th className="px-8 py-5">Grade</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {filteredArchive.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors group">
                      <td className="px-8 py-6">
                        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-xl text-sm font-black text-gray-800 dark:text-white group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          {r.roll_no}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-bold text-gray-700 dark:text-gray-300">{r.student_name}</td>
                      <td className="px-8 py-6 text-xs font-black text-gray-400 uppercase">{r.exam_type}</td>
                      <td className="px-8 py-6 font-black text-emerald-600 text-lg">{Number(r.gpa).toFixed(2)}</td>
                      <td className="px-8 py-6 font-black text-gray-400">{r.grade}</td>
                      <td className="px-8 py-6">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'Pass' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                           {r.status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredArchive.length === 0 && (
                <div className="py-32 text-center text-gray-400 italic flex flex-col items-center gap-4">
                   <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center opacity-30"><Search size={32} /></div>
                   <p className="font-bold uppercase tracking-widest text-xs">No records matching criteria for {year}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
