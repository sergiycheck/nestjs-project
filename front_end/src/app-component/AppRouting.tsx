import React from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import { Divider, Typography } from "@mui/material";
import { Routes, Route, Outlet } from "react-router-dom";
import { Posts } from "../features/posts/Posts";
import { Users, UsersList } from "../features/users/Users";
import { SingleUser } from "../features/users/sigle-user/SingleUser";
import { UpdateUser, UpdateUserContainer } from "../features/users/manage-user/edit-user";
import { UserInfoDeleteResultComponent } from "../features/users/manage-user/user-delete-result";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { NavBar } from "./nav-bar/NavBar";
import { LoginUser } from "../features/users/sigle-user/login-user";

export const AppRouting = () => {
  return (
    <React.Fragment>
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
        </Route>
        <Route path="*" element={<NoMatch />}></Route>
      </Routes>
    </React.Fragment>
  );
};

export const AppContent = () => {
  return (
    <StyledEngineProvider injectFirst>
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
    </StyledEngineProvider>
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
