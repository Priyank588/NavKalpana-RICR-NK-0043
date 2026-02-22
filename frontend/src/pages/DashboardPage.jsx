import React, { useState, useEffect } from 'react';
import { workoutService, progressService, profileService } from '../services/apiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [habitScore, setHabitScore] = useState(null);
  const [progress, setProgress] = useState([]);
  const [dropoffRisk, setDropoffRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, workoutRes, habitRes, progressRes, dropoffRes] = await Promise.all([
          profileService.getProfile(),
          workoutService.getLatestWorkout(),
          progressService.getCurrentHabitScore(),
          progressService.getRecentProgress(12),
          progressService.checkDropoffRisk()
        ]);
        
        setProfile(profileRes.data);
        setWorkout(workoutRes.data);
        setHabitScore(habitRes.data);
        setProgress(progressRes.data.reverse());
        setDropoffRisk(dropoffRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
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
        <p className="text-2xl font-bold text-gray-800">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="page-container bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's your fitness overview</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <span className="text-xl">✏️</span>
                <span>Edit Profile</span>
              </span>
            </button>
            <button
              onClick={handleLogout}
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
      
        {/* Profile Summary Card */}
        {profile && (
          <div className="card-gradient p-8 mb-8 animate-scale-in">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="text-4xl">👤</span>
                  Your Profile
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white bg-opacity-60 p-4 rounded-xl hover:bg-opacity-80 transition-all">
                    <span className="text-gray-600 text-sm block mb-1">Age</span>
                    <span className="text-2xl font-bold text-blue-600">{profile.age}</span>
                    <span className="text-gray-500 text-sm ml-1">years</span>
                  </div>
                  <div className="bg-white bg-opacity-60 p-4 rounded-xl hover:bg-opacity-80 transition-all">
                    <span className="text-gray-600 text-sm block mb-1">Weight</span>
                    <span className="text-2xl font-bold text-purple-600">{profile.weight_kg}</span>
                    <span className="text-gray-500 text-sm ml-1">kg</span>
                  </div>
                  <div className="bg-white bg-opacity-60 p-4 rounded-xl hover:bg-opacity-80 transition-all">
                    <span className="text-gray-600 text-sm block mb-1">Goal</span>
                    <span className="text-lg font-bold text-green-600">{profile.goal}</span>
                  </div>
                  <div className="bg-white bg-opacity-60 p-4 rounded-xl hover:bg-opacity-80 transition-all">
                    <span className="text-gray-600 text-sm block mb-1">Target</span>
                    <span className="text-2xl font-bold text-pink-600">{profile.target_weight_kg}</span>
                    <span className="text-gray-500 text-sm ml-1">kg</span>
                  </div>
                  <div className="bg-white bg-opacity-60 p-4 rounded-xl hover:bg-opacity-80 transition-all">
                    <span className="text-gray-600 text-sm block mb-1">Experience</span>
                    <span className="text-lg font-bold text-indigo-600">{profile.experience_level}</span>
                  </div>
                  <div className="bg-white bg-opacity-60 p-4 rounded-xl hover:bg-opacity-80 transition-all">
                    <span className="text-gray-600 text-sm block mb-1">Calories</span>
                    <span className="text-2xl font-bold text-orange-600">{profile.daily_calorie_target}</span>
                    <span className="text-gray-500 text-sm ml-1">kcal</span>
                  </div>
                  <div className="bg-white bg-opacity-60 p-4 rounded-xl hover:bg-opacity-80 transition-all">
                    <span className="text-gray-600 text-sm block mb-1">Training Days</span>
                    <span className="text-2xl font-bold text-teal-600">{profile.available_days_per_week}</span>
                    <span className="text-gray-500 text-sm ml-1">/week</span>
                  </div>
                  <div className="bg-white bg-opacity-60 p-4 rounded-xl hover:bg-opacity-80 transition-all">
                    <span className="text-gray-600 text-sm block mb-1">Diet</span>
                    <span className="text-lg font-bold text-emerald-600">{profile.dietary_preferences || 'None'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="ml-4 text-blue-500 hover:text-blue-600 text-sm font-semibold hover:scale-110 transition-transform"
              >
                Edit →
              </button>
            </div>
          </div>
        )}
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Habit Score Card */}
          <div className="stat-card bg-gradient-to-br from-cyan-500 to-sky-600 text-white animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Habit Score</h3>
              <span className="text-4xl">🎯</span>
            </div>
            <div className="text-6xl font-bold mb-2">{habitScore?.habit_score || 0}</div>
            <div className="text-blue-100 text-lg">out of 100</div>
            <div className="mt-4 pt-4 border-t border-cyan-400">
              <p className="text-cyan-100">🔥 Streak: <span className="font-bold text-white">{habitScore?.streak_count || 0} weeks</span></p>
            </div>
          </div>
          
          {/* Drop-off Risk Card */}
          <div className={`stat-card ${dropoffRisk?.at_risk ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-green-600'} text-white animate-slide-up`} style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Status</h3>
              <span className="text-4xl">{dropoffRisk?.at_risk ? '⚠️' : '✅'}</span>
            </div>
            <p className="text-3xl font-bold mb-2">
              {dropoffRisk?.at_risk ? 'At Risk' : 'On Track'}
            </p>
            <div className={dropoffRisk?.at_risk ? 'text-red-100' : 'text-green-100'}>
              {dropoffRisk?.at_risk ? 'Needs attention' : 'Keep it up!'}
            </div>
            {dropoffRisk?.reasons?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-opacity-30 border-white">
                {dropoffRisk.reasons.map((reason, idx) => (
                  <p key={idx} className="text-sm opacity-90 mb-1">• {reason}</p>
                ))}
              </div>
            )}
          </div>
          
          {/* Upcoming Workout Card */}
          <div className="stat-card bg-gradient-to-br from-orange-500 to-amber-500 text-white animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">This Week's Focus</h3>
              <span className="text-4xl">💪</span>
            </div>
            <p className="text-2xl font-bold mb-2">{workout?.workouts?.[0]?.type || 'Full Body'}</p>
            <div className="text-orange-100">Week {workout?.week_number || 1}</div>
            <div className="mt-4 pt-4 border-t border-orange-400">
              <p className="text-orange-100">Ready to crush it!</p>
            </div>
          </div>
        </div>
      
        {/* Progress Chart */}
        {progress.length > 0 && (
          <div className="card p-8 mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-3xl">📈</span>
                  Weight Progress
                </h3>
                <p className="text-gray-600 mt-1">Track your journey over time</p>
              </div>
              <button
                onClick={() => navigate('/progress')}
                className="text-blue-500 hover:text-blue-600 font-semibold hover:scale-110 transition-transform"
              >
                View All Progress →
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week_number" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="weight_kg" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Weight (kg)"
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button
            onClick={() => navigate('/workouts')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl text-center font-bold transition-all transform hover:scale-105 hover:-translate-y-1 animate-scale-in"
          >
            <div className="text-5xl mb-3 animate-bounce-subtle">💪</div>
            <div className="text-xl">Workouts</div>
            <div className="text-sm opacity-80 mt-1">View your plan</div>
          </button>
          <button
            onClick={() => navigate('/diet')}
            className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl text-center font-bold transition-all transform hover:scale-105 hover:-translate-y-1 animate-scale-in"
            style={{animationDelay: '0.1s'}}
          >
            <div className="text-5xl mb-3 animate-bounce-subtle">🥗</div>
            <div className="text-xl">Diet Plans</div>
            <div className="text-sm opacity-80 mt-1">Nutrition guide</div>
          </button>
          <button
            onClick={() => navigate('/progress')}
            className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl text-center font-bold transition-all transform hover:scale-105 hover:-translate-y-1 animate-scale-in"
            style={{animationDelay: '0.2s'}}
          >
            <div className="text-5xl mb-3 animate-bounce-subtle">📊</div>
            <div className="text-xl">Log Progress</div>
            <div className="text-sm opacity-80 mt-1">Track metrics</div>
          </button>
          <button
            onClick={() => navigate('/assistant')}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl text-center font-bold transition-all transform hover:scale-105 hover:-translate-y-1 animate-scale-in"
            style={{animationDelay: '0.3s'}}
          >
            <div className="text-5xl mb-3 animate-bounce-subtle">🤖</div>
            <div className="text-xl">AI Coach</div>
            <div className="text-sm opacity-80 mt-1">Get guidance</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
