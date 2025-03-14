import { config } from 'dotenv';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import Course from '../models/courseModel';
import Transaction from '../models/transactionModel';
import UserCourseProgress from '../models/userCourseProgressModel';
const stripeSecreteKey = process.env.STRIPE_SECRETE_KEY;
if (!stripeSecreteKey) {
  throw new Error('Stripe Secrete Key Required....!');
}
const stripe = new Stripe(stripeSecreteKey);

const createPaymentIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
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
  } catch (error) {
    res.status(501).json({ message: 'Stripe paymentIntent Error' });
  }
};

const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId, transactionId, paymentProvider, amount } = req.body;
  console.log({ userId, courseId, transactionId, paymentProvider, amount });

  try {
    // 1. Check if the course is available
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course is not available!' });
      return;
    }

    // 2. Create a transaction record
    const transaction = new Transaction({
      courseId,
      userId,
      transactionId,
      paymentProvider,
      amount,
      dateTime: new Date().toISOString(),
    });

    await transaction.save(); // ✅ Use instance save()

    // 3. Set up the initial course progress
    const courseProgress = new UserCourseProgress({
      userId,
      courseId,
      enrollmentDate: new Date().toISOString(),
      lastAccessedTimestamp: new Date().toISOString(),
      overallProgress: 0,
      sections: course?.sections?.map((section: any) => ({
        sectionId: section?.sectionId,
        chapters:
          section?.chapters?.map((chapter: any) => ({
            chapterId: chapter?.chapterId,
            completed: false,
          })) || [],
      })),
    });

    await courseProgress.save();

    // 4. Update course enrollments
    await Course.update({ courseId }, { $ADD: { enrollments: [{ userId }] } });

    res.json({
      message: 'Course purchased successfully!',
      data: {
        transaction,
        courseProgress,
      },
    });
  } catch (error) {
    console.error('Transaction Error:', error);
    res.status(500).json({ message: 'Transaction Error!' });
  }
};

const getUserTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  console.log('🚀 ~ userId:', userId);

  try {
    const transactions = userId
      ? await Transaction.scan('userId').eq(userId).exec()
      : await Transaction.scan().exec();

    res.status(201).json({
      message: 'Transactions retrieved successfully',
      data: transactions,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transactions', error });
  }
};

export { createPaymentIntent, createTransaction, getUserTransaction };
