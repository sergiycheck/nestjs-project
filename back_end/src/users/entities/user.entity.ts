import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from './roles.enum';
import { BaseEntity } from '../../base/entities/base-entities';
import { Article } from '../../article/entities/article.entity';

@Schema()
export class User extends BaseEntity {
  public _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true, minlength: 4, maxlength: 20 })
  public username: string;

  @Prop({ type: String, required: true, minlength: 4, maxlength: 50 })
  public firstName: string;

  @Prop({ type: String, required: true, minlength: 3, maxlength: 60 })
  public lastName: string;

  @Prop({ type: String, required: true, minlength: 6, maxlength: 500 })
  public passwordHash: string;

  @Prop({ type: String, enum: Role })
  public role: Role;

  @Prop({ type: Date, default: Date.now, required: true })
  public createdAt: Date;

  @Prop({ type: Number, default: 0 })
  public numberOfArticles: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  })
  public articles: Article[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

export type UserToFindOne = Partial<
  Pick<User, 'username' | 'firstName' | 'lastName' | 'createdAt'>
>;
