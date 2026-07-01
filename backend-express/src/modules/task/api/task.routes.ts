import { Router } from 'express';
import { createTaskController, TaskUseCases } from './task.controller';

export function createTaskRouter(deps: TaskUseCases): Router {
  const router = Router();
  const controller = createTaskController(deps);

  router.post('/', controller.createTask);
  router.get('/', controller.getAllTasks);

  return router;
}
