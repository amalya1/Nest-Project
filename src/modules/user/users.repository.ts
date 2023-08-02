import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { Video } from './video.model';
import * as moment from 'moment';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Video') private readonly videoModel: Model<Video>,
  ) {}

  async creatVideo(userId, video, path, name, type): Promise<void | never> {
    await this.videoModel.create({
      name: `firstSegment${name}`,
      userId,
      originName: video.originalname,
      type,
      path,
      timeStamp: moment().unix(),
    });
  }
}
