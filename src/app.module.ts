import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { TokenModule } from './modules/token/token.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from 'config';
import { AuthGuard } from './modules/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${databaseConfig().db.host}:${databaseConfig().db.port}/${
        databaseConfig().db.name
      }`,
    ),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    TokenModule,
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
  ],
  controllers: [],
  providers: [AuthGuard],
})
export class AppModule {}
