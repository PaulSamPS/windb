import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TokenModel extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserModel' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(TokenModel);
