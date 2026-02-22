import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/apiService';
import toast from 'react-hot-toast';

export const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    height_cm: '',
    weight_kg: '',
    activity_level: 'Moderate',
    experience_level: 'Beginner',
    goal: 'Weight Loss',
    target_weight_kg: '',
    available_days_per_week: 4,
    dietary_preferences: '',
    allergies: '',
    injuries_limitations: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (['age', 'height_cm', 'weight_kg', 'target_weight_kg', 'available_days_per_week'].includes(name)) {
      // Only set if value is not empty, otherwise keep as empty string
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else {
      // Handle text fields
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const loadingToast = toast.loading('Setting up your profile...');
    try {
      await profileService.createProfile(formData);
      toast.success('Profile created! Welcome to FitAI 🎉', { id: loadingToast });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create profile', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-10">📊</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-float opacity-10" style={{animationDelay: '1s'}}>💪</div>
        <div className="absolute top-1/2 right-20 text-6xl animate-float opacity-10" style={{animationDelay: '2s'}}>🎯</div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass-card p-10 animate-scale-in border border-cyan-500/20">
          <div className="text-center mb-10">
            <div className="text-7xl mb-4 animate-bounce-subtle">🎯</div>
            <h1 className="text-5xl font-bold gradient-text mb-3">Complete Your Profile</h1>
            <p className="text-gray-400 text-lg">Tell us about yourself to get personalized plans</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-slide-up">
                <label className="block text-gray-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-cyan-400">🎂</span>
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  required
                  min="13"
                  max="120"
                  placeholder="25"
                />
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.05s'}}>
                <label className="block text-gray-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-cyan-400">👤</span>
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  required
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                <label className="block text-gray-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-cyan-400">📏</span>
                  Height (cm) *
                </label>
                <input
                  type="number"
                  name="height_cm"
                  value={formData.height_cm}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  required
                  min="100"
                  max="250"
                  placeholder="170"
                />
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.15s'}}>
                <label className="block text-gray-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-cyan-400">⚖️</span>
                  Current Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  required
                  min="30"
                  max="500"
                  placeholder="70"
                />
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                <label className="block text-gray-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-cyan-400">🏃</span>
                  Activity Level *
                </label>
                <select
                  name="activity_level"
                  value={formData.activity_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  required
                >
                  <option>Sedentary</option>
                  <option>Light</option>
                  <option>Moderate</option>
                  <option>Active</option>
                </select>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.25s'}}>
                <label className="block text-gray-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-cyan-400">💪</span>
                  Experience Level *
                </label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  required
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
                <label className="block text-gray-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-cyan-400">🎯</span>
                  Goal *
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  required
                >
                  <option>Weight Loss</option>
                  <option>Muscle Gain</option>
                  <option>Maintenance</option>
                </select>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.35s'}}>
                <label className="block text-gray-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-cyan-400">🎯</span>
                  Target Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="target_weight_kg"
                  value={formData.target_weight_kg}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  required
                  min="30"
                  max="500"
                  placeholder="65"
                />
              </div>

              <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
                <label className="block text-gray-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-cyan-400">📅</span>
                  Training Days per Week *
                </label>
                <input
                  type="number"
                  name="available_days_per_week"
                  value={formData.available_days_per_week}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  required
                  min="1"
                  max="7"
                  placeholder="4"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 animate-slide-up" style={{animationDelay: '0.45s'}}>
                <label className="block text-gray-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-emerald-400">🥗</span>
                  Dietary Preferences
                </label>
                <input
                  type="text"
                  name="dietary_preferences"
                  value={formData.dietary_preferences}
                  onChange={handleChange}
                  placeholder="e.g., Vegetarian, Vegan, Keto, Paleo"
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                />
                <p className="text-sm text-gray-500 mt-2">Optional: Specify your dietary preferences</p>
              </div>
              
              <div className="col-span-1 md:col-span-2 animate-slide-up" style={{animationDelay: '0.5s'}}>
                <label className="block text-gray-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-orange-400">⚠️</span>
                  Food Allergies
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="e.g., Nuts, Dairy, Gluten, Shellfish"
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                />
                <p className="text-sm text-gray-500 mt-2">Important: List any food allergies to avoid in your diet plan</p>
              </div>
              
              <div className="col-span-1 md:col-span-2 animate-slide-up" style={{animationDelay: '0.55s'}}>
                <label className="block text-gray-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-red-400">🩹</span>
                  Injuries or Physical Limitations
                </label>
                <textarea
                  name="injuries_limitations"
                  value={formData.injuries_limitations}
                  onChange={handleChange}
                  placeholder="e.g., Lower back pain, Knee injury, Shoulder issues"
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 resize-none"
                  rows="3"
                />
                <p className="text-sm text-gray-500 mt-2">Important: Describe any injuries or limitations to customize your workout plan</p>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative px-6 py-4 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden mt-8 text-lg animate-slide-up"
              style={{animationDelay: '0.6s'}}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Setting up your profile...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Complete Setup & Start Your Journey</span>
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
