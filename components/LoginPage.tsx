
import React, { useState } from 'react';
import { User, Lock, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { User as UserType } from '../types';
import { supabase } from '../supabaseClient';

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

      if (data.user && data.session) {
        // Store user details and access token for persistence
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('user_email', data.user.email || '');
        localStorage.setItem('access_token', data.session.access_token);

        let userProfile: UserType = {
          name: data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          role: 'Student'
        };

        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (!profileError && profile) {
            userProfile = {
              name: profile.name || userProfile.name,
              email: data.user.email || '',
              role: profile.role || 'Student',
              institute: profile.institute,
              mobile: profile.mobile
            };
          }
        } catch (innerErr) {
          console.error("Profile fetch error:", innerErr);
        }

        onLogin(userProfile);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div>
          <button onClick={onBack} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 mb-4">
            <ArrowLeft size={16} className="mr-1" /> Back to Home
          </button>
          <div className="text-center mb-6">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                <User size={32} className="text-emerald-700 dark:text-emerald-400" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in to Portal</h2>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Access your dashboard</p>
          </div>
        </div>

        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-3 rounded text-sm flex items-center gap-2 mb-4">
                <AlertCircle size={16} className="shrink-0" /> <span>{error}</span>
            </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">Email Address</label>
              <div className="relative">
                <User className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Enter your Email"
                />
              </div>
            </div>
            <div className="relative">
               <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">Password</label>
               <div className="relative">
                <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-xs">
              <button onClick={onForgotPasswordClick} type="button" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
                Forgot password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="animate-spin" size={18} /> Validating...
                </span>
              ) : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center mt-4">
             <p className="text-xs text-gray-600 dark:text-gray-400">
                Don't have an account? <button type="button" onClick={onRegisterClick} className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">Register here</button>
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
