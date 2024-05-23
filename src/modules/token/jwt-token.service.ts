import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async generateJwtToken(
    payload: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.signToken(payload, 'access');
    const refreshToken = this.signToken(payload, 'refresh');

    await this.saveTokens(payload, accessToken, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Не автоизован и нет refresh токена');
    }
    const userId = this.verifyToken(refreshToken, 'refresh');

    const dbToken = await this.tokenService.findByUserId(userId);

    if (!dbToken) {
      throw new UnauthorizedException('refresh токен не найден в базе');
    }

    if (dbToken.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Невалидный токен');
    }

    const accessToken = this.signToken(userId, 'access');
    const newRefreshToken = this.signToken(userId, 'refresh');

    await this.saveTokens(userId, accessToken, newRefreshToken);

    return { accessToken, newRefreshToken };
  }

  private signToken<T>(user: T, type: 'access' | 'refresh'): string {
    const secretKey = this.getJwtSecret(type);
    const expiresIn = this.getJwtTokenExpiresIn(type);

    return this.jwtService.sign({ user }, { secret: secretKey, expiresIn });
  }

  private async saveTokens(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    let tokens = await this.tokenService.findByUserId(userId);

    if (!tokens) {
      tokens = await this.tokenService.create(
        userId,
        accessToken,
        refreshToken,
      );
    } else {
      tokens.accessToken = accessToken;
      tokens.refreshToken = refreshToken;
      return this.tokenService.update(tokens);
    }
  }

  private verifyToken(token: string, type: 'access' | 'refresh'): any {
    const secretKey = this.getJwtSecret(type);
    return this.jwtService.verify(token, { secret: secretKey });
  }

  private getJwtSecret(type: 'access' | 'refresh'): string {
    const secretKey = this.configService.get<string>(
      `JWT_SECRET_${type.toUpperCase()}`,
    );

    if (!secretKey) {
      throw new InternalServerErrorException(
        `Секретный ключ для токена ${type.toUpperCase()} не найден`,
      );
    }

    return secretKey;
  }

  private getJwtTokenExpiresIn(type: 'access' | 'refresh'): string {
    const expiresIn = this.configService.get<string>(
      `JWT_${type.toUpperCase()}_TOKEN_EXPIRES_IN`,
    );

    if (!expiresIn) {
      throw new InternalServerErrorException(
        `Срок действия токена ${type.toUpperCase()} не найден`,
      );
    }

    return expiresIn;
  }
}
