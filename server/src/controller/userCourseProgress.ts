import { getAuth } from '@clerk/express';
import { Request, Response } from 'express';
import UserCourseProgress from '../models/userCourseProgressModel';
import Course from '../models/courseModel';
import { calculateOverallProgress, mergeSections } from '../utils/utils';

const getEnrolledCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params || getAuth(req);
  const enrollment = await UserCourseProgress.query('userId').eq(userId).exec();
  const courseIds = enrollment.map((progress: any) => progress?.courseId);
  const courses = await Course.batchGet(courseIds);
  if (!courses) {
    res.status(401).json({
      message: 'Enrolled Courses fetching failed.....!',
      success: false,
    });
    return;
  }
  res.status(201).json({
    message: 'Enrolled Courses fetched successfully.',
    success: true,
    data: courses,
  });
  return;
};

const getUserCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;
  const course = await UserCourseProgress.get({ courseId, userId });
  if (!course) {
    res.status(401).json({
      message: 'course progress fetching faield.....!',
      success: false,
    });
    return;
  }
  res.status(201).json({
    message: 'Enrolled Courses fetched successfully.',
    success: true,
    data: course,
  });
  return;
};

const updateCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;
  const updateProgressData = req.body;

  let progress = await UserCourseProgress.get({ courseId, userId });
  if (!progress) {
    progress = new UserCourseProgress({
      userId,
      courseId,
      enrollmentDate: new Date().toISOString(),
      overallProgress: 0,
      sections: updateProgressData?.sections || [],
      lastAccessedTimestamp: new Date().toISOString(),
    });
  } else {
    progress.sections = mergeSections(
      progress?.sections,
      updateProgressData.sections
    );
    progress.overallProgress = calculateOverallProgress(progress.sections);
    progress.lastaccessedTimestamps = new Date().toISOString();
  }
  await progress.save();
  res.status(201).json({
    message: 'Enrolled Courses fetched successfully.',
    success: true,
    data: progress,
  });
  return;
};

export { getEnrolledCourses, getUserCourseProgress, updateCourseProgress };
