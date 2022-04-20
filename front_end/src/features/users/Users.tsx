import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { Link, Outlet } from "react-router-dom";
import { TimeAgo } from "../shared/TimeAgo";
import { selectGetUsersQueryParams, setGetUsersQueryParams, useGetUsersQuery } from "./usersApi";
import { AddUser } from "./manage-user/add-user";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAppDispatch } from "./../../app/hooks";

export const Users = () => {
  return (
    <div className="container-md d-flex flex-column flex-grow-1">
      <div className="row flex-grow-1">
        <div className="col-8">
          <h4>Users</h4>
          <Outlet />
        </div>
        <div className="col-4">
          <AddUser></AddUser>
        </div>
      </div>
      <div className="row">
        <PaginationComponent></PaginationComponent>
      </div>
    </div>
  );
};

const increment = 5;
const initialPage = 1;
const initialSkip = 0;
export const PaginationComponent = () => {
  const dispatch = useAppDispatch();

  const [{ limit, skip }, setLimitAndSkip] = useState({ limit: increment, skip: initialSkip });
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    dispatch(setGetUsersQueryParams({ limit, skip }));
  }, [limit, skip, dispatch]);

  const { data: usersResponse, isFetching } = useGetUsersQuery({ limit, skip });

  if (!usersResponse || !Object.keys(usersResponse).length) return <div>Error occurred</div>;

  return (
    <div className="row justify-content-center">
      <div className="col">
        <div className="row">
          <div className="col-auto">page: {usersResponse.page}</div>
          <div className="col-auto">per_page: {usersResponse.per_page}</div>
          <div className="col-auto">total: {usersResponse.total}</div>
          <div className="col-auto">total_pages:{usersResponse.total_pages}</div>
          <div className="col-auto">limit:{limit}</div>
          <div className="col-auto">skip:{skip}</div>
        </div>
      </div>
      <div className="col-auto">
        <LoadingButton
          size="small"
          disabled={Boolean(page - 1 <= 0)}
          onClick={() => {
            if (page - 1 <= 0) return;
            const previousPage = page - 1;
            const previousParams = { limit: increment, skip: previousPage * limit - limit };
            setPage(previousPage);
            setLimitAndSkip(previousParams);
          }}
          loading={isFetching}
          variant="outlined"
        >
          previous
        </LoadingButton>
      </div>
      <div className="col-auto">
        {" "}
        <LoadingButton
          size="small"
          disabled={Boolean(page === usersResponse.total_pages)}
          onClick={() => {
            const nextPage = page + 1;
            const nextParams = { limit: increment, skip: nextPage * limit - limit };
            setPage(nextPage);
            setLimitAndSkip(nextParams);
          }}
          loading={isFetching}
          variant="outlined"
        >
          next
        </LoadingButton>
      </div>
    </div>
  );
};

export const UsersList = () => {
  const userQueryParams = useAppSelector(selectGetUsersQueryParams);

  const {
    data: usersResponse,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(userQueryParams);

  const users = usersResponse?.data.map((user, index) => (
    <UserExcerpt key={index} userId={user.id}></UserExcerpt>
  ));

  if (isLoading) return <div>...loading</div>;
  if (isError) return <div>Error occurred {error}</div>;
  if (!usersResponse || !Object.keys(usersResponse).length) return <div>No users found</div>;

  if (isSuccess) return <div className="row gy-2">{users}</div>;

  return <div>unknown response</div>;
};

export const UserExcerpt = ({ userId }: { userId: string }) => {
  const userQueryParams = useAppSelector(selectGetUsersQueryParams);
  const { user } = useGetUsersQuery(userQueryParams, {
    selectFromResult: ({ data }) => ({
      user: data?.data.find((user) => user.id === userId),
    }),
  });

  return (
    <div className="col-12 justify-content-center ">
      <div className="row gx-3">
        <div className="col-5">
          <Link className="text-dark text-decoration-none" to={`users/${userId}`}>
            {user?.firstName} {user?.lastName} <br />({user?.username})
          </Link>
        </div>
        <div className="col-auto d-flex justify-content-center">{user?.numberOfArticles}</div>
        <div className="col d-flex justify-content-center">
          <TimeAgo timeStamp={user?.createdAt}></TimeAgo>
        </div>
        <div className="col-auto d-flex justify-content-center">
          <button className="btn btn-primary  align-self-start flex-shrink-0">
            <Link className="text-white" to={`users/edit/${user?.id}`}>
              edit user
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};
