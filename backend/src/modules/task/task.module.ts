import { Module } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { redisProvider } from '../../config/redis.provider';
import { CreateTaskUseCase } from './application/create-task.use-case';
import { GetAllTasksUseCase } from './application/get-all-tasks.use-case';
import { TASK_CACHE, TASK_REPOSITORY } from './application/task.tokens';
import { TaskController } from './api/task.controller';
import { PrismaTaskRepository } from './infrastructure/prisma-task.repository';
import { RedisTaskCache } from './infrastructure/redis-task.cache';

@Module({
  controllers: [TaskController],
  providers: [
    PrismaService,
    redisProvider,
    CreateTaskUseCase,
    GetAllTasksUseCase,
    { provide: TASK_REPOSITORY, useClass: PrismaTaskRepository },
    { provide: TASK_CACHE, useClass: RedisTaskCache },
  ],
})
export class TaskModule {}
