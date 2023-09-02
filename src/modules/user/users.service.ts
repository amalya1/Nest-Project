import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppError } from '../../common/errors';
import { UsersRepository } from './users.repository';
import { RedisToken } from '../redis/redis.module';
import { RedisClientType } from 'redis';
import * as moment from 'moment/moment';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { extname } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { ObjectId } from 'mongoose';
const execAsync = promisify(exec);

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(RedisToken) private readonly redis: RedisClientType,
  ) {}

  async cropVideo(
    video: Express.Multer.File,
    userId: ObjectId,
  ): Promise<{ message: string }> {
    const extensions = extname(video.originalname);
    if (
      extensions !== '.mp4' &&
      extensions !== '.avi' &&
      extensions !== '.mkv'
    ) {
      throw new HttpException(AppError.WRONG_TYPE, HttpStatus.BAD_REQUEST);
    }

    const inputFilePath = video.path;

    const randomName = crypto.randomBytes(4).toString('hex');

    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads');
    }

    const outputDirFirst1min = `uploads/firs1min${randomName}${extensions}`;
    const outputDirLast1min = `uploads/last1min${randomName}${extensions}`;

    const videoDurationLimit = 2;
    const cutDuration = 1;
    let startTimeLast1Min;

    try {
      const uploadVideoDurInMinutes = await this.ffprobe(inputFilePath);
      if (uploadVideoDurInMinutes < videoDurationLimit) {
        throw new HttpException(
          AppError.WRONG_DURATION,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        startTimeLast1Min = uploadVideoDurInMinutes - cutDuration;

        await this.ffmpeg(
          inputFilePath,
          startTimeLast1Min,
          outputDirFirst1min,
          outputDirLast1min,
        )
          .then(async ([firstSegmentPath, secondSegmentPath]) => {
            await this.usersRepository.createVideo(
              userId,
              video,
              firstSegmentPath,
              randomName,
              extensions,
            );
            const cutVideo = {
              id: userId,
              name: `secondSegment${randomName}`,
              originName: video.originalname,
              type: extensions,
              path: secondSegmentPath,
              timeStamp: moment().unix(),
            };

            await this.redis.sAdd('users', JSON.stringify(cutVideo));
          })
          .catch(async (error) => {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
          });
      }
    } catch (error) {
      throw new InternalServerErrorException(AppError.ERROR_FFMPEG);
    }
    return { message: AppError.VIDEO_SAVED };
  }

  async ffmpeg(
    inputFilePath,
    startTimeLast1Min,
    outputDirFirst1min,
    outputDirLast1min,
  ): Promise<[string, string]> {
    const startTimeSeconds = Math.floor(startTimeLast1Min * 60);
    const startTime = `${Math.floor(startTimeSeconds / 60)
      .toString()
      .padStart(2, '0')}:${(startTimeSeconds % 60)
      .toString()
      .padStart(2, '0')}.${Math.floor((startTimeSeconds % 1) * 1000)
      .toString()
      .padStart(3, '0')}`;

    return new Promise<[string, string]>((resolve, reject) => {
      const firstSegmentProcess = ffmpeg(inputFilePath)
        .setStartTime('00:00:00')
        .setDuration(60)
        .output(outputDirFirst1min)
        .on('end', () => {
          const secondSegmentProcess = ffmpeg(inputFilePath)
            .setStartTime(startTime)
            .setDuration(60)
            .output(outputDirLast1min)
            .on('end', () => {
              resolve([outputDirFirst1min, outputDirLast1min]);
            })
            .on('error', () => {
              reject(AppError.ERROR_SECOND_TRIMMING);
            });

          secondSegmentProcess.run();
        })
        .on('error', () => {
          reject(AppError.ERROR_FIRST_TRIMMING);
        });

      firstSegmentProcess.run();
    });
  }

  async ffprobe(inputFilePath): Promise<number> {
    const ffprobePath = 'C:\\ffmpeg\\bin\\ffprobe.exe';

    try {
      const { stdout } = await execAsync(
        `${ffprobePath} -v error -select_streams v:0 -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${inputFilePath}`,
      );

      const videoDurationInSeconds = parseFloat(stdout);
      return videoDurationInSeconds / 60;
    } catch (error) {
      throw new InternalServerErrorException(AppError.ERROR_FFPROBE);
    }
  }

  async getRandomDataFromRedis(): Promise<string[]> {
    return await this.redis.sMembers('users');
  }
}
