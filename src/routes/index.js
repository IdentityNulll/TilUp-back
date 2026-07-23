import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import onboardingRoutes from './onboardingRoutes.js';
import courseRoutes from './courseRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/courses', courseRoutes);
router.use('/admin', adminRoutes);

export default router;
