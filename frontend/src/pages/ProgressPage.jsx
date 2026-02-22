import React, { useState, useEffect } from 'react';
import { progressService } from '../services/apiService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProgressPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [progress, setProgress] = useState([]);
  const [habitScores, setHabitScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('weight');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, habitsRes] = await Promise.all([
          progressService.getRecentProgress(12),
          progressService.getHabitScores()
        ]);
        
        setProgress(progressRes.data.reverse());
        setHabitScores(habitsRes.data.reverse());
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return (
    <div className="page-container bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-4 animate-bounce-subtle">⏳</div>
        <p className="text-2xl font-bold text-white">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="page-container bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">📊 Your Progress</h1>
            <p className="text-gray-400">Track your fitness journey</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative px-6 py-3 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 text-white font-bold rounded-xl hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <span className="relative flex items-center gap-2">
                <span className="text-xl">🏠</span>
                <span>Dashboard</span>
              </span>
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-rose-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <span className="text-xl">🚪</span>
                <span>Logout</span>
              </span>
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 animate-scale-in">
          <button
            onClick={() => setActiveTab('weight')}
            className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
              activeTab === 'weight'
                ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-glow'
                : 'bg-slate-800/50 border border-slate-700/50 text-gray-300 hover:shadow-lg hover:border-cyan-500/50'
            }`}
          >
            <span className="text-2xl mr-2">⚖️</span>
            Weight Progress
          </button>
          <button
            onClick={() => setActiveTab('adherence')}
            className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
              activeTab === 'adherence'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-glow'
                : 'bg-slate-800/50 border border-slate-700/50 text-gray-300 hover:shadow-lg hover:border-emerald-500/50'
            }`}
          >
            <span className="text-2xl mr-2">✅</span>
            Adherence
          </button>
          <button
            onClick={() => setActiveTab('habits')}
            className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
              activeTab === 'habits'
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-glow'
                : 'bg-slate-800/50 border border-slate-700/50 text-gray-300 hover:shadow-lg hover:border-sky-500/50'
            }`}
          >
            <span className="text-2xl mr-2">🎯</span>
            Habit Scores
          </button>
        </div>
        
        {/* Weight Progress Chart */}
        {activeTab === 'weight' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-4xl">📈</span>
              Weight Trend
            </h2>
            {progress.length > 0 ? (
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-cyan-500/30 p-6 rounded-xl">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis 
                      dataKey="week_number" 
                      label={{ value: 'Week', position: 'insideBottom', offset: -5 }}
                      stroke="#94a3b8"
                    />
                    <YAxis 
                      label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                      stroke="#94a3b8"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                        borderRadius: '12px',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="weight_kg" 
                      stroke="#06b6d4" 
                      strokeWidth={3} 
                      name="Weight (kg)"
                      dot={{ fill: '#06b6d4', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-600/50 rounded-2xl">
                <p className="text-7xl mb-4 animate-bounce-subtle">📊</p>
                <p className="text-white text-2xl font-bold mb-2">No progress data yet</p>
                <p className="text-gray-300 text-lg">Start logging your weekly progress to see your weight trend</p>
              </div>
            )}
          </div>
        )}
        
        {/* Adherence Chart */}
        {activeTab === 'adherence' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-4xl">✅</span>
              Weekly Adherence
            </h2>
            {progress.length > 0 ? (
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-emerald-500/30 p-6 rounded-xl">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis 
                      dataKey="week_number" 
                      label={{ value: 'Week', position: 'insideBottom', offset: -5 }}
                      stroke="#94a3b8"
                    />
                    <YAxis 
                      label={{ value: 'Adherence (%)', angle: -90, position: 'insideLeft' }}
                      stroke="#94a3b8"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                        borderRadius: '12px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="workout_adherence_percent" fill="#06b6d4" name="Workout %" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="diet_adherence_percent" fill="#10b981" name="Diet %" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-600/50 rounded-2xl">
                <p className="text-7xl mb-4 animate-bounce-subtle">✅</p>
                <p className="text-white text-2xl font-bold mb-2">No adherence data yet</p>
                <p className="text-gray-300 text-lg">Track your workout and diet adherence weekly to see your consistency</p>
              </div>
            )}
          </div>
        )}
        
        {/* Habit Scores Chart */}
        {activeTab === 'habits' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-4xl">🎯</span>
              Habit Score Trend
            </h2>
            {habitScores.length > 0 ? (
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-sky-500/30 p-6 rounded-xl">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={habitScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis 
                      dataKey="week_number" 
                      label={{ value: 'Week', position: 'insideBottom', offset: -5 }}
                      stroke="#94a3b8"
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      label={{ value: 'Habit Score', angle: -90, position: 'insideLeft' }}
                      stroke="#94a3b8"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                        borderRadius: '12px',
                        border: '1px solid rgba(14, 165, 233, 0.3)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="habit_score" 
                      stroke="#0ea5e9" 
                      strokeWidth={3} 
                      name="Habit Score"
                      dot={{ fill: '#0ea5e9', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-600/50 rounded-2xl">
                <p className="text-7xl mb-4 animate-bounce-subtle">🎯</p>
                <p className="text-white text-2xl font-bold mb-2">No habit scores yet</p>
                <p className="text-gray-300 text-lg">Your habit scores are calculated based on your weekly adherence</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
