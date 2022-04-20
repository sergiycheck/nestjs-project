export const usersSliceName = "users";

export type QueryGetUsersType = { limit: number | null; skip: number | null };

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
  articles: any[];
};

export type UserWithRelationsIds = UserRootData & {
  articleIds: string[];
};

export type CreateUserDto = UserRootNonChangeable & {
  password: string;
};

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
