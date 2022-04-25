import { ArticleResponse } from "../../../posts/types";
import { UserWithRelationsIds } from "../../types";

export enum PostGenre {
  Sport = "sport",
  Games = "games",
  History = "history",
}

type Question<T> = {
  [Prop in keyof T]+?: T[Prop];
};

export type CreatePostReqType = {
  title: string;
  subtitle: string;
  description: string;
  category: PostGenre;
  ownerId: string;
};

export type PostIdType = {
  id: string;
};

export type UpdatePostReqType = Pick<CreatePostReqType, "ownerId"> &
  Question<Omit<CreatePostReqType, "ownerId">> &
  PostIdType;

export type CreateArticleResponse = {
  updatedUser: UserWithRelationsIds;
  newArticle: ArticleResponse;
};

export type ArticleDeleteResponse = {
  articleId: string;
  updatedUser: UserWithRelationsIds;
  acknowledged: boolean;
  deletedCount: number;
};
