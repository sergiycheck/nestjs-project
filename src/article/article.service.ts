import {
  forwardRef,
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import {
  BaseService,
  ToObjectContainingQuery,
} from 'src/base/services/base.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ArticleMapperService } from './article-mapper.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './entities/article.entity';

@Injectable()
export class ArticleService extends BaseService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private articleMapper: ArticleMapperService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async create(createArticleDto: CreateArticleDto, user: User) {
    try {
      delete createArticleDto.ownerId;

      const newArticle = new this.articleModel({
        _id: new mongoose.Types.ObjectId(),
        ...createArticleDto,
        owner: user,
      });
      const createdArticleQuery = await newArticle.save();

      await this.usersService.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          $set: { numberOfArticles: ++user.numberOfArticles },
          $push: { articles: createdArticleQuery._id },
        },
        { new: true },
      );

      return this.getResponse(createdArticleQuery);
    } catch (error) {
      throw error;
    }
  }

  private getResponse(articleQuery: ToObjectContainingQuery<Article>) {
    const articleDoc = super.queryToObj(articleQuery);
    return this.articleMapper.articleToArticleResponse(articleDoc);
  }

  private getResponseWithRelations(
    articleQuery: ToObjectContainingQuery<Article>,
  ) {
    const articleDoc = super.queryToObj(articleQuery);
    return this.articleMapper.articleToArticleResponseWithRelations(articleDoc);
  }

  async findAll() {
    const resQuery = await this.articleModel
      .find()
      .populate({ path: 'owner' })
      .exec();

    //losing this if we pass only method call
    const resArr = resQuery.map(this.getResponseWithRelations.bind(this));
    return resArr;
  }

  async findOne(id: string) {
    try {
      const resQuery = await this.articleModel
        .findById(id)
        .populate({ path: 'owner' })
        .exec();
      return this.getResponseWithRelations(resQuery);
    } catch (error) {
      throw new BadRequestException(`cannot find article with id ${id}`);
    }
  }

  async findByIdWithRelationsIds(id: string) {
    try {
      return await this.articleModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    delete updateArticleDto.id;
    delete updateArticleDto.ownerId;
    const updatedArticleQuery = await this.articleModel.findOneAndUpdate(
      { _id: id },
      { ...updateArticleDto },
      { runValidators: true, new: true },
    );
    return this.getResponse(updatedArticleQuery);
  }

  async remove(id: string, user: User) {
    try {
      const updatedUserQuery =
        await this.usersService.userModel.findOneAndUpdate(
          { _id: id },
          {
            $set: { numberOfArticles: --user.numberOfArticles },
            $pull: { articles: id },
          },
          { new: true },
        );

      const userResp =
        this.usersService.userMapper.userToUserResponse(updatedUserQuery);

      const deleteRes = await this.articleModel.deleteOne({ _id: id });
      return { ...deleteRes, articleId: id, updatedUser: userResp };
    } catch (error) {
      throw error;
    }
  }
}
