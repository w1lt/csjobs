import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }} // Set the default color scheme here
    >
      <Router>
        <App />
      </Router>
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
