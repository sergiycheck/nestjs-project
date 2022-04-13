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
} from '../base/services/base.service';
import { UsersService } from '../users/users.service';
import { ArticleMapperService } from './article-mapper.service';
import { CreateArticleDto } from './dto/create-article.dto';
import {
  ArticleDeleteResult,
  CreateArticleResponse,
  MappedArticleResponse,
  MappedArticleResponseWithRelations,
} from './dto/response-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './entities/article.entity';
import {
  ArticleSearchText,
  searchArticlePropsNames,
} from './dto/article-requests';
import { MappedUserResponse } from '../users/dto/response-user.dto';

// all thrown exceptions is handled by global exception filter
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

    const userResp = this.usersService.getResponse(updatedUserQuery);
    const articleResp =
      this.getResponseWithExcludedRelations(createdArticleQuery);

    return {
      updatedUser: userResp,
      newArticle: articleResp,
    } as CreateArticleResponse;
  }

  public getResponse(articleQuery: ToObjectContainingQuery<Article>) {
    const articleDoc = super.queryToObj(articleQuery);
    return this.articleMapper.articleToArticleResponse(
      articleDoc,
    ) as MappedArticleResponse;
  }

  private getResponseWithRelations(
    articleQuery: ToObjectContainingQuery<Article>,
  ) {
    const articleDoc = super.queryToObj(articleQuery);
    return this.articleMapper.articleToArticleResponseWithRelations(
      articleDoc,
    ) as MappedArticleResponseWithRelations;
  }

  private getResponseWithExcludedRelations(
    articleQuery: ToObjectContainingQuery<Article>,
  ) {
    const articleDoc = super.queryToObj(articleQuery);

    return this.articleMapper.articleToArticleResponseWithExcludedRelations(
      articleDoc,
    ) as MappedArticleResponse;
  }

  private getFindArgsArr(requestQuery: ArticleSearchText) {
    const query = {} as any;
    const projection = null;
    const options = {} as any;

    for (const queryProp in requestQuery) {
      switch (queryProp) {
        case searchArticlePropsNames.searchText:
          query['$text'] = { $search: requestQuery[queryProp] };
          break;
        case searchArticlePropsNames.lessThanCreatedAt:
          query['createdAt'] = { $lte: requestQuery[queryProp] };
          break;
        case searchArticlePropsNames.greaterThanCreatedAt:
          query['createdAt'] = { $gte: requestQuery[queryProp] };
          break;
        case searchArticlePropsNames.lessThanUpdatedAt:
          query['updatedAt'] = { $lte: requestQuery[queryProp] };
          break;
        case searchArticlePropsNames.greaterThanUpdatedAt:
          query['updatedAt'] = { $gte: requestQuery[queryProp] };
          break;
        case searchArticlePropsNames.limit:
          options['limit'] = requestQuery[queryProp];
          break;
        case searchArticlePropsNames.skip:
          options['skip'] = requestQuery[queryProp];
          break;

        default:
          break;
      }
    }
    return [query, projection, options];
  }

  async findAll(requestQuery: ArticleSearchText) {
    let resQuery;
    if (requestQuery && Object.keys(requestQuery).length) {
      const findArgsArr = this.getFindArgsArr(requestQuery);
      const { searchText } = requestQuery;

      if (searchText) {
        resQuery = await this.articleModel
          .find(...findArgsArr)
          .sort({ score: { $meta: 'textScore' } })
          .populate({ path: 'owner' })
          .exec();
      } else {
        resQuery = await this.articleModel
          .find(...findArgsArr)
          .populate({ path: 'owner' })
          .exec();
      }
    } else {
      resQuery = await this.articleModel
        .find({})
        .populate({ path: 'owner' })
        .exec();
    }

    // losing this if we pass only method call
    const resArr = resQuery.map(this.getResponseWithRelations.bind(this));
    return resArr;
  }

  async findOne(id: string) {
    const resQuery = await this.articleModel
      .findById(id)
      .populate({ path: 'owner' })
      .exec();
    if (!resQuery)
      throw new BadRequestException(`cannot find article with id ${id}`);
    return this.getResponseWithRelations(resQuery);
  }

  async findByIdWithRelationsIds(id: string) {
    const res = await this.articleModel.findById(id);
    if (!res)
      throw new BadRequestException(`cannot find article with id ${id}`);
    return this.getResponse(res);
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const { id: idDto, ownerId, ...updateArticleData } = updateArticleDto;

    const updatedArticleQuery = await this.articleModel.findOneAndUpdate(
      { _id: id },
      { ...updateArticleData },
      { runValidators: true, new: true },
    );
    return this.getResponse(updatedArticleQuery);
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

    const userResp = this.usersService.getResponse(updatedUserQuery);

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

    const resArr = articlesQuery.map(
      this.getResponseWithRelations.bind(this),
    ) as MappedArticleResponseWithRelations[];
    return resArr;
  }
}
