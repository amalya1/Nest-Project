import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { RedisModule } from '../redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Video, VideoSchema } from './video.model';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({}),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('secret_jwt'),
        signOptions: {
          expiresIn: configService.get('expire_jwt'),
        },
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
  ],
  controllers: [UserController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UserModule {}
