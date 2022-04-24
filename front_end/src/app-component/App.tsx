import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ColorModeContext } from "./color-mode-context";
import { AppRouting } from "./AppRouting";
import "./App.scss";
import {
  getThemeMode,
  ColorThemeType,
  BG_COLOR,
  createThemeFromMode,
  colorsThemesAvailable,
} from "./default-theme";
import { useMediaQuery } from "@mui/material";

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const memoizedThemeMode = React.useMemo(() => {
    const gotTheme = getThemeMode();
    if (prefersDarkMode) return colorsThemesAvailable.dark;
    return gotTheme;
  }, [prefersDarkMode]);
  const [mode, setMode] = React.useState<ColorThemeType>(memoizedThemeMode as ColorThemeType);

  const colorModeManager = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const colorToSet =
            prevMode === colorsThemesAvailable.light
              ? colorsThemesAvailable.dark
              : colorsThemesAvailable.light;
          window.localStorage.setItem(BG_COLOR, colorToSet);
          return colorToSet as ColorThemeType;
        });
      },
    }),
    []
  );

  const theme = React.useMemo(() => createThemeFromMode(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorModeManager}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouting />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
