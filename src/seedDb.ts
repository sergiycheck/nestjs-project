import mongoose from 'mongoose';
import { Model, Connection } from 'mongoose';
import { User, UserDocument } from './users/entities/user.entity';
import { Article, ArticleDocument } from './article/entities/article.entity';
import { MyLogger } from './injecting-custom-logger/my-logger.service';

export class DbInitializer {
  constructor(private connection: Connection, private logger: MyLogger) {}

  public async seedDb() {
    const userCollectionName = `${User.name.toLowerCase()}s`;
    const articleCollectionName = `${Article.name.toLowerCase()}s`;

    const userCollection = await this.connection.db
      .listCollections({
        name: userCollectionName,
      })
      .toArray();

    const articleCollection = await this.connection.db
      .listCollections({
        name: articleCollectionName,
      })
      .toArray();

    if (userCollection.length || articleCollection.length) {
      this.logger.customLog(
        `userCollection.length ${userCollection.length} articleCollection.length ${articleCollection.length}`,
      );
      return;
    }

    const UserModel = (await this.connection.model(
      User.name,
    )) as Model<UserDocument>;

    const ArticleModel = (await this.connection.model(
      Article.name,
    )) as Model<ArticleDocument>;

    try {
      const authors = await UserModel.create([
        {
          _id: new mongoose.Types.ObjectId(),
          firstName: 'Leanne',
          lastName: 'Graham',
          password: 'cft0id32',
          username: 'leane1Gra',
          role: 'user',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          firstName: 'Clementine',
          lastName: 'Bauch',
          password: 'v32rfizx',
          username: 'Samantha',
          role: 'writer',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          firstName: 'badFirstName',
          lastName: 'Howell',
          password: '3182v53f',
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
          owner: authors[0]._id,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article text ${getRandomInt(0, 100)}`,
          subtitle: 'subtitle great 2',
          description: 'article description 3',
          category: 'games',
          owner: authors[0]._id,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article title 3`,
          subtitle: 'subtitle arrogant',
          description: 'article description dark',
          category: 'history',
          owner: authors[1]._id,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: `article text ${getRandomInt(0, 100)}`,
          subtitle: 'subtitle bored',
          description: 'article description cute',
          category: 'sport',
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
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
