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
    dietary_preferences: 'No Preference',
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

  // Dropdown options
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const activityLevelOptions = [
    { value: 'Sedentary', label: 'Sedentary (Little or no exercise)' },
    { value: 'Light', label: 'Light (Exercise 1-3 days/week)' },
    { value: 'Moderate', label: 'Moderate (Exercise 3-5 days/week)' },
    { value: 'Active', label: 'Active (Exercise 6-7 days/week)' },
    { value: 'Very Active', label: 'Very Active (Physical job or intense training)' }
  ];
  const experienceLevelOptions = ['Beginner', 'Intermediate', 'Advanced'];
  const goalOptions = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Body Recomposition'];
  const trainingDaysOptions = [1, 2, 3, 4, 5, 6, 7];
  const dietaryPreferenceOptions = [
    'No Preference',
    'Vegetarian',
    'Vegan',
    'Pescatarian',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Low Carb',
    'High Protein',
    'Gluten Free'
  ];

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
        dietary_preferences: formData.dietary_preferences === 'No Preference' ? '' : formData.dietary_preferences,
        initial_measurements: hasMeasurements ? formData.initial_measurements : undefined
      };
      
      await profileService.createProfile(profilePayload);
      toast.success('Profile created successfully! Welcome to FitAI', { id: loadingToast });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create profile', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Complete Your Profile</h1>
            <p className="text-gray-600 text-lg">Provide your information to receive personalized fitness and nutrition plans</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                    min="13"
                    max="120"
                    placeholder="Enter your age"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  >
                    {genderOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Physical Metrics Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Physical Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Height (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="height_cm"
                    value={formData.height_cm}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                    min="100"
                    max="250"
                    placeholder="e.g., 170"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Current Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight_kg"
                    value={formData.weight_kg}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                    min="30"
                    max="500"
                    placeholder="e.g., 70.5"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Target Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="target_weight_kg"
                    value={formData.target_weight_kg}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                    min="30"
                    max="500"
                    placeholder="e.g., 65.0"
                  />
                </div>
              </div>
            </div>

            {/* Fitness Profile Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Fitness Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Activity Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="activity_level"
                    value={formData.activity_level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  >
                    {activityLevelOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  >
                    {experienceLevelOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Fitness Goal <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  >
                    {goalOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Training Days per Week <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="available_days_per_week"
                    value={formData.available_days_per_week}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  >
                    {trainingDaysOptions.map(days => (
                      <option key={days} value={days}>{days} {days === 1 ? 'day' : 'days'} per week</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dietary Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Dietary Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Dietary Preferences
                  </label>
                  <select
                    name="dietary_preferences"
                    value={formData.dietary_preferences}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    {dietaryPreferenceOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-2">Select your dietary preference to customize your nutrition plan</p>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Food Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="e.g., Nuts, Dairy, Gluten, Shellfish"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <p className="text-sm text-gray-500 mt-2">List any food allergies to avoid in your diet plan</p>
                </div>
              </div>
            </div>

            {/* Health & Safety Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Health & Safety</h2>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Injuries or Physical Limitations
                </label>
                <textarea
                  name="injuries_limitations"
                  value={formData.injuries_limitations}
                  onChange={handleChange}
                  placeholder="Describe any injuries, chronic conditions, or physical limitations (e.g., Lower back pain, Knee injury, Shoulder issues)"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  rows="4"
                />
                <p className="text-sm text-gray-500 mt-2">This information helps us customize your workout plan for safety and effectiveness</p>
              </div>
            </div>

            {/* Body Measurements Section - OPTIONAL */}
            <div className="mb-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Body Measurements (Optional)</h3>
                    <p className="text-sm text-gray-600 mt-1">Track your progress beyond weight with detailed measurements</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMeasurements(!showMeasurements)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold"
                  >
                    {showMeasurements ? 'Hide' : 'Add Measurements'}
                  </button>
                </div>

                {showMeasurements && (
                  <>
                    <p className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <strong>Note:</strong> Measurements help track muscle gain and fat loss more accurately than weight alone. You'll receive reminders every 4 weeks to update them.
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
                          placeholder="e.g., 80.0"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
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
                          placeholder="e.g., 95.0"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
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
                          placeholder="e.g., 100.0"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
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
                          placeholder="e.g., 35.0"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
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
                          placeholder="e.g., 55.0"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Setting up your profile...' : 'Complete Setup & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
