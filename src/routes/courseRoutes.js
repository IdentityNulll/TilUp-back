import { Router } from 'express';
import {
  listCourses,
  getCourse,
  getCourseRoadmap,
  enroll,
  completeNode,
  myEnrollments,
} from '../controllers/courseController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect);

router.get('/', asyncHandler(listCourses));
router.get('/me/enrollments', asyncHandler(myEnrollments));
router.get('/:id', asyncHandler(getCourse));
router.get('/:id/roadmap', asyncHandler(getCourseRoadmap));
router.post('/:id/enroll', asyncHandler(enroll));
router.post('/:id/nodes/:nodeId/complete', asyncHandler(completeNode));

export default router;
