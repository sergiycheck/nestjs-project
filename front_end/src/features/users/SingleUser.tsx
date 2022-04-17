import { useParams } from "react-router-dom";
import { useGetUserQuery } from "./usersSlice";
import { CircularIndeterminate } from "./mui-components/Loader";
import { TimeAgo } from "../shared/TimeAgo";
import { Typography } from "@mui/material";

export const SingleUser = () => {
  const { userId } = useParams();
  if (!userId) return <div>user with id {userId} is not found</div>;

  return <SingleUserInner userId={userId}></SingleUserInner>;
};

export const SingleUserInner = ({ userId }: { userId: string }) => {
  const { data: user, isLoading } = useGetUserQuery(userId, {
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  if (isLoading) return <CircularIndeterminate />;

  return (
    <section className="row ">
      <div className="row">
        <Typography variant="h5" gutterBottom component="div">
          single user page
        </Typography>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="row">username: {user?.username}</div>
          <div className="row">
            full name: {user?.firstName} {user?.lastName}
          </div>
          <div className="row">
            <div className="col-auto p-0">created:</div>
            <div className="col-auto">
              <TimeAgo timeStamp={user?.createdAt}></TimeAgo>
            </div>
          </div>
          <div className="row">number of articles: {user?.numberOfArticles}</div>
        </div>
      </div>
    </section>
  );
};
