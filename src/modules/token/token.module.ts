import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from './jwt-token.service';
import { TokenSchema, TokenModel } from './token.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: TokenModel.name, schema: TokenSchema }]),
  ],
  providers: [TokenService, JwtTokenService, JwtService],
  exports: [JwtTokenService, JwtService],
})
export class TokenModule {}
