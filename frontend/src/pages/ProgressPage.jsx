import React, { useState, useEffect } from 'react';
import { progressService, dailyLogService } from '../services/apiService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProgressPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [progress, setProgress] = useState([]);
  const [habitScores, setHabitScores] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('weight');
  const [timeRange, setTimeRange] = useState(12); // 4, 8, or 12 weeks

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, habitsRes, logsRes] = await Promise.all([
          progressService.getRecentProgress(12),
          progressService.getHabitScores(),
          dailyLogService.getRecentLogs(90)
        ]);
        
        setProgress(progressRes.data.reverse());
        setHabitScores(habitsRes.data.reverse());
        setDailyLogs(logsRes.data.reverse());
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return (
    <div className="page-container flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-4 animate-bounce-subtle">⏳</div>
        <p className="text-2xl font-bold text-gray-900">Loading...</p>
      </div>
    </div>
  );

  // Prepare weight data from daily logs (filtered by time range)
  const weeksInDays = timeRange * 7;
  const weightData = dailyLogs
    .slice(-weeksInDays)
    .filter(log => log.weight_kg && log.weight_kg > 0)
    .map((log, index) => ({
      day: index + 1,
      date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight_kg: log.weight_kg
    }));

  // Prepare adherence data by week (filtered by time range)
  const adherenceByWeek = {};
  dailyLogs.slice(-weeksInDays).forEach(log => {
    const logDate = new Date(log.date);
    const weekNum = Math.ceil((logDate - new Date(logDate.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
    if (!adherenceByWeek[weekNum]) {
      adherenceByWeek[weekNum] = {
        week_number: weekNum,
        workout_days: 0,
        diet_days: 0,
        total_days: 0,
        workout_score: 0,
        diet_score: 0
      };
    }
    adherenceByWeek[weekNum].total_days++;
    
    // Calculate scores based on status
    const workoutScore = {
      'Completed': 100,
      'Partial': 50,
      'Skipped': 0
    }[log.workout_status] || (log.workout_completed ? 100 : 0);
    
    const dietScore = {
      'Followed': 100,
      'Mostly': 70,
      'Deviated': 0
    }[log.diet_adherence] || (log.diet_followed ? 100 : 0);
    
    adherenceByWeek[weekNum].workout_score += workoutScore;
    adherenceByWeek[weekNum].diet_score += dietScore;
    
    if (log.workout_completed) adherenceByWeek[weekNum].workout_days++;
    if (log.diet_followed) adherenceByWeek[weekNum].diet_days++;
  });

  const adherenceData = Object.values(adherenceByWeek)
    .map(week => ({
      week_number: week.week_number,
      workout_adherence_percent: Math.round(week.workout_score / week.total_days),
      diet_adherence_percent: Math.round(week.diet_score / week.total_days)
    }))
    .sort((a, b) => a.week_number - b.week_number)
    .slice(-timeRange); // Filter by selected time range

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">📊 Your Progress</h1>
            <p className="text-gray-600">Track your fitness journey over time</p>
          </div>
          <div className="flex gap-3">
            {/* Time Range Selector */}
            <div className="flex gap-2 bg-white border-2 border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setTimeRange(4)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeRange === 4
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                4 Weeks
              </button>
              <button
                onClick={() => setTimeRange(8)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeRange === 8
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                8 Weeks
              </button>
              <button
                onClick={() => setTimeRange(12)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeRange === 12
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                12 Weeks
              </button>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative px-6 py-3 bg-white border-2 border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-50 hover:border-violet-300 transition-all duration-300 transform hover:scale-105 overflow-hidden shadow-sm"
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
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-glow'
                : 'bg-white border border-gray-200 text-gray-700 hover:shadow-lg hover:border-blue-300'
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
                : 'bg-white border border-gray-200 text-gray-700 hover:shadow-lg hover:border-emerald-300'
            }`}
          >
            <span className="text-2xl mr-2">✅</span>
            Adherence
          </button>
          <button
            onClick={() => setActiveTab('habits')}
            className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
              activeTab === 'habits'
                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-glow'
                : 'bg-white border border-gray-200 text-gray-700 hover:shadow-lg hover:border-violet-300'
            }`}
          >
            <span className="text-2xl mr-2">🎯</span>
            Habit Scores
          </button>
        </div>
        
        {/* Weight Progress Chart */}
        {activeTab === 'weight' && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-4xl">📈</span>
              Weight Trend
            </h2>
            {weightData.length > 0 ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis 
                      dataKey="date" 
                      label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
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
              <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                <p className="text-7xl mb-4 animate-bounce-subtle">📊</p>
                <p className="text-gray-900 text-2xl font-bold mb-2">No weight data yet</p>
                <p className="text-gray-700 text-lg mb-6">Start logging your weight in the Daily Log to see your progress</p>
                <button
                  onClick={() => navigate('/daily-log')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    <span>📝</span>
                    <span>Go to Daily Log</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Adherence Chart */}
        {activeTab === 'adherence' && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-4xl">✅</span>
              Weekly Adherence
            </h2>
            {adherenceData.length > 0 ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={adherenceData}>
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
              <div className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                <p className="text-7xl mb-4 animate-bounce-subtle">✅</p>
                <p className="text-gray-900 text-2xl font-bold mb-2">No adherence data yet</p>
                <p className="text-gray-700 text-lg mb-6">Start logging your daily workouts and diet to see your consistency</p>
                <button
                  onClick={() => navigate('/daily-log')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    <span>📝</span>
                    <span>Go to Daily Log</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Habit Scores Chart */}
        {activeTab === 'habits' && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-4xl">🎯</span>
              Habit Score Trend
            </h2>
            {habitScores.length > 0 ? (
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 p-6 rounded-xl">
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
              <div className="text-center py-16 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl">
                <p className="text-7xl mb-4 animate-bounce-subtle">🎯</p>
                <p className="text-gray-900 text-2xl font-bold mb-2">No habit scores yet</p>
                <p className="text-gray-700 text-lg mb-6">Your habit scores are calculated based on your daily logs</p>
                <button
                  onClick={() => navigate('/daily-log')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-violet-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    <span>📝</span>
                    <span>Go to Daily Log</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
