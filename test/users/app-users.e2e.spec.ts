import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { configApp } from '../../src/configApp';
import { createAndCompileTestingModule } from '../create-testing-module';
import { LoginEndPoint, UsersEndpoint } from '../../src/api/endpoints';
import {
  MappedUserResponse,
  MappedUserResponseWithRelations,
  UserDeleteResult,
} from '../../src/users/dto/response-user.dto';
import { CustomConnectionService } from '../../src/custom-conn.service';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from '../../src/injecting-custom-logger/my-logger.service';
import { DbInitializer } from '../../src/seedDb';
import { Connection } from 'mongoose';
import { UserLoginResponse } from '../../src/auth/responses/responses.dto';
import { EndPointResponse } from '../../src/base/responses/response';
import mongoose from 'mongoose';
import { TIMEOUT_FOR_DEBUGGING } from './../constants';

describe('app users (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let dbInitializer: DbInitializer;

  beforeAll(async () => {
    const partOfTheDbName = 'appUsers';
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

  it('/ (GET) users with populated articles (UsersController findAll)', () => {
    expect.assertions(7);
    return request(app.getHttpServer())
      .get(`/${UsersEndpoint}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);

        const result = response.body as EndPointResponse<
          MappedUserResponseWithRelations[]
        >;

        expect(result.message).toBe('users was found');
        expect(result.data).toBeInstanceOf(Array);
        expect(result.data.length).toBe(3);
        expect(Array.isArray(result.data[0].articles)).toBeTruthy();
        expect(result.data[0].articles.length).toBe(2);
        expect(result.data[0].numberOfArticles).toBe(2);
      });
  });

  it('/ (POST) creates user (UsersController create)', () => {
    expect.assertions(5);

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
      .then((response) => {
        expect(response.statusCode).toBe(201);

        expect(response.headers['content-type']).toMatch(/json/);
        const result = response.body as EndPointResponse<MappedUserResponse>;
        expect(result.data.username).toBe('myUsername1');
        expect(result.data.id).toBeTruthy();
        expect(result.message).toBe('user was created');
      });
  });

  it('/ (POST) auth login for user (AuthController login)', async () => {
    expect.assertions(4);

    const userToLogin = {
      username: 'leane1Gra',
      password: 'cft0id32',
    };

    const test = request(app.getHttpServer())
      .post(`/${LoginEndPoint}`)
      .set('Accept', 'application/json')
      .send(userToLogin);

    const response = await test;

    expect(response.statusCode).toBe(201);

    expect(response.headers['content-type']).toMatch(/json/);
    const data = response.body as UserLoginResponse;
    expect(data.message).toBe('successfully logged in');
    expect(data.user_jwt).toBeTruthy();
    return test;
  });

  it('/ (GET) gets user by username (UsersController findOneByUsername)', async () => {
    expect.assertions(8);

    const username = 'Samantha';
    const numberOfArticles = 2;

    const test = request(app.getHttpServer())
      .get(`/${UsersEndpoint}/by-username`)
      .query({ username });

    const response = await test;
    expect(response.statusCode).toBe(200);

    expect(response.headers['content-type']).toMatch(/json/);
    const result = response.body as EndPointResponse<MappedUserResponse>;

    expect(result.message).toBe('user was found');
    expect(result.data.id).toBeTruthy();
    expect(result.data.username).toBe(username);
    expect(result.data.numberOfArticles).toBe(numberOfArticles);
    expect(result.data.articleIds).toBeInstanceOf(Array);
    expect(result.data.articleIds.length).not.toBe(0);
    return test;
  });

  it('/ (GET) gets user by non existing username (UsersController findOneByUsername)', async () => {
    expect.assertions(3);

    const username = 'definitely non existing';

    const test = request(app.getHttpServer())
      .get(`/${UsersEndpoint}/by-username`)
      .query({ username });

    const response = await test;
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);

    const result = response.body as EndPointResponse<unknown>;
    expect(result.message).toBe(`user was not found for username ${username}`);
    return test;
  });

  it('/ (GET) gets user by id with relations (UsersController findOne)', async () => {
    expect.assertions(5);
    const username = 'Samantha';

    const httpServer = app.getHttpServer();
    let response = await request(httpServer)
      .get(`/${UsersEndpoint}/by-username`)
      .query({ username });

    expect(response.statusCode).toBe(200);
    const resultUserResponse =
      response.body as EndPointResponse<MappedUserResponse>;

    const { id } = resultUserResponse.data;

    expect(mongoose.Types.ObjectId.isValid(id)).toBeTruthy();

    response = await request(httpServer).get(`/${UsersEndpoint}/${id}`);

    const resultUserResponseWithRelations =
      response.body as EndPointResponse<MappedUserResponseWithRelations>;

    expect(resultUserResponseWithRelations.message).toBe('user was found');
    expect(
      mongoose.Types.ObjectId.isValid(resultUserResponseWithRelations.data.id),
    ).toBeTruthy();
    expect(resultUserResponseWithRelations.data.articles[0].title).not.toBe('');
  });

  describe('auth update and delete requests', () => {
    const userToLogin = {
      username: 'leane1Gra',
      password: 'cft0id32',
    };
    let httpServer;
    let userLoginResponse: UserLoginResponse;

    beforeEach(async () => {
      httpServer = app.getHttpServer();
      const responseLogin = await request(httpServer)
        .post(`/${LoginEndPoint}`)
        .set('Accept', 'application/json')
        .send(userToLogin);

      expect(responseLogin.statusCode).toBe(201);

      userLoginResponse = responseLogin.body as UserLoginResponse;
    });

    it(
      '/ (PATCH) update user (UsersController update)',
      async () => {
        expect.assertions(6);

        const updateUserDto = {
          firstName: 'firstname changed 1',
          username: 'usernameChanged1',
        };

        const updateUserUrl = `/${UsersEndpoint}/${userLoginResponse.userResponse.id}`;
        const response = await request(httpServer)
          .patch(updateUserUrl)
          .set('Authorization', `Bearer ${userLoginResponse.user_jwt}`)
          .set('Accept', 'application/json')
          .send(updateUserDto);

        expect(response.statusCode).toBe(200);

        const result = response.body as EndPointResponse<MappedUserResponse>;

        expect(result.message).toBe('user was updated successfully');
        expect(result.data.id).not.toBe('');
        expect(result.data.firstName).toBe(updateUserDto.firstName);
        expect(result.data.username).toBe(updateUserDto.username);
      },
      TIMEOUT_FOR_DEBUGGING,
    );

    it(
      '/ (DELETE) deletes user (UsersController remove)',
      async () => {
        expect.assertions(5);
        const updateUserUrl = `/${UsersEndpoint}/${userLoginResponse.userResponse.id}`;

        const response = await request(httpServer)
          .delete(updateUserUrl)
          .set('Authorization', `Bearer ${userLoginResponse.user_jwt}`)
          .set('Accept', 'application/json');

        expect(response.statusCode).toBe(200);
        const result = response.body as EndPointResponse<UserDeleteResult>;
        expect(result.message).toBe('user was deleted successfully');
        expect(result.data.deletedCount).toBe(1);
        expect(result.data.acknowledged).toBeTruthy();
      },
      TIMEOUT_FOR_DEBUGGING,
    );
  });
});
