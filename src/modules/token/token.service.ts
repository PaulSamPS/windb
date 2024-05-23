import { TokenModel } from './token.model';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(TokenModel.name)
    private tokenModel: Model<TokenModel>,
  ) {}

  async findByUserId(userId: number) {
    return this.tokenModel.findOne({ userId });
  }

  async create(userId: number, accessToken: string, refreshToken: string) {
    try {
      return await this.tokenModel.create({
        userId,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      throw new Error(`Ошибка при создании записи о токенах: ${error}`);
    }
  }

  async update(tokens: TokenModel): Promise<void> {
    try {
      await tokens.save();
    } catch (error) {
      throw new Error(`Ошибка при обновлении записи о токенах: ${error}`);
    }
  }
}
