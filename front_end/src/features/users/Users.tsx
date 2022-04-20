import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useSearchParams } from "react-router-dom";
import { TimeAgo } from "../shared/TimeAgo";
import { useGetUsersQuery } from "./usersApi";
import { AddUser } from "./manage-user/add-user";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  PaginationContext,
  PaginationContextType,
  willBePassedToPaginationData,
} from "./pagination-context";

const availableSearchParams = "page";

export const Users = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get(availableSearchParams);

  const [initialPaginationData, setPaginationContextData] = useState<PaginationContextType>(
    willBePassedToPaginationData
  );
  const { limit } = initialPaginationData;

  useEffect(() => {
    const numPage = Number(page);
    if (Number.isInteger(numPage) && numPage > 0 && numPage < 1000) {
      const skip = numPage * limit - limit;
      setPaginationContextData((prev) => ({ ...prev, page: numPage, skip }));
    }
  }, [page, limit]);

  const passedValued = { initialPaginationData, setPaginationContextData };

  return (
    <PaginationContext.Provider value={passedValued}>
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
    </PaginationContext.Provider>
  );
};

const increment = 5;
export const PaginationComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { initialPaginationData, setPaginationContextData } = useContext(PaginationContext);
  const { limit, skip, page, per_page, total, total_pages, isFetching } = initialPaginationData;

  return (
    <div className="row justify-content-center">
      <div className="col">
        <div className="row">
          <div className="col-auto">page: {page}</div>
          <div className="col-auto">per_page: {per_page}</div>
          <div className="col-auto">total: {total}</div>
          <div className="col-auto">total_pages:{total_pages}</div>
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
            const previousPage = { page: page - 1 };
            const searchParamObj = { [availableSearchParams]: `${previousPage.page}` };
            setSearchParams(searchParamObj);

            const previousParams = { limit: increment, skip: previousPage.page * limit - limit };
            setPaginationContextData((prev) => ({
              ...prev,
              ...previousPage,
              ...previousParams,
            }));
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
          disabled={Boolean(page === total_pages)}
          onClick={() => {
            const nextPage = { page: page + 1 };
            const searchParamObj = { [availableSearchParams]: `${nextPage.page}` };
            setSearchParams(searchParamObj);
            const nextParams = { limit: increment, skip: nextPage.page * limit - limit };
            setPaginationContextData((prev) => ({
              ...prev,
              ...nextPage,
              ...nextParams,
            }));
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

  if (isLoading) return <div>...loading</div>;
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
