import { Router } from "express";
import { container } from '../../container';
import { createTask, getTasks } from './task.controller';

const router = Router();

router.post('/', createTask(container.taskService));
router.get('/', getTasks(container.taskService));

export default router;