import mongoose from 'mongoose';
import { Model, Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/entities/user.entity';
import { Article, ArticleDocument } from '../article/entities/article.entity';
import { MyLogger } from '../injecting-custom-logger/my-logger.service';
import { SALT_ROUNDS } from '../auth/constants';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { FakeUserFromFile, FakePostFromFile } from './types';
import { Role } from '../users/entities/roles.enum';
import { ArticleGenre } from '../article/entities/article.enum';

const fakePostsArrFileName = 'fake-posts.json';
const fakeUsersObjWithArrName = 'fake-users.json';

export class DbInitializer {
  public userCollectionName = `${User.name.toLowerCase()}s`;
  public articleCollectionName = `${Article.name.toLowerCase()}s`;

  constructor(private connection: Connection, private logger: MyLogger) {}

  private async getHashFromPass(password: string) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  public async seedDb() {
    const usersDocs = await this.connection.db.collection(this.userCollectionName).find().toArray();
    const articleDocs = await this.connection.db
      .collection(this.articleCollectionName)
      .find()
      .toArray();

    if (usersDocs.length || articleDocs.length) {
      this.logger.customLog(
        `userCollection.length ${usersDocs.length} articleCollection.length ${articleDocs.length}`,
      );
      return;
    }

    const UserModel = (await this.connection.model(User.name)) as Model<UserDocument>;

    const ArticleModel = (await this.connection.model(Article.name)) as Model<ArticleDocument>;

    try {
      const usersPasswords = ['cft0id32', 'v32rfizx', '3182v53f'];
      const usersHashes = [];
      for (const userPass of usersPasswords) {
        usersHashes.push(await this.getHashFromPass(userPass));
      }
      const [user1Hash, user2Hash, user3Hash] = usersHashes;

      const authors = await UserModel.create([
        {
          _id: new mongoose.Types.ObjectId(),
          firstName: 'Leanne',
          lastName: 'Graham',
          passwordHash: user1Hash,
          username: 'leane1Gra',
          role: 'user',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          firstName: 'Clementine',
          lastName: 'Bauch',
          passwordHash: user2Hash,
          username: 'Samantha',
          role: 'writer',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          firstName: 'badFirstName',
          lastName: 'Howell',
          passwordHash: user3Hash,
          username: 'dweege3',
          role: 'admin',
        },
      ]);

      const articles = await ArticleModel.create([
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article text 1`,
          subtitle: 'subtitle great',
          description: 'article description 1',
          category: 'history',
          createdAt: '2021-03-21',
          owner: authors[0]._id,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article text ${getRandomInt(0, 100)}`,
          subtitle: 'subtitle great 2',
          description: 'article description 3',
          category: 'games',
          createdAt: '2021-04-21',
          owner: authors[0]._id,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article title 3`,
          subtitle: 'subtitle arrogant',
          description: 'article description dark',
          category: 'history',
          createdAt: '2021-03-10',
          owner: authors[1]._id,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article text ${getRandomInt(0, 100)}`,
          subtitle: 'subtitle bored',
          description: 'article description cute',
          category: 'sport',
          createdAt: '2020-07-27',
          owner: authors[1]._id,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article text ${getRandomInt(0, 100)}`,
          subtitle: 'subtitle bright',
          description: 'article description defeated',
          category: 'games',
          owner: authors[2]._id,
        },
      ]);

      for (const article of articles) {
        const ownerFromDb = authors.find(
          (author) => author._id.valueOf() === article.owner.valueOf(),
        );

        await UserModel.findOneAndUpdate(
          { _id: article.owner },
          {
            $set: { numberOfArticles: ++ownerFromDb.numberOfArticles },
            $push: { articles: article._id },
          },
          { new: true },
        );
      }

      return { authors, articles };
    } catch (error) {
      this.logger.error('an error occurred while seeding db', error);
    }
  }

  public async seedManyDocumentsIntoDb() {
    const usersDocs = await this.connection.db.collection(this.userCollectionName).find().toArray();

    const articleDocs = await this.connection.db
      .collection(this.articleCollectionName)
      .find()
      .toArray();

    if (usersDocs.length || articleDocs.length) {
      this.logger.customLog(
        `userCollection.length ${usersDocs.length} articleCollection.length ${articleDocs.length}`,
      );
      return;
    }

    const UserModel = (await this.connection.model(User.name)) as Model<UserDocument>;

    const ArticleModel = (await this.connection.model(Article.name)) as Model<ArticleDocument>;

    try {
      const generatedUsers = [
        {
          _id: new mongoose.Types.ObjectId(),
          firstName: 'Leanne',
          lastName: 'Graham',
          passwordHash: await this.getHashFromPass('cft0id32'),
          username: 'leane1Gra',
          role: 'user',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          firstName: 'Clementine',
          lastName: 'Bauch',
          passwordHash: await this.getHashFromPass('v32rfizx'),
          username: 'Samantha',
          role: 'writer',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          firstName: 'badFirstName',
          lastName: 'Howell',
          passwordHash: await this.getHashFromPass('3182v53f'),
          username: 'dweege3',
          role: 'admin',
        },
      ];

      const usersPath = path.resolve('src/seed-db-config', fakeUsersObjWithArrName);
      const loadedUsersObj = (await fsExtra.readJSON(usersPath)) as {
        total: number;
        data: FakeUserFromFile[];
      };

      const mappedNormalizedUsers = await Promise.all(
        loadedUsersObj.data.map(async (u) => ({
          _id: new mongoose.Types.ObjectId(),
          firstName: u.firstname,
          lastName: u.lastname,
          passwordHash: await this.getHashFromPass(u.password),
          username: u.username,
          role: Object.values(Role)[getRandomInt(0, Object.keys(Role).length)],
        })),
      );

      const authors = await UserModel.create(generatedUsers.concat(mappedNormalizedUsers));

      const generatedArticles = [
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article text 1`,
          subtitle: 'subtitle great',
          description: 'article description 1',
          category: 'history',
          createdAt: '2021-03-21',
          owner: authors[0]._id,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article text ${getRandomInt(0, 100)}`,
          subtitle: 'subtitle great 2',
          description: 'article description 3',
          category: 'games',
          createdAt: '2021-04-21',
          owner: authors[0]._id,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article title 3`,
          subtitle: 'subtitle arrogant',
          description: 'article description dark',
          category: 'history',
          createdAt: '2021-03-10',
          owner: authors[1]._id,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article text ${getRandomInt(0, 100)}`,
          subtitle: 'subtitle bored',
          description: 'article description cute',
          category: 'sport',
          createdAt: '2020-07-27',
          owner: authors[1]._id,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article text ${getRandomInt(0, 100)}`,
          subtitle: 'subtitle bright',
          description: 'article description defeated',
          category: 'games',
          owner: authors[2]._id,
        },
      ];

      const loadedPostsObj = (await fsExtra.readJson(
        path.resolve('src/seed-db-config', fakePostsArrFileName),
      )) as FakePostFromFile[];

      const mappedNormalizedPosts = await Promise.all(
        loadedPostsObj.map(async (p) => ({
          _id: new mongoose.Types.ObjectId(),
          title: p.title,
          subtitle: `article subtitle ${getRandomInt(0, 100)}`,
          description: p.body,
          category: Object.values(ArticleGenre)[getRandomInt(0, Object.keys(ArticleGenre).length)],
          owner: authors[getRandomInt(0, authors.length)]._id,
        })),
      );

      const articles = await ArticleModel.create(generatedArticles.concat(mappedNormalizedPosts));

      for (const article of articles) {
        const ownerFromDb = authors.find(
          (author) => author._id.valueOf() === article.owner.valueOf(),
        );

        await UserModel.findOneAndUpdate(
          { _id: article.owner },
          {
            $set: { numberOfArticles: ++ownerFromDb.numberOfArticles },
            $push: { articles: article._id },
          },
          { new: true },
        );
      }

      return { authors, articles };
    } catch (error) {
      this.logger.error('an error occurred while seeding db', error);
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
