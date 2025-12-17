
import React, { useState } from 'react';
import { User, Lock, Mail, Phone, ArrowLeft, Building, AlertCircle, RefreshCw } from 'lucide-react';
import { User as UserType } from '../types';
import { supabase } from '../supabaseClient';

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
      role: 'Student',
      institute: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if(error) setError('');
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setIsLoading(true);

      if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setIsLoading(false);
          return;
      }
      if (formData.password.length < 6) {
          setError("Password must be at least 6 characters.");
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
          // Store ID, email, and access token (if session exists)
          localStorage.setItem('user_id', authData.user.id);
          localStorage.setItem('user_email', authData.user.email || '');
          if (authData.session) {
            localStorage.setItem('access_token', authData.session.access_token);
          }

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

          setSuccess("Registration successful! Logging you in...");
          setTimeout(() => onRegisterSuccess(newUser), 1500);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred during registration.');
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-lg w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div>
          <button onClick={onBack} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 mb-4">
            <ArrowLeft size={16} className="mr-1" /> Back to Home
          </button>
          <div className="text-center mb-6">
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Register for Dinajpur Board Portal</p>
          </div>
        </div>

        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-3 rounded text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
            </div>
        )}
        {success && (
             <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 p-3 rounded text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {success}
            </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">Full Name</label>
                <div className="relative">
                    <User className="absolute top-2.5 left-3 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-9 w-full py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded text-sm focus:ring-emerald-500 focus:border-emerald-500" 
                        placeholder="Your Name" 
                    />
                </div>
             </div>
             <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">Role</label>
                <div className="relative">
                    <select 
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="pl-3 w-full py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
             </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">Institute Name (Optional)</label>
            <div className="relative">
                <Building className="absolute top-2.5 left-3 text-gray-400" size={16} />
                <input 
                    type="text" 
                    value={formData.institute}
                    onChange={(e) => handleInputChange('institute', e.target.value)}
                    className="pl-9 w-full py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded text-sm focus:ring-emerald-500 focus:border-emerald-500" 
                    placeholder="School or College Name" 
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">Email Address</label>
                <div className="relative">
                    <Mail className="absolute top-2.5 left-3 text-gray-400" size={16} />
                    <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-9 w-full py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded text-sm focus:ring-emerald-500 focus:border-emerald-500" 
                        placeholder="mail@example.com" 
                    />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">Mobile Number</label>
                <div className="relative">
                    <Phone className="absolute top-2.5 left-3 text-gray-400" size={16} />
                    <input 
                        type="tel" 
                        required
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        className="pl-9 w-full py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded text-sm focus:ring-emerald-500 focus:border-emerald-500" 
                        placeholder="017XXXXXXXX" 
                    />
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">Password</label>
                <div className="relative">
                    <Lock className="absolute top-2.5 left-3 text-gray-400" size={16} />
                    <input 
                        type="password" 
                        required
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-9 w-full py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded text-sm focus:ring-emerald-500 focus:border-emerald-500" 
                        placeholder="******" 
                    />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">Confirm Password</label>
                <div className="relative">
                    <Lock className="absolute top-2.5 left-3 text-gray-400" size={16} />
                    <input 
                        type="password" 
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-9 w-full py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded text-sm focus:ring-emerald-500 focus:border-emerald-500" 
                        placeholder="******" 
                    />
                </div>
            </div>
          </div>

          <div className="flex items-start">
            <input id="terms" type="checkbox" required className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-0.5" />
            <label htmlFor="terms" className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                I agree to the <button type="button" onClick={onTermsClick} className="text-emerald-700 dark:text-emerald-400 hover:underline">Terms of Service</button> and <button type="button" onClick={onPrivacyClick} className="text-emerald-700 dark:text-emerald-400 hover:underline">Privacy Policy</button>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="animate-spin mr-2" size={18} /> : 'Create Account'}
            </button>
          </div>

          <div className="text-center mt-4">
             <p className="text-xs text-gray-600 dark:text-gray-400">
                Already have an account? <button type="button" onClick={onLoginClick} className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">Sign in</button>
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
