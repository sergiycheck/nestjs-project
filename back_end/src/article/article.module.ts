import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './entities/article.entity';
import { ArticleMapperService } from './article-mapper.service';
import { UsersModule } from '../users/users.module';
import { AddOwnerToRequestMiddleware } from './middlewares/add-owner-to-request.middleware';
import { ArticlesEndpoint } from '../api/endpoints';
import { CheckIfUserPossessesArticleMiddleware } from './middlewares/check-if-user-possesses-article.middleware';
import { ArticleResponseGetterService } from './article-response-getter.service';
import { ArticleSearchService } from './article-search.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Article.name,
        useFactory: () => {
          const schema = ArticleSchema;
          schema.index(
            {
              title: 'text',
              subtitle: 'text',
              description: 'text',
              category: 'text',
            },
            {
              weights: {
                title: 10,
                subtitle: 8,
                description: 2,
                category: 5,
              },
              name: 'ArticleTextIndex',
            },
          );
          return schema;
        },
      },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    ArticleMapperService,
    ArticleResponseGetterService,
    ArticleSearchService,
  ],
  exports: [ArticleService, ArticleMapperService],
})
export class ArticleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AddOwnerToRequestMiddleware)
      .forRoutes({ path: ArticlesEndpoint, method: RequestMethod.POST })
      .apply(CheckIfUserPossessesArticleMiddleware)
      .forRoutes(
        { path: `${ArticlesEndpoint}/:id`, method: RequestMethod.PATCH },
        { path: `${ArticlesEndpoint}/:id`, method: RequestMethod.DELETE },
      );
  }
}
