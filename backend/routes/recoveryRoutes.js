import express from 'express';
import { getRecoveryStatus, getWorkoutRecommendation } from '../controllers/recoveryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get recovery status (checks last 7 days for fatigue patterns)
router.get('/status', authMiddleware, getRecoveryStatus);

// Get workout adjustment recommendation based on energy level
router.get('/recommendation', authMiddleware, getWorkoutRecommendation);

export default router;
