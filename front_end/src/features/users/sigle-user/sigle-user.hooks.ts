import React from "react";
import { useGetUserWithRelationsQuery } from "../usersApi";
import { createSelector } from "@reduxjs/toolkit";
import { UserWithIncludedAndPopulatedRelations, UserWithIncludedRelations } from "../types";
import { ArticleResponseWithRelations } from "../../posts/types";

const emptyArr: UserWithIncludedRelations[] = [];

export const useGetUserWithRelationsQueryAndPopulateUserArticlesWithUser = ({
  userId,
}: {
  userId: string | undefined;
}) => {
  const selectUserWithPostsArrWithPopulatedOwner = React.useMemo(() => {
    return createSelector(
      (res: UserWithIncludedRelations) => res,
      (res: UserWithIncludedRelations) => {
        return new Promise(async (resolve) => {
          const mappedPopulatedArticlesPromise = res.articles.map((article) => {
            const { articles: userArticles, ...userData } = res;
            const { ownerId, ...other } = article;

            return new Promise((resolve) =>
              resolve({
                owner: { ...userData },
                ...other,
              })
            );
          });

          const mappedPopulatedArticles = (await Promise.all(
            mappedPopulatedArticlesPromise
          )) as unknown as ArticleResponseWithRelations[];

          const populatedResult = {
            ...res,
            articles: mappedPopulatedArticles,
          } as UserWithIncludedAndPopulatedRelations;
          resolve(populatedResult);
        });
      }
    );
  }, []);

  const {
    data: user,
    userWithPostsArrWithPopulatedOwner,
    isLoading,
    isSuccess,
    isFetching,
    isError,
  } = useGetUserWithRelationsQuery(userId!, {
    refetchOnMountOrArgChange: true,
    skip: false,
    selectFromResult: (result) => ({
      ...result,
      userWithPostsArrWithPopulatedOwner: result?.data
        ? selectUserWithPostsArrWithPopulatedOwner(result.data)
        : emptyArr,
    }),
  });

  const [articles, setArticles] = React.useState<ArticleResponseWithRelations[]>([]);

  React.useEffect(() => {
    async function WaitForMappingUser() {
      const { articles: articlesGot } =
        (await userWithPostsArrWithPopulatedOwner) as UserWithIncludedAndPopulatedRelations;

      setArticles(articlesGot);
    }

    WaitForMappingUser();
  }, [userWithPostsArrWithPopulatedOwner]);

  return {
    user,
    isLoading,
    isSuccess,
    isFetching,
    isError,
    articles,
  };
};
