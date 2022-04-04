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

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new ReadArticlePolicyHandler())
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new UpdateArticlePolicyHandler())
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    //TODO: retrieve article from db and check whether user possess it
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
