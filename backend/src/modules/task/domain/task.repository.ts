import { Task, CreateTaskInput } from './task';

export type TaskRepository = {
  create(data: CreateTaskInput): Promise<Task>;
  findAll(): Promise<Task[]>;
};
