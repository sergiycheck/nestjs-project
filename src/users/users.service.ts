import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { UserMapperService } from './user-mapper.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
    private userMapper: UserMapperService,
  ) {}

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

      const createdCat = new this.userModel({
        id: new mongoose.Types.ObjectId(),
        ...createUserDto,
      });
      return createdCat.save();
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.userModel.find().populate({ path: 'articles' }).exec();
  }

  async findOne(id: string) {
    try {
      const userDoc = (await this.userModel
        .findById(id)
        .populate({ path: 'articles' })
        .exec()) as User;
      return userDoc;
    } catch (error) {
      throw new BadRequestException(`cannot find user with id ${id}`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUserQuery = await this.userModel.findOneAndUpdate(
        { _id: id },
        { ...updateUserDto },
        { runValidators: true, new: true },
      );
      const obj = updatedUserQuery.toObject({
        getters: true,
        virtuals: true,
        versionKey: false,
      });

      return this.userMapper.userToUserResponse(obj);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.userModel.deleteOne({ _id: id });
    } catch (error) {
      throw error;
    }
  }
}
