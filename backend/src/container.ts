import { prisma } from './config/prisma';
import redis from './config/redis.config';

import { createPrismaTaskRepository } from './modules/task/infrastructure/task.repository.prisma';
import { createRedisTaskCache } from './modules/task/infrastructure/task.cache.redis';
import { createTaskUseCase } from './modules/task/application/task.create';
import { getAllTasksUseCase } from './modules/task/application/task.get-all';

const taskRepository = createPrismaTaskRepository(prisma);
const taskCache = createRedisTaskCache(redis);

export const container = {
  createTask: createTaskUseCase(taskRepository, taskCache),
  getAllTasks: getAllTasksUseCase(taskRepository, taskCache),
};
