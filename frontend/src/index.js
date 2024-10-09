import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter, BrowserRouter as Router } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { NavigationProgress } from "@mantine/nprogress";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/notifications/styles.css";
import { AuthProvider } from "./context/AuthContext";
import { MyModalsProvider } from "./context/Modals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      defaultColorScheme="auto"
    >
      <NavigationProgress />
      <Notifications />

      <HashRouter basename="/">
        <AuthProvider>
          <MyModalsProvider>
            <App />
          </MyModalsProvider>
        </AuthProvider>
      </HashRouter>
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
