import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppError } from '../../common/errors';
import { TokenService } from '../token/token.service';
import { AuthRepository } from './auth.repository';
import { RedisToken } from '../redis/redis.module';
import { RedisClientType } from 'redis';
import * as moment from 'moment/moment';
import { Auth, UserData, UserLogin, UserLoginResponse } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    @Inject(RedisToken) private readonly redis: RedisClientType,
  ) {}

  async addUser(input: UserData): Promise<{ message: string }> {
    const email = input.email.toLowerCase();
    const existUser = await this.authRepository.findUserByEmail(email);
    if (existUser) throw new BadRequestException(AppError.USER_EXIST);
    await this.authRepository.createUser({ ...input, email });
    return { message: AppError.USER_CREATED };
  }

  async loginUser(input: UserLogin): Promise<UserLoginResponse> {
    const email = input.email;
    const existUser = await this.authRepository.findUserByEmail(email);

    if (!existUser) throw new BadRequestException(AppError.USER_NOT_EXIST);
    const validatePassword = await bcrypt.compare(
      input.password,
      existUser.password,
    );
    if (!validatePassword) throw new BadRequestException(AppError.WRONG_DATA);
    await this.authRepository.updateUserLogTime(existUser._id, moment().unix());

    const auth: Auth = {
      _id: existUser._id,
      email: existUser.email,
    };
    const jwtToken = await this.tokenService.generateJwtToken(auth);
    await this.redis.set(jwtToken, JSON.stringify(auth));
    return { ...auth, token: jwtToken };
  }
}
