import { Request, Response } from 'express';
import Course from '../models/courseModel';
import { randomUUID } from 'crypto';
import { getAuth } from '@clerk/express';
import AWS from 'aws-sdk';
const s3 = new AWS.S3();

const allCourses = async (req: Request, res: Response): Promise<void> => {
  const { category } = req.params;
  try {
    if (category !== 'all') {
      const courses = await Course.scan().exec();
      res
        .status(200)
        .json({ message: 'courses were fetched successfully.', data: courses });
      return;
    } else {
      const courses = await Course.scan('category').eq(category).exec();
      res.status(200).json({
        message: `courses were fetched successfully based on Category : ${category}.`,
        data: courses,
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Courses fetching Process failed.....!',
    });
    return;
  }
};

const courseById = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  try {
    if (!courseId) {
      res
        .status(500)
        .json({ success: false, message: 'Course Id required.....!' });
      return;
    }
    const course = await Course.get(courseId);

    if (!course) {
      res
        .status(401)
        .json({ success: false, message: 'course not Found . . . !' });
      return;
    }
    res.status(200).json({
      message: `course is fetched successfully based on courseId : ${courseId}.`,
      data: course,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Courses fetching Process failed.....!',
    });
    return;
  }
};

const createCourse = async (req: Request, res: Response): Promise<void> => {
  const { teacherName, teacherId } = req.body;
  if (!teacherName || !teacherId) {
    res.status(401).json({
      message: 'Teacher name and Teacher Id is required...!',
      success: false,
    });
    return;
  }
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({
      message: 'Please authnticated to create course...!',
      success: false,
    });
    return;
  }
  const newCourse = new Course({
    courseId: randomUUID(),
    teacherId,
    teacherName,
    title: 'untitled',
    description: '',
    category: 'Uncatogized',
    image: '',
    price: 0,
    level: 'Beginner',
    status: 'Draft',
    sections: [],
    enrollment: [],
  });
  (await newCourse).save();
  if (!newCourse) {
    res.status(401).json({
      message: 'new Course creation failed...!',
      success: false,
    });
    return;
  }
  res.status(201).json({
    message: 'new draft course created successfully.',
    success: true,
    data: newCourse,
  });
  return;
};

const updateCourse = async (req: Request, res: Response): Promise<void> => {
  const courseData = req.body;
  const { courseId } = req.params;
  const { userId } = getAuth(req);
  console.log('userId', userId);
  console.log('courseData : ', courseData);

  if (!userId) {
    res.status(401).json({
      message: 'Please authnticated to updated course...!',
      success: false,
    });
    return;
  }

  const course = await Course.get(courseId);
  console.log('Course : ', course);

  if (courseData?.price) {
    const price = parseInt(courseData.price);
    if (isNaN(price)) {
      res.status(401).json({
        message: 'price suppose to be a number',
        success: false,
      });
      return;
    }
    courseData.price = price * 100;
  }
  if (courseData?.sections) {
    const sectionData =
      typeof courseData.sections === 'string'
        ? JSON.parse(courseData.sections)
        : courseData.sections;
    courseData.sections = sectionData?.sections?.map((section: any) => ({
      ...section,
      sectionId: section?.sectionId || randomUUID(),
      chapters: section?.chapters?.map((chapter: any) => ({
        ...chapter,
        chapterId: chapter?.chapterId || randomUUID(),
      })),
    }));
    Object.assign(course, courseData);
  }
  await course.save();

  res.status(201).json({
    message: 'course updated successfully.',
    success: true,
    data: course,
  });
  return;
};

const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  const { userId } = getAuth(req);
  const { courseId } = req.params;
  if (!userId) {
    res.status(401).json({
      message: 'Please authnticated to create course...!',
      success: false,
    });
    return;
  }
  if (!courseId) {
    res.status(401).json({
      message: 'course Id Required...!',
      success: false,
    });
    return;
  }
  try {
    const deletedCourse = await Course.delete(courseId);
    res.status(201).json({
      message: 'Course deleted successfully.',
      success: true,
      data: deletedCourse,
    });
    return;
  } catch (error) {
    res.status(501).json({
      message: 'COurse deletion failed...!',
      success: false,
    });
    return;
  }
};

const getUploadVideoUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { videoName, videoType } = req.body;
  if (!videoName || !videoType) {
    res.status(401).json({
      message: 'Video name and Video Type is required...!',
      success: false,
    });
    return;
  }
  try {
    const uniqeId = randomUUID();
    const s3Key = `videos/${uniqeId}/${videoName}`;
    const s3Params = {
      Key: s3Key,
      Bucket: process.env.S3_BUCKET_NAME || '',
      Expire: 60,
      ContentType: videoType,
    };
    const uploadUrl = s3.getSignedUrl('putObject', s3Params);
    const videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqeId}/${videoName}`;

    res.status(201).json({
      message: 'Upload URL set successfully',
      data: { uploadUrl, videoUrl },
    });
  } catch (error) {
    res.status(401).json({
      message: 'video uplaod url failed..',
      error,
      success: false,
    });
    return;
  }
};
export {
  courseById,
  allCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getUploadVideoUrl,
};
