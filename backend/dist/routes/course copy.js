"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courses_1 = require("../controller/courses");
const router = (0, express_1.Router)();
router.get('/', courses_1.allCourses);
router.get('/:courseId', courses_1.courseById);
exports.default = router;
