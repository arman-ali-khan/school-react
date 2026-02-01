
import React, { useState, useMemo } from 'react';
import { 
  Trash2, Edit, Save, RefreshCw, Plus, Search, 
  ChevronDown, GraduationCap, Users, CheckCircle, 
  XCircle, Star, TrendingUp, AlertCircle
} from 'lucide-react';
import { Result } from '../../types';

interface AdminResultsProps {
  results: Result[];
  onAdd: (r: Result) => Promise<any>;
  onUpdate: (r: Result) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  generateUUID: () => string;
}

const AdminResults: React.FC<AdminResultsProps> = ({ results, onAdd, onUpdate, onDelete, generateUUID }) => {
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [rollNo, setRollNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [examType, setExamType] = useState<Result['exam_type']>('SSC');
  const [gpa, setGpa] = useState<string>('');
  const [grade, setGrade] = useState<string>('A+');
  const [status, setStatus] = useState<Result['status']>('Pass');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Years options (Current to 2010)
  const years = useMemo(() => Array.from({ length: 16 }, (_, i) => new Date().getFullYear() - i), []);

  // Filtered Results by Year and Search
  const filteredResults = useMemo(() => {
    return results.filter(r => 
      r.exam_year === selectedYear && 
      (r.roll_no.includes(searchTerm) || r.student_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [results, selectedYear, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const yearResults = results.filter(r => r.exam_year === selectedYear);
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
  }, [results, selectedYear]);

  const resetForm = () => {
    setEditingResult(null);
    setRollNo('');
    setStudentName('');
    setGpa('');
    setGrade('A+');
    setStatus('Pass');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNo.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const data: Result = {
        id: editingResult?.id || generateUUID(),
        roll_no: rollNo,
        student_name: studentName,
        exam_type: examType,
        exam_year: selectedYear,
        gpa: parseFloat(gpa),
        grade,
        status
      };

      if (editingResult) await onUpdate(data);
      else await onAdd(data);
      resetForm();
    } finally {
      setIsProcessing(false);
    }
  };

  const startEditing = (r: Result) => {
    setEditingResult(r);
    setRollNo(r.roll_no);
    setStudentName(r.student_name);
    setExamType(r.exam_type);
    setGpa(r.gpa.toString());
    setGrade(r.grade);
    setStatus(r.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Year & Summary Header */}
      <div className="bg-emerald-800 text-white p-6 rounded-3xl shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Results Analytics</h2>
            <p className="text-emerald-100 text-sm opacity-80 uppercase font-bold tracking-widest mt-1">Management Workspace</p>
          </div>
          <div className="flex items-center gap-4 bg-white/10 p-1.5 rounded-2xl border border-white/10">
             <span className="text-xs font-bold px-3 uppercase tracking-tighter">Academic Year:</span>
             <select 
              value={selectedYear} 
              onChange={e=>setSelectedYear(parseInt(e.target.value))}
              className="bg-emerald-900 border-none rounded-xl text-sm font-black px-6 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
             >
               {years.map(y => <option key={y} value={y}>{y}</option>)}
             </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
           {[
             { label: 'Attended', value: stats.attend, icon: Users, color: 'bg-white/10' },
             { label: 'Passed', value: stats.pass, icon: CheckCircle, color: 'bg-emerald-400/20' },
             { label: 'Failed', value: stats.fail, icon: XCircle, color: 'bg-red-400/20' },
             { label: 'GPA 5.00', value: stats.gpa5, icon: Star, color: 'bg-yellow-400/20' },
             { label: 'Pass Rate', value: `${stats.passRate}%`, icon: TrendingUp, color: 'bg-white/10' },
             { label: 'GPA Rate', value: `${stats.gpaRate}%`, icon: GraduationCap, color: 'bg-white/10' },
           ].map((stat, i) => (
             <div key={i} className={`${stat.color} p-4 rounded-2xl border border-white/5 backdrop-blur-sm group hover:scale-105 transition-transform cursor-default`}>
                <stat.icon size={16} className="mb-2 opacity-60" />
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 truncate">{stat.label}</p>
                <h4 className="text-xl font-black mt-0.5">{stat.value}</h4>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 transition-all shadow-lg ${editingResult ? 'border-emerald-500 ring-4 ring-emerald-500/5' : 'border-gray-100 dark:border-gray-700'}`}>
             <h3 className="font-black text-gray-800 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2 mb-6">
               {editingResult ? <Edit size={16} /> : <Plus size={16} />}
               {editingResult ? 'Correction Mode' : 'Add Individual Result'}
             </h3>

             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase">Roll Number</label>
                   <input 
                    type="text" value={rollNo} onChange={e=>setRollNo(e.target.value)} required 
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm font-bold dark:text-white" 
                    placeholder="Enter Roll" 
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase">Student Name</label>
                   <input 
                    type="text" value={studentName} onChange={e=>setStudentName(e.target.value)} required 
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm font-bold dark:text-white" 
                    placeholder="Student Full Name" 
                   />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase">Exam Type</label>
                      <select value={examType} onChange={e=>setExamType(e.target.value as any)} className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm font-bold dark:text-white">
                        <option value="JSC">JSC</option>
                        <option value="SSC">SSC</option>
                        <option value="HSC">HSC</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase">Status</label>
                      <select value={status} onChange={e=>setStatus(e.target.value as any)} className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm font-bold dark:text-white">
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                      </select>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase">GPA (e.g. 5.00)</label>
                      <input 
                        type="number" step="0.01" max="5" value={gpa} onChange={e=>setGpa(e.target.value)} required 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm font-bold dark:text-white" 
                        placeholder="0.00" 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase">Grade</label>
                      <select value={grade} onChange={e=>setGrade(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm font-bold dark:text-white">
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                      </select>
                   </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                   <button 
                    type="submit" disabled={isProcessing}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
                   >
                     {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                     {editingResult ? 'Update Result' : 'Publish Result'}
                   </button>
                   {editingResult && (
                     <button 
                      type="button" onClick={resetForm}
                      className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest"
                     >
                       Cancel
                     </button>
                   )}
                </div>
             </form>
          </div>
        </div>

        {/* Directory List */}
        <div className="lg:col-span-8">
           <div className="bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Published Registry ({filteredResults.length})</h4>
                 <div className="relative w-full sm:w-72">
                    <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                      placeholder="Search Roll or Student Name..."
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                 </div>
              </div>

              <div className="flex-grow overflow-y-auto divide-y dark:divide-gray-700">
                 {filteredResults.map(r => {
                   const isDeleting = deletingId === r.id;
                   return (
                     <div key={r.id} className="p-4 flex items-center justify-between hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 group transition-all">
                        <div className="flex items-center gap-6 min-w-0">
                           <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center shrink-0 border border-gray-200 dark:border-gray-600">
                              <span className="text-[8px] font-black text-gray-400 uppercase leading-none">ROLL</span>
                              <span className="text-sm font-black dark:text-white leading-tight">{r.roll_no}</span>
                           </div>
                           <div className="min-w-0">
                              <p className="font-black text-sm dark:text-white truncate">{r.student_name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                 <span className="text-[9px] font-black bg-white dark:bg-gray-900 border dark:border-gray-700 px-2 py-0.5 rounded-full uppercase text-gray-500">{r.exam_type}</span>
                                 <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${r.status === 'Pass' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                                    {r.status}
                                 </span>
                                 <span className="text-xs font-black text-emerald-600">GPA: {Number(r.gpa).toFixed(2)} ({r.grade})</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => startEditing(r)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"><Edit size={16}/></button>
                           <button 
                            onClick={async () => {
                              if (window.confirm('Delete this record?')) {
                                setDeletingId(r.id);
                                await onDelete(r.id);
                                setDeletingId(null);
                              }
                            }} 
                            disabled={isDeleting}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                           >
                             {isDeleting ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16}/>}
                           </button>
                        </div>
                     </div>
                   );
                 })}
                 {filteredResults.length === 0 && (
                   <div className="p-20 text-center text-gray-400 italic flex flex-col items-center gap-3">
                      <AlertCircle size={40} className="opacity-20" />
                      <p>No results found for {selectedYear} matching your criteria.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResults;
