import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../../base/entities/base-entities';
import { User } from '../../users/entities/user.entity';
import { ArticleGenre } from './article.enum';
import { Expose } from 'class-transformer';

// A collection can only have one text search index, but that index can cover multiple fields.
@Schema()
export class Article extends BaseEntity {
  @Expose({ name: 'id' })
  public _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 400,
    // text: true
  })
  public title: string;

  @Prop({ type: String, minlength: 5 })
  public subtitle: string;

  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5000,
  })
  public description: string;

  @Prop({ type: String, enum: ArticleGenre, required: true })
  public category: keyof typeof ArticleGenre;

  @Prop({ type: Date, default: Date.now, required: true })
  public createdAt: Date;

  @Prop({ type: Date, default: Date.now, required: true })
  public updatedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  public owner: User;
}

export type ArticleDocument = Article & Document;
export const ArticleSchema = SchemaFactory.createForClass(Article);

export const articleTextSearchFilters = ['title', 'subtitle', 'description', 'category'];
