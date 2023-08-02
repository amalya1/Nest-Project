import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserData, UserLogin, UserLoginResponse } from './auth.types';
import { createUserSchema, loginInputSchema } from './auth.validation';
import { JoiValidationPipe } from '../../common/validation.pipe';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async register(@Body() body: UserData): Promise<{ message: string }> {
    return this.authService.addUser(body);
  }

  @UsePipes(new JoiValidationPipe(loginInputSchema))
  @Post('/login')
  async login(@Body() body: UserLogin): Promise<UserLoginResponse> {
    return this.authService.loginUser(body);
  }
}
