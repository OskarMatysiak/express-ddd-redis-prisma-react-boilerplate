import { Inject, Injectable } from '@nestjs/common';
import { Task } from '../domain/task';
import { TaskRepository } from '../domain/task.repository';
import { TaskCachePort } from './task.cache';
import { TASK_REPOSITORY, TASK_CACHE } from './task.tokens';

@Injectable()
export class GetAllTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: TaskRepository,
    @Inject(TASK_CACHE) private readonly taskCache: TaskCachePort
  ) {}

  async execute(): Promise<Task[]> {
    const cached = await this.taskCache.getTasks();
    if (cached) return cached;
    const tasks = await this.taskRepository.findAll();
    await this.taskCache.setTasks(tasks);
    return tasks;
  }
}
