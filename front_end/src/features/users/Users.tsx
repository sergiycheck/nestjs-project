import React, { useEffect, useContext } from "react";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { TimeAgo } from "../shared/TimeAgo";
import { useGetUsersQuery } from "./usersApi";
import { AddUser } from "./manage-user/add-user";
import {
  PaginationContext,
  useSearchParamsToPassInAndPaginationContext,
  availableSearchParams,
} from "../shared/pagination/pagination-context";

import { PaginationComponent } from "../shared/pagination/PaginationComponent";
import { Button, Link } from "@mui/material";
import { CircularIndeterminate } from "../shared/mui-components/Loader";

export const Users = () => {
  const { contextDataAndHandler } = useSearchParamsToPassInAndPaginationContext({
    searchParamsNames: availableSearchParams,
  });

  return (
    <PaginationContext.Provider value={contextDataAndHandler}>
      <div className="container-lg d-flex flex-column flex-grow-1">
        <div className="row flex-grow-1">
          <div className="col-8">
            <h4>Users</h4>
            <Outlet />
          </div>
        </div>
        <div className="row">
          <PaginationComponent></PaginationComponent>
        </div>
      </div>
    </PaginationContext.Provider>
  );
};

export const usePaginationContextAndGetDataQuery = () => {};

export const UsersList = () => {
  const { initialPaginationData, setPaginationContextData } = useContext(PaginationContext);
  const { limit, skip } = initialPaginationData;

  const {
    data: usersResponse,
    isLoading,
    isSuccess,
    isError,
    error,
    isFetching,
  } = useGetUsersQuery({ limit, skip });

  useEffect(() => {
    if (usersResponse) {
      const { page, per_page, total, total_pages } = usersResponse;

      setPaginationContextData((prev) => ({
        ...prev,
        page,
        per_page,
        total,
        total_pages,
        isFetching,
      }));
    }
  }, [isFetching, setPaginationContextData, usersResponse]);

  const users = usersResponse?.data.map((user, index) => (
    <UserExcerpt key={index} userId={user.id}></UserExcerpt>
  ));

  if (isLoading) return <CircularIndeterminate />;

  if (isError) return <div>Error occurred {error}</div>;
  if (!usersResponse || !Object.keys(usersResponse).length) return <div>No users found</div>;

  if (isSuccess) return <div className="row gy-2">{users}</div>;

  return <div>unknown response</div>;
};

export const UserExcerpt = ({ userId }: { userId: string }) => {
  const { initialPaginationData } = useContext(PaginationContext);
  const { limit, skip } = initialPaginationData;
  const { user } = useGetUsersQuery(
    { limit, skip },
    {
      selectFromResult: ({ data }) => ({
        user: data?.data.find((user) => user.id === userId),
      }),
    }
  );

  return (
    <div className="col-12 justify-content-center ">
      <div className="row gx-3">
        <div className="col-5">
          <Link href={`users/${userId}`}>
            {user?.firstName} {user?.lastName} <br />({user?.username})
          </Link>
        </div>
        <div className="col-auto d-flex justify-content-center">{user?.numberOfArticles}</div>
        <div className="col d-flex justify-content-center">
          <TimeAgo timeStamp={user?.createdAt}></TimeAgo>
        </div>
        <div className="col-auto d-flex justify-content-center">
          <Button
            component={RouterLink}
            className="align-self-start flex-shrink-0"
            to={`users/edit/${user?.id}`}
            variant="outlined"
          >
            edit user
          </Button>
        </div>
      </div>
    </div>
  );
};
