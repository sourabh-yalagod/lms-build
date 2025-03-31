"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadVideoUrl = exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.allCourses = exports.courseById = void 0;
const courseModel_1 = __importDefault(require("../models/courseModel"));
const crypto_1 = require("crypto");
const express_1 = require("@clerk/express");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3();
const allCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    try {
        if (category !== 'all') {
            const courses = yield courseModel_1.default.scan().exec();
            res
                .status(200)
                .json({ message: 'courses were fetched successfully.', data: courses });
            return;
        }
        else {
            const courses = yield courseModel_1.default.scan('category').eq(category).exec();
            res.status(200).json({
                message: `courses were fetched successfully based on Category : ${category}.`,
                data: courses,
            });
            return;
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Courses fetching Process failed.....!',
        });
        return;
    }
});
exports.allCourses = allCourses;
const courseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    try {
        if (!courseId) {
            res
                .status(500)
                .json({ success: false, message: 'Course Id required.....!' });
            return;
        }
        const course = yield courseModel_1.default.get(courseId);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Courses fetching Process failed.....!',
        });
        return;
    }
});
exports.courseById = courseById;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { teacherName, teacherId } = req.body;
    if (!teacherName || !teacherId) {
        res.status(401).json({
            message: 'Teacher name and Teacher Id is required...!',
            success: false,
        });
        return;
    }
    const { userId } = (0, express_1.getAuth)(req);
    if (!userId) {
        res.status(401).json({
            message: 'Please authnticated to create course...!',
            success: false,
        });
        return;
    }
    const newCourse = new courseModel_1.default({
        courseId: (0, crypto_1.randomUUID)(),
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
    (yield newCourse).save();
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
});
exports.createCourse = createCourse;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseData = req.body;
    const { courseId } = req.params;
    const { userId } = (0, express_1.getAuth)(req);
    console.log('courseData : ', courseData);
    if (!userId) {
        res.status(401).json({
            message: 'Please authnticated to updated course...!',
            success: false,
        });
        return;
    }
    const course = yield courseModel_1.default.get(courseId);
    console.log('Course : ', course);
    if (courseData === null || courseData === void 0 ? void 0 : courseData.price) {
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
    if (courseData === null || courseData === void 0 ? void 0 : courseData.sections) {
        const sectionData = typeof courseData.sections === 'string'
            ? JSON.parse(courseData.sections)
            : courseData.sections;
        courseData.sections = sectionData === null || sectionData === void 0 ? void 0 : sectionData.map((section) => {
            var _a;
            return (Object.assign(Object.assign({}, section), { sectionId: (section === null || section === void 0 ? void 0 : section.sectionId) || (0, crypto_1.randomUUID)(), chapters: (_a = section === null || section === void 0 ? void 0 : section.chapters) === null || _a === void 0 ? void 0 : _a.map((chapter) => (Object.assign(Object.assign({}, chapter), { chapterId: (chapter === null || chapter === void 0 ? void 0 : chapter.chapterId) || (0, crypto_1.randomUUID)() }))) }));
        });
        Object.assign(course, courseData);
    }
    yield course.save();
    console.log(course);
    res.status(201).json({
        message: 'course updated successfully.',
        success: true,
        data: course,
    });
    return;
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = (0, express_1.getAuth)(req);
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
        const deletedCourse = yield courseModel_1.default.delete(courseId);
        res.status(201).json({
            message: 'Course deleted successfully.',
            success: true,
            data: deletedCourse,
        });
        return;
    }
    catch (error) {
        res.status(501).json({
            message: 'COurse deletion failed...!',
            success: false,
        });
        return;
    }
});
exports.deleteCourse = deleteCourse;
const getUploadVideoUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoName, videoType } = req.body;
    console.log(`🚀 ~ { videoName, videoType }:`, { videoName, videoType });
    if (!videoName || !videoType) {
        res.status(401).json({
            message: 'Video name and Video Type is required...!',
            success: false,
        });
        return;
    }
    const uniqeId = (0, crypto_1.randomUUID)();
    const s3Key = `videos/${uniqeId}/${videoName}`;
    const s3Params = {
        Key: s3Key,
        Bucket: process.env.S3_BUCKET_NAME || '',
        ContentType: videoType,
    };
    const uploadUrl = s3.getSignedUrl('putObject', s3Params);
    const videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqeId}/${videoName}`;
    console.log('🚀 ~ uploadUrl:', uploadUrl);
    console.log('🚀 ~ videoUrl:', videoUrl);
    res.status(201).json({
        message: 'Upload URL set successfully',
        data: { uploadUrl, videoUrl },
    });
});
exports.getUploadVideoUrl = getUploadVideoUrl;
