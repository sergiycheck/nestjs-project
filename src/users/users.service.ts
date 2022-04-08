import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { User, UserDocument, UserToFindOne } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { UserMapperService } from './user-mapper.service';
import {
  BaseService,
  ToObjectContainingQuery,
} from '../base/services/base.service';
import { ArticleService } from '../article/article.service';
import {
  MappedUserResponse,
  MappedUserResponseWithRelations,
} from './dto/response-user.dto';

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

  async create(createUserDto: CreateUserDto) {
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

    return this.getResponse(createdUserQuery);
  }

  public getResponse(entityQuery: ToObjectContainingQuery<User>) {
    const entityDoc = super.queryToObj(entityQuery);
    return this.userMapper.userToUserResponse(entityDoc) as MappedUserResponse;
  }

  private getResponseWithRelations(entityQuery: ToObjectContainingQuery<User>) {
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

  private async findOneUserByProps(userProps: UserToFindOne) {
    const res = await this.userModel.findOne(userProps);
    if (!res)
      throw new UnauthorizedException({
        message: 'user was not found for props',
        props: userProps,
      });
    return res;
  }

  async findOne(userProps: UserToFindOne) {
    const res = await this.findOneUserByProps(userProps);
    return this.queryToObj<User>(res);
  }

  async findOneUserByUsername(username: string) {
    const res = await this.findOneUserByProps({ username });
    return this.getResponse(res);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUserQuery = await this.userModel.findOneAndUpdate(
      { _id: id },
      { ...updateUserDto },
      { runValidators: true, new: true },
    );
    return this.getResponse(updatedUserQuery);
  }

  async remove(id: string) {
    const deleteRes = await this.userModel.deleteOne({ _id: id });
    return { ...deleteRes, userId: id };
  }
}
