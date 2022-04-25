import React from "react";
import { useTheme } from "@mui/material/styles";
import { Button, Grid, IconButton, ListItem, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../color-mode-context";
import { useAuth } from "../auth-provider/auth-provider";
import { useNavigate } from "react-router-dom";

export function NavBar() {
  const theme = useTheme();
  const colorModeManager = React.useContext(ColorModeContext);
  const auth = useAuth();
  const navigate = useNavigate();

  let renderedLoginResult;

  if (!auth.user) {
    renderedLoginResult = (
      <Grid className="col-auto" item component={ListItem}>
        <Link href="login">login</Link>
      </Grid>
    );
  } else {
    renderedLoginResult = (
      <Grid className="col-auto" item component={ListItem}>
        <Typography>welcome {auth.user.userResponse.username}</Typography>
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
