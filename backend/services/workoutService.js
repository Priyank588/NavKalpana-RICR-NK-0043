import mongoose from 'mongoose';
import WorkoutPlan from '../models/WorkoutPlanV2.js';
import ProgressLog from '../models/ProgressLog.js';
import { generateWeeklyWorkout } from '../utils/workoutGenerator.js';
import { generateAIWorkoutPlan } from './groqService.js';
import { getWeekExercises, calculateProgressiveOverload } from './exerciseLogService.js';
import Profile from '../models/Profile.js';
import { checkRecoveryNeeded, adjustWorkoutForRecovery } from './recoveryService.js';

export const generateWorkoutPlan = async (user_id, week_number = 1) => {
  // Get user profile for goal and experience level
  const profile = await Profile.findOne({ user_id });
  
  if (!profile) {
    throw new Error('Profile not found. Please complete profile setup first.');
  }
  
  // Determine training frequency based on activity level and available days
  let trainingDaysPerWeek = profile.available_days_per_week || 4;
  
  // Adjust based on activity level
  if (profile.activity_level === 'Sedentary' && trainingDaysPerWeek > 3) {
    trainingDaysPerWeek = 3; // Limit sedentary users to 3 days initially
    console.log('⚠️ Reduced training days to 3 for sedentary activity level');
  } else if (profile.activity_level === 'Active' && trainingDaysPerWeek < 5) {
    trainingDaysPerWeek = Math.min(trainingDaysPerWeek + 1, 6); // Active users can handle more
    console.log('✅ Increased training days for active lifestyle');
  }
  
  let workoutDays, weekSummary, progressionNotes, recoveryTips, motivationMessage;
  
  // Debug: Check API key
  console.log('🔍 Checking Groq API key for workout generation...');
  console.log('API Key exists:', !!process.env.GROQ_API_KEY);
  
  // Try to use AI if API key is configured
  if (process.env.GROQ_API_KEY && 
      process.env.GROQ_API_KEY !== 'your_groq_api_key_here' && 
      process.env.GROQ_API_KEY.trim() !== '') {
    try {
      console.log(`✅ Groq API configured! Generating AI-powered workout plan for user ${user_id}, week ${week_number}...`);
      const aiPlan = await generateAIWorkoutPlan(user_id, week_number);
      workoutDays = aiPlan.weekly_schedule;
      weekSummary = aiPlan.week_summary;
      progressionNotes = aiPlan.progression_notes;
      recoveryTips = aiPlan.recovery_tips;
      motivationMessage = aiPlan.motivation_message;
    } catch (error) {
      console.error('❌ Groq AI generation failed, falling back to template:', error.message);
      // Fallback to template-based generation with injury filtering and activity level
      workoutDays = generateWeeklyWorkout(
        profile.goal, 
        profile.experience_level, 
        'Normal', 
        profile.injuries_limitations,
        trainingDaysPerWeek,
        profile.activity_level
      );
      weekSummary = `Week ${week_number} - ${profile.experience_level} ${profile.goal} Program (${trainingDaysPerWeek} days/week)`;
      if (profile.injuries_limitations && profile.injuries_limitations.trim() !== '') {
        weekSummary += ` (Modified for: ${profile.injuries_limitations})`;
      }
    }
  } else {
    console.log('⚠️  Using template-based workout generation (Groq AI not configured)');
    // Use template-based generation with injury filtering
    workoutDays = generateWeeklyWorkout(profile.goal, profile.experience_level, 'Normal', profile.injuries_limitations);
    weekSummary = `Week ${week_number} - ${profile.experience_level} ${profile.goal} Program`;
    if (profile.injuries_limitations && profile.injuries_limitations.trim() !== '') {
      weekSummary += ` (Modified for: ${profile.injuries_limitations})`;
    }
  }
  
  // Validate workoutDays is an array
  if (!Array.isArray(workoutDays)) {
    console.error('workoutDays is not an array:', typeof workoutDays, workoutDays);
    throw new Error('Invalid workout data structure');
  }
  
  console.log(`Creating workout plan with ${workoutDays.length} days`);
  console.log('First workout day structure:', JSON.stringify(workoutDays[0], null, 2));
  
  // Apply progressive overload if this is week 2+
  if (week_number > 1) {
    try {
      const previousWeekExercises = await getWeekExercises(user_id, week_number - 1);
      
      if (previousWeekExercises.length > 0) {
        console.log(`📈 Applying progressive overload based on week ${week_number - 1} performance...`);
        
        // Apply progressive overload to each exercise
        for (const day of workoutDays) {
          if (day.exercises && day.exercises.length > 0) {
            for (const exercise of day.exercises) {
              const overloadRec = await calculateProgressiveOverload(user_id, exercise.name);
              
              if (overloadRec.recommendation === 'increase_weight') {
                exercise.guidance += ` | 💪 INCREASE WEIGHT: Add ${overloadRec.suggested_weight_increase}kg from last week`;
                exercise.intensity_level = 'High';
              } else if (overloadRec.recommendation === 'increase_reps') {
                // Increase reps
                const currentReps = exercise.reps.split('-');
                if (currentReps.length === 2) {
                  const newMin = parseInt(currentReps[0]) + 2;
                  const newMax = parseInt(currentReps[1]) + 2;
                  exercise.reps = `${newMin}-${newMax}`;
                  exercise.guidance += ` | 📈 INCREASED REPS: ${overloadRec.reason}`;
                }
              } else if (overloadRec.recommendation === 'decrease') {
                exercise.guidance += ` | ⚠️ REDUCE INTENSITY: ${overloadRec.reason}`;
                exercise.intensity_level = 'Light';
              }
            }
          }
        }
        
        progressionNotes = progressionNotes || 'Progressive overload applied based on your previous week\'s performance. Keep pushing!';
      }
    } catch (error) {
      console.log('Could not apply progressive overload:', error.message);
    }
  }
  
  // Create plain object first
  const workoutData = {
    user_id,
    week_number,
    goal: profile.goal,
    experience_level: profile.experience_level,
    fatigue_status: 'Normal',
    workouts: JSON.parse(JSON.stringify(workoutDays)), // Deep clone to avoid reference issues
    week_summary: weekSummary,
    progression_notes: progressionNotes,
    recovery_tips: recoveryTips,
    motivation_message: motivationMessage
  };
  
  console.log('About to save workout data...');
  console.log('Workouts array length:', workoutData.workouts.length);
  
  try {
    // Use insertOne directly to bypass Mongoose issues
    const result = await mongoose.connection.db.collection('workoutplans').insertOne(workoutData);
    console.log('✅ Workout plan saved successfully with ID:', result.insertedId);
    
    // Fetch the saved document
    const savedPlan = await mongoose.connection.db.collection('workoutplans').findOne({ _id: result.insertedId });
    console.log('Saved plan has', savedPlan.workouts.length, 'workout days');
    
    return savedPlan;
  } catch (saveError) {
    console.error('❌ Error saving workout plan:', saveError.message);
    throw saveError;
  }
};

export const getLatestWorkoutPlan = async (user_id) => {
  let workoutPlan = await WorkoutPlan.findOne({ user_id }).sort({ created_at: -1 });
  
  if (!workoutPlan) {
    // Generate first week plan if none exists
    workoutPlan = await generateWorkoutPlan(user_id, 1);
  }
  
  // Check recovery status and adjust workout if needed
  try {
    const recoveryStatus = await checkRecoveryNeeded(user_id);
    if (recoveryStatus.recovery_needed || recoveryStatus.current_energy === 'Very Tired' || recoveryStatus.current_energy === 'Slightly Fatigued') {
      workoutPlan = await adjustWorkoutForRecovery(user_id, workoutPlan, recoveryStatus);
    }
  } catch (error) {
    console.error('Error checking recovery status:', error);
    // Continue with original workout plan if recovery check fails
  }
  
  return workoutPlan;
};

export const getWorkoutPlanByWeek = async (user_id, week_number) => {
  const workoutPlan = await WorkoutPlan.findOne({ user_id, week_number });
  
  if (!workoutPlan) {
    throw new Error('Workout plan not found for this week');
  }
  
  return workoutPlan;
};

export const getAllWorkoutPlans = async (user_id) => {
  return await WorkoutPlan.find({ user_id }).sort({ week_number: 1 });
};
