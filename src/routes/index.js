import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import onboardingRoutes from './onboardingRoutes.js';
import roadmapRoutes from './roadmapRoutes.js';

const router = Router();

router.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/roadmap', roadmapRoutes);

export default router;
