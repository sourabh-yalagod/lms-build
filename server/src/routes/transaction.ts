import { Router } from 'express';
import {
  createPaymentIntent,
  createTransaction,
  getUserTransaction,
} from '../controller/transaction';
const router = Router();
router.post('/', createTransaction);
router.get('/:userId', getUserTransaction);
router.post('/stripe/payment-intent', createPaymentIntent);
export default router;
