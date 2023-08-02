import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisClientType } from 'redis';
import { RedisToken } from './modules/redis/redis.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redis = app.get<RedisClientType>(RedisToken);
  await redis.connect();
  await app.listen(process.env.PORT);
}
bootstrap();
