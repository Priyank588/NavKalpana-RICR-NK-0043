import React, { useState, useEffect } from 'react';
import { workoutService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const WorkoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    fetchWorkout();
  }, []);

  const fetchWorkout = async () => {
    try {
      const res = await workoutService.getLatestWorkout();
      setWorkoutPlan(res.data);
    } catch (err) {
      console.error('Error fetching workout:', err);
      toast.error('Failed to load workout plan');
    } finally {
      setLoading(false);
    }
  };

  const generateNewWorkout = async () => {
    setGenerating(true);
    const loadingToast = toast.loading('Generating your personalized workout plan...');
    try {
      const nextWeek = workoutPlan ? workoutPlan.week_number + 1 : 1;
      const res = await workoutService.generateWorkout(nextWeek);
      setWorkoutPlan(res.data);
      setSelectedDay(0);
      toast.success(`Week ${nextWeek} workout plan ready! 💪`, { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate workout plan', { id: loadingToast });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="page-container flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-4 animate-bounce-subtle">⏳</div>
        <p className="text-2xl font-bold text-gray-900">Loading...</p>
      </div>
    </div>
  );

  const currentDay = workoutPlan?.workouts[selectedDay];

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">💪 Workout Plan</h1>
            <p className="text-gray-600">Your personalized training program</p>
          </div>
          <div className="flex gap-3">
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
              onClick={generateNewWorkout}
              disabled={generating}
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                {generating ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Generate New Plan</span>
                  </>
                )}
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

        {!workoutPlan ? (
          <div className="card p-12 text-center animate-scale-in">
            <div className="text-8xl mb-6 animate-bounce-subtle">💪</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Workout Plan Yet</h2>
            <p className="text-gray-700 text-lg mb-8">Generate your first AI-powered workout plan tailored to your goals!</p>
            <button
              onClick={generateNewWorkout}
              disabled={generating}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden text-lg"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center gap-2">
                {generating ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Generating Your Plan...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Generate Workout Plan</span>
                  </>
                )}
              </span>
            </button>
          </div>
        ) : (
          <>
            {/* Week Summary - AI Generated */}
            {workoutPlan.week_summary && (
              <div className="bg-white border-2 border-violet-200 rounded-2xl p-8 mb-8 animate-slide-up shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">🎯</span>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Week {workoutPlan.week_number} Overview</h2>
                    <p className="text-violet-600 font-semibold">Your training focus this week</p>
                  </div>
                </div>
                <p className="text-xl leading-relaxed text-gray-800">{workoutPlan.week_summary}</p>
              </div>
            )}

            {/* Motivation Message - AI Generated */}
            {workoutPlan.motivation_message && (
              <div className="card border-l-4 border-amber-500 p-6 mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl">💪</span>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">Motivation Boost</p>
                    <p className="text-gray-700 text-lg">{workoutPlan.motivation_message}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Day Selector */}
            <div className="card p-6 mb-8 animate-scale-in">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Select Training Day</h3>
              <div className="grid grid-cols-7 gap-3">
                {workoutPlan.workouts.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(idx)}
                    className={`p-5 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      selectedDay === idx
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-glow scale-105'
                        : day.rest_day
                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        : 'bg-gradient-to-br from-violet-100 to-purple-100 text-gray-900 hover:from-violet-200 hover:to-purple-200'
                    }`}
                  >
                    <div className="text-xs mb-2 uppercase tracking-wide">{day.day_name.slice(0, 3)}</div>
                    <div className="text-3xl mb-1">{day.rest_day ? '🛌' : '💪'}</div>
                    <div className="text-xs opacity-75">Day {day.day}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Current Day Details */}
            {currentDay && (
              <div className="card p-8 mb-8 animate-fade-in">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-4xl font-bold text-gray-900 mb-2">{currentDay.day_name}</h3>
                    <p className="text-2xl text-gray-700 flex items-center gap-2">
                      {currentDay.rest_day ? (
                        <>
                          <span className="text-3xl">🛌</span>
                          <span>Rest & Recovery Day</span>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl">💪</span>
                          <span>{currentDay.type}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-right bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl">
                    <div className="text-sm text-gray-700">Day {currentDay.day}</div>
                    <div className="text-2xl font-bold text-blue-600">Week {workoutPlan.week_number}</div>
                  </div>
                </div>
                
                {currentDay.exercises.length > 0 ? (
                  <div className="space-y-6">
                    {currentDay.exercises.map((exercise, idx) => (
                      <div key={idx} className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-r-2xl hover:shadow-lg transition-all transform hover:-translate-y-1 animate-scale-in" style={{animationDelay: `${idx * 0.1}s`}}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                              {idx + 1}
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900">{exercise.name}</h4>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                            exercise.intensity_level === 'High' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                            exercise.intensity_level === 'Moderate' ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white' :
                            'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
                          }`}>
                            {exercise.intensity_level}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-white border border-blue-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                            <div className="text-4xl font-bold text-blue-600 mb-1">{exercise.sets}</div>
                            <div className="text-sm text-gray-700 font-semibold">Sets</div>
                          </div>
                          <div className="bg-white border border-indigo-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                            <div className="text-4xl font-bold text-indigo-600 mb-1">{exercise.reps}</div>
                            <div className="text-sm text-gray-700 font-semibold">Reps</div>
                          </div>
                          <div className="bg-white border border-emerald-200 p-4 rounded-xl text-center shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                            <div className="text-4xl font-bold text-emerald-600 mb-1">{exercise.rest_seconds}s</div>
                            <div className="text-sm text-gray-700 font-semibold">Rest</div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                          <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="text-xl">📝</span>
                            Form & Guidance
                          </p>
                          <p className="text-gray-700 leading-relaxed">{exercise.guidance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                    <p className="text-7xl mb-4 animate-bounce-subtle">🌟</p>
                    <p className="text-gray-900 text-2xl font-bold mb-2">Rest and recover today!</p>
                    <p className="text-gray-700 text-lg">Your body needs time to adapt and grow stronger.</p>
                  </div>
                )}
              </div>
            )}

            {/* AI-Generated Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Progression Notes */}
              {workoutPlan.progression_notes && (
                <div className="card p-6 hover:shadow-xl transition-shadow animate-slide-up">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-3xl">📈</span>
                    Progression Strategy
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{workoutPlan.progression_notes}</p>
                </div>
              )}

              {/* Recovery Tips */}
              {workoutPlan.recovery_tips && (
                <div className="card p-6 hover:shadow-xl transition-shadow animate-slide-up" style={{animationDelay: '0.1s'}}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-3xl">💤</span>
                    Recovery Tips
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{workoutPlan.recovery_tips}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkoutPage;
