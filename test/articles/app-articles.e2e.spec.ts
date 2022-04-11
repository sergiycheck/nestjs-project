import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { configApp } from '../../src/configApp';
import { createAndCompileTestingModule } from '../create-testing-module';
import {
  LoginEndPoint,
  UsersEndpoint,
  ArticlesEndpoint,
} from '../../src/api/endpoints';
import { MappedUserResponse } from '../../src/users/dto/response-user.dto';
import { CustomConnectionService } from '../../src/custom-conn.service';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from '../../src/injecting-custom-logger/my-logger.service';
import { DbInitializer } from '../../src/seedDb';
import { Connection } from 'mongoose';
import { UserLoginResponse } from '../../src/auth/responses/responses.dto';
import { CreateArticleResponse } from '../../src/article/dto/response-article.dto';
import { EndPointResponse } from '../../src/base/responses/response';
import { TIMEOUT_FOR_DEBUGGING } from './../constants';

describe('app articles (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let dbInitializer: DbInitializer;

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
    await app.close();
  });

  beforeEach(async () => {
    const configService = app.get(ConfigService);
    const logger = new MyLogger(configService);
    connection = app.get(CustomConnectionService).getConnection();
    dbInitializer = new DbInitializer(connection, logger);
    await dbInitializer.seedDb();
  });

  afterEach(async () => {
    await connection.db.dropCollection(dbInitializer.articleCollectionName);
    await connection.db.dropCollection(dbInitializer.userCollectionName);
  });

  it(
    '/ (POST) creates article',
    async function () {
      expect.assertions(9);
      const userToLogin = {
        username: 'leane1Gra',
        password: 'cft0id32',
      };

      const httpServer = app.getHttpServer();

      const responseLogin = await request(httpServer)
        .post(`/${LoginEndPoint}`)
        .set('Accept', 'application/json')
        .send(userToLogin);

      expect(responseLogin.statusCode).toBe(201);

      const userLoginResponse = responseLogin.body as UserLoginResponse;

      const resposeGetUser = await request(httpServer)
        .get(`/${UsersEndpoint}/by-username`)
        .query({ username: userToLogin.username });

      expect(resposeGetUser.statusCode).toBe(200);

      const userFindByUsernameResponse =
        resposeGetUser.body as EndPointResponse<MappedUserResponse>;

      const userData = userFindByUsernameResponse.data;

      const articleToCreate = {
        title: 'article a',
        subtitle: 'subtitle a',
        description: 'description a',
        category: 'history',
        ownerId: userData.id,
      };

      const response = await request(httpServer)
        .post(`/${ArticlesEndpoint}`)
        .set('Authorization', `Bearer ${userLoginResponse.user_jwt}`)
        .set('Accept', 'application/json')
        .send(articleToCreate);

      expect(response.statusCode).toBe(201);
      expect(response.headers['content-type']).toMatch(/json/);

      const { updatedUser, newArticle } =
        response.body as CreateArticleResponse;

      expect(newArticle.id).toBeTruthy();
      expect(newArticle.title).toBe(articleToCreate.title);

      expect(updatedUser.id).toBeTruthy();
      expect(updatedUser.articleIds).toContain(newArticle.id);
      expect(updatedUser.numberOfArticles).toBe(userData.numberOfArticles + 1);
    },
    TIMEOUT_FOR_DEBUGGING,
  );
});
