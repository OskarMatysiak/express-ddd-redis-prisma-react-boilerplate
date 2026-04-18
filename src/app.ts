import express from 'express';

const app = express();

app.user(express.json());
app.user('/api/tasks', taskRoutes);
app.user(errorMiddleware);

export default app;