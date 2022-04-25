import React from "react";
import { useTheme } from "@mui/material/styles";
import { Button, Grid, IconButton, ListItem } from "@mui/material";
import Link from "@mui/material/Link";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../color-mode-context";
import { AuthContext } from "../auth-provider/auth-provider";
import { useNavigate } from "react-router-dom";
import { useGetUserFromJwtMutation } from "../../features/users/usersApi";
import { CircularIndeterminate } from "../../features/shared/mui-components/Loader";
import { schemaTokenValidation } from "./../../features/shared/token_validator";

export function NavBar() {
  const theme = useTheme();
  const colorModeManager = React.useContext(ColorModeContext);
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [getUserFromJwtMutation, { isLoading, isError }] = useGetUserFromJwtMutation();

  React.useEffect(() => {
    const jwt_token = window.localStorage.getItem("jwt");
    if (!jwt_token) return;
    if (auth.user) return;

    async function getUserFromJwtRequest(token: string) {
      const result = await getUserFromJwtMutation().unwrap();
      const { message, ...currentUser } = result;
      if (currentUser.successfulAuth) {
        auth.setUserFromJwt(currentUser);
      } else {
        auth.setUserFromJwt(null);
      }
    }
    getUserFromJwtRequest(jwt_token);
  }, [auth, getUserFromJwtMutation]);

  React.useEffect(() => {
    if (isError) {
      auth.setUserFromJwt(null);
    }
  }, [isError, auth]);

  let renderedLoginResult;

  if (isLoading)
    renderedLoginResult = (
      <Grid className="col-auto" item component={ListItem}>
        <div className="row align-items-center">
          <div className="col">signing in...</div>
          <div className="col-auto">
            <CircularIndeterminate />
          </div>
        </div>
      </Grid>
    );

  if (!isLoading && !auth.user) {
    renderedLoginResult = (
      <Grid className="col-auto" item component={ListItem}>
        <Link href="login">login</Link>
      </Grid>
    );
  } else if (auth.user) {
    renderedLoginResult = (
      <Grid className="col-auto" item component={ListItem}>
        <Link className="mx-2" href={`users/${auth.user.userResponse.id}`}>
          {auth.user.userResponse.username}
        </Link>
        <Button
          variant="outlined"
          onClick={() => {
            auth.signOut(() => {
              navigate("/");
            });
          }}
        >
          Sign out
        </Button>
      </Grid>
    );
  }

  return (
    <div className="container-md">
      <Grid component="nav" className="row">
        <Grid className="col" item component={ListItem}>
          <Link href="/">users</Link>
        </Grid>
        <Grid className="col" item component={ListItem}>
          <Link href="posts">posts</Link>
        </Grid>
        {renderedLoginResult}
        <Grid className="col-auto" item component={ListItem}>
          <IconButton sx={{ ml: 1 }} onClick={colorModeManager.toggleColorMode}>
            {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
}
