import { prisma } from "./config/prisma";
import redis from './config/redis.config';


import { TaskRepository } from './modules/task/task.repository';
import { PrismaTaskRepository } from './modules/task/task.repository';
import TaskService from './modules/task/task.service';

const prismaTaskRepository: TaskRepository = new PrismaTaskRepository(prisma);
const taskService = new TaskService(prismaTaskRepository, redis);


export const container = {
    taskService,
};




