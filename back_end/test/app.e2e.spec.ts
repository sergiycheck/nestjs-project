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
