import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Grid, IconButton, ListItem } from '@mui/material';
import Link from '@mui/material/Link';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../color-mode-context';
import { useNavigate } from 'react-router-dom';
import { CircularIndeterminate } from '../../features/shared/mui-components/Loader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectIsAuthenticated,
  selectIsAuthUser,
  selectIsAuthStatus,
  logout,
} from '../../features/shared/authSlice';

export function NavBar() {
  const theme = useTheme();
  const colorModeManager = React.useContext(ColorModeContext);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectIsAuthUser);
  const authStatus = useAppSelector(selectIsAuthStatus);

  let renderedLoginResult;

  if (authStatus === 'loading')
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

  if (authStatus !== 'loading' && !user) {
    renderedLoginResult = (
      <Grid className="col-auto" item component={ListItem}>
        <Link href="login">Login</Link>
      </Grid>
    );
  } else if (user && isAuthenticated) {
    renderedLoginResult = (
      <Grid className="col-auto" item component={ListItem}>
        <Link className="mx-2" href={`users/${user!.id}`}>
          {user!.username}
        </Link>
        <Button
          variant="outlined"
          onClick={() => {
            dispatch(logout());
            navigate('/');
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
        <Grid className="col">
          <Grid className="row">
            <Grid className="col-auto d-flex justify-content-center" item component={ListItem}>
              <Link href="/">Users</Link>
            </Grid>
            <Grid className="col-auto d-flex justify-content-center" item component={ListItem}>
              <Link href="posts">Posts</Link>
            </Grid>
          </Grid>
        </Grid>

        {renderedLoginResult}
        <Grid className="col-auto" item component={ListItem}>
          <IconButton sx={{ ml: 1 }} onClick={colorModeManager.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
}
