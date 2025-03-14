import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import helment from 'helmet';
import { config } from 'dotenv';
import * as dynamoose from 'dynamoose';
import {
  clerkMiddleware,
  createClerkClient,
  requireAuth,
} from '@clerk/express';

const app = express();

config({ path: './.env' });
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
  dynamoose.aws.ddb.local();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helment.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(cors({ origin: '*', credentials: true }));
app.use(clerkMiddleware());
export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// IMPORT ROUTER API ENDPOINTS
import courseRouter from './routes/course';
import usersRouter from './routes/userClerk';
import transactionRouter from './routes/transaction';
import courseProgreeRouter from './routes/courseProgress';

app.use('/courses', courseRouter);
app.use('/users', requireAuth(), usersRouter);
app.use('/transactions', requireAuth(), transactionRouter);
app.use('/progress', requireAuth(), courseProgreeRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
