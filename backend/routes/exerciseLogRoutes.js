import express from 'express';
import * as exerciseLogController from '../controllers/exerciseLogController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Log exercise performance
router.post('/log', exerciseLogController.logExercise);

// Get exercise history
router.get('/history/:exercise_name', exerciseLogController.getExerciseHistory);

// Get week exercises
router.get('/week/:week_number', exerciseLogController.getWeekExercises);

// Get progressive overload recommendations
router.get('/overload/:exercise_name', exerciseLogController.getProgressiveOverload);

// Get weekly adherence
router.get('/adherence/:week_number', exerciseLogController.getWeeklyAdherence);

export default router;
