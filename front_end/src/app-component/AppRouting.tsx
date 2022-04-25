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
import { AuthProvider, useAuth } from "./auth-provider/auth-provider";

export const AppRouting = () => {
  return (
    <AuthProvider>
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
          <Route path="posts" element={<Posts />}></Route>
          <Route
            path="/protected/user"
            element={
              <RequireAuth>
                <UserProtectedPage />
              </RequireAuth>
            }
          ></Route>
        </Route>
        <Route path="*" element={<NoMatch />}></Route>
      </Routes>
    </AuthProvider>
  );
};

export const AppContent = () => {
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
    </Box>
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
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user || !auth.user.user_jwt) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function UserProtectedPage() {
  const auth = useAuth();

  return (
    <div>
      <Typography>user {auth.user?.userResponse.username} protected page</Typography>
    </div>
  );
}
