import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateTaskUseCase } from '../application/create-task.use-case';
import { GetAllTasksUseCase } from '../application/get-all-tasks.use-case';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getAllTasksUseCase: GetAllTasksUseCase
  ) {}

  @Post()
  @HttpCode(201)
  createTask(@Body() body: unknown) {
    return this.createTaskUseCase.execute(body);
  }

  @Get()
  getAllTasks() {
    return this.getAllTasksUseCase.execute();
  }
}
