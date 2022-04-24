import { ArticleResponse, ArticleResponseWithRelations } from "../posts/types";

export const usersSliceName = "users";

type UserRootNonChangeable = {
  username: string;
  firstName: string;
  lastName: string;
};

export type UserRootData = UserRootNonChangeable & {
  id: string;
  role: string;
  numberOfArticles: number;
  createdAt: string;
};

export type UserWithIncludedRelations = UserRootData & {
  articles: ArticleResponse[];
};

export type UserWithIncludedAndPopulatedRelations = UserRootData & {
  articles: ArticleResponseWithRelations[];
};

export type UserWithRelationsIds = UserRootData & {
  articleIds: string[];
};

export type CreateUserDto = UserRootNonChangeable & {
  password: string;
};

export type LoginUserDto = Pick<CreateUserDto, "username" | "password">;

export type UpdateUserDto = Partial<UserRootNonChangeable> & Pick<UserRootData, "id">;

export type UserDeleteResult = {
  userId: string;
  acknowledged: boolean;
  deletedCount: number;
  articlesUpdateResults: {
    matchedCount: number;
    modifiedCount: number;
    acknowledged: boolean;
  };
};
