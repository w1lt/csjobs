import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }} // Set the default color scheme here
    >
      <Router>
        <App />
      </Router>
=======
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
>>>>>>> b7055d75778a35b63c2e6378c0e4d156bb8e3bcb
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
