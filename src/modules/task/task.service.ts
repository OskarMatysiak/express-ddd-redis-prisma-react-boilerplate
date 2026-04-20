import { TaskRepository } from "./task.repository";
import Redis from 'ioredis';


export default class TaskService {
    constructor(private taskRepository: TaskRepository, private redis: Redis) { }

    async create(data: { title: string }) {
        const task = await this.taskRepository.create(data);
        await this.redis.del('tasks');
        return task;
    }
    async findAll() {
        const cached = await this.redis.get('tasks');

        if (cached) {
            return JSON.parse(cached);
        }
        const tasks = await this.taskRepository.findAll();
        await this.redis.set('tasks', JSON.stringify(tasks), 'EX', 60);
        return tasks;
    }
}