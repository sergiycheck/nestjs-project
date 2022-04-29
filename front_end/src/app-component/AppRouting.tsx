import React from "react";
import { Divider, Typography } from "@mui/material";
import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { Posts } from "../features/posts/Posts";
import { Users, UsersList } from "../features/users/Users";
import { SingleUser } from "../features/users/sigle-user/SingleUser";
import { UpdateUser, UpdateUserContainer } from "../features/users/manage-user/edit-user";
import { UserInfoDeleteResultComponent } from "../features/users/manage-user/user-delete-result";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { NavBar } from "./nav-bar/NavBar";
import { LoginUser } from "../features/users/sigle-user/login-user";
import AddPostForUser from "../features/users/sigle-user/manage-posts/add-posts";
import EditPostForUser from "../features/users/sigle-user/manage-posts/edit-post";
import { useAppSelector } from "../app/hooks";
import { selectIsAuthenticated } from "../features/shared/authSlice";
import { AddUser } from "../features/users/manage-user/add-user";
import { SinglePost } from "../features/posts/SinglePost";

export const AppRouting = () => {
  return (
    <Box
      data-testid="app-root"
      className="page"
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <header className="page__header">
        <NavBar />
        <Divider />
      </header>

      <Routes>
        <Route path="/" element={<AppContent />}>
          <Route element={<Users />}>
            <Route index element={<UsersList />}></Route>
          </Route>
          <Route path="users/:userId" element={<SingleUser />}></Route>

          <Route path="users/edit/:userId" element={<UpdateUser />}>
            <Route path="deleteResult" element={<UserInfoDeleteResultComponent />}></Route>
            <Route index element={<UpdateUserContainer />}></Route>
          </Route>

          <Route path="login" element={<LoginUser />}></Route>
          <Route path="register" element={<AddUser />}></Route>
          <Route path="posts" element={<Posts />}></Route>
          <Route path="posts/:postId" element={<SinglePost />}></Route>

          <Route
            path="user/:userId/add-post"
            element={
              <RequireAuth>
                <AddPostForUser />
              </RequireAuth>
            }
          ></Route>
          <Route
            path="user/:userId/edit-post/:postId"
            element={
              <RequireAuth>
                <EditPostForUser />
              </RequireAuth>
            }
          ></Route>
        </Route>
        <Route path="*" element={<NoMatch />}></Route>
      </Routes>
    </Box>
  );
};

export const AppContent = () => {
  return (
    <React.Fragment>
      <main className="page__body">
        <Outlet></Outlet>
      </main>
      <footer className="page__footer">
        <Divider />
        <div className="container">
          <div className="row">
            <Typography variant="h5">footer</Typography>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

function NoMatch() {
  return (
    <div>
      <Typography variant="h2">Nothing to see here!</Typography>
      <p>
        <Link href="/">Go to the home page</Link>
      </p>
    </div>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
