import * as joi from 'joi';
import { UserData, UserLogin } from '../auth/auth.types';

export const createUserSchema = joi.object<UserData>({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  password: joi.string().min(6).required(),
  email: joi.string().lowercase().email().required(),
});

export const loginInputSchema = joi.object<UserLogin>({
  email: joi.string().email().required().trim(),
  password: joi.string().required(),
});
