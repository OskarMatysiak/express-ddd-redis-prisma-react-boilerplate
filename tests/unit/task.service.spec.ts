import TaskService from '../../src/modules/task/task.service';

describe('TaskService', () => {
    let repo: any;
    let redis: any;
    let service: TaskService;

    beforeEach(() => {
        repo = {
            create: jest.fn(),
            findAll: jest.fn(),
        };

        redis = {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
        };

        service = new TaskService(repo, redis);
    });

    it('should create a task and invalidate cache', async () => {
        repo.create.mockResolvedValue({ id: '1', title: 'test' });

        const result = await service.create({ title: 'test' });

        expect(repo.create).toHaveBeenCalledWith({ title: 'test' });
        expect(redis.del).toHaveBeenCalledWith('tasks');
        expect(result).toEqual({ id: '1', title: 'test' });
    });

    it('should return cached tasks if cache exists', async () => {
        const cached = [{ id: '1', title: 'test' }];
        redis.get.mockResolvedValue(JSON.stringify(cached));

        const result = await service.findAll();

        expect(redis.get).toHaveBeenCalledWith('tasks');
        expect(repo.findAll).not.toHaveBeenCalled();
        expect(result).toEqual(cached);
    });

    it('should fetch tasks from db and cache them if cache is empty', async () => {
        const tasks = [{ id: '1', title: 'test' }];
        redis.get.mockResolvedValue(null);
        repo.findAll.mockResolvedValue(tasks);

        const result = await service.findAll();

        expect(repo.findAll).toHaveBeenCalled();
        expect(redis.set).toHaveBeenCalledWith('tasks', JSON.stringify(tasks), 'EX', 60);
        expect(result).toEqual(tasks);
    });
});
