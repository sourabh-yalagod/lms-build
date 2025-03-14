import { Router } from 'express';
import {
  getEnrolledCourses,
  getUserCourseProgress,
  updateCourseProgress,
} from '../controller/userCourseProgress';
const router = Router();
router.get('/:userId/enrolled-courses', getEnrolledCourses);
router.get('/:userId/courses/:courseId', getUserCourseProgress);
router.post('/:userId/courses/:courseId', updateCourseProgress);
export default router;
