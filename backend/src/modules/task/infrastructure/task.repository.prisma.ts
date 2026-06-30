import { PrismaClient } from '@prisma/client';
import { TaskRepository } from '../domain/task.repository';

export function createPrismaTaskRepository(
  prisma: PrismaClient
): TaskRepository {
  return {
    create(data) {
      return prisma.task.create({ data });
    },

    findAll() {
      return prisma.task.findMany();
    },
  };
}
