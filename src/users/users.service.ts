import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Connection, LeanDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument, UserToFindOne } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapperService } from './user-mapper.service';
import {
  BaseService,
  ToObjectContainingQuery,
} from '../base/services/base.service';
import { ArticleService } from '../article/article.service';
import {
  MappedUserResponse,
  MappedUserResponseWithRelations,
  UserDeleteResult,
} from './dto/response-user.dto';
import { SALT_ROUNDS } from '../auth/constants';

//all thrown exceptions is handled by global exception filter
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

  private async countUsername(username?: string) {
    if (!username) return;
    const usernameCount = await this.userModel.count({
      username: username,
    });

    if (usernameCount) {
      throw new BadRequestException(
        `${username} username has already been taken`,
      );
    }
  }

  async create(createUserDto: CreateUserDto) {
    this.countUsername(createUserDto.username);

    const { password, ...props } = createUserDto;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new this.userModel({
      _id: new mongoose.Types.ObjectId(),
      passwordHash: hash,
      ...props,
    });

    const createdUserQuery = await newUser.save();

    return this.getResponse(createdUserQuery);
  }

  public getResponse(
    entityQuery: ToObjectContainingQuery<User>,
  ): MappedUserResponse | null {
    if (!entityQuery) return null;

    const entityDoc = super.queryToObj(entityQuery);
    return this.userObjToPlain(entityDoc);
  }

  public userObjToPlain(user: LeanDocument<User>) {
    return this.userMapper.userToUserResponse(user) as MappedUserResponse;
  }

  private getResponseWithRelations(
    entityQuery: ToObjectContainingQuery<User>,
  ): MappedUserResponseWithRelations | null {
    if (!entityQuery) return null;

    const entityDoc = super.queryToObj(entityQuery);
    return this.userMapper.userToUserResponseWithRelations(
      entityDoc,
    ) as MappedUserResponseWithRelations;
  }

  async findAll() {
    const resQuery = await this.userModel
      .find()
      .populate({ path: 'articles' })
      .exec();

    const resArr = resQuery.map((query) => {
      return this.getResponseWithRelations(query);
    });
    return resArr;
  }

  async findOneWithRelations(id: string) {
    const userQuery = await this.userModel
      .findById(id)
      .populate({ path: 'articles' })
      .exec();
    if (!userQuery)
      throw new NotFoundException(`user was not found by id ${id}`);

    return this.getResponseWithRelations(userQuery);
  }

  async findByIdWithRelationsIds(id: string) {
    const res = await this.userModel.findById(id);
    if (!res) throw new NotFoundException(`user was not found by id ${id}`);
    return this.getResponse(res);
  }

  private findOneUserByProps(userProps: UserToFindOne) {
    return this.userModel.findOne(userProps);
  }

  async findOne(userProps: UserToFindOne) {
    const res = await this.findOneUserByProps(userProps);
    if (!res) return null;
    return this.queryToObj<User>(res);
  }

  async findOneUserByUsername(username: string) {
    const res = await this.findOneUserByProps({ username });
    return this.getResponse(res);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.countUsername(updateUserDto?.username);
    const updatedUserQuery = await this.userModel.findOneAndUpdate(
      { _id: id },
      { ...updateUserDto },
      { runValidators: true, new: true },
    );
    return this.getResponse(updatedUserQuery);
  }

  async remove(id: string) {
    const deleteRes = await this.userModel.deleteOne({ _id: id });
    if (!deleteRes.deletedCount) return null;
    return { ...deleteRes, userId: id } as UserDeleteResult;
  }
}
