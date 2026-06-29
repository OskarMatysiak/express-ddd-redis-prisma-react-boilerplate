import express from 'express';
import cors from 'cors';
import taskRoutes from './modules/task/infrastructure/task.routes';
import { errorMiddleware } from './common/middleware/error.middleware';

const app = express();

if (!process.env.FRONTEND_URL) throw new Error('FRONTEND_URL is not set');                                      
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/tasks', taskRoutes);

app.use(errorMiddleware);

export default app;