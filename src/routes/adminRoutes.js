import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as admin from '../controllers/adminController.js';

const router = Router();

router.use(protect);

// Read-only insight — admin AND teacher.
const staff = requireRole('admin', 'teacher');
router.get('/overview', staff, asyncHandler(admin.overview));
router.get('/enrollments', staff, asyncHandler(admin.listEnrollments));

// Everything below is admin-only.
const adminOnly = requireRole('admin');

router.get('/users', adminOnly, asyncHandler(admin.listUsers));
router.patch('/users/:id/role', adminOnly, asyncHandler(admin.updateUserRole));

router.get('/courses', adminOnly, asyncHandler(admin.listAllCourses));
router.post('/courses', adminOnly, asyncHandler(admin.createCourse));
router.patch('/courses/:id', adminOnly, asyncHandler(admin.updateCourse));
router.delete('/courses/:id', adminOnly, asyncHandler(admin.deleteCourse));

router.post('/modules', adminOnly, asyncHandler(admin.createModule));
router.patch('/modules/:id', adminOnly, asyncHandler(admin.updateModule));
router.delete('/modules/:id', adminOnly, asyncHandler(admin.deleteModule));

router.post('/lessons', adminOnly, asyncHandler(admin.createLesson));
router.patch('/lessons/:id', adminOnly, asyncHandler(admin.updateLesson));
router.delete('/lessons/:id', adminOnly, asyncHandler(admin.deleteLesson));

router.get('/onboarding-questions', adminOnly, asyncHandler(admin.listOnboardingQuestions));
router.post('/onboarding-questions', adminOnly, asyncHandler(admin.createOnboardingQuestion));
router.patch('/onboarding-questions/:id', adminOnly, asyncHandler(admin.updateOnboardingQuestion));
router.delete('/onboarding-questions/:id', adminOnly, asyncHandler(admin.deleteOnboardingQuestion));

export default router;
