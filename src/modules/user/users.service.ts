import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './user.model';
import { Model } from 'mongoose';
import { UserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtTokenService } from '../token/jwt-token.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private userModel: Model<UserModel>,
    private readonly authService: JwtTokenService,
  ) {}

  async findOne(
    filter: Partial<{
      id?: string;
      email?: string;
    }>,
  ) {
    return this.userModel.findOne(filter).exec();
  }

  private async checkExistingUserByEmail(email: string): Promise<void> {
    const existingByEmail = await this.findOne({ email });

    if (existingByEmail) {
      throw new ForbiddenException('Пользователь с таким email уже существует');
    }
  }

  async register(userDto: UserDto): Promise<{ message: string }> {
    const { email, password } = userDto;

    await this.checkExistingUserByEmail(email);

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await this.userModel.create({
        ...userDto,
        password: hashedPassword,
      });

      return { message: 'Регистрация прошла успешно.' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Не удалось создать пользователя.',
      );
    }
  }

  async login(
    userDto: UserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const existingUser = await this.findOne({ email: userDto.email });

    if (!existingUser) {
      throw new UnauthorizedException('Пользоаватель не найден');
    }

    const isPasswordValid = bcrypt.compare(
      userDto.password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль.');
    }

    const { password: _, ...user } = existingUser.toObject();

    return await this.authService.generateJwtToken(user._id);
  }
}
