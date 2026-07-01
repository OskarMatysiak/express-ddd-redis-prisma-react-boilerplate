import { prisma } from '../../config/prisma';
import redis from '../../config/redis.config';
import { createPrismaTaskRepository } from './infrastructure/task.repository.prisma';
import { createRedisTaskCache } from './infrastructure/task.cache.redis';
import { createTaskUseCase } from './application/task.create';
import { getAllTasksUseCase } from './application/task.get-all';
import { createTaskRouter } from './api/task.routes';

const repository = createPrismaTaskRepository(prisma);
const cache = createRedisTaskCache(redis);

export const taskRouter = createTaskRouter({
  createTask: createTaskUseCase(repository, cache),
  getAllTasks: getAllTasksUseCase(repository, cache),
});
