"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userCourseProgress_1 = require("../controller/userCourseProgress");
const router = (0, express_1.Router)();
router.get('/:userId/enrolled-courses', userCourseProgress_1.getEnrolledCourses);
router.get('/:userId/courses/:courseId', userCourseProgress_1.getUserCourseProgress);
router.post('/:userId/courses/:courseId', userCourseProgress_1.updateCourseProgress);
exports.default = router;
