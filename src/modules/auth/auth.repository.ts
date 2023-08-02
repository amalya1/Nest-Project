import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from '../user/user.model';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { UserData, RetUser } from './auth.types';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async findUserByEmail(email: string): Promise<RetUser | never> {
    return this.userModel.findOne({ email });
  }

  async updateUserLogTime(_id: ObjectId, time: number): Promise<void> {
    await this.userModel.findByIdAndUpdate(_id, { timeStamp: time });
  }

  async createUser(input: UserData): Promise<void | never> {
    const password = input.password;
    const hashPassword = await this.hashPassword(password);
    await this.userModel.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: hashPassword,
      timeStamp: moment().unix(),
    });
  }
}
