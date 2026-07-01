import { Task } from '../domain/task';

export type TaskCachePort = {
  getTasks(): Promise<Task[] | null>;
  setTasks(tasks: Task[]): Promise<void>;
  invalidateTasks(): Promise<void>;
};
