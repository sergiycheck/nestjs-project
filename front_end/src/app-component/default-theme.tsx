import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { LinkProps } from '@mui/material/Link';
import { PaletteMode } from '@mui/material';

export const LinkBehavior = React.forwardRef<
  any,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map hre (Mui) -> to (react-router)
  return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />;
});

export const colorsThemesAvailable = { light: 'light', dark: 'dark' };
export type ColorThemeType = 'light' | 'dark';
export const BG_COLOR = 'bgColor';
export const getThemeMode = () => {
  const bgColorFromLocalStorage = window.localStorage.getItem(BG_COLOR);
  if (
    bgColorFromLocalStorage &&
    Object.values(colorsThemesAvailable).includes(bgColorFromLocalStorage)
  ) {
    return bgColorFromLocalStorage as ColorThemeType;
  }
  return 'light';
};

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'dark' && {
      background: {
        default: '#1a202c',
      },
    }),
  },
});

export function createThemeFromMode(mode: ColorThemeType) {
  return responsiveFontSizes(
    createTheme({
      components: {
        MuiLink: {
          defaultProps: {
            component: LinkBehavior,
            underline: 'none',
            variant: 'subtitle1',
            fontWeight: '500',
            color: 'inherit',
          } as LinkProps,
        },
      },
      palette: getDesignTokens(mode).palette,
      breakpoints: {
        values: {
          xs: 0,
          sm: 576,
          md: 768,
          lg: 992,
          xl: 1200,
          xxl: 1400,
        },
      },
    }),
  );
}
