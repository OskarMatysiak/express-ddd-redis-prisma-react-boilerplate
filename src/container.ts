import { prisma } from "./config/prisma";
import redis from './config/redis.config';


import TaskRepository from './modules/task/task.repository';
import TaskService from './modules/task/task.service';

const taskRepository = new TaskRepository(prisma);
const taskService = new TaskService(taskRepository, redis);




export const container = {
    taskService,
};




