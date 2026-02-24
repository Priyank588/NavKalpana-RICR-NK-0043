import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getProfile: () =>
    api.get('/auth/profile')
};

// Profile endpoints
export const profileService = {
  createProfile: (profileData) =>
    api.post('/profile', profileData),
  getProfile: () =>
    api.get('/profile'),
  updateProfile: (profileData) =>
    api.put('/profile', profileData)
};

// Workout endpoints
export const workoutService = {
  generateWorkout: (weekNumber = 1) =>
    api.post('/workouts', { week_number: weekNumber }),
  getLatestWorkout: () =>
    api.get('/workouts/latest'),
  getWorkoutByWeek: (weekNumber) =>
    api.get(`/workouts/week/${weekNumber}`),
  getAllWorkouts: () =>
    api.get('/workouts')
};

// Diet endpoints
export const dietService = {
  generateDiet: (weekNumber = 1) =>
    api.post('/diet', { week_number: weekNumber }),
  getLatestDiet: () =>
    api.get('/diet/latest'),
  getDietByWeek: (weekNumber) =>
    api.get(`/diet/week/${weekNumber}`),
  getAllDiets: () =>
    api.get('/diet')
};

// Progress endpoints
export const progressService = {
  logProgress: (weekNumber, weightKg, dailyLogs) =>
    api.post('/progress', { week_number: weekNumber, weight_kg: weightKg, daily_logs: dailyLogs }),
  getProgressByWeek: (weekNumber) =>
    api.get(`/progress/week/${weekNumber}`),
  getAllProgress: () =>
    api.get('/progress'),
  getRecentProgress: (weeks = 12) =>
    api.get(`/progress/recent?weeks=${weeks}`),
  getHabitScores: () =>
    api.get('/progress/habits'),
  getCurrentHabitScore: () =>
    api.get('/progress/habits/current'),
  logEnergy: (energyLevel, notes = '') =>
    api.post('/progress/energy', { energy_level: energyLevel, notes }),
  getRecentEnergyLogs: (days = 7) =>
    api.get(`/progress/energy/recent?days=${days}`),
  logMeasurements: (measurements, notes = '') =>
    api.post('/progress/measurements', { measurements, notes }),
  getLatestMeasurements: () =>
    api.get('/progress/measurements/latest'),
  getAllMeasurements: () =>
    api.get('/progress/measurements'),
  checkDropoffRisk: () =>
    api.get('/progress/dropoff/check'),
  forecastGoal: () =>
    api.get('/progress/forecast/goal')
};

// Assistant endpoints
export const assistantService = {
  askQuestion: (question) =>
    api.post('/assistant/ask', { question })
};

// Daily Log endpoints
export const dailyLogService = {
  logDaily: (logData) =>
    api.post('/daily/log', logData),
  getDailyLog: (date) =>
    api.get(`/daily/date/${date}`),
  getRecentLogs: (days = 30) =>
    api.get(`/daily/recent?days=${days}`),
  getLogsInRange: (startDate, endDate) =>
    api.get(`/daily/range?startDate=${startDate}&endDate=${endDate}`),
  getStreak: () =>
    api.get('/daily/streak'),
  getDailyStats: () =>
    api.get('/daily/stats'),
  getWeeklyAdherence: (weekNumber) =>
    api.get(`/daily/adherence/${weekNumber}`)
};

// Measurement endpoints
export const measurementService = {
  addMeasurement: (measurements, notes = '') =>
    api.post('/measurements', { measurements, notes }),
  getAllMeasurements: () =>
    api.get('/measurements'),
  getLatestMeasurement: () =>
    api.get('/measurements/latest'),
  checkReminder: () =>
    api.get('/measurements/reminder'),
  compareMeasurements: () =>
    api.get('/measurements/compare'),
  getMeasurementHistory: () =>
    api.get('/measurements/history')
};

// Recovery Intelligence endpoints
export const recoveryService = {
  getRecoveryStatus: () =>
    api.get('/recovery/status'),
  getWorkoutRecommendation: (energyLevel) =>
    api.get('/recovery/recommendation', { params: { energy_level: energyLevel } })
};

export default api;
