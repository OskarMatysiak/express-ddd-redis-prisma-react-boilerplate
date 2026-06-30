import { ZodError } from 'zod';
import { createTaskUseCase } from '../../src/modules/task/application/task.create';
import { TaskRepository } from '../../src/modules/task/domain/task.repository';
import { TaskCachePort } from '../../src/modules/task/domain/task.cache';

describe('createTaskUseCase', () => {
  let repo: jest.Mocked<TaskRepository>;
  let cache: jest.Mocked<TaskCachePort>;
  let createTask: ReturnType<typeof createTaskUseCase>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    cache = {
      getTasks: jest.fn(),
      setTasks: jest.fn(),
      invalidate: jest.fn(),
    };

    createTask = createTaskUseCase(repo, cache);
  });

  it('should create a task and invalidate cache', async () => {
    repo.create.mockResolvedValue({ id: '1', title: 'test' });

    const result = await createTask({ title: 'test' });

    expect(repo.create).toHaveBeenCalledWith({ title: 'test' });
    expect(cache.invalidate).toHaveBeenCalled();
    expect(result).toEqual({ id: '1', title: 'test' });
  });

  it('should reject input with an empty title', async () => {
    await expect(createTask({ title: '' })).rejects.toBeInstanceOf(ZodError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('should reject input missing a title', async () => {
    await expect(createTask({})).rejects.toBeInstanceOf(ZodError);
    expect(repo.create).not.toHaveBeenCalled();
  });
});
