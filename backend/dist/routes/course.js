"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courses_1 = require("../controller/courses");
const express_2 = require("@clerk/express");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
// public Routers
router.get('/', courses_1.allCourses);
router.get('/:courseId', courses_1.courseById);
// Private Routers
router.post('/', (0, express_2.requireAuth)(), courses_1.createCourse);
router.put('/:courseId', (0, express_2.requireAuth)(), upload.none(), courses_1.updateCourse);
router.delete('/:courseId', (0, express_2.requireAuth)(), courses_1.deleteCourse);
router.post('/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url', courses_1.getUploadVideoUrl);
exports.default = router;
