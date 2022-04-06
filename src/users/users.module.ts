import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserMapperService } from './user-mapper.service';
import { ArticleModule } from 'src/article/article.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => ArticleModule),
  ],
  providers: [UsersService, UserMapperService],
  exports: [UsersService, UserMapperService],
  controllers: [UsersController],
})
export class UsersModule {}
