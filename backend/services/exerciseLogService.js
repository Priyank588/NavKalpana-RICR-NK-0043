import ExerciseLog from '../models/ExerciseLog.js';

// Log exercise performance
export const logExercise = async (user_id, exerciseData) => {
  const exerciseLog = new ExerciseLog({
    user_id,
    ...exerciseData
  });
  
  await exerciseLog.save();
  return exerciseLog;
};

// Get exercise history for a specific exercise
export const getExerciseHistory = async (user_id, exercise_name, limit = 10) => {
  return await ExerciseLog.find({
    user_id,
    exercise_name
  })
    .sort({ created_at: -1 })
    .limit(limit);
};

// Get all exercises for a specific week
export const getWeekExercises = async (user_id, week_number) => {
  return await ExerciseLog.find({
    user_id,
    week_number
  }).sort({ day_number: 1, created_at: 1 });
};

// Calculate progressive overload recommendations
export const calculateProgressiveOverload = async (user_id, exercise_name) => {
  const history = await getExerciseHistory(user_id, exercise_name, 3);
  
  if (history.length < 2) {
    return {
      recommendation: 'maintain',
      reason: 'Need more data to calculate progression'
    };
  }
  
  // Analyze last 2-3 workouts
  const recentPerformance = history.slice(0, 2);
  
  // Check if user completed all sets with "Too Easy" difficulty
  const allTooEasy = recentPerformance.every(log => 
    log.set_details.every(set => set.difficulty === 'Too Easy')
  );
  
  // Check if user completed all sets
  const allCompleted = recentPerformance.every(log => 
    log.completion_status === 'Completed' && 
    log.sets_completed === log.sets_planned
  );
  
  // Check if user struggled (Too Hard or didn't complete)
  const struggled = recentPerformance.some(log => 
    log.completion_status !== 'Completed' ||
    log.set_details.some(set => set.difficulty === 'Too Hard')
  );
  
  if (allTooEasy && allCompleted) {
    return {
      recommendation: 'increase_weight',
      reason: 'Exercise is too easy - increase weight by 2.5-5kg',
      suggested_weight_increase: 2.5
    };
  } else if (allCompleted && !struggled) {
    return {
      recommendation: 'increase_reps',
      reason: 'Good performance - increase reps by 2',
      suggested_rep_increase: 2
    };
  } else if (struggled) {
    return {
      recommendation: 'decrease',
      reason: 'Exercise is too challenging - reduce weight or reps',
      suggested_weight_decrease: 2.5
    };
  }
  
  return {
    recommendation: 'maintain',
    reason: 'Current intensity is appropriate'
  };
};

// Get weekly adherence from exercise logs
export const getWeeklyAdherence = async (user_id, week_number) => {
  const exercises = await getWeekExercises(user_id, week_number);
  
  if (exercises.length === 0) return 0;
  
  const completed = exercises.filter(e => e.completion_status === 'Completed').length;
  const partial = exercises.filter(e => e.completion_status === 'Partial').length;
  
  // Completed = 100%, Partial = 50%, Skipped = 0%
  const score = ((completed * 100) + (partial * 50)) / exercises.length;
  
  return Math.round(score);
};
