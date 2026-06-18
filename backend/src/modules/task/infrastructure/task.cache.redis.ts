import Redis from 'ioredis';
import { TaskCachePort } from '../domain/task.cache';

const TASKS_CACHE_KEY = 'tasks';
const TASKS_CACHE_TTL_SECONDS = 60;

export function createRedisTaskCache(redis: Redis): TaskCachePort {
  return {
    async getTasks() {
      const cached = await redis.get(TASKS_CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    },

    async setTasks(tasks) {
      await redis.set(TASKS_CACHE_KEY, JSON.stringify(tasks), 'EX', TASKS_CACHE_TTL_SECONDS);
    },

    async invalidate() {
      await redis.del(TASKS_CACHE_KEY);
    },
  };
}
