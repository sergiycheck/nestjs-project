import React from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import "./App.scss";
import { Posts } from "../features/posts/Posts";
import { Users, UsersList } from "../features/users/Users";
import { SingleUser } from "../features/users/SingleUser";
import { UpdateUser, UpdateUserContainer } from "../features/users/manage-user/edit-user";
import { UserInfoDeleteResultComponent } from "../features/users/manage-user/user-delete-result";

function App() {
  return (
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
        <Route path="posts" element={<Posts />}></Route>
      </Route>
    </Routes>
  );
}

const AppContent = () => {
  return (
    <StyledEngineProvider injectFirst>
      <div data-testid="app-root" className="page">
        <header className="page__header">
          <NavBar />
        </header>
        <main className="page__body">
          <Outlet></Outlet>
        </main>
        <footer className="page__footer border-top">footer</footer>
      </div>
    </StyledEngineProvider>
  );
};

function NavBar() {
  return (
    <nav className="border-bottom d-flex justify-content-around">
      <Link to="/">users</Link>
      <Link to="posts">posts</Link>
    </nav>
  );
}

export default App;
