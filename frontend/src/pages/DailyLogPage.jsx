import React, { useState, useEffect } from 'react';
import { dailyLogService, recoveryService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const DailyLogPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);
  const [recoveryStatus, setRecoveryStatus] = useState(null);
  const [todayLog, setTodayLog] = useState({
    workout_completed: false,
    workout_status: 'Skipped',
    workout_notes: '',
    diet_followed: false,
    diet_adherence: 'Deviated',
    diet_notes: '',
    calories_consumed: 0,
    water_intake_liters: 0,
    energy_level: 'Normal',
    mood: 'Good',
    sleep_hours: 0,
    weight_kg: '',
    notes: ''
  });

  useEffect(() => {
    fetchTodayLog();
    fetchStats();
    fetchRecoveryStatus();
  }, []);

  const fetchTodayLog = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await dailyLogService.getDailyLog(today);
      if (res.data && res.data._id) {
        setTodayLog(res.data);
      }
    } catch (err) {
      console.error('Error fetching today log:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await dailyLogService.getDailyStats();
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchRecoveryStatus = async () => {
    try {
      const res = await recoveryService.getRecoveryStatus();
      setRecoveryStatus(res.data);
    } catch (err) {
      console.error('Error fetching recovery status:', err);
    }
  };

  const handleChange = (field, value) => {
    setTodayLog(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const loadingToast = toast.loading('Saving your daily log...');
    try {
      await dailyLogService.logDaily({
        date: new Date().toISOString(),
        ...todayLog
      });
      toast.success('Daily log saved! Keep up the great work! 🎉', { id: loadingToast });
      fetchStats(); 
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save log', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-4 animate-bounce-subtle">⏳</div>
        <p className="text-2xl font-bold text-gray-900">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">📝 Daily Log</h1>
            <p className="text-gray-600">Track your daily progress and maintain your streak</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-violet-300 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
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

        
        {recoveryStatus && recoveryStatus.recommendation && (
          <div className={`mb-8 rounded-3xl p-6 shadow-xl animate-slide-down ${
            recoveryStatus.recommendation.level === 'critical' 
              ? 'bg-gradient-to-r from-red-500 to-rose-600' 
              : recoveryStatus.recommendation.level === 'high'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600'
              : recoveryStatus.recommendation.level === 'moderate'
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
              : 'bg-gradient-to-r from-green-500 to-emerald-600'
          } text-white`}>
            <div className="flex items-start gap-4">
              <div className="text-5xl">
                {recoveryStatus.recommendation.level === 'critical' ? '⚠️' :
                 recoveryStatus.recommendation.level === 'high' ? '😴' :
                 recoveryStatus.recommendation.level === 'moderate' ? '😌' : '✅'}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Recovery Intelligence</h3>
                <p className="text-lg mb-2">{recoveryStatus.recommendation.message}</p>
                <p className="text-sm opacity-90 mb-3">{recoveryStatus.recommendation.action}</p>
                {recoveryStatus.fatigue_count > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full">
                      Fatigue flags: {recoveryStatus.fatigue_count}/7 days
                    </span>
                    <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full">
                      Current: {recoveryStatus.current_energy}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="stat-card bg-gradient-to-br from-cyan-500 to-sky-600 text-white animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Current Streak</h3>
                <span className="text-4xl">🔥</span>
              </div>
              <div className="text-6xl font-bold mb-2">{stats.streak}</div>
              <div className="text-cyan-100 text-lg">days in a row</div>
            </div>

            <div className="stat-card bg-gradient-to-br from-emerald-500 to-green-600 text-white animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Workout Rate</h3>
                <span className="text-4xl">💪</span>
              </div>
              <div className="text-6xl font-bold mb-2">{stats.workout_completion_rate}%</div>
              <div className="text-emerald-100 text-lg">completion</div>
            </div>

            <div className="stat-card bg-gradient-to-br from-orange-500 to-amber-500 text-white animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Diet Rate</h3>
                <span className="text-4xl">🥗</span>
              </div>
              <div className="text-6xl font-bold mb-2">{stats.diet_completion_rate}%</div>
              <div className="text-orange-100 text-lg">adherence</div>
            </div>

            <div className="stat-card bg-gradient-to-br from-purple-500 to-pink-500 text-white animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Days Logged</h3>
                <span className="text-4xl">📊</span>
              </div>
              <div className="text-6xl font-bold mb-2">{stats.total_days_logged}</div>
              <div className="text-purple-100 text-lg">last 30 days</div>
            </div>
          </div>
        )}

        
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 animate-scale-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-4xl">📅</span>
            Today's Log - {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>

          
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">💪</span>
              Workout
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Workout Status</label>
              <select
                value={todayLog.workout_status}
                onChange={(e) => {
                  const status = e.target.value;
                  handleChange('workout_status', status);
                  handleChange('workout_completed', status === 'Completed' || status === 'Partial');
                }}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              >
                <option value="Skipped">❌ Skipped - Didn't workout today</option>
                <option value="Partial">⚡ Partial - Did some exercises</option>
                <option value="Completed">✅ Completed - Finished full workout</option>
              </select>
            </div>

            <textarea
              value={todayLog.workout_notes}
              onChange={(e) => handleChange('workout_notes', e.target.value)}
              placeholder="How did your workout go? Any notes or achievements?"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
              rows="3"
            />
          </div>

          
          <div className="mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">🥗</span>
              Diet
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Diet Adherence</label>
              <select
                value={todayLog.diet_adherence}
                onChange={(e) => {
                  const adherence = e.target.value;
                  handleChange('diet_adherence', adherence);
                  handleChange('diet_followed', adherence === 'Followed' || adherence === 'Mostly');
                }}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
              >
                <option value="Deviated">❌ Deviated - Didn't follow diet plan</option>
                <option value="Mostly">⚡ Mostly - Followed most of the plan</option>
                <option value="Followed">✅ Followed - Stuck to the plan completely</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Calories Consumed</label>
                <input
                  type="number"
                  value={todayLog.calories_consumed}
                  onChange={(e) => handleChange('calories_consumed', parseInt(e.target.value) || 0)}
                  placeholder="2000"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Water Intake (Liters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={todayLog.water_intake_liters}
                  onChange={(e) => handleChange('water_intake_liters', parseFloat(e.target.value) || 0)}
                  placeholder="2.5"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                />
              </div>
            </div>

            <textarea
              value={todayLog.diet_notes}
              onChange={(e) => handleChange('diet_notes', e.target.value)}
              placeholder="Any notes about your meals or nutrition today?"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 resize-none"
              rows="3"
            />
          </div>

          
          <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">🌟</span>
              Wellness
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Energy Level 
                  <span className="ml-2 text-xs text-gray-500">(Affects workout recommendations)</span>
                </label>
                <select
                  value={todayLog.energy_level}
                  onChange={(e) => handleChange('energy_level', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                >
                  <option value="Energized">⚡ Energized - Feeling great!</option>
                  <option value="Normal">😊 Normal - Ready to train</option>
                  <option value="Slightly Fatigued">😌 Slightly Fatigued - A bit tired</option>
                  <option value="Very Tired">😴 Very Tired - Need rest</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mood</label>
                <select
                  value={todayLog.mood}
                  onChange={(e) => handleChange('mood', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                >
                  <option value="Poor">Poor</option>
                  <option value="Fair">Fair</option>
                  <option value="Good">Good</option>
                  <option value="Great">Great</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sleep (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={todayLog.sleep_hours}
                  onChange={(e) => handleChange('sleep_hours', parseFloat(e.target.value) || 0)}
                  placeholder="8"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Weight (kg) - Optional</label>
              <input
                type="number"
                step="0.1"
                value={todayLog.weight_kg}
                onChange={(e) => handleChange('weight_kg', e.target.value)}
                placeholder="Leave empty if not weighing today"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
              />
            </div>
          </div>

          
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={todayLog.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any other thoughts, feelings, or observations about today?"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300 resize-none"
              rows="4"
            />
          </div>

          
          <button
            type="submit"
            disabled={saving}
            className="w-full group relative px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-violet-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden text-lg"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save Daily Log</span>
                </>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyLogPage;
