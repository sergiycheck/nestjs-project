import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../auth/metadata.decorators';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesEndpoint } from '../api/endpoints';
import { GetUserFromReqDec } from '../base/decorators/get-user-from-req.decorator';
import { CustomParseObjectIdPipe } from '../pipes/custom-parse-objectid.pipe';
import { ArticleSearchQueryTextDto } from './dto/article-requests.dto';
import { BaseController } from '../base/controllers/base.controller';
import {
  ArticleDeleteResult,
  CreateArticleResponse,
  MappedArticleResponse,
  MappedArticleResponseWithRelations,
} from './dto/response-article.dto';
import { MappedUserResponse } from '../users/dto/response-user.dto';
import { CanUserManageArticleGuard } from './can-user-manage-article.guard';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiCreateArticleDecorator } from './swagger_decorators/api-create-article.decorator';
import { PaginatedResponseDto } from '../base/responses/response.dto';
import { ArticleSearchService } from './article-search.service';

// TODO: remove for testing
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// JwtAuthGuard is bounded automatically to endpoint that is not marked with @Public decorator
// because it is declared as a global guard
// user is add to the req obj by passport

@ApiTags(ArticlesEndpoint)
@Controller(ArticlesEndpoint)
export class ArticleController extends BaseController {
  constructor(
    private readonly articleService: ArticleService,
    private articleSearchService: ArticleSearchService,
  ) {
    super();
  }

  @ApiBearerAuth()
  @ApiCreateArticleDecorator(CreateArticleResponse)
  @ApiNotFoundResponse({ description: 'article was not created' })
  @ApiUnauthorizedResponse()
  // TODO: provide custom header from swagger ui ?
  @Post()
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @GetUserFromReqDec() user: MappedUserResponse,
  ) {
    const res = await this.articleService.create(createArticleDto, user);

    return this.getResponse<CreateArticleResponse>(
      'article was created',
      'article was not created',
      res,
    );
  }

  @Public()
  @Get()
  async findAll(@Query() query: ArticleSearchQueryTextDto) {
    const res = await this.articleSearchService.findAll(query);
    await sleep(1000);
    return this.getResponse<
      PaginatedResponseDto<MappedArticleResponseWithRelations[]>
    >('articles were found', 'no articles was found', res);
  }

  @Public()
  @Get('by-user-id/:userId')
  async findArticlesByUser(
    @Param('userId', new CustomParseObjectIdPipe()) userId: string,
  ) {
    const res = await this.articleService.getArticlesByUserId(userId);
    return this.getResponse<MappedArticleResponseWithRelations[]>(
      `articles were found for user`,
      'no articles were found',
      res,
    );
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', new CustomParseObjectIdPipe()) id: string) {
    const res = await this.articleService.findOne(id);

    return this.getResponse<MappedArticleResponseWithRelations>(
      'article was found',
      `article was not found for id ${id}`,
      res,
    );
  }

  @ApiBearerAuth()
  @UseGuards(CanUserManageArticleGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const res = await this.articleService.update(id, updateArticleDto);
    return this.getResponse<MappedArticleResponse>(
      'article was updated successfully',
      'fail to update the article',
      res,
    );
  }

  @ApiBearerAuth()
  @UseGuards(CanUserManageArticleGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @GetUserFromReqDec() user: MappedUserResponse,
  ) {
    const res = await this.articleService.remove(id, user);
    return this.getResponse<ArticleDeleteResult>(
      'article was deleted successfully',
      'fail to delete the article',
      res,
    );
  }
}
