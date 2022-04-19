import React from "react";
import { useAppSelector } from "../../app/hooks";
import { Link, Outlet } from "react-router-dom";
import { TimeAgo } from "../shared/TimeAgo";
import { selectUserById, selectUserIds, useGetUsersQuery } from "./usersSlice";
import { AddUser } from "./manage-user/add-user";

export const Users = () => {
  return (
    <div className="container-md">
      <div className="row">
        <div className="col-8">
          <h4>Users</h4>
          <Outlet />
        </div>
        <div className="col-4">
          <AddUser></AddUser>
        </div>
      </div>
    </div>
  );
};

export const UsersList = () => {
  const { isLoading, isSuccess, isError, error } = useGetUsersQuery();
  const userIds = useAppSelector(selectUserIds);

  const users = userIds.map((userId, index) => (
    <UserExcerpt key={index} userId={userId.toString()}></UserExcerpt>
  ));
  if (isLoading) return <div>...loading</div>;

  if (isSuccess) return <div className="row gy-2">{users}</div>;

  if (isError) return <div>Error occurred {error}</div>;

  return <div>unknown response</div>;
};

export const UserExcerpt = ({ userId }: { userId: string }) => {
  const user = useAppSelector((state) => selectUserById(state, userId));

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
