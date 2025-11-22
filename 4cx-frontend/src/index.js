import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { SoftUIControllerProvider } from "components/context";
import { ReduxStore } from "store/store";
import "./style.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "@/assets/scss/style.scss";

import { SnackbarProvider } from "notistack";
import ConfirmContextProvider from "@/store/context/ConfirmContextProvider";
import { ReactFlowContext } from "@/store/context/ReactFlowContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <SoftUIControllerProvider>
      <Provider store={ReduxStore}>
        <SnackbarProvider>
          <ConfirmContextProvider>
            <ReactFlowContext>
              <App />
              <ToastContainer style={{ fontSize: "14px", fontWeight: 700 }} />
            </ReactFlowContext>
          </ConfirmContextProvider>
        </SnackbarProvider>
      </Provider>
    </SoftUIControllerProvider>
  </BrowserRouter>
);