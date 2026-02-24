import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  // Enhanced workout tracking with status
  workout_completed: {
    type: Boolean,
    default: false
  },
  workout_status: {
    type: String,
    enum: ['Completed', 'Partial', 'Skipped'],
    default: 'Skipped'
  },
  workout_notes: {
    type: String,
    default: ''
  },
  // Enhanced diet tracking with adherence level
  diet_followed: {
    type: Boolean,
    default: false
  },
  diet_adherence: {
    type: String,
    enum: ['Followed', 'Mostly', 'Deviated'],
    default: 'Deviated'
  },
  diet_notes: {
    type: String,
    default: ''
  },
  calories_consumed: {
    type: Number,
    default: 0
  },
  water_intake_liters: {
    type: Number,
    default: 0
  },
  energy_level: {
    type: String,
    enum: ['Energized', 'Normal', 'Slightly Fatigued', 'Very Tired'],
    default: 'Normal'
  },
  mood: {
    type: String,
    enum: ['Poor', 'Fair', 'Good', 'Great', 'Excellent'],
    default: 'Good'
  },
  sleep_hours: {
    type: Number,
    default: 0
  },
  weight_kg: {
    type: Number
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
dailyLogSchema.index({ user_id: 1, date: -1 });

// Ensure one log per user per day
dailyLogSchema.index({ user_id: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyLog', dailyLogSchema);
