import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { configApp } from '../src/configApp';
import { createAndCompileTestingModule } from './create-testing-module';
import { CustomConnectionService } from '../src/custom-conn.service';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from '../src/injecting-custom-logger/my-logger.service';
import { DbInitializer } from '../src/seed-db-config/seedDb';
import { Connection } from 'mongoose';

// change this options in package.json from "rootDir": "src" to "rootDir": "\" to
// be able to debug and run e2e.spec.ts files from vscode-jest extension

// to debug hit the break point and choose "Jest Current File" run and debug option

// instruction how to debug jest test from microsoft
// https://github.com/Microsoft/vscode-recipes/tree/master/debugging-jest-tests

// TODO: change jest-e2e.json from  "rootDir": "./articles" to "rootDir": "."

describe('app global (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let dbInitializer: DbInitializer;

  beforeAll(async () => {
    const partOfTheDbName = 'appGlobal';
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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World! nestjs-project');
  });
});
