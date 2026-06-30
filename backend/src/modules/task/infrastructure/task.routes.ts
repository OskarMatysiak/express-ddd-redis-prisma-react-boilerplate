import { Router } from 'express';
import { container } from '../../../container';
import { createTask, getTasks } from './task.controller';

const router = Router();

router.post('/', createTask(container.createTask));
router.get('/', getTasks(container.getAllTasks));

export default router;
