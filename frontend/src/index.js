import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
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
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NavigationProgress />
      <Notifications />

      <Router>
        <AuthProvider>
          <MyModalsProvider>
            <App />
          </MyModalsProvider>
        </AuthProvider>
      </Router>
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
