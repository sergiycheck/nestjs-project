import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { CircularIndeterminate } from '../../shared/mui-components/Loader';
import { TimeAgo } from '../../shared/TimeAgo';
import { Button, Divider, Typography } from '@mui/material';
import { UserRootData } from '../types';
import { ArticleResponseWithRelations } from '../../posts/types';
import { PostExcerptContent } from '../../posts/PostsContent';
import { useGetUserWithRelationsQueryAndPopulateUserArticlesWithUser } from './sigle-user.hooks';
import { useDeletePostMutation } from './manage-posts/user-manage-posts.api';
import { useAppSelector } from '../../../app/hooks';
import { selectIsAuthenticated, selectIsAuthUser } from '../../shared/authSlice';

export const SingleUser = () => {
  const { userId } = useParams();

  const { user, isLoading, isSuccess, isFetching, isError, articles } =
    useGetUserWithRelationsQueryAndPopulateUserArticlesWithUser({ userId });

  let renderedResult;

  if (isLoading || isFetching) renderedResult = <CircularIndeterminate />;

  let renderedUserPosts;
  if (!user?.numberOfArticles) {
    renderedUserPosts = (
      <Typography variant="subtitle1">User hasn&apos;t created any post yet</Typography>
    );
  } else if (articles?.length) {
    renderedUserPosts = <PostsForUser userId={user.id} articles={articles}></PostsForUser>;
  } else {
    renderedUserPosts = <CircularIndeterminate />;
  }

  if (isSuccess)
    renderedResult = (
      <React.Fragment>
        <SingleUserContent user={user} />
        <Divider className="mt-2 mb-2"></Divider>
        {renderedUserPosts}
      </React.Fragment>
    );

  if (isError) renderedResult = <Typography variant="h3">can not get user</Typography>;

  return (
    <div className="container-md">
      <div className="row gap-2 mt-2 justify-content-center">
        <div className="col-12 col-md-8">{renderedResult}</div>
      </div>
    </div>
  );
};

const SingleUserContent = ({ user }: { user: UserRootData | undefined }) => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const userAuth = useAppSelector(selectIsAuthUser);

  return (
    <React.Fragment>
      {/* user info */}
      <section className="row">
        <div className="row">
          <Typography variant="h5" gutterBottom component="div">
            {user?.username} page
          </Typography>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="row">
              <Typography>username: {user?.username}</Typography>{' '}
            </div>
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
      {isAuth && userAuth?.id === user?.id && (
        <div className="row">
          <div className="col-auto">
            <Button
              component={RouterLink}
              variant="outlined"
              className="align-self-start flex-shrink-0"
              to={`/users/edit/${user?.id}`}
            >
              edit user
            </Button>
          </div>
          <div className="col-auto">
            <Button
              component={RouterLink}
              variant="outlined"
              className="align-self-start flex-shrink-0"
              to={`/user/${user?.id}/add-post`}
            >
              add post
            </Button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const PostsForUser = ({
  articles,
  userId,
}: {
  userId: string;
  articles: ArticleResponseWithRelations[];
}) => {
  const [deletePostMutation, { isSuccess: isFetchDeleteSuccessful }] = useDeletePostMutation();
  const [deleteSuccessful, setDelRes] = React.useState<boolean | null>(null);

  const isAuth = useAppSelector(selectIsAuthenticated);
  const userAuth = useAppSelector(selectIsAuthUser);

  const renderedArticles = articles.map((article) => (
    <div key={article.id} className="row">
      <div className="row">
        <div className="col-9">
          <div className="row">
            <PostExcerptContent item={article} />
          </div>
        </div>
        {isAuth && userAuth?.id === userId && (
          <div className="col-3 d-flex align-items-end flex-column">
            <Button
              variant="outlined"
              color="warning"
              onClick={async () => {
                const res = await deletePostMutation({
                  postId: article.id,
                  ownerId: userId,
                }).unwrap();
                if (res.data.deletedCount === 1 && res.data.updatedUser) {
                  setDelRes(true);
                }
              }}
            >
              {/* TODO: pop up with message asking if you really want to delete this post */}X
            </Button>
            <Button
              className="mt-auto"
              component={RouterLink}
              variant="outlined"
              color="info"
              to={`/user/${userId}/edit-post/${article.id}`}
            >
              edit
            </Button>
          </div>
        )}
      </div>
      {isFetchDeleteSuccessful && deleteSuccessful && <div>post was deleted</div>}
    </div>
  ));

  return <div className="col-12">{renderedArticles}</div>;
};
