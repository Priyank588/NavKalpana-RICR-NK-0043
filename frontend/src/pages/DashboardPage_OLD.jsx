import React, { useState, useEffect } from 'react';
import { workoutService, progressService, profileService } from '../services/apiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [habitScore, setHabitScore] = useState(null);
  const [progress, setProgress] = useState([]);
  const [dropoffRisk, setDropoffRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRiskDetails, setShowRiskDetails] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    
    const returningStatus = localStorage.getItem('isReturningUser');
    setIsReturningUser(returningStatus === 'true');
  }, []);

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
    <div className="page-container flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-4 animate-bounce-subtle">⏳</div>
        <p className="text-2xl font-bold text-gray-900">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">
              {isReturningUser ? 'Welcome back' : 'Welcome'}, {user?.name || profile?.name || 'User'}! 👋
            </h1>
            <p className="text-gray-600">
              {isReturningUser 
                ? "Great to see you again! Here's your fitness overview" 
                : "Let's start your fitness journey together!"}
            </p>
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
      
        
        {profile && (
          <div className="card p-8 mb-8 animate-scale-in">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-4xl">👤</span>
                  Your Profile
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-xl hover:shadow-md transition-all border border-violet-100">
                    <span className="text-gray-600 text-sm block mb-1">Age</span>
                    <span className="text-2xl font-bold text-violet-600">{profile.age}</span>
                    <span className="text-gray-500 text-sm ml-1">years</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl hover:shadow-md transition-all border border-purple-100">
                    <span className="text-gray-600 text-sm block mb-1">Weight</span>
                    <span className="text-2xl font-bold text-purple-600">{profile.weight_kg}</span>
                    <span className="text-gray-500 text-sm ml-1">kg</span>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl hover:shadow-md transition-all border border-green-100">
                    <span className="text-gray-600 text-sm block mb-1">Goal</span>
                    <span className="text-lg font-bold text-green-600">{profile.goal}</span>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl hover:shadow-md transition-all border border-pink-100">
                    <span className="text-gray-600 text-sm block mb-1">Target</span>
                    <span className="text-2xl font-bold text-pink-600">{profile.target_weight_kg}</span>
                    <span className="text-gray-500 text-sm ml-1">kg</span>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl hover:shadow-md transition-all border border-indigo-100">
                    <span className="text-gray-600 text-sm block mb-1">Experience</span>
                    <span className="text-lg font-bold text-indigo-600">{profile.experience_level}</span>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl hover:shadow-md transition-all border border-orange-100">
                    <span className="text-gray-600 text-sm block mb-1">Calories</span>
                    <span className="text-2xl font-bold text-orange-600">{profile.daily_calorie_target}</span>
                    <span className="text-gray-500 text-sm ml-1">kcal</span>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl hover:shadow-md transition-all border border-teal-100">
                    <span className="text-gray-600 text-sm block mb-1">Training Days</span>
                    <span className="text-2xl font-bold text-teal-600">{profile.available_days_per_week}</span>
                    <span className="text-gray-500 text-sm ml-1">/week</span>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl hover:shadow-md transition-all border border-emerald-100">
                    <span className="text-gray-600 text-sm block mb-1">Diet</span>
                    <span className="text-lg font-bold text-emerald-600">{profile.dietary_preferences || 'None'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="ml-4 text-violet-600 hover:text-violet-700 text-sm font-semibold hover:scale-110 transition-transform"
              >
                Edit →
              </button>
            </div>
          </div>
        )}
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="stat-card bg-gradient-to-br from-violet-500 to-purple-600 text-white animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Habit Score</h3>
              <span className="text-4xl">🎯</span>
            </div>
            <div className="text-6xl font-bold mb-2">{habitScore?.habit_score || 0}</div>
            <div className="text-violet-100 text-lg">out of 100</div>
            <div className="mt-4 pt-4 border-t border-violet-400">
              <p className="text-violet-100">🔥 Streak: <span className="font-bold text-white">{habitScore?.streak_count || 0} weeks</span></p>
            </div>
          </div>
          
          
          <div 
            onClick={() => setShowRiskDetails(true)}
            className={`stat-card cursor-pointer ${
            dropoffRisk?.risk_level === 'critical' ? 'bg-gradient-to-br from-red-600 to-red-700' :
            dropoffRisk?.risk_level === 'high' ? 'bg-gradient-to-br from-orange-500 to-red-500' :
            dropoffRisk?.risk_level === 'medium' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
            'bg-gradient-to-br from-green-500 to-emerald-600'
          } text-white animate-slide-up hover:scale-105 transition-transform`} style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Status</h3>
              <span className="text-4xl">
                {dropoffRisk?.risk_level === 'critical' ? '🚨' :
                 dropoffRisk?.risk_level === 'high' ? '⚠️' :
                 dropoffRisk?.risk_level === 'medium' ? '⚡' :
                 '✅'}
              </span>
            </div>
            <p className="text-3xl font-bold mb-2">
              {dropoffRisk?.risk_level === 'critical' ? 'Critical' :
               dropoffRisk?.risk_level === 'high' ? 'At Risk' :
               dropoffRisk?.risk_level === 'medium' ? 'Needs Focus' :
               'On Track'}
            </p>
            <div className={
              dropoffRisk?.risk_level === 'critical' ? 'text-red-100' :
              dropoffRisk?.risk_level === 'high' ? 'text-orange-100' :
              dropoffRisk?.risk_level === 'medium' ? 'text-amber-100' :
              'text-green-100'
            }>
              {dropoffRisk?.at_risk ? 'Needs attention' : 'Keep it up!'}
            </div>
            
            
            {dropoffRisk?.risk_score > 0 && (
              <div className="mt-4 pt-4 border-t border-opacity-30 border-white">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-90">Risk Score</span>
                  <span className="text-lg font-bold">{dropoffRisk.risk_score}/100</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{width: `${dropoffRisk.risk_score}%`}}
                  ></div>
                </div>
              </div>
            )}
            
            
            {dropoffRisk?.reasons?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-opacity-30 border-white">
                <p className="text-sm font-bold mb-2">Issues:</p>
                {dropoffRisk.reasons.slice(0, 2).map((reason, idx) => (
                  <p key={idx} className="text-sm opacity-90 mb-1">• {reason}</p>
                ))}
                {dropoffRisk.reasons.length > 2 && (
                  <p className="text-xs opacity-75 mt-1">+{dropoffRisk.reasons.length - 2} more</p>
                )}
              </div>
            )}
            
            
            {dropoffRisk?.positive_notes?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-opacity-30 border-white">
                <p className="text-sm font-bold mb-2">Wins:</p>
                {dropoffRisk.positive_notes.slice(0, 2).map((note, idx) => (
                  <p key={idx} className="text-sm opacity-90 mb-1">✨ {note}</p>
                ))}
              </div>
            )}
            
            <p className="text-xs opacity-75 mt-4 text-center">Click for details →</p>
          </div>
          
          
          <div className="stat-card bg-gradient-to-br from-blue-500 to-indigo-600 text-white animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">This Week's Focus</h3>
              <span className="text-4xl">💪</span>
            </div>
            <p className="text-2xl font-bold mb-2">{workout?.workouts?.[0]?.type || 'Full Body'}</p>
            <div className="text-blue-100">Week {workout?.week_number || 1}</div>
            <div className="mt-4 pt-4 border-t border-blue-400">
              <p className="text-blue-100">Ready to crush it!</p>
            </div>
          </div>
        </div>
      
        
        {progress.length > 0 && (
          <div className="card p-8 mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-3xl">📈</span>
                  Weight Progress
                </h3>
                <p className="text-gray-600 mt-1">Track your journey over time</p>
              </div>
              <button
                onClick={() => navigate('/progress')}
                className="text-violet-600 hover:text-violet-700 font-semibold hover:scale-110 transition-transform"
              >
                View All Progress →
              </button>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-xl border border-violet-100">
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
      
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <button
            onClick={() => navigate('/daily-log')}
            className="bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl text-center font-bold transition-all transform hover:scale-105 hover:-translate-y-1 animate-scale-in"
          >
            <div className="text-5xl mb-3 animate-bounce-subtle">📝</div>
            <div className="text-xl">Daily Log</div>
            <div className="text-sm opacity-80 mt-1">Track today</div>
          </button>
          <button
            onClick={() => navigate('/workouts')}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl text-center font-bold transition-all transform hover:scale-105 hover:-translate-y-1 animate-scale-in"
            style={{animationDelay: '0.05s'}}
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
            className="bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl text-center font-bold transition-all transform hover:scale-105 hover:-translate-y-1 animate-scale-in"
            style={{animationDelay: '0.15s'}}
          >
            <div className="text-5xl mb-3 animate-bounce-subtle">📊</div>
            <div className="text-xl">Progress</div>
            <div className="text-sm opacity-80 mt-1">Track metrics</div>
          </button>
          <button
            onClick={() => navigate('/assistant')}
            className="bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl text-center font-bold transition-all transform hover:scale-105 hover:-translate-y-1 animate-scale-in"
            style={{animationDelay: '0.2s'}}
          >
            <div className="text-5xl mb-3 animate-bounce-subtle">🤖</div>
            <div className="text-xl">AI Coach</div>
            <div className="text-sm opacity-80 mt-1">Get guidance</div>
          </button>
        </div>
      </div>
      
      
      {showRiskDetails && dropoffRisk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowRiskDetails(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            
            <div className={`p-8 ${
              dropoffRisk.risk_level === 'critical' ? 'bg-gradient-to-r from-red-600 to-red-700' :
              dropoffRisk.risk_level === 'high' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
              dropoffRisk.risk_level === 'medium' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
              'bg-gradient-to-r from-green-500 to-emerald-600'
            } text-white rounded-t-2xl`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-6xl">
                    {dropoffRisk.risk_level === 'critical' ? '🚨' :
                     dropoffRisk.risk_level === 'high' ? '⚠️' :
                     dropoffRisk.risk_level === 'medium' ? '⚡' :
                     '✅'}
                  </span>
                  <div>
                    <h2 className="text-4xl font-bold mb-2">
                      {dropoffRisk.risk_level === 'critical' ? 'Critical Status' :
                       dropoffRisk.risk_level === 'high' ? 'At Risk' :
                       dropoffRisk.risk_level === 'medium' ? 'Needs Focus' :
                       'On Track!'}
                    </h2>
                    <p className="text-lg opacity-90">Detailed Analysis & Recommendations</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRiskDetails(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>
              
              
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Risk Score</span>
                  <span className="text-3xl font-bold">{dropoffRisk.risk_score}/100</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                  <div 
                    className="bg-white rounded-full h-3 transition-all duration-500"
                    style={{width: `${dropoffRisk.risk_score}%`}}
                  ></div>
                </div>
              </div>
            </div>
            
            
            <div className="p-8 space-y-6 bg-gray-50">
              
              {dropoffRisk.positive_notes?.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-3xl">🌟</span>
                    What's Going Well
                  </h3>
                  <div className="space-y-2">
                    {dropoffRisk.positive_notes.map((note, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-green-600 text-xl mt-1">✓</span>
                        <p className="text-lg">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              
              {dropoffRisk.reasons?.length > 0 && (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-3xl">⚠️</span>
                    Areas Needing Attention
                  </h3>
                  <div className="space-y-2">
                    {dropoffRisk.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-red-600 text-xl mt-1">•</span>
                        <p className="text-lg">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              
              {dropoffRisk.recommendations?.length > 0 && (
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-300 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-3xl">💡</span>
                    Action Plan
                  </h3>
                  <div className="space-y-3">
                    {dropoffRisk.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white rounded-lg p-4 hover:shadow-md transition-all border border-violet-200">
                        <span className="text-violet-600 text-2xl font-bold">{idx + 1}</span>
                        <p className="text-lg text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() => { setShowRiskDetails(false); navigate('/daily-log'); }}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all transform hover:scale-105"
                >
                  <span className="text-2xl mr-2">📝</span>
                  Log Today
                </button>
                <button
                  onClick={() => { setShowRiskDetails(false); navigate('/assistant'); }}
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition-all transform hover:scale-105"
                >
                  <span className="text-2xl mr-2">🤖</span>
                  Talk to AI Coach
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
