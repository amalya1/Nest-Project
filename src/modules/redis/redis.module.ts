import { Module, Provider } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

export const RedisToken = 'RedisToken';

@Module({
  imports: [],
  providers: [redisProvider()],
  exports: [RedisToken],
})
export class RedisModule {}

function redisProvider(): Provider<RedisClientType> {
  return {
    provide: RedisToken,
    useFactory: () => createClient({ url: process.env.REDIS_URL }),
    inject: [],
  };
}
