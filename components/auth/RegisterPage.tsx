
import React, { useState } from 'react';
import { User, Lock, Mail, Phone, ArrowLeft, Building, AlertCircle, RefreshCw } from 'lucide-react';
import { User as UserType } from '../../types/index';
import { supabase } from '../../services/supabase';

interface RegisterPageProps { onBack: () => void; onLoginClick: () => void; onTermsClick: () => void; onPrivacyClick: () => void; onRegisterSuccess: (user: UserType) => void; }

const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onLoginClick, onTermsClick, onPrivacyClick, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({ name: '', role: 'Student', institute: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (f: string, v: string) => { setFormData(p => ({ ...p, [f]: v })); if(error) setError(''); }
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setError(''); setIsLoading(true);
      if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); setIsLoading(false); return; }
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({ email: formData.email, password: formData.password });
        if (authError) throw authError;
        if (authData.user) {
          localStorage.setItem('user_id', authData.user.id);
          localStorage.setItem('user_email', authData.user.email || '');
          if (authData.session) localStorage.setItem('access_token', authData.session.access_token);
          await supabase.from('profiles').insert({ id: authData.user.id, name: formData.name, role: formData.role, institute: formData.institute, mobile: formData.mobile, email: formData.email });
          onRegisterSuccess({ name: formData.name, email: formData.email, role: formData.role, institute: formData.institute, mobile: formData.mobile });
        }
      } catch (err: any) { setError(err.message || 'Error occurred.'); } finally { setIsLoading(false); }
  };
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 py-12 px-4">
      <div className="max-w-lg w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <button onClick={onBack} className="flex items-center text-sm text-gray-500 mb-4"><ArrowLeft size={16} /> Back</button>
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        {error && <div className="bg-red-50 p-3 rounded text-sm text-red-600 flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" required value={formData.name} onChange={e=>handleInputChange('name', e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" placeholder="Full Name" />
            <select value={formData.role} onChange={e=>handleInputChange('role', e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700"><option value="Student">Student</option><option value="Teacher">Teacher</option><option value="Admin">Admin</option></select>
          </div>
          <input type="email" required value={formData.email} onChange={e=>handleInputChange('email', e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" placeholder="Email" />
          <div className="grid grid-cols-2 gap-4">
            <input type="password" required value={formData.password} onChange={e=>handleInputChange('password', e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" placeholder="Password" />
            <input type="password" required value={formData.confirmPassword} onChange={e=>handleInputChange('confirmPassword', e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" placeholder="Confirm" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-2 bg-emerald-700 text-white rounded font-bold">{isLoading ? <RefreshCw className="animate-spin mx-auto" size={18} /> : 'Register'}</button>
          <p className="text-center text-xs">Already have an account? <button type="button" onClick={onLoginClick} className="text-emerald-700 font-bold">Sign in</button></p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
