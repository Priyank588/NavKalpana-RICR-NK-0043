import React from 'react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:px-12 text-white relative z-10 animate-slide-down backdrop-blur-sm bg-slate-900/30">
        <div className="flex items-center gap-3">
          <div className="text-4xl animate-bounce-subtle">🤖</div>
          <h1 className="text-4xl font-bold gradient-text">FitAI</h1>
        </div>
        <div className="flex items-center gap-6">
          {token ? (
            <a href="/dashboard" className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative">Dashboard</span>
            </a>
          ) : (
            <>
              <a href="/login" className="text-gray-300 hover:text-white font-semibold transition-all hover:scale-110 inline-block">Login</a>
              <a href="/register" className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">Sign Up</span>
              </a>
            </>
          )}
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-semibold mb-8 animate-fade-in backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            AI-Powered Fitness Platform
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-scale-in leading-tight">
            <span className="gradient-text block mb-2">Transform Your Body</span>
            <span className="text-white">With AI Intelligence</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Get personalized workout plans, nutrition guidance, and an AI coach that adapts to your progress in real-time. Your fitness journey, scientifically optimized.
          </p>
          
          {/* CTA Buttons */}
          {!token && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <a href="/register" className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden text-lg">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                  <span>🚀</span>
                  <span>Start Free Trial</span>
                </span>
              </a>
              <a href="/login" className="group px-8 py-4 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 text-white font-bold rounded-xl hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 text-lg">
                <span className="flex items-center gap-2">
                  <span>🔐</span>
                  <span>Login</span>
                </span>
              </a>
            </div>
          )}
          
          {token && (
            <a href="/dashboard" className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden text-lg inline-block animate-scale-in">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <span>🏠</span>
                <span>Go to Dashboard</span>
              </span>
            </a>
          )}
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-gray-400 text-sm md:text-base">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">50K+</div>
              <div className="text-gray-400 text-sm md:text-base">Workouts Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">95%</div>
              <div className="text-gray-400 text-sm md:text-base">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm py-24 px-4 relative z-10 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold gradient-text mb-4 animate-slide-up">Powerful Features</h2>
            <p className="text-xl text-gray-400 animate-fade-in">Everything you need to achieve your fitness goals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 animate-bounce-subtle">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Plans</h3>
                <p className="text-gray-400 leading-relaxed">
                  Dynamic workout and diet plans generated specifically for your experience level, goals, and current fitness status using advanced AI.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="group relative p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 animate-scale-in" style={{animationDelay: '0.1s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 animate-bounce-subtle">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-3">Smart AI Coach</h3>
                <p className="text-gray-400 leading-relaxed">
                  Get intelligent, personalized coaching advice based on your real progress data, not generic templates. Available 24/7.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="group relative p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20 animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 animate-bounce-subtle">📈</div>
                <h3 className="text-2xl font-bold text-white mb-3">Real-Time Adaptation</h3>
                <p className="text-gray-400 leading-relaxed">
                  Your plans adjust automatically based on your adherence, fatigue levels, and progress trends for optimal results.
                </p>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="group relative p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-sky-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/20 animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 animate-bounce-subtle">💪</div>
                <h3 className="text-2xl font-bold text-white mb-3">Progressive Overload</h3>
                <p className="text-gray-400 leading-relaxed">
                  Intelligent progression logic that increases intensity based on your actual performance and recovery patterns.
                </p>
              </div>
            </div>
            
            {/* Feature 5 */}
            <div className="group relative p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-red-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20 animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 animate-bounce-subtle">⚠️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Risk Detection</h3>
                <p className="text-gray-400 leading-relaxed">
                  Automatic detection of drop-off risk with personalized interventions to keep you motivated and on track.
                </p>
              </div>
            </div>
            
            {/* Feature 6 */}
            <div className="group relative p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 animate-scale-in" style={{animationDelay: '0.5s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 animate-bounce-subtle">📊</div>
                <h3 className="text-2xl font-bold text-white mb-3">Comprehensive Tracking</h3>
                <p className="text-gray-400 leading-relaxed">
                  Track weight, measurements, habit scores, and get realistic timelines for achieving your fitness goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold gradient-text mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Get started in 3 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center animate-slide-up">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-cyan-500/50">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Create Profile</h3>
              <p className="text-gray-400 leading-relaxed">
                Tell us about your fitness level, goals, and any limitations. Takes less than 2 minutes.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-emerald-500/50">
                  2
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Get AI Plans</h3>
              <p className="text-gray-400 leading-relaxed">
                Receive personalized workout and nutrition plans generated by our advanced AI system.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-orange-500/50">
                  3
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Track & Adapt</h3>
              <p className="text-gray-400 leading-relaxed">
                Log your progress and watch your plans adapt automatically for optimal results.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-sky-600 py-20 px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-7xl mb-6 animate-bounce-subtle">🚀</div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white animate-scale-in">Ready to Transform?</h2>
          <p className="text-2xl mb-12 text-cyan-100 leading-relaxed animate-fade-in">
            Join thousands achieving their fitness goals with AI-powered personalization.
          </p>
          <a href="/register" className="group relative px-10 py-5 bg-white text-cyan-600 font-bold rounded-xl shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-110 overflow-hidden text-xl inline-block animate-slide-up">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-50 to-sky-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center gap-3">
              <span>✨</span>
              <span>Start Your Free Trial</span>
              <span>→</span>
            </span>
          </a>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-4xl">🤖</div>
            <h3 className="text-3xl font-bold gradient-text">FitAI</h3>
          </div>
          <p className="text-gray-400 mb-6">Your AI-Powered Fitness Companion</p>
          <p className="text-gray-500 text-sm">© 2024 FitAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
