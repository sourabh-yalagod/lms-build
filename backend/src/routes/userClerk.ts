import { Router } from 'express';
import { updateUser } from '../controller/userClerk';
const router = Router();
router.put('/:userId', updateUser);
export default router;
