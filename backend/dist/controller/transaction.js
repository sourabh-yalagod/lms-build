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
exports.getUserTransaction = exports.createTransaction = exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const userCourseProgressModel_1 = __importDefault(require("../models/userCourseProgressModel"));
const stripeSecreteKey = process.env.STRIPE_SECRETE_KEY;
if (!stripeSecreteKey) {
    throw new Error('Stripe Secrete Key Required....!');
}
const stripe = new stripe_1.default(stripeSecreteKey);
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        const paymentIntent = yield stripe.paymentIntents.create({
            currency: 'usd',
            amount: amount || 0,
            description: 'Purchase of digital services - Subscription Plan',
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'always',
            },
            shipping: {
                name: 'John Doe',
                address: {
                    line1: '123 Street Name',
                    city: 'Mumbai',
                    state: 'MH',
                    postal_code: '400001',
                    country: 'IN',
                },
            },
        });
        res.json({
            message: '',
            data: paymentIntent.client_secret,
        });
    }
    catch (error) {
        res.status(501).json({ message: 'Stripe paymentIntent Error' });
    }
});
exports.createPaymentIntent = createPaymentIntent;
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId, courseId, transactionId, paymentProvider, amount } = req.body;
    console.log({ userId, courseId, transactionId, paymentProvider, amount });
    try {
        // 1. Check if the course is available
        const course = yield courseModel_1.default.get(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course is not available!' });
            return;
        }
        // 2. Create a transaction record
        const transaction = new transactionModel_1.default({
            courseId,
            userId,
            transactionId,
            paymentProvider,
            amount,
            dateTime: new Date().toISOString(),
        });
        yield transaction.save(); // ✅ Use instance save()
        // 3. Set up the initial course progress
        const courseProgress = new userCourseProgressModel_1.default({
            userId,
            courseId,
            enrollmentDate: new Date().toISOString(),
            lastAccessedTimestamp: new Date().toISOString(),
            overallProgress: 0,
            sections: (_a = course === null || course === void 0 ? void 0 : course.sections) === null || _a === void 0 ? void 0 : _a.map((section) => {
                var _a;
                return ({
                    sectionId: section === null || section === void 0 ? void 0 : section.sectionId,
                    chapters: ((_a = section === null || section === void 0 ? void 0 : section.chapters) === null || _a === void 0 ? void 0 : _a.map((chapter) => ({
                        chapterId: chapter === null || chapter === void 0 ? void 0 : chapter.chapterId,
                        completed: false,
                    }))) || [],
                });
            }),
        });
        yield courseProgress.save();
        // 4. Update course enrollments
        yield courseModel_1.default.update({ courseId }, { $ADD: { enrollments: [{ userId }] } });
        res.json({
            message: 'Course purchased successfully!',
            data: {
                transaction,
                courseProgress,
            },
        });
    }
    catch (error) {
        console.error('Transaction Error:', error);
        res.status(500).json({ message: 'Transaction Error!' });
    }
});
exports.createTransaction = createTransaction;
const getUserTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log('🚀 ~ userId:', userId);
    try {
        const transactions = userId
            ? yield transactionModel_1.default.scan('userId').eq(userId).exec()
            : yield transactionModel_1.default.scan().exec();
        res.status(201).json({
            message: 'Transactions retrieved successfully',
            data: transactions,
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving transactions', error });
    }
});
exports.getUserTransaction = getUserTransaction;
