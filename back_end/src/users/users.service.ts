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
import { BaseService } from '../base/services/base.service';
import { ArticleService } from '../article/article.service';
import { MappedUserResponse, UserDeleteResult } from './dto/response-user.dto';
import { SALT_ROUNDS } from '../auth/constants';
import { PaginatedRequestDto } from '../base/requests/requests.dto';
import { PaginatedResponseDto } from '../base/responses/response.dto';
import { UsersResponseGetterService } from './users-response-getter.service';
import { JwtService } from '@nestjs/jwt';
import { UsernameIsNotAccessibleException } from './dto/exceptions/username-accessible.dto';

// all thrown exceptions is handled by global exception filter
@Injectable()
export class UsersService extends BaseService {
  constructor(
    @InjectModel(User.name) public userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
    public usersResponseGetterService: UsersResponseGetterService,
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
    private jwtService: JwtService,
  ) {
    super();
  }

  public async countUsername(username: string, id?: string) {
    let usernameCount;
    if (id) {
      usernameCount = await this.userModel.count({
        $and: [{ username: { $eq: username } }, { _id: { $ne: id } }],
      });
    } else {
      usernameCount = await this.userModel.count({ username });
    }

    if (usernameCount) {
      throw new UsernameIsNotAccessibleException(
        `${username} username has already been taken`,
      );
    }

    return true;
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

    return this.usersResponseGetterService.getResponse(createdUserQuery);
  }

  async findAlWithRelations() {
    const resQuery = await this.userModel
      .find()
      .populate({ path: 'articles' })
      .exec();

    const resArr = resQuery.map((query) => {
      return this.usersResponseGetterService.getResponseWithRelations(query);
    });
    return resArr;
  }

  async findAll(
    requestQuery: PaginatedRequestDto,
  ): Promise<PaginatedResponseDto<MappedUserResponse[]>> {
    let resQuery;

    if (requestQuery && Object.keys(requestQuery).length) {
      const findArgsArr = this.getFindArgsArrUsers(requestQuery);
      resQuery = await this.userModel
        .find(...findArgsArr)
        .sort({ _id: 'desc' })
        .exec();
    } else {
      resQuery = await this.userModel.find({}).sort({ _id: 'desc' }).exec();
    }
    const totalDocsInDbForQuery = await this.userModel.estimatedDocumentCount();

    const { total_pages, per_page, page, total } = this.getPaginatedProps(
      totalDocsInDbForQuery,
      requestQuery,
    );

    const resArr = resQuery.map((query) => {
      return this.usersResponseGetterService.getResponse(query);
    }) as MappedUserResponse[];

    return {
      page,
      per_page,
      total,
      total_pages,
      data: resArr,
    };
  }

  async findOneWithRelations(id: string) {
    const userQuery = await this.userModel
      .findById(id)
      .populate({ path: 'articles', options: { sort: { updatedAt: -1 } } })
      .exec();
    if (!userQuery)
      throw new NotFoundException(`user was not found by id ${id}`);

    return this.usersResponseGetterService.getResponseWithRelations(userQuery);
  }

  async findByIdWithRelationsIds(id: string) {
    const res = await this.userModel.findById(id);
    if (!res) throw new NotFoundException(`user was not found by id ${id}`);
    return this.usersResponseGetterService.getResponse(res);
  }

  private findOneUserByProps(userProps: UserToFindOne) {
    return this.userModel.findOne(userProps);
  }

  async findOne(userProps: UserToFindOne): Promise<LeanDocument<User>> {
    const res = await this.findOneUserByProps(userProps);
    if (!res) return null;
    return this.queryToObj<User>(res);
  }

  async findOneUserByUsername(username: string) {
    const res = await this.findOneUserByProps({ username });
    return this.usersResponseGetterService.getResponse(res);
  }

  // TODO: generate new jwt token on update
  async update(id: string, updateUserDto: UpdateUserDto) {
    this.countUsername(updateUserDto?.username, id);
    const { id: userId, ...data } = updateUserDto;
    const updatedUserQuery = await this.userModel.findOneAndUpdate(
      { _id: id },
      { ...data },
      { runValidators: true, new: true },
    );
    const mappedUserResponse =
      this.usersResponseGetterService.getResponse(updatedUserQuery);

    return {
      access_token: this.jwtService.sign({
        username: updatedUserQuery.username,
        sub: updatedUserQuery.id,
      }),
      mappedUserResponse,
    };
  }

  async remove(id: string) {
    const updateArticleRes = await this.articleService.articleModel.updateMany(
      { owner: id },
      { owner: null },
    );
    const { upsertedCount, upsertedId, ...results } = updateArticleRes;
    const deleteRes = await this.userModel.deleteOne({ _id: id });
    if (!deleteRes.deletedCount) return null;
    return {
      ...deleteRes,
      userId: id,
      articlesUpdateResults: results,
    } as UserDeleteResult;
  }
}
