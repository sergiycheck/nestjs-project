import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Public } from 'src/auth/metadata.decorators';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesEndpoint } from 'src/api/endpoints';
import { GetUserFromReq } from '../base/decorators/get-user-from-req.decorator';
import { User } from 'src/users/entities/user.entity';
import { CustomParseObjectIdPipe } from 'src/pipes/custom-parse-objectid.pipe';
import { ArticleSearchText } from './dto/article-requests';

//JwtAuthGuard is bounded automatically to endpoint that is not marked with @Public decorator
//because it is declared as a global guard
//user is add to the req obj by passport
@Controller(ArticlesEndpoint)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(
    @Body() createArticleDto: CreateArticleDto,
    @GetUserFromReq() user: User,
  ) {
    return this.articleService.create(createArticleDto, user);
  }

  @Public()
  @Get()
  findAll(@Query() query: ArticleSearchText) {
    return this.articleService.findAll(query);
  }

  @Public()
  @Get('by-user-id/:userId')
  findArticlesByUser(
    @Param('userId', new CustomParseObjectIdPipe()) userId: string,
  ) {
    return this.articleService.getArticlesByUserId(userId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', new CustomParseObjectIdPipe()) id: string) {
    return this.articleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    // const userFromBearerTokenId = user._id.valueOf().toString();
    // if (userFromBearerTokenId !== userFromArticle.id) {
    //   return next(
    //     new BadRequestException({
    //       message: `user from bearer token is not the same as owner of this article ${userFromBearerTokenId} !== ${userFromArticle.id}`,
    //     }),
    //   );
    // }

    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUserFromReq() user: User) {
    return this.articleService.remove(id, user);
  }
}
