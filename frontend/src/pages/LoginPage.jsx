import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Logging in...');
    try {
      await login(email, password);
      toast.success('Welcome back! 🎉', { id: loadingToast });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed', { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-10">💪</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-float opacity-10" style={{animationDelay: '1s'}}>🏃</div>
        <div className="absolute top-40 right-20 text-6xl animate-float opacity-10" style={{animationDelay: '2s'}}>🥗</div>
        <div className="absolute bottom-40 left-20 text-6xl animate-float opacity-10" style={{animationDelay: '1.5s'}}>🎯</div>
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="glass-card p-10 w-full max-w-md animate-scale-in relative z-10 border border-cyan-500/20">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce-subtle">🔐</div>
          <h1 className="text-5xl font-bold gradient-text mb-3">Welcome Back!</h1>
          <p className="text-gray-400 text-lg">Login to continue your fitness journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="animate-slide-up">
            <label className="block text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
              <span className="text-cyan-400">📧</span>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
            <label className="block text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
              <span className="text-cyan-400">🔒</span>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full group relative px-6 py-4 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden animate-slide-up"
            style={{animationDelay: '0.2s'}}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center gap-2 text-lg">
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Login</span>
                </>
              )}
            </span>
          </button>
        </form>
        
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-colors">
              Register here
            </a>
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full opacity-20 blur-2xl"></div>
      </div>
    </div>
  );
};

export default LoginPage;
