import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { TaskRepository } from '../domain/task.repository';
import { Task, CreateTaskInput } from '../domain/task';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTaskInput): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }
}
