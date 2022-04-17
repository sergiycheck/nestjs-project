export const usersSliceName = "users";

export type UserRootData = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  numberOfArticles: number;
  createdAt: string;
};

export type UserWithIncludedRelations = UserRootData & {
  articles: any[];
};

export type UserWithRelationsIds = UserRootData & {
  articleIds: string[];
};

export type CreateUserDto = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

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
