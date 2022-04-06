import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/metadata.decorators';
import { CheckPolicies } from 'src/casl/check-policies.decorat';
import { PoliciesGuard } from 'src/casl/policies.guard';
import {
  ReadArticlePolicyHandler,
  UpdateArticlePolicyHandler,
} from 'src/casl/article-policy-handlers';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesEndpoint } from 'src/api/endpoints';
import { GetUserFromReq } from '../base/decorators/get-user-from-req.decorator';
import { User } from 'src/users/entities/user.entity';

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
  findAll() {
    return this.articleService.findAll();
  }

  //JwtAuthGuard is bounded automatically because it is declared as a global guard
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadArticlePolicyHandler())
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  //JwtAuthGuard is bounded automatically because it is declared as a global guard
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateArticlePolicyHandler())
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUserFromReq() user: User) {
    return this.articleService.remove(id, user);
  }
}
