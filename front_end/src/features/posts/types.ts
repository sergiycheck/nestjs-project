import { UserWithRelationsIds } from "../users/types";

type ArticleNonChangeableData = {
  title: string;
  subtitle: string;
  description: string;
  category: string;
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
