import express from 'express';
import { getUserProfile, updateProfile, getProfileByUsername, getMyProfile } from '../controllers/profileController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

// Protected Routes (Must be before generic public routes to capture /me)
router.get('/me', protect, getMyProfile);
router.patch('/me', protect, updateProfile);

// Public Routes
router.get('/u/:username', getProfileByUsername);

// only for developer use
router.get('/id/:userId', getUserProfile);

export default router;
