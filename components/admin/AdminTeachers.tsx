
import React, { useState, useRef } from 'react';
import { 
  Trash2, Edit, Save, RefreshCw, Plus, Upload, X, 
  User as UserIcon, Phone, MapPin, BookOpen, Calendar, 
  CheckCircle2, AlertCircle, Search
} from 'lucide-react';
import { Teacher } from '../../types';

interface AdminTeachersProps {
  teachers: Teacher[];
  onAdd: (t: Teacher) => Promise<any>;
  onUpdate: (t: Teacher) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  generateUUID: () => string;
}

const CLOUDINARY_UPLOAD_PRESET = "school"; 
const CLOUDINARY_CLOUD_NAME = "dgituybrt";

const AdminTeachers: React.FC<AdminTeachersProps> = ({ teachers, onAdd, onUpdate, onDelete, generateUUID }) => {
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState<Teacher['position']>('Assistant Teacher');
  const [subject, setSubject] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const resetForm = () => {
    setEditingTeacher(null);
    setName('');
    setPosition('Assistant Teacher');
    setSubject('');
    setPhone('');
    setAddress('');
    setBirthday('');
    setPhotoUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setPhotoUrl(data.secure_url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      alert('Photo upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const teacherData: Teacher = {
        id: editingTeacher?.id || generateUUID(),
        name,
        position,
        subject,
        phone,
        address,
        birthday,
        photo_url: photoUrl || undefined,
      };

      if (editingTeacher) {
        await onUpdate(teacherData);
      } else {
        await onAdd(teacherData);
      }
      resetForm();
    } finally { 
      setIsProcessing(false); 
    }
  };

  const startEditing = (t: Teacher) => {
    setEditingTeacher(t);
    setName(t.name);
    setPosition(t.position);
    setSubject(t.subject);
    setPhone(t.phone);
    setAddress(t.address);
    setBirthday(t.birthday);
    setPhotoUrl(t.photo_url || '');
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this teacher profile?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500" ref={formRef}>
      {/* Profile Editor */}
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 transition-all shadow-xl ${editingTeacher ? 'border-emerald-500 ring-4 ring-emerald-500/5' : 'border-gray-100 dark:border-gray-700'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-black flex items-center gap-2 uppercase tracking-widest text-sm ${editingTeacher ? 'text-emerald-600' : 'text-gray-800 dark:text-emerald-400'}`}>
            {editingTeacher ? <Edit size={18}/> : <Plus size={18}/>} 
            {editingTeacher ? 'Update Teacher Profile' : 'Add New Teacher'} <p className="lowercase text-blue-400">Page URL: /our-faculty</p>
          </h3>
          {editingTeacher && (
            <button onClick={resetForm} className="text-[10px] font-black text-red-500 uppercase flex items-center gap-1 hover:underline">
              <X size={12}/> Discard Changes
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo Upload Area */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Profile Photo</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`h-52 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${photoUrl ? 'border-emerald-500' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400'}`}
              >
                {isUploading ? (
                  <RefreshCw className="animate-spin text-emerald-500" />
                ) : photoUrl ? (
                  <div className="w-full h-full group">
                    <img src={photoUrl} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Upload className="text-white" size={24} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <UserIcon className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Upload Profile Image</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" />
              </div>
            </div>

            {/* Basic Info */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                <div className="relative">
                  <UserIcon size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full pl-9 p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Dr. John Doe" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Designation</label>
                <select value={position} onChange={e=>setPosition(e.target.value as any)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold dark:text-white">
                  <option value="Head Teacher">Head Teacher</option>
                  <option value="Assistant Teacher">Assistant Teacher</option>
                  <option value="Junior Teacher">Junior Teacher</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Primary Subject</label>
                <div className="relative">
                  <BookOpen size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" value={subject} onChange={e=>setSubject(e.target.value)} required className="w-full pl-9 p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Mathematics" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} required className="w-full pl-9 p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" placeholder="017XXXXXXXX" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Date of Join</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input type="date" value={birthday} onChange={e=>setBirthday(e.target.value)} className="w-full pl-9 p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Contact Address</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" value={address} onChange={e=>setAddress(e.target.value)} className="w-full pl-9 p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" placeholder="Village, City" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t dark:border-gray-700">
            <button 
              type="submit" 
              disabled={isProcessing || isUploading} 
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/10 disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : editingTeacher ? <Save size={16} /> : <CheckCircle2 size={16} />}
              {isProcessing ? 'Saving...' : editingTeacher ? 'Update Profile' : 'Confirm & Add'}
            </button>
          </div>
        </form>
      </div>

      {/* Teachers Directory List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50">
          <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Added Teachers ({teachers.length})</h4>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search faculty..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="divide-y dark:divide-gray-700 max-h-[500px] overflow-y-auto">
          {filteredTeachers.map(t => {
            const isDeleting = deletingId === t.id;
            return (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden border dark:border-gray-600 shrink-0">
                    {t.photo_url ? <img src={t.photo_url} className="w-full h-full object-cover" alt="" /> : <UserIcon size={20} className="m-auto mt-3 text-gray-300" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-sm dark:text-white truncate">{t.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-black bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full uppercase">{t.position}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t.subject}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEditing(t)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(t.id)} disabled={isDeleting} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    {isDeleting ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16}/>}
                  </button>
                </div>
              </div>
            );
          })}
          {filteredTeachers.length === 0 && (
            <div className="p-20 text-center text-gray-400 italic text-sm">No faculty members found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTeachers;
