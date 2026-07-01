import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS = Symbol('REDIS');

export const redisProvider: Provider = {
  provide: REDIS,
  useFactory: () => new Redis(process.env.REDIS_URL ?? ''),
};
