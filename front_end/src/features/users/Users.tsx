import React from "react";
import { useAppSelector } from "../../app/hooks";
import { Link, Outlet } from "react-router-dom";
import { TimeAgo } from "../shared/TimeAgo";
import { selectUserById, selectUserIds, useGetUsersQuery } from "./usersSlice";

export const Users = () => {
  return (
    <div className="container-md">
      <div className="row"> Users </div>
      <Outlet />
    </div>
  );
};

export const UsersList = () => {
  const { isLoading, isFetching, isSuccess, isError, error } = useGetUsersQuery();
  const userIds = useAppSelector(selectUserIds);

  const users = userIds.map((userId, index) => (
    <UserExcerpt key={index} userId={userId.toString()}></UserExcerpt>
  ));
  if (isLoading) return <div>...loading</div>;
  return <div className="row">{users}</div>;
};

export const UserExcerpt = ({ userId }: { userId: string }) => {
  const user = useAppSelector((state) => selectUserById(state, userId));

  return (
    <div className="mb-1 row justify-content-between">
      <div className="col-auto">
        <Link className="text-dark text-decoration-none" to={`users/${userId}`}>
          {user?.firstName} {user?.lastName} ({user?.username})
        </Link>
      </div>
      <div className="col-auto">{user?.numberOfArticles}</div>
      <div className="col-auto">
        <TimeAgo timeStamp={user?.createdAt}></TimeAgo>
      </div>
      <div className="col-auto">
        <button className="btn btn-primary  align-self-start flex-shrink-0">
          <Link className="text-white" to={`users/editUser/${user?.id}`}>
            edit user
          </Link>
        </button>
      </div>
    </div>
  );
};
