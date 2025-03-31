"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_1 = require("../controller/transaction");
const router = (0, express_1.Router)();
router.post('/', transaction_1.createTransaction);
router.get('/:userId', transaction_1.getUserTransaction);
router.post('/stripe/payment-intent', transaction_1.createPaymentIntent);
exports.default = router;
