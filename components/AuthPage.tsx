import React, { useState } from 'react';
import { FileText, ArrowRight, ShieldCheck, AlertCircle, Loader } from 'lucide-react';
import { authService } from '../services/authService';

interface AuthPageProps {
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login({ email, password });
      } else {
        await authService.signup({ fullName, email, password });
      }
      onLogin();
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFullName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#020617]">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="z-10 w-full max-w-4xl flex flex-col md:flex-row bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl m-4">
        
        {/* Left Side - Brand */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-[#020617] relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                <FileText className="text-white" size={28} />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">ResumeNest</h1>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed">
              Craft your professional story with AI-powered intelligence. Build, edit, and export resumes that get you hired.
            </p>
          </div>
          
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <ShieldCheck className="text-teal-400" size={20} />
              <span>ATS-Friendly Templates</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <ShieldCheck className="text-teal-400" size={20} />
              <span>AI Grammar & Tone Correction</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <ShieldCheck className="text-teal-400" size={20} />
              <span>Real-time Preview</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12 bg-slate-950/50">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-400">
              {isLogin ? 'Enter your credentials to access your workspace.' : 'Start building your career today.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
               <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-teal-900/20 transition-all duration-200 mt-6 flex items-center justify-center gap-2 group disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={handleToggleMode}
                disabled={loading}
                className="text-teal-400 hover:text-teal-300 font-medium ml-1 transition-colors disabled:opacity-50"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
