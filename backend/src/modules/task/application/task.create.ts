import { TaskRepository } from '../domain/task.repository';
import { TaskCachePort } from '../domain/task.cache';
import { CreateTaskInputSchema } from '../domain/task';

export function createTaskUseCase(
  taskRepository: TaskRepository,
  taskCache: TaskCachePort,
) {
  return async (input: unknown) => {
    const data = CreateTaskInputSchema.parse(input);
    const task = await taskRepository.create(data);
    await taskCache.invalidate();
    return task;
  };
}



