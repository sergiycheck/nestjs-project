import { UserWithRelationsIds } from "../users/types";

export enum PostGenre {
  Sport = "sport",
  Games = "games",
  History = "history",
}

type ArticleNonChangeableData = {
  title: string;
  subtitle: string;
  description: string;
  category: PostGenre;
  createdAt: string;
  updatedAt: string;
};

export type ArticleResponse = ArticleNonChangeableData & {
  id: string;
  ownerId: string;
};

export type ArticleResponseWithRelations = ArticleNonChangeableData & {
  id: string;
  owner: UserWithRelationsIds;
};
