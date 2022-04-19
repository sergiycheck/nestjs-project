import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { configApp } from '../../src/configApp';
import { createAndCompileTestingModule } from '../create-testing-module';
import { LoginEndPoint, ArticlesEndpoint } from '../../src/api/endpoints';
import { CustomConnectionService } from '../../src/custom-conn.service';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from '../../src/injecting-custom-logger/my-logger.service';
import { DbInitializer } from '../../src/seed-db-config/seedDb';
import { Connection } from 'mongoose';
import { UserLoginResponse } from '../../src/auth/responses/responses.dto';
import {
  ArticleDeleteResult,
  CreateArticleResponse,
  MappedArticleResponse,
  MappedArticleResponseWithRelations,
} from '../../src/article/dto/response-article.dto';
import { EndPointResponse } from '../../src/base/responses/response.dto';
import { TIMEOUT_FOR_DEBUGGING } from './../constants';

describe('app articles (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let dbInitializer: DbInitializer;

  const userToLogin = {
    username: 'leane1Gra',
    password: 'cft0id32',
  };

  let userLoginResponse: UserLoginResponse;

  beforeAll(async () => {
    const partOfTheDbName = 'appArticles';
    const moduleFixture: TestingModule = await createAndCompileTestingModule({
      partOfTheDbName,
    });

    app = moduleFixture.createNestApplication();

    await configApp(app);

    await app.init();
  });

  afterAll(async () => {
    await connection.db.dropDatabase();
    await app.close();
  });

  beforeEach(async () => {
    const configService = app.get(ConfigService);
    const logger = new MyLogger(configService);
    connection = app.get(CustomConnectionService).getConnection();
    dbInitializer = new DbInitializer(connection, logger);
    await dbInitializer.seedDb();

    const httpServer = app.getHttpServer();
    const responseLogin = await request(httpServer)
      .post(`/${LoginEndPoint}`)
      .set('Accept', 'application/json')
      .send(userToLogin);
    userLoginResponse = responseLogin.body as UserLoginResponse;
  });

  afterEach(async () => {
    await connection.db
      .collection(dbInitializer.articleCollectionName)
      .deleteMany({});
    await connection.db
      .collection(dbInitializer.userCollectionName)
      .deleteMany({});
  });

  it(
    '/ (POST) creates article (ArticleController create)',
    async function () {
      expect.assertions(8);
      const httpServer = app.getHttpServer();

      const articleToCreate = {
        title: 'article a',
        subtitle: 'subtitle a',
        description: 'description a',
        category: 'history',
        ownerId: userLoginResponse.userResponse.id,
      };

      const response = await request(httpServer)
        .post(`/${ArticlesEndpoint}`)
        .set('Authorization', `Bearer ${userLoginResponse.user_jwt}`)
        .set('Accept', 'application/json')
        .send(articleToCreate);

      expect(response.statusCode).toBe(201);
      expect(response.headers['content-type']).toMatch(/json/);

      const createArticleMappedResponse =
        response.body as EndPointResponse<CreateArticleResponse>;
      const { updatedUser, newArticle } = createArticleMappedResponse.data;

      expect(createArticleMappedResponse.message).toBe('article was created');
      expect(newArticle.id).toBeTruthy();
      expect(newArticle.title).toBe(articleToCreate.title);
      expect(updatedUser.id).toBeTruthy();
      expect(updatedUser.articleIds).toContain(newArticle.id);
      expect(updatedUser.numberOfArticles).toBe(
        userLoginResponse.userResponse.numberOfArticles + 1,
      );
    },
    TIMEOUT_FOR_DEBUGGING,
  );

  it(
    '/ (GET) articles with populated owner (ArticleController findAll)',
    async () => {
      expect.assertions(5);

      const response = await request(app.getHttpServer()).get(
        `/${ArticlesEndpoint}`,
      );
      expect(response.statusCode).toBe(200);

      const result = response.body as EndPointResponse<
        MappedArticleResponseWithRelations[]
      >;

      expect(result.message).toBe('articles were found');
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBe(5);
      expect(result.data[0].owner.id).not.toBe('');
    },
    TIMEOUT_FOR_DEBUGGING,
  );

  // TODO: BUG passing when running separately but fails if runs with app article all tests

  it(
    '/ (GET) find articles with owner by owner id (ArticleController findArticlesByUser)',
    async () => {
      expect.assertions(5);

      const response = await request(app.getHttpServer()).get(
        `/${ArticlesEndpoint}/by-user-id/${userLoginResponse.userResponse.id}`,
      );
      expect(response.statusCode).toBe(200);

      const result = response.body as EndPointResponse<
        MappedArticleResponseWithRelations[]
      >;

      expect(result.message).toBe(`articles were found four user`);

      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBe(2);
      expect(result.data[0].owner.id).toBe(userLoginResponse.userResponse.id);
    },
    TIMEOUT_FOR_DEBUGGING,
  );

  // TODO: BUG passing when running separately but fails if runs with app article all tests
  // TODO: ERROR [ExceptionsHandler] text index required for $text query
  // text index is not creating for tests in debug mode

  it(
    '/ (GET) find article by id (ArticleController findOne)',
    async () => {
      expect.assertions(6);
      let response = await request(app.getHttpServer())
        .get(`/${ArticlesEndpoint}`)
        .query({ searchText: 'history' });

      expect(response.statusCode).toBe(200);

      const resultArticles = response.body as EndPointResponse<
        MappedArticleResponseWithRelations[]
      >;

      const articleId = resultArticles.data[0].id;
      response = await request(app.getHttpServer()).get(
        `/${ArticlesEndpoint}/${articleId}`,
      );

      expect(response.statusCode).toBe(200);

      const result =
        response.body as EndPointResponse<MappedArticleResponseWithRelations>;

      expect(result.message).toBe('article was found');
      expect(result.data.id).toBe(articleId);
      expect(result.data.title).not.toBe('');
      expect(result.data.owner.username).not.toBe('');
    },
    TIMEOUT_FOR_DEBUGGING,
  );

  it(
    '/ (PATCH) updates article with bearer token (ArticleController update)',
    async () => {
      expect.assertions(5);

      const httpServer = app.getHttpServer();
      let response = await request(httpServer)
        .get(`/${ArticlesEndpoint}`)
        .query({ limit: '1' });

      expect(response.statusCode).toBe(200);

      const resultArticles = response.body as EndPointResponse<
        MappedArticleResponseWithRelations[]
      >;
      const articleId = resultArticles.data[0].id;

      const updateArticleRequest = {
        id: articleId,
        title: 'definitely updated article title',
        ownerId: userLoginResponse.userResponse.id,
      };

      response = await request(httpServer)
        .patch(`/${ArticlesEndpoint}/${articleId}`)
        .set('Authorization', `Bearer ${userLoginResponse.user_jwt}`)
        .set('Accept', 'application/json')
        .send(updateArticleRequest);

      expect(response.statusCode).toBe(200);

      const result = response.body as EndPointResponse<MappedArticleResponse>;
      expect(result.message).toBe('article was updated successfully');
      expect(result.data.id).not.toBe('');
      expect(result.data.title).toBe(updateArticleRequest.title);
    },
    TIMEOUT_FOR_DEBUGGING,
  );

  // TODO: force space after comment

  it(
    '/ (DELETE) deletes article (ArticleController remove)',
    async () => {
      expect.assertions(6);
      const httpServer = app.getHttpServer();
      let response = await request(httpServer)
        .get(`/${ArticlesEndpoint}`)
        .query({ limit: '1' });

      expect(response.statusCode).toBe(200);

      const resultArticles = response.body as EndPointResponse<
        MappedArticleResponseWithRelations[]
      >;
      const articleId = resultArticles.data[0].id;

      response = await request(httpServer)
        .delete(`/${ArticlesEndpoint}/${articleId}`)
        .set('Authorization', `Bearer ${userLoginResponse.user_jwt}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(200);
      const articleDeleteResult =
        response.body as EndPointResponse<ArticleDeleteResult>;

      expect(articleDeleteResult.message).toBe(
        'article was deleted successfully',
      );
      expect(articleDeleteResult.data.deletedCount).toBe(1);
      expect(articleDeleteResult.data.updatedUser.numberOfArticles).toBe(
        Number(userLoginResponse.userResponse.numberOfArticles) - 1,
      );
      expect(articleDeleteResult.data.updatedUser.articleIds).not.toContain(
        articleId,
      );
    },
    TIMEOUT_FOR_DEBUGGING,
  );

  // it('/ (GET) (ArticleController findOne)', async () => {}, TIMEOUT_FOR_DEBUGGING);
});
