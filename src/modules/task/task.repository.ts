import { PrismaClient, Task } from '@prisma/client';

export interface TaskRepository {
  create(data: { title: string }): Promise<Task>;
  findAll(): Promise<Task[]>;
}

export class PrismaTaskRepository implements TaskRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: { title: string }) {
    return this.prisma.task.create({ data });
  }

  findAll() {
    return this.prisma.task.findMany();
  }
}