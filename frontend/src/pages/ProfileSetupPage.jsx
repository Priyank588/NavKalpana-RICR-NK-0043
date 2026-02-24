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
    injuries_limitations: '',
    initial_measurements: {
      waist_cm: '',
      chest_cm: '',
      hips_cm: '',
      arms_cm: '',
      thighs_cm: ''
    }
  });
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle measurement fields
    if (name.startsWith('measurement_')) {
      const measurementField = name.replace('measurement_', '');
      setFormData(prev => ({
        ...prev,
        initial_measurements: {
          ...prev.initial_measurements,
          [measurementField]: value === '' ? '' : Number(value)
        }
      }));
    }
    // Handle numeric fields
    else if (['age', 'height_cm', 'weight_kg', 'target_weight_kg', 'available_days_per_week'].includes(name)) {
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
      // Clean up measurements - only send if at least one field is filled
      const hasMeasurements = Object.values(formData.initial_measurements).some(val => val !== '');
      const profilePayload = {
        ...formData,
        initial_measurements: hasMeasurements ? formData.initial_measurements : undefined
      };
      
      await profileService.createProfile(profilePayload);
      toast.success('Profile created! Welcome to FitAI 🎉', { id: loadingToast });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create profile', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-20">📊</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-float opacity-20" style={{animationDelay: '1s'}}>💪</div>
        <div className="absolute top-1/2 right-20 text-6xl animate-float opacity-20" style={{animationDelay: '2s'}}>🎯</div>
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl p-10 animate-scale-in">
          <div className="text-center mb-10">
            <div className="text-7xl mb-4 animate-bounce-subtle">🎯</div>
            <h1 className="text-5xl font-bold gradient-text mb-3">Complete Your Profile</h1>
            <p className="text-gray-600 text-lg">Tell us about yourself to get personalized plans</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-slide-up">
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <span className="text-violet-600">🎂</span>
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                  required
                  min="13"
                  max="120"
                  placeholder="25"
                />
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.05s'}}>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <span className="text-violet-600">👤</span>
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                  required
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <span className="text-blue-600">📏</span>
                  Height (cm) *
                </label>
                <input
                  type="number"
                  name="height_cm"
                  value={formData.height_cm}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  required
                  min="100"
                  max="250"
                  placeholder="170"
                />
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.15s'}}>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <span className="text-blue-600">⚖️</span>
                  Current Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  required
                  min="30"
                  max="500"
                  placeholder="70"
                />
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <span className="text-green-600">🏃</span>
                  Activity Level *
                </label>
                <select
                  name="activity_level"
                  value={formData.activity_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                  required
                >
                  <option>Sedentary</option>
                  <option>Light</option>
                  <option>Moderate</option>
                  <option>Active</option>
                </select>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.25s'}}>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <span className="text-purple-600">💪</span>
                  Experience Level *
                </label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                  required
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <span className="text-pink-600">🎯</span>
                  Goal *
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                  required
                >
                  <option>Weight Loss</option>
                  <option>Muscle Gain</option>
                  <option>Maintenance</option>
                </select>
              </div>
              
              <div className="animate-slide-up" style={{animationDelay: '0.35s'}}>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <span className="text-pink-600">🎯</span>
                  Target Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="target_weight_kg"
                  value={formData.target_weight_kg}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                  required
                  min="30"
                  max="500"
                  placeholder="65"
                />
              </div>

              <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <span className="text-indigo-600">📅</span>
                  Training Days per Week *
                </label>
                <input
                  type="number"
                  name="available_days_per_week"
                  value={formData.available_days_per_week}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                  required
                  min="1"
                  max="7"
                  placeholder="4"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 animate-slide-up" style={{animationDelay: '0.45s'}}>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <span className="text-emerald-600">🥗</span>
                  Dietary Preferences
                </label>
                <input
                  type="text"
                  name="dietary_preferences"
                  value={formData.dietary_preferences}
                  onChange={handleChange}
                  placeholder="e.g., Vegetarian, Vegan, Keto, Paleo"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
                />
                <p className="text-sm text-gray-500 mt-2">Optional: Specify your dietary preferences</p>
              </div>
              
              <div className="col-span-1 md:col-span-2 animate-slide-up" style={{animationDelay: '0.5s'}}>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <span className="text-orange-600">⚠️</span>
                  Food Allergies
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="e.g., Nuts, Dairy, Gluten, Shellfish"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                />
                <p className="text-sm text-gray-500 mt-2">Important: List any food allergies to avoid in your diet plan</p>
              </div>
              
              <div className="col-span-1 md:col-span-2 animate-slide-up" style={{animationDelay: '0.55s'}}>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <span className="text-red-600">🩹</span>
                  Injuries or Physical Limitations
                </label>
                <textarea
                  name="injuries_limitations"
                  value={formData.injuries_limitations}
                  onChange={handleChange}
                  placeholder="e.g., Lower back pain, Knee injury, Shoulder issues"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 resize-none"
                  rows="3"
                />
                <p className="text-sm text-gray-500 mt-2">Important: Describe any injuries or limitations to customize your workout plan</p>
              </div>

              {/* Body Measurements Section - OPTIONAL */}
              <div className="col-span-1 md:col-span-2 animate-slide-up" style={{animationDelay: '0.6s'}}>
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border-2 border-violet-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📏</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Body Measurements (Optional)</h3>
                        <p className="text-sm text-gray-600">Track your progress beyond just weight</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMeasurements(!showMeasurements)}
                      className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-all text-sm font-semibold"
                    >
                      {showMeasurements ? 'Hide' : 'Add Measurements'}
                    </button>
                  </div>

                  {showMeasurements && (
                    <>
                      <p className="text-sm text-gray-600 mb-4">
                        💡 Measurements help track muscle gain and fat loss better than weight alone. You'll get reminders every 4 weeks to update them.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Waist (cm)</label>
                          <input
                            type="number"
                            step="0.1"
                            name="measurement_waist_cm"
                            value={formData.initial_measurements.waist_cm}
                            onChange={handleChange}
                            placeholder="e.g., 80"
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Chest (cm)</label>
                          <input
                            type="number"
                            step="0.1"
                            name="measurement_chest_cm"
                            value={formData.initial_measurements.chest_cm}
                            onChange={handleChange}
                            placeholder="e.g., 95"
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Hips (cm)</label>
                          <input
                            type="number"
                            step="0.1"
                            name="measurement_hips_cm"
                            value={formData.initial_measurements.hips_cm}
                            onChange={handleChange}
                            placeholder="e.g., 100"
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Arms (cm)</label>
                          <input
                            type="number"
                            step="0.1"
                            name="measurement_arms_cm"
                            value={formData.initial_measurements.arms_cm}
                            onChange={handleChange}
                            placeholder="e.g., 35"
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Thighs (cm)</label>
                          <input
                            type="number"
                            step="0.1"
                            name="measurement_thighs_cm"
                            value={formData.initial_measurements.thighs_cm}
                            onChange={handleChange}
                            placeholder="e.g., 55"
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-violet-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden mt-8 text-lg animate-slide-up"
              style={{animationDelay: '0.6s'}}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
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
