import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskInputSchema, Task } from '../domain/task';
import { TaskRepository } from '../domain/task.repository';
import { TaskCachePort } from './task.cache';
import { TASK_REPOSITORY, TASK_CACHE } from './task.tokens';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: TaskRepository,
    @Inject(TASK_CACHE) private readonly taskCache: TaskCachePort
  ) {}

  async execute(input: unknown): Promise<Task> {
    const data = CreateTaskInputSchema.parse(input);
    const task = await this.taskRepository.create(data);
    await this.taskCache.invalidateTasks();
    return task;
  }
}
