
import React, { useState, useRef } from 'react';
import { 
  Trash2, Edit, Save, RefreshCw, Plus, Upload, X, 
  User as UserIcon, Phone, MapPin, Briefcase, Calendar, 
  CheckCircle2, Search, Building
} from 'lucide-react';
import { Employee } from '../../types';

interface AdminEmployeesProps {
  employees: Employee[];
  onAdd: (e: Employee) => Promise<any>;
  onUpdate: (e: Employee) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  generateUUID: () => string;
}

const CLOUDINARY_UPLOAD_PRESET = "school"; 
const CLOUDINARY_CLOUD_NAME = "dgituybrt";

const AdminEmployees: React.FC<AdminEmployeesProps> = ({ employees, onAdd, onUpdate, onDelete, generateUUID }) => {
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
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
    setEditingEmployee(null);
    setName('');
    setPosition('');
    setDepartment('');
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
      const empData: Employee = {
        id: editingEmployee?.id || generateUUID(),
        name,
        position,
        department,
        phone,
        address,
        birthday,
        photo_url: photoUrl || undefined,
      };

      if (editingEmployee) {
        await onUpdate(empData);
      } else {
        await onAdd(empData);
      }
      resetForm();
    } finally { 
      setIsProcessing(false); 
    }
  };

  const startEditing = (emp: Employee) => {
    setEditingEmployee(emp);
    setName(emp.name);
    setPosition(emp.position);
    setDepartment(emp.department);
    setPhone(emp.phone);
    setAddress(emp.address);
    setBirthday(emp.birthday);
    setPhotoUrl(emp.photo_url || '');
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this employee record?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500" ref={formRef}>
      {/* Editor Card */}
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 transition-all shadow-xl ${editingEmployee ? 'border-emerald-500 ring-4 ring-emerald-500/5' : 'border-gray-100 dark:border-gray-700'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-black flex items-center gap-2 uppercase tracking-widest text-sm ${editingEmployee ? 'text-emerald-600' : 'text-gray-800 dark:text-emerald-400'}`}>
            {editingEmployee ? <Edit size={18}/> : <Plus size={18}/>} 
            {editingEmployee ? 'Update Employee Record' : 'Register New Employee'}
          </h3>
          {editingEmployee && (
            <button onClick={resetForm} className="text-[10px] font-black text-red-500 uppercase flex items-center gap-1 hover:underline">
              <X size={12}/> Discard Changes
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo Section */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Photo</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`h-52 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${photoUrl ? 'border-emerald-500' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400'}`}
              >
                {isUploading ? (
                  <RefreshCw className="animate-spin text-emerald-500" />
                ) : photoUrl ? (
                  <img src={photoUrl} className="w-full h-full object-cover" alt="Employee" />
                ) : (
                  <div className="text-center p-4">
                    <UserIcon className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Upload Staff Image</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" />
              </div>
            </div>

            {/* Info Grid */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Robert Smith" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Designation</label>
                <div className="relative">
                  <Briefcase size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" value={position} onChange={e=>setPosition(e.target.value)} required className="w-full pl-9 p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Senior Accountant" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Department</label>
                <div className="relative">
                  <Building size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" value={department} onChange={e=>setDepartment(e.target.value)} required className="w-full pl-9 p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Accounts Section" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
                <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} required className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" placeholder="01XXXXXXXXX" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Join Date / Birthday</label>
                <input type="date" value={birthday} onChange={e=>setBirthday(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Address</label>
                <input type="text" value={address} onChange={e=>setAddress(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t dark:border-gray-700">
            <button 
              type="submit" 
              disabled={isProcessing || isUploading} 
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
              {editingEmployee ? 'Update' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>

      {/* Directory List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Admin Staff ({employees.length})</h4>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input type="text" placeholder="Search staff..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 outline-none" />
          </div>
        </div>

        <div className="divide-y dark:divide-gray-700 max-h-[400px] overflow-y-auto">
          {filteredEmployees.map(e => {
            const isDeleting = deletingId === e.id;
            return (
              <div key={e.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                    {e.photo_url ? <img src={e.photo_url} className="w-full h-full object-cover" /> : <UserIcon size={20} className="m-auto mt-2 text-gray-300" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-sm dark:text-white truncate">{e.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{e.position} • {e.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEditing(e)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(e.id)} disabled={isDeleting} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    {isDeleting ? <RefreshCw className="animate-spin" size={16} /> : <Trash2 size={16}/>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminEmployees;
