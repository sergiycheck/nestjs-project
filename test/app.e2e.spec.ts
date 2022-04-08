import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { configApp } from '../src/configApp';
import { createAndCompileTestingModule } from './create-testing-module';
import {
  LoginEndPoint,
  UsersEndpoint,
  ArticlesEndpoint,
} from '../src/api/endpoints';
import {
  MappedUserResponse,
  MappedUserResponseWithRelations,
} from '../src/users/dto/response-user.dto';
import { CustomConnectionService } from '../src/custom-conn.service';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from '../src/injecting-custom-logger/my-logger.service';
import { DbInitializer } from '../src/seedDb';
import { Connection } from 'mongoose';
import { UserLoginResponse } from '../src/auth/responses/responses.dto';
import { CreateArticleResponse } from '../src/article/dto/response-article.dto';

// change this options in package.json from "rootDir": "src" to "rootDir": "\" to
// be able to debug and run e2e.spec.ts files from vscode-jest extension

describe('app (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let dbInitializer: DbInitializer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await createAndCompileTestingModule();

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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World! nestjs-project');
  });

  it('/ (GET) users with populated articles', () => {
    return request(app.getHttpServer())
      .get(`/${UsersEndpoint}`)
      .expect(200)
      .then((response) => {
        const data = response.body as MappedUserResponseWithRelations[];

        expect(Array.isArray(data));
        expect(data.length).toBe(3);
        expect(Array.isArray(data[0].articles));
        expect(data[0].articles.length).toBe(2);
        expect(data[0].numberOfArticles).toBe(2);
      });
  });

  it('/ (POST) creates user', () => {
    const userToCreate = {
      username: 'myUsername1',
      firstName: 'testUserName',
      lastName: 'Graham',
      password: 'cft0id32',
    };
    return request(app.getHttpServer())
      .post(`/${UsersEndpoint}`)
      .set('Accept', 'application/json')
      .send(userToCreate)
      .expect(201)
      .then((response) => {
        expect(response.headers['content-type']).toMatch(/json/);
        const data = response.body as MappedUserResponse;
        expect(data.username).toBe('myUsername1');
        expect(data.id).toBeTruthy();
      });
  });

  it('/ (POST) auth login for user', async () => {
    const userToLogin = {
      username: 'leane1Gra',
      password: 'cft0id32',
    };

    const test = request(app.getHttpServer())
      .post(`/${LoginEndPoint}`)
      .set('Accept', 'application/json')
      .send(userToLogin)
      .expect(201);

    const response = await test;
    expect(response.headers['content-type']).toMatch(/json/);
    const data = response.body as UserLoginResponse;
    expect(data.message).toBe('successfully logged in');
    expect(data.user_jwt).toBeTruthy();
    return test;
  });

  it('/ (POST) creates article', async () => {
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

    const resposeGetUser = await request(app.getHttpServer())
      .get(`/${UsersEndpoint}/by-username`)
      .query({ username: userToLogin.username });

    expect(resposeGetUser.statusCode).toBe(200);

    const userFindByUsernameResponse =
      resposeGetUser.body as MappedUserResponse;

    const articleToCreate = {
      title: 'article a',
      subtitle: 'subtitle a',
      description: 'description a',
      category: 'history',
      ownerId: userFindByUsernameResponse.id,
    };

    const response = await request(httpServer)
      .post(`/${ArticlesEndpoint}`)
      .set('Authorization', `Bearer ${userLoginResponse.user_jwt}`)
      .set('Accept', 'application/json')
      .send(articleToCreate);

    expect(response.statusCode).toBe(201);
    expect(response.headers['content-type']).toMatch(/json/);

    const { updatedUser, newArticle } = response.body as CreateArticleResponse;

    expect(newArticle.id).toBeTruthy();
    expect(newArticle.title).toBe(articleToCreate.title);

    expect(updatedUser.id).toBeTruthy();
    expect(updatedUser.articleIds).toContain(newArticle.id);
    expect(updatedUser.numberOfArticles).toBe(
      userFindByUsernameResponse.numberOfArticles + 1,
    );
  });
});
