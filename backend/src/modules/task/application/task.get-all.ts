import { TaskRepository } from '../domain/task.repository';
import { TaskCachePort } from '../domain/task.cache';

export function getAllTasksUseCase(
  taskRepository: TaskRepository,
  taskCache: TaskCachePort,
) {
  return async () => {
    const cached = await taskCache.getTasks();
    if (cached) {
      return cached;
    }
    const tasks = await taskRepository.findAll();
    await taskCache.setTasks(tasks);
    return tasks;
  };
}
