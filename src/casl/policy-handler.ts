import { AppAbility } from './casl-ability.factory';
import { CreateArticleDto } from './../article/dto/create-article.dto';

export interface IPolicyHandler {
  handle(ability: AppAbility, article: CreateArticleDto): boolean;
}

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
