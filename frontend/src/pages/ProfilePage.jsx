import React, { useState, useEffect } from 'react';
import { profileService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight_kg: '',
    height_cm: '',
    goal: '',
    target_weight_kg: '',
    experience_level: '',
    available_days_per_week: '',
    dietary_preferences: '',
    allergies: '',
    injuries_limitations: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await profileService.getProfile();
      setProfile(res.data);
      setFormData({
        age: res.data.age,
        gender: res.data.gender,
        weight_kg: res.data.weight_kg,
        height_cm: res.data.height_cm,
        goal: res.data.goal,
        target_weight_kg: res.data.target_weight_kg,
        experience_level: res.data.experience_level,
        available_days_per_week: res.data.available_days_per_week,
        dietary_preferences: res.data.dietary_preferences || '',
        allergies: res.data.allergies || '',
        injuries_limitations: res.data.injuries_limitations || ''
      });
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading('Updating your profile...');
    try {
      await profileService.updateProfile(formData);
      toast.success('Profile updated successfully! ✅', { id: loadingToast });
      setEditing(false);
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile', { id: loadingToast });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-4 animate-bounce-subtle">⏳</div>
        <p className="text-2xl font-bold text-white">Loading your profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">👤 My Profile</h1>
            <p className="text-gray-400">Manage your fitness profile and preferences</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative px-6 py-3 bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 text-white font-bold rounded-xl hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <span className="relative flex items-center gap-2">
                <span className="text-xl">🏠</span>
                <span>Back to Dashboard</span>
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

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 animate-scale-in">{!editing ? (
            // View Mode
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Profile Information</h2>
                <button
                  onClick={() => setEditing(true)}
                  className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    <span>✏️</span>
                    <span>Edit Profile</span>
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Age</label>
                  <p className="text-white text-xl font-semibold">{profile.age} years</p>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Gender</label>
                  <p className="text-white text-xl font-semibold">{profile.gender}</p>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Current Weight</label>
                  <p className="text-white text-xl font-semibold">{profile.weight_kg} kg</p>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Height</label>
                  <p className="text-white text-xl font-semibold">{profile.height_cm} cm</p>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Goal</label>
                  <p className="text-white text-xl font-semibold">{profile.goal}</p>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Target Weight</label>
                  <p className="text-white text-xl font-semibold">{profile.target_weight_kg} kg</p>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Experience Level</label>
                  <p className="text-white text-xl font-semibold">{profile.experience_level}</p>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Training Days/Week</label>
                  <p className="text-white text-xl font-semibold">{profile.available_days_per_week} days</p>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Daily Calorie Target</label>
                  <p className="text-white text-xl font-semibold">{profile.daily_calorie_target} kcal</p>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Dietary Preferences</label>
                  <p className="text-white text-lg">{profile.dietary_preferences || 'None specified'}</p>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Food Allergies</label>
                  <p className="text-white text-lg">{profile.allergies || 'None specified'}</p>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/30 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Injuries/Limitations</label>
                  <p className="text-white text-lg">{profile.injuries_limitations || 'None specified'}</p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Edit Profile</h2>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="group relative px-6 py-3 bg-slate-700/50 border-2 border-slate-600 text-white font-bold rounded-xl hover:bg-slate-600/50 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <span>❌</span>
                    <span>Cancel</span>
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight_kg"
                    value={formData.weight_kg}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    name="height_cm"
                    value={formData.height_cm}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Goal</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    required
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Target Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="target_weight_kg"
                    value={formData.target_weight_kg}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Experience Level</label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Training Days/Week</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    name="available_days_per_week"
                    value={formData.available_days_per_week}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Dietary Preferences</label>
                  <input
                    type="text"
                    name="dietary_preferences"
                    value={formData.dietary_preferences}
                    onChange={handleChange}
                    placeholder="e.g., Vegetarian, Vegan, Keto"
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Food Allergies</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="e.g., Nuts, Dairy, Gluten"
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Injuries/Limitations</label>
                  <textarea
                    name="injuries_limitations"
                    value={formData.injuries_limitations}
                    onChange={handleChange}
                    placeholder="e.g., Lower back pain, Knee injury"
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 resize-none"
                    rows="3"
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="group relative px-6 py-4 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 w-full text-lg overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    <span>💾</span>
                    <span>Save Changes</span>
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
