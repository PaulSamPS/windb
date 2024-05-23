import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto';
import { LoginResponseType } from './types/login-response.type';
import { RegistrationResponseType } from './types/registration-response.type';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiResponse({ type: RegistrationResponseType })
  @Post('register')
  async register(@Body() userDto: UserDto) {
    return this.userService.register(userDto);
  }

  @ApiResponse({ type: LoginResponseType })
  @Post('login')
  async login(@Body() userDto: UserDto) {
    return this.userService.login(userDto);
    // return { userDto, message: 'Вход успешно выполнен' };
  }
}
