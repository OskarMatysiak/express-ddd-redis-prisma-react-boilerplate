import { Request, Response, NextFunction } from 'express';
import TaskService from './task.service';

export const createTask = (taskService: TaskService) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const task = await taskService.create(req.body);
        res.status(201).json(task);
    };

export const getTasks = (taskService: TaskService) =>
    async (req: Request, res: Response, next: NextFunction) => {

        const tasks = await taskService.findAll();
        res.json(tasks);
    };


