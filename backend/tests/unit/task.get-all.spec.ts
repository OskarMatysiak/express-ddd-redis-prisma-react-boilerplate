import { getAllTasksUseCase } from '../../src/modules/task/application/task.get-all';
import { TaskRepository } from '../../src/modules/task/domain/task.repository';
import { TaskCachePort } from '../../src/modules/task/application/task.cache';

describe('getAllTasksUseCase', () => {
  let repo: jest.Mocked<TaskRepository>;
  let cache: jest.Mocked<TaskCachePort>;
  let getAllTasks: ReturnType<typeof getAllTasksUseCase>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    cache = {
      getTasks: jest.fn(),
      setTasks: jest.fn(),
      invalidateTasks: jest.fn(),
    };

    getAllTasks = getAllTasksUseCase(repo, cache);
  });

  it('should return cached tasks if cache exists', async () => {
    const cached = [{ id: '1', title: 'test' }];
    cache.getTasks.mockResolvedValue(cached);

    const result = await getAllTasks();

    expect(cache.getTasks).toHaveBeenCalled();
    expect(repo.findAll).not.toHaveBeenCalled();
    expect(result).toEqual(cached);
  });

  it('should fetch tasks from db and cache them if cache is empty', async () => {
    const tasks = [{ id: '1', title: 'test' }];
    cache.getTasks.mockResolvedValue(null);
    repo.findAll.mockResolvedValue(tasks);

    const result = await getAllTasks();

    expect(repo.findAll).toHaveBeenCalled();
    expect(cache.setTasks).toHaveBeenCalledWith(tasks);
    expect(result).toEqual(tasks);
  });
});
