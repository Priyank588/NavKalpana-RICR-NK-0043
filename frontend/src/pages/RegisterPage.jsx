import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    const loadingToast = toast.loading('Creating your account...');
    try {
      await register(name, email, password);
      toast.success('Account created! Let\'s set up your profile 🎉', { id: loadingToast });
      navigate('/profile-setup');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed', { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden py-12">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 text-6xl animate-float opacity-20">🎯</div>
        <div className="absolute bottom-10 left-10 text-6xl animate-float opacity-20" style={{animationDelay: '1.5s'}}>⚡</div>
        <div className="absolute top-1/2 left-20 text-6xl animate-float opacity-20" style={{animationDelay: '0.5s'}}>🌟</div>
        <div className="absolute bottom-1/3 right-20 text-6xl animate-float opacity-20" style={{animationDelay: '2s'}}>💪</div>
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl p-10 w-full max-w-md animate-scale-in relative z-10">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce-subtle">🚀</div>
          <h1 className="text-5xl font-bold gradient-text mb-3">Join FitAI</h1>
          <p className="text-gray-600 text-lg">Start your transformation today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-slide-up">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
              <span className="text-green-600">👤</span>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
              placeholder="Your name"
              required
            />
          </div>
          
          <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
              <span className="text-green-600">📧</span>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
              <span className="text-green-600">🔒</span>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
              <span className="text-green-600">🔐</span>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full group relative px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden animate-slide-up"
            style={{animationDelay: '0.4s'}}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center gap-2 text-lg">
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Create Account</span>
                </>
              )}
            </span>
          </button>
        </form>
        
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 hover:text-green-700 font-bold hover:underline transition-colors">
              Login here
            </a>
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-20 blur-2xl"></div>
      </div>
    </div>
  );
};

export default RegisterPage;
