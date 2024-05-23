import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    example: 'example@mail.com',
    description: 'Адрес электронной почты пользователя',
  })
  @IsNotEmpty({ message: 'Email должен быть заполнен' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Неверный формат адреса электронной почты',
  })
  readonly email: string;

  @ApiProperty({
    example: '12345',
    description: 'Пароль пользователя',
  })
  @IsNotEmpty({ message: 'Пароль должен быть заполнен' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(5, { message: 'Пароль должен содержать минимум 5 символов' })
  readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
