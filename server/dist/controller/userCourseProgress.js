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
exports.updateCourseProgress = exports.getUserCourseProgress = exports.getEnrolledCourses = void 0;
const express_1 = require("@clerk/express");
const userCourseProgressModel_1 = __importDefault(require("../models/userCourseProgressModel"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
const utils_1 = require("../utils/utils");
const getEnrolledCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params || (0, express_1.getAuth)(req);
    const enrollment = yield userCourseProgressModel_1.default.query('userId').eq(userId).exec();
    const courseIds = enrollment.map((progress) => progress === null || progress === void 0 ? void 0 : progress.courseId);
    const courses = yield courseModel_1.default.batchGet(courseIds);
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
});
exports.getEnrolledCourses = getEnrolledCourses;
const getUserCourseProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, courseId } = req.params;
    const course = yield userCourseProgressModel_1.default.get({ courseId, userId });
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
});
exports.getUserCourseProgress = getUserCourseProgress;
const updateCourseProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, courseId } = req.params;
    const updateProgressData = req.body;
    let progress = yield userCourseProgressModel_1.default.get({ courseId, userId });
    if (!progress) {
        progress = new userCourseProgressModel_1.default({
            userId,
            courseId,
            enrollmentDate: new Date().toISOString(),
            overallProgress: 0,
            sections: (updateProgressData === null || updateProgressData === void 0 ? void 0 : updateProgressData.sections) || [],
            lastAccessedTimestamp: new Date().toISOString(),
        });
    }
    else {
        progress.sections = (0, utils_1.mergeSections)(progress === null || progress === void 0 ? void 0 : progress.sections, updateProgressData.sections);
        progress.overallProgress = (0, utils_1.calculateOverallProgress)(progress.sections);
        progress.lastaccessedTimestamps = new Date().toISOString();
    }
    yield progress.save();
    res.status(201).json({
        message: 'Enrolled Courses fetched successfully.',
        success: true,
        data: progress,
    });
    return;
});
exports.updateCourseProgress = updateCourseProgress;
