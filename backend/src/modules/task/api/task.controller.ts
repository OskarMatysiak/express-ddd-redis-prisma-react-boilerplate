import { Request, Response, NextFunction } from 'express';
import { Task, CreateTaskInput } from '../domain/task';

export type TaskUseCases = {
  createTask: (input: CreateTaskInput) => Promise<Task>;
  getAllTasks: () => Promise<Task[]>;
};

export function createTaskController(deps: TaskUseCases) {
  return {
    createTask: async (req: Request, res: Response, _next: NextFunction) => {
      const task = await deps.createTask(req.body);
      res.status(201).json(task);
    },

    getAllTasks: async (_req: Request, res: Response, _next: NextFunction) => {
      const tasks = await deps.getAllTasks();
      res.json(tasks);
    },
  };
}
