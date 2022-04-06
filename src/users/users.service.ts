import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { User, UserDocument, UserToFindOne } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { UserMapperService } from './user-mapper.service';
import { BaseService } from 'src/base/services/base.service';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    @InjectModel(User.name) public userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
    public userMapper: UserMapperService,
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
  ) {
    super();
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const usernameCount = await this.userModel.count({
        username: createUserDto.username,
      });

      if (usernameCount) {
        throw new BadRequestException(
          `${createUserDto.username} username has already been taken`,
        );
      }

      const newUser = new this.userModel({
        _id: new mongoose.Types.ObjectId(),
        ...createUserDto,
      });

      const createdUserQuery = await newUser.save();
      const userDoc = this.queryToObj(createdUserQuery) as User;
      return this.userMapper.userToUserResponse(userDoc);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const resQuery = await this.userModel
      .find()
      .populate({ path: 'articles' })
      .exec();

    const resArr = resQuery.map((query) => {
      const leanDoc = this.queryToObj(query) as User;
      return this.userMapper.userToUserResponseWithRelations(leanDoc);
    });
    return resArr;
  }

  async findOneWithRelations(id: string) {
    try {
      const userQuery = await this.userModel
        .findById(id)
        .populate({ path: 'articles' })
        .exec();
      const userDoc = this.queryToObj(userQuery) as User;
      return this.userMapper.userToUserResponseWithRelations(userDoc);
    } catch (error) {
      throw new BadRequestException(`cannot find user with id ${id}`);
    }
  }

  async findByIdWithRelationsIds(id: string) {
    try {
      const res = await this.userModel.findById(id);
      return this.queryToObj<User>(res);
    } catch (error) {
      throw error;
    }
  }

  async findOne(userProps: UserToFindOne) {
    const res = await this.userModel.findOne(userProps);
    return this.queryToObj<User>(res);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUserQuery = await this.userModel.findOneAndUpdate(
        { _id: id },
        { ...updateUserDto },
        { runValidators: true, new: true },
      );
      const obj = this.queryToObj(updatedUserQuery) as User;

      return this.userMapper.userToUserResponse(obj);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const deleteRes = await this.userModel.deleteOne({ _id: id });
      return { ...deleteRes, userId: id };
    } catch (error) {
      throw error;
    }
  }
}
