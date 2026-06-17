import { Task } from './task';

export type TaskCachePort = {
  getTasks(): Promise<Task[] | null>;
  setTasks(tasks: Task[]): Promise<void>;
  invalidate(): Promise<void>;
};
