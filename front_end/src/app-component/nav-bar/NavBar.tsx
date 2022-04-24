import React from "react";
import { useTheme } from "@mui/material/styles";
import { Grid, IconButton, ListItem } from "@mui/material";
import Link from "@mui/material/Link";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../color-mode-context";

export function NavBar() {
  const theme = useTheme();
  const colorModeManager = React.useContext(ColorModeContext);
  return (
    <div className="container-md">
      <Grid component="nav" className="row">
        <Grid className="col" item component={ListItem}>
          <Link href="/">users</Link>
        </Grid>
        <Grid className="col" item component={ListItem}>
          <Link href="posts">posts</Link>
        </Grid>
        <Grid className="col-auto" item component={ListItem}>
          <Link href="login">login</Link>
        </Grid>
        <Grid className="col-auto" item component={ListItem}>
          <IconButton sx={{ ml: 1 }} onClick={colorModeManager.toggleColorMode}>
            {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
}
