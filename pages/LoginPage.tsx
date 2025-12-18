
import React, { useState } from 'react';
import { User, Lock, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { User as UserType } from '../types';
import { supabase } from '../services/supabase';

interface LoginPageProps {
  onBack: () => void;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
  onLogin: (user: UserType) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onRegisterClick, onForgotPasswordClick, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        let userProfile: UserType = {
          name: data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          role: 'Student'
        };

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          userProfile = {
            name: profile.name || userProfile.name,
            email: data.user.email || '',
            role: profile.role || 'Student',
            institute: profile.institute,
            mobile: profile.mobile
          };
        }

        onLogin(userProfile);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div>
          <button onClick={onBack} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-700 mb-4">
            <ArrowLeft size={16} className="mr-1" /> Back
          </button>
          <div className="text-center mb-6">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                <User size={32} className="text-emerald-700 dark:text-emerald-400" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in to Portal</h2>
          </div>
        </div>

        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded text-sm flex items-center gap-2 mb-4">
                <AlertCircle size={16} /> <span>{error}</span>
            </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">Email</label>
              <div className="relative">
                <User className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md"
                    placeholder="Enter Email"
                />
              </div>
            </div>
            <div>
               <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">Password</label>
               <div className="relative">
                <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md"
                    placeholder="Enter Password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <input id="remember" type="checkbox" className="h-4 w-4 text-emerald-600 rounded" />
              <label htmlFor="remember" className="ml-2 dark:text-gray-300">Remember me</label>
            </div>
            <button onClick={onForgotPasswordClick} type="button" className="font-medium text-emerald-600">Forgot password?</button>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-medium disabled:opacity-50">
            {isLoading ? <RefreshCw className="animate-spin mx-auto" /> : 'Sign in'}
          </button>
          
          <p className="text-center text-xs dark:text-gray-400">
            Don't have an account? <button type="button" onClick={onRegisterClick} className="font-bold text-emerald-700">Register here</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
