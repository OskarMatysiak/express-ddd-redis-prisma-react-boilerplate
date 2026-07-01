import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { taskRouter } from './modules/task/task.module';
import { errorMiddleware } from './common/middleware/error.middleware';

if (!process.env.FRONTEND_URL) throw new Error('FRONTEND_URL is not set');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/tasks', taskRouter);

app.use(errorMiddleware);

export default app;
