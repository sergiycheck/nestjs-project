import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserMapperService } from './user-mapper.service';
import { ArticleModule } from '../article/article.module';
import { UsersResponseGetterService } from './users-response-getter.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => ArticleModule),
  ],
  providers: [UsersService, UserMapperService, UsersResponseGetterService],
  exports: [UsersService, UserMapperService],
  controllers: [UsersController],
})
export class UsersModule {}
