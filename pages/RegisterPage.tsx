
import React, { useState } from 'react';
import { User, Lock, Mail, Phone, ArrowLeft, Building, AlertCircle, RefreshCw } from 'lucide-react';
import { User as UserType, UserRole } from '../types';
import { supabase } from '../services/supabase';

interface RegisterPageProps {
    onBack: () => void;
    onLoginClick: () => void;
    onTermsClick: () => void;
    onPrivacyClick: () => void;
    onRegisterSuccess: (user: UserType) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onLoginClick, onTermsClick, onPrivacyClick, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
      name: '',
      role: 'Student' as UserRole,
      institute: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);

      if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setIsLoading(false);
          return;
      }

      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              name: formData.name,
              role: formData.role,
              institute: formData.institute,
              mobile: formData.mobile,
              email: formData.email
            });

          if (profileError) throw profileError;

          const newUser: UserType = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            institute: formData.institute,
            mobile: formData.mobile
          };

          onRegisterSuccess(newUser);
        }
      } catch (err: any) {
        setError(err.message || 'Registration failed.');
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 transition-colors">
      <div className="max-w-lg w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border dark:border-gray-700">
        <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-emerald-700 mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
        <div className="text-center">
            <h2 className="text-2xl font-bold dark:text-white">Create Account</h2>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="text-xs font-bold dark:text-gray-300">Full Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded" />
             </div>
             <div>
                <label className="text-xs font-bold dark:text-gray-300">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})} className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded">
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Guardian">Guardian</option>
                </select>
             </div>
          </div>
          <div>
            <label className="text-xs font-bold dark:text-gray-300">Institute</label>
            <input type="text" value={formData.institute} onChange={(e) => setFormData({...formData, institute: e.target.value})} className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold dark:text-gray-300">Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded" />
            </div>
            <div>
                <label className="text-xs font-bold dark:text-gray-300">Mobile</label>
                <input type="tel" required value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold dark:text-gray-300">Password</label>
                <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded" />
            </div>
            <div>
                <label className="text-xs font-bold dark:text-gray-300">Confirm</label>
                <input type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-medium">
            {isLoading ? <RefreshCw className="animate-spin mx-auto" /> : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
