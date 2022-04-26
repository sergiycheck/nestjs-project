import {
  forwardRef,
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../base/services/base.service';
import { UsersService } from '../users/users.service';
import { CreateArticleDto } from './dto/create-article.dto';
import {
  ArticleDeleteResult,
  CreateArticleResponse,
  MappedArticleResponseWithRelations,
} from './dto/response-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './entities/article.entity';
import { MappedUserResponse } from '../users/dto/response-user.dto';
import { ArticleResponseGetterService } from './article-response-getter.service';

// all thrown exceptions is handled by global exception filter
@Injectable()
export class ArticleService extends BaseService {
  constructor(
    @InjectModel(Article.name) public articleModel: Model<ArticleDocument>,
    private articleResponseGetterService: ArticleResponseGetterService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async create(
    createArticleDto: CreateArticleDto,
    userResponse: MappedUserResponse,
  ) {
    const { ownerId, ...articleData } = createArticleDto;

    const userFromDb = await this.usersService.userModel.findById(
      userResponse.id,
    );

    const newArticle = new this.articleModel({
      _id: new mongoose.Types.ObjectId(),
      ...articleData,
      owner: userFromDb,
    });
    const createdArticleQuery = await newArticle.save();

    const updatedUserQuery = await this.usersService.userModel.findOneAndUpdate(
      { _id: userResponse.id },
      {
        $set: { numberOfArticles: Number(userResponse.numberOfArticles) + 1 },
        $push: { articles: createdArticleQuery._id },
      },
      { new: true },
    );

    const userResp =
      this.usersService.usersResponseGetterService.getResponse(
        updatedUserQuery,
      );
    const articleResp =
      this.articleResponseGetterService.getResponseWithExcludedRelations(
        createdArticleQuery,
      );

    return {
      updatedUser: userResp,
      newArticle: articleResp,
    } as CreateArticleResponse;
  }

  async findOneWithRelations(id: string) {
    const resQuery = await this.articleModel
      .findById(id)
      .populate({ path: 'owner' })
      .exec();

    if (!resQuery)
      throw new NotFoundException(`cannot find article with id ${id}`);

    return this.articleResponseGetterService.getResponseWithRelations(resQuery);
  }

  async findOne(id: string) {
    const resQuery = await this.articleModel.findById(id).exec();

    if (!resQuery)
      throw new NotFoundException(`cannot find article with id ${id}`);

    return this.articleResponseGetterService.getResponse(resQuery);
  }

  async findByIdWithRelationsIds(id: string) {
    const res = await this.articleModel.findById(id);
    if (!res)
      throw new BadRequestException(`cannot find article with id ${id}`);
    return this.articleResponseGetterService.getResponse(res);
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const { id: idDto, ownerId, ...updateArticleData } = updateArticleDto;

    const updatedArticleQuery = await this.articleModel.findOneAndUpdate(
      { _id: id },
      { ...updateArticleData },
      { runValidators: true, new: true },
    );
    return this.articleResponseGetterService.getResponse(updatedArticleQuery);
  }

  async remove(id: string, user: MappedUserResponse) {
    const updatedUserQuery = await this.usersService.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        $set: { numberOfArticles: Number(user.numberOfArticles) - 1 },
        $pull: { articles: id },
      },
      { new: true },
    );

    const userResp =
      this.usersService.usersResponseGetterService.getResponse(
        updatedUserQuery,
      );

    const deleteRes = await this.articleModel.deleteOne({ _id: id });
    return {
      ...deleteRes,
      articleId: id,
      updatedUser: userResp,
    } as ArticleDeleteResult;
  }

  async getArticlesByUserId(userId: string) {
    const articlesQuery = await this.articleModel
      .where('owner')
      .equals(userId)
      .populate({ path: 'owner' });

    const resArr = articlesQuery.map((query) =>
      this.articleResponseGetterService.getResponseWithRelations(query),
    ) as MappedArticleResponseWithRelations[];
    return resArr;
  }
}
