import { Router } from 'express';
import { loginWithTelegram } from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/telegram', asyncHandler(loginWithTelegram));

export default router;
