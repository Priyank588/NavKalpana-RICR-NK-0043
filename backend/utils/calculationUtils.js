// Calculate BMI: weight / (height in meters)^2
export const calculateBMI = (weight_kg, height_cm) => {
  const height_m = height_cm / 100;
  return Math.round((weight_kg / (height_m * height_m)) * 10) / 10;
};

// Calculate BMR using Mifflin-St Jeor equation
export const calculateBMR = (weight_kg, height_cm, age, gender) => {
  let bmr;
  
  // Handle both 'gender' and 'biological_sex' for backward compatibility
  const sex = gender || 'Male';
  
  if (sex === 'Male') {
    // Men: (10 × weight) + (6.25 × height) − (5 × age) + 5
    bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5;
  } else {
    // Women and Other: (10 × weight) + (6.25 × height) − (5 × age) − 161
    bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161;
  }
  
  return Math.round(bmr);
};

// Get activity factor from activity level
export const getActivityFactor = (activity_level) => {
  const factors = {
    'Sedentary': 1.2,
    'Light': 1.375,
    'Moderate': 1.55,
    'Active': 1.725
  };
  return factors[activity_level] || 1.2;
};

// Calculate daily calorie target based on goal
export const calculateDailyCalorieTarget = (bmr, activity_factor, goal, gender) => {
  let tdee = bmr * activity_factor;
  let target;
  
  // Handle both 'gender' and 'biological_sex' for backward compatibility
  const sex = gender || 'Male';
  
  if (goal === 'Weight Loss') {
    // Deficit of 300-500 kcal
    target = Math.round(tdee - 400);
  } else if (goal === 'Muscle Gain') {
    // Surplus of 300 kcal
    target = Math.round(tdee + 300);
  } else {
    // Maintenance
    target = Math.round(tdee);
  }
  
  // Enforce safety floors
  const floor = sex === 'Male' ? 1500 : 1200;
  return Math.max(target, floor);
};

// Get macro split percentages based on goal
export const getMacroSplit = (goal) => {
  if (goal === 'Weight Loss') {
    return { protein: 40, carbs: 30, fat: 30 };
  } else if (goal === 'Muscle Gain') {
    return { protein: 30, carbs: 50, fat: 20 };
  } else {
    // Maintenance
    return { protein: 30, carbs: 50, fat: 20 };
  }
};

// Calculate macro grams from calorie target
export const calculateMacros = (daily_calorie_target, goal) => {
  const split = getMacroSplit(goal);
  
  return {
    protein_grams: Math.round((split.protein * daily_calorie_target) / 4),
    carbs_grams: Math.round((split.carbs * daily_calorie_target) / 4),
    fat_grams: Math.round((split.fat * daily_calorie_target) / 9),
    protein_percent: split.protein,
    carbs_percent: split.carbs,
    fat_percent: split.fat
  };
};

// Estimate weeks to goal
export const estimateWeeksToGoal = (current_weight, target_weight, avg_weekly_change) => {
  if (avg_weekly_change === 0 || !avg_weekly_change) return null;
  
  const weight_difference = Math.abs(target_weight - current_weight);
  const weeks = Math.ceil(weight_difference / Math.abs(avg_weekly_change));
  
  return {
    estimated_weeks: weeks,
    estimated_date: new Date(Date.now() + weeks * 7 * 24 * 60 * 60 * 1000),
    confidence: 'Medium'
  };
};

// Detect drop-off risk
export const detectDropoffRisk = (workoutCompletions, dietLogs, lastLogDate) => {
  const risk = {
    at_risk: false,
    reasons: [],
    recommendations: []
  };
  
  // Check for 3 missed workouts in a row
  if (workoutCompletions && workoutCompletions.slice(-3).every(w => w === 'Skipped')) {
    risk.at_risk = true;
    risk.reasons.push('3 missed workouts in a row');
    risk.recommendations.push('Offer lighter plan');
  }
  
  // Check for no log for 14 days
  if (lastLogDate) {
    const daysSinceLog = Math.floor((Date.now() - lastLogDate) / (24 * 60 * 60 * 1000));
    if (daysSinceLog > 14) {
      risk.at_risk = true;
      risk.reasons.push(`No log for ${daysSinceLog} days`);
      risk.recommendations.push('Send motivational message');
    }
  }
  
  // Check for low diet adherence
  if (dietLogs && dietLogs.length >= 2) {
    const recentAdherence = dietLogs.slice(-2).reduce((a, b) => a + b, 0) / 2;
    if (recentAdherence < 40) {
      risk.at_risk = true;
      risk.reasons.push('Diet adherence below 40% for 2 weeks');
      risk.recommendations.push('Offer schedule reset');
    }
  }
  
  return risk;
};
