import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';

import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import { stripeWebhookHandler } from './app/webhook/webhook.stripe';
import path from 'path';
const app: Application = express();
//parsers
app.use(express.json());
app.use(cookieParser());

// stripe webhook
app.post(
  '/webhook/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhookHandler,
);
// app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(
  cors({
    origin: [
       "https://kevin-livid.vercel.app",
      'https://kevin-admin-dashboard.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://10.10.20.13:5000',
      'http://10.10.20.20:5173',
      'http://10.10.20.13:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'https://dashboard.yourtradesource.com',
      'https://yourtradesource.com',
      'https://www.yourtradesource.com'
      
     
    ],
     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  }),
);
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('Kevin Server is Running...');
});
app.use(globalErrorHandler);
app.use(notFound);
export default app;
