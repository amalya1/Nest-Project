import { ObjectId } from 'mongoose';

export interface UserData {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export type UserLogin = {
  email: string;
  password: string;
};

export type UserLoginResponse = {
  _id: ObjectId;
  email: string;
  token?: string;
};

export type RetUser = {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  timeStamp: number;
};

export type AuthUser = {
  user: {
    email: string;
    _id: ObjectId;
  };
};

export type Auth = UserLoginResponse;
