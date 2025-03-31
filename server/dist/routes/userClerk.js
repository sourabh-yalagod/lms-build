"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userClerk_1 = require("../controller/userClerk");
const router = (0, express_1.Router)();
router.put('/:userId', userClerk_1.updateUser);
exports.default = router;
