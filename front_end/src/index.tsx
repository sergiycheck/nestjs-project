import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./app-component/App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import "./root-styles/index.scss";
import { StyledEngineProvider } from "@mui/material/styles";

ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </StyledEngineProvider>
  </React.StrictMode>,

  document.getElementById("root")
);

serviceWorker.register();
