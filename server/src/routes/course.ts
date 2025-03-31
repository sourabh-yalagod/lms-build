import { Router } from 'express';
import {
  allCourses,
  courseById,
  createCourse,
  deleteCourse,
  getUploadVideoUrl,
  updateCourse,
} from '../controller/courses';
import { requireAuth } from '@clerk/express';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
// public Routers
router.get('/', allCourses);
router.get('/:courseId', courseById);

// Private Routers
router.post('/', requireAuth(), createCourse);
router.put('/:courseId', requireAuth(), upload.none(), updateCourse);
router.delete('/:courseId', requireAuth(), deleteCourse);
router.post(
  '/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url',
  getUploadVideoUrl
);

export default router;
