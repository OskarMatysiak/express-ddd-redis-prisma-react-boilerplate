import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { TaskCachePort } from '../application/task.cache';
import { Task } from '../domain/task';
import { REDIS } from '../../../config/redis.provider';

const TASKS_CACHE_KEY = 'tasks';
const TASKS_CACHE_TTL_SECONDS = 60;

@Injectable()
export class RedisTaskCache implements TaskCachePort {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async getTasks(): Promise<Task[] | null> {
    const cached = await this.redis.get(TASKS_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  }

  async setTasks(tasks: Task[]): Promise<void> {
    await this.redis.set(
      TASKS_CACHE_KEY,
      JSON.stringify(tasks),
      'EX',
      TASKS_CACHE_TTL_SECONDS
    );
  }

  async invalidateTasks(): Promise<void> {
    await this.redis.del(TASKS_CACHE_KEY);
  }
}
