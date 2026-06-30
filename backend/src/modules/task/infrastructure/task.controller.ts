import { Request, Response, NextFunction } from 'express';
import { createTaskUseCase } from '../application/task.create';
import { getAllTasksUseCase } from '../application/task.get-all';

export const createTask =
  (createTask: ReturnType<typeof createTaskUseCase>) =>
  async (req: Request, res: Response, _next: NextFunction) => {
    const task = await createTask(req.body);
    res.status(201).json(task);
  };

export const getTasks =
  (getAllTasks: ReturnType<typeof getAllTasksUseCase>) =>
  async (req: Request, res: Response, _next: NextFunction) => {
    const tasks = await getAllTasks();
    res.json(tasks);
  };
