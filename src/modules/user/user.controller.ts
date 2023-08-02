import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserAuth } from '../auth/auth.user.decorator';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post('login/uploadVideo')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile() video: Express.Multer.File,
    @UserAuth() auth: AuthUser,
  ): Promise<{ message: string }> {
    const userId = auth.user._id;
    return this.userService.cropVideo(video, userId);
  }

  @Get()
  async getAllCount(): Promise<string[]> {
    return this.userService.getRandomDataFromRedis();
  }
}
